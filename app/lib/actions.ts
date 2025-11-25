'use server';

import { signIn, auth } from '../../auth';
import { AuthError } from 'next-auth';
import { prisma } from '../../lib/db';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { redirect } from 'next/navigation';

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const CreateEventSchema = z.object({
  name: z.string().min(1),
  date: z.string(),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
  theme: z.string(),
});

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function register(
  prevState: string | undefined,
  formData: FormData,
) {
  const validatedFields = RegisterSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return 'Invalid fields.';
  }

  const { email, password } = validatedFields.data;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return 'User already exists.';
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return 'Failed to register user.';
  }
  
  // signIn will throw a redirect on success, let it propagate
  await signIn('credentials', formData);
}

export async function createEvent(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) {
    return { message: 'Unauthorized' };
  }

  const validatedFields = CreateEventSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { message: 'Invalid fields', errors: validatedFields.error.flatten().fieldErrors };
  }

  const { name, date, slug, theme } = validatedFields.data;

  try {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) throw new Error('User not found');

    await prisma.event.create({
      data: {
        name,
        date: new Date(date),
        slug,
        themeConfig: { theme },
        organizerId: user.id,
        qrCodeUrl: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/e/${slug}`,
      },
    });
  } catch (error) {
    console.error(error);
    return { message: 'Failed to create event. Slug might be taken.' };
  }

  redirect('/dashboard');
}
