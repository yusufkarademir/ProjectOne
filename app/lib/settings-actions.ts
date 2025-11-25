'use server';

import { auth } from '../../auth';
import { prisma } from '../../lib/db';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const UpdateProfileSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır.'),
});

const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(6, 'Mevcut şifre en az 6 karakter olmalıdır.'),
  newPassword: z.string().min(6, 'Yeni şifre en az 6 karakter olmalıdır.'),
  confirmPassword: z.string().min(6, 'Şifre tekrarı en az 6 karakter olmalıdır.'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Yeni şifreler eşleşmiyor.",
  path: ["confirmPassword"],
});

export async function updateProfile(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) {
    return { message: 'Oturum açmanız gerekiyor.', success: false };
  }

  const validatedFields = UpdateProfileSchema.safeParse({
    name: formData.get('name'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Lütfen alanları kontrol edin.',
      success: false,
    };
  }

  const { name } = validatedFields.data;

  try {
    await prisma.user.update({
      where: { email: session.user.email },
      data: { name },
    });

    revalidatePath('/settings');
    return { message: 'Profil başarıyla güncellendi.', success: true };
  } catch (error) {
    return { message: 'Veritabanı hatası: Profil güncellenemedi.', success: false };
  }
}

export async function changePassword(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) {
    return { message: 'Oturum açmanız gerekiyor.', success: false };
  }

  const validatedFields = ChangePasswordSchema.safeParse({
    currentPassword: formData.get('currentPassword'),
    newPassword: formData.get('newPassword'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Lütfen alanları kontrol edin.',
      success: false,
    };
  }

  const { currentPassword, newPassword } = validatedFields.data;

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return { message: 'Kullanıcı bulunamadı.', success: false };
    }

    const passwordsMatch = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!passwordsMatch) {
      return { 
          errors: { currentPassword: ['Mevcut şifre yanlış.'] },
          message: 'Mevcut şifre yanlış.', 
          success: false 
      };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email: session.user.email },
      data: { passwordHash: hashedPassword },
    });

    return { message: 'Şifre başarıyla değiştirildi.', success: true };
  } catch (error) {
    return { message: 'Veritabanı hatası: Şifre değiştirilemedi.', success: false };
  }
}
