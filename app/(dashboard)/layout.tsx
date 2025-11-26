import Sidebar from '../components/Sidebar';
import { auth } from '../../auth';
import { prisma } from '../../lib/db';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  let user = null;
  let recentEvents: { id: string; name: string; slug: string }[] = [];

  if (session?.user?.email) {
    user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { email: true, id: true } 
    });
    // Note: 'image' might not be in the schema or I should check schema.prisma. 
    // Removing image from select to be safe if it causes issues, or I can check schema.
    // Based on previous file reads, User model has: id, email, passwordHash, createdAt, updatedAt, events.
    // It does NOT have 'name' or 'image' in the schema I read earlier in step 37!
    // Wait, let me check step 37 schema again.
    
    /*
    model User {
      id            String    @id @default(cuid())
      email         String    @unique
      passwordHash  String
      createdAt     DateTime  @default(now())
      updatedAt     DateTime  @updatedAt
      events        Event[]
    }
    */
   
   // You are right! The User model in schema.prisma (Step 37) ONLY has email and passwordHash. 
   // It does NOT have 'name' or 'image'.
   // I need to fix this. I should probably add 'name' to the User model if I want to display it, 
   // or just use the email as the name for now.
   
   // For now, to fix the build, I will NOT select name or image. I will use email as name.
  }

  // Re-fetching user correctly
  if (session?.user?.email) {
      const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
          select: { id: true, email: true }
      });

      if (dbUser) {
          user = { name: dbUser.email, email: dbUser.email, image: null }; // Mocking name/image for sidebar
          
          recentEvents = await prisma.event.findMany({
              where: { organizerId: dbUser.id },
              orderBy: { updatedAt: 'desc' },
              take: 5,
              select: { id: true, name: true, slug: true }
          });
      }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar user={user || undefined} recentEvents={recentEvents} />
      <main className="ml-72 p-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
        </div>
      </main>
    </div>
  );
}
