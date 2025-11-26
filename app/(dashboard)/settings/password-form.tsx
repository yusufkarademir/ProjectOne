'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { changePassword } from '../../lib/settings-actions';
import { Lock } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
    >
      {pending ? 'Değiştiriliyor...' : 'Şifreyi Değiştir'}
    </button>
  );
}

export default function PasswordForm() {
  const initialState = { message: '', errors: {}, success: false };
  const [state, dispatch] = useActionState(changePassword, initialState);

  return (
    <form action={dispatch} className="space-y-4">
      <div>
        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Mevcut Şifre
        </label>
        <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            />
        </div>
        {state.errors?.currentPassword && (
          <p className="text-sm text-red-500 mt-1">{state.errors.currentPassword}</p>
        )}
      </div>

      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Yeni Şifre
        </label>
        <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
            type="password"
            id="newPassword"
            name="newPassword"
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            />
        </div>
        {state.errors?.newPassword && (
          <p className="text-sm text-red-500 mt-1">{state.errors.newPassword}</p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Yeni Şifre (Tekrar)
        </label>
        <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            />
        </div>
        {state.errors?.confirmPassword && (
          <p className="text-sm text-red-500 mt-1">{state.errors.confirmPassword}</p>
        )}
      </div>

      {state.message && (
        <div className={`p-3 rounded-lg text-sm ${state.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {state.message}
        </div>
      )}

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
