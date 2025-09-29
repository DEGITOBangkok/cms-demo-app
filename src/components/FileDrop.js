/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef } from "react";

export default function FileDrop({ file, setFile }) {
 
  const dropRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="md:col-span-2">
      <label className="block font-medium text-black text-[16px] mb-2">
        Attachment{" "}
        <span className="text-[12px] font-light">
          (PDF file or document not exceeding 5 MB)
        </span>
      </label>

      <div
        ref={dropRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-gray-400 rounded-md p-6 text-center
                   hover:border-[#E60000] hover:bg-red-50 cursor-pointer transition"
        onClick={() => dropRef.current.querySelector("input").click()}
      >
        {file ? (
          <p className="text-gray-700">{file.name}</p>
        ) : (
          <div className="flex flex-row items-center gap-2 justify-center space-y-2">
            <img
              src="/images/UploadFile.png"
              alt="Upload File"
              className="w-5 h-5 mt-[5px]"
            />
            <p className="text-black text-[16px] text-center">
              Upload or Drag and drop files here
            </p>
          </div>
        )}

        <input type="file" className="hidden" onChange={handleFileChange} />
      </div>
    </div>
  );
}
