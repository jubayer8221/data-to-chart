// src/app/page.js

"use client";

import UploadZone from "@/components/fileConverter/converterComponents/UploadZone";
import DataViewer from "@/components/fileConverter/converterComponents/DataViewer";

export default function page() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <UploadZone />
      </div>
      <div className="my-8">
        <DataViewer />
      </div>
    </div>
  );
}
