'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { updateProfile } from '../../lib/settings-actions';
import { User } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
    >
      {pending ? 'Kaydediliyor...' : 'Kaydet'}
    </button>
  );
}

export default function ProfileForm({ user }: { user: { name: string | null; email: string } }) {
  const initialState = { message: '', errors: {}, success: false };
  const [state, dispatch] = useFormState(updateProfile, initialState);

  return (
    <form action={dispatch} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Ad Soyad
        </label>
        <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
            type="text"
            id="name"
            name="name"
            defaultValue={user.name || ''}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            />
        </div>
        {state.errors?.name && (
          <p className="text-sm text-red-500 mt-1">{state.errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          E-posta Adresi
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={user.email}
          disabled
          className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
        />
        <p className="text-xs text-gray-500 mt-1">E-posta adresi değiştirilemez.</p>
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
