// src/components/fileConverter/converterComponents/ErrorMessage.js
'use client';

export default function ErrorMessage({ error, onDismiss }) {
  if (!error) return null;

  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
      <span className="block sm:inline">{error}</span>
      <button
        onClick={onDismiss}
        className="absolute top-0 bottom-0 right-0 px-3 text-red-700 hover:text-red-900"
      >
        &times;
      </button>
    </div>
  );
}