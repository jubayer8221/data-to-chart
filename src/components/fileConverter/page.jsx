"use client";

// File: app/page.tsx
import { UploadZone } from "../fileConverter/converterComponents/UploadZone";
import { DataViewer } from "../fileConverter/converterComponents/DataViewer";

export default function HomePage() {
  return (
    <main className="p-6 w-full mx-auto bg-white ">
      <div className="mb-5 pb-6">
        <UploadZone />
      </div>
      <div className="my-5 py-5">
        <DataViewer />
      </div>
    </main>
  );
}
