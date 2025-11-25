'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createEvent } from '../../../lib/actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50" aria-disabled={pending}>
      {pending ? 'Oluşturuluyor...' : 'Etkinliği Oluştur'}
    </button>
  );
}

export default function CreateEventPage() {
  const [state, dispatch] = useActionState(createEvent, null);

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Yeni Etkinlik Oluştur</h1>
      <form action={dispatch}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Etkinlik Adı</label>
          <input type="text" name="name" required className="mt-1 block w-full border border-gray-300 rounded p-2" placeholder="Örn: Ahmet & Ayşe Düğün" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Tarih</label>
          <input type="date" name="date" required className="mt-1 block w-full border border-gray-300 rounded p-2" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Etkinlik URL (Slug)</label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
              etkinlikqr.net/e/
            </span>
            <input type="text" name="slug" required pattern="[a-z0-9-]+" className="mt-1 block w-full border border-gray-300 rounded-r-md p-2" placeholder="ahmet-ayse-dugun" />
          </div>
          <p className="text-xs text-gray-500 mt-1">Sadece küçük harf, rakam ve tire kullanın.</p>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Tema</label>
          <select name="theme" className="mt-1 block w-full border border-gray-300 rounded p-2">
            <option value="wedding">Düğün Teması</option>
            <option value="corporate">Kurumsal Tema</option>
            <option value="birthday">Doğum Günü Teması</option>
          </select>
        </div>

        {state?.message && (
          <div className="text-red-500 text-sm mb-4">{state.message}</div>
        )}

        <SubmitButton />
      </form>
    </div>
  );
}
