'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { register } from '../../lib/actions';

function RegisterButton() {
  const { pending } = useFormStatus();
  return (
    <button className="mt-4 w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:opacity-50" aria-disabled={pending}>
      {pending ? 'Kayıt olunuyor...' : 'Kayıt Ol'}
    </button>
  );
}

export default function RegisterPage() {
  const [errorMessage, dispatch] = useActionState(register, undefined);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form action={dispatch} className="p-8 bg-white rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Kayıt Ol</h1>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" name="email" required className="mt-1 block w-full border border-gray-300 rounded p-2" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Şifre</label>
          <input type="password" name="password" required minLength={6} className="mt-1 block w-full border border-gray-300 rounded p-2" />
        </div>
        <div className="flex items-center justify-between mb-4">
            <a href="/login" className="text-sm text-blue-500 hover:underline">Zaten hesabın var mı? Giriş yap</a>
        </div>
        <div className="text-red-500 text-sm h-5">{errorMessage}</div>
        <RegisterButton />
      </form>
    </div>
  );
}
