'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { authenticate } from '../../lib/actions';

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <button className="mt-4 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50" aria-disabled={pending}>
      {pending ? 'Giriş yapılıyor...' : 'Giriş Yap'}
    </button>
  );
}

export default function LoginPage() {
  const [errorMessage, dispatch] = useActionState(authenticate, undefined);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form action={dispatch} className="p-8 bg-white rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Giriş Yap</h1>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" name="email" required className="mt-1 block w-full border border-gray-300 rounded p-2" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Şifre</label>
          <input type="password" name="password" required minLength={6} className="mt-1 block w-full border border-gray-300 rounded p-2" />
        </div>
        <div className="flex items-center justify-between mb-4">
            <a href="/register" className="text-sm text-blue-500 hover:underline">Hesap oluştur</a>
        </div>
        <div className="text-red-500 text-sm h-5">{errorMessage}</div>
        <LoginButton />
      </form>
    </div>
  );
}
