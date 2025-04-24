// src/components/fileConverter/converterComponents/UploadZone.jsx
"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useAppDispatch } from "@/redux/hooks";
import { handleFileUpload } from "@/redux/slices/convertDataSlice";

export default function UploadZone() {
  const dispatch = useAppDispatch();
  const [error, setError] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles, fileRejections) => {
      setError(null);
      setIsDragActive(false);

      if (fileRejections.length > 0) {
        const firstError = fileRejections[0].errors[0];
        setError(
          firstError.code === "file-too-large"
            ? "File is too large (max 50MB)"
            : "Invalid file type"
        );
        return;
      }

      if (acceptedFiles.length > 0) {
        dispatch(handleFileUpload(acceptedFiles[0]))
          .unwrap()
          .catch((err) => setError(err.message));
      }
    },
    [dispatch]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "text/csv": [".csv"],
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: false,
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-blue-400"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-3">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          {isDragActive ? (
            <p className="text-lg font-medium text-gray-600">
              Drop the file here...
            </p>
          ) : (
            <>
              <p className="text-base font-medium text-gray-600">
                Drag & drop files here, or click to select
              </p>
              <p className="text-sm text-gray-500">
                Supports Excel (.xlsx), CSV (.csv), PDF (.pdf), and images
                (.png, .jpg, .jpeg)
              </p>
              <p className="text-xs text-gray-500">Max file size: 50MB</p>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-700 bg-red-50 rounded-lg">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        </div>
      )}
    </div>
  );
}
