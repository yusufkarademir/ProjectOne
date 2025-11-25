import { auth } from '../../../auth';
import { prisma } from '../../../lib/db';
import ProfileForm from './profile-form';
import PasswordForm from './password-form';
import { Settings, User, Lock } from 'lucide-react';

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Settings className="text-gray-400" size={32} />
            Ayarlar
        </h1>
        <p className="text-gray-500 mt-1 ml-11">Hesap bilgilerinizi ve tercihlerinizi yönetin.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Profile Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <User size={20} />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Profil Bilgileri</h2>
                    <p className="text-sm text-gray-500">Kişisel bilgilerinizi güncelleyin.</p>
                </div>
            </div>
            <div className="p-6">
                <ProfileForm user={{ name: user.name, email: user.email }} />
            </div>
        </div>

        {/* Password Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                    <Lock size={20} />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Güvenlik</h2>
                    <p className="text-sm text-gray-500">Şifrenizi değiştirin.</p>
                </div>
            </div>
            <div className="p-6">
                <PasswordForm />
            </div>
        </div>
      </div>
    </div>
  );
}
