"use client";

import { UploadZone } from "@/components/fileConverter/converterComponents/UploadZone";
import { DataViewer } from "@/components/fileConverter/converterComponents/DataViewer";

export function HomePage() {
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
export default HomePage;
