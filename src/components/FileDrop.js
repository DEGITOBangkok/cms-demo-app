/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef } from "react";
import { useTranslations } from "use-intl";

export default function FileDrop({ file, setFile }) {
  const dropRef = useRef(null);

  const maxSize = 5 * 1024 * 1024; // 5MB
  const acceptedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "application/rtf",
    "application/vnd.oasis.opendocument.text",
    "application/vnd.apple.pages",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ];

  // ✅ ตรวจสอบไฟล์
  const validateFile = (file) => {
    if (!file) return { isValid: false, error: "No file selected" };

    if (file.size > maxSize) {
      return { isValid: false, error: `File size must be less than 5MB` };
    }

    if (!acceptedTypes.includes(file.type)) {
      return { isValid: false, error: "File type not allowed" };
    }

    return { isValid: true };
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const selectedFile = e.dataTransfer.files[0];
      const validation = validateFile(selectedFile);

      if (!validation.isValid) {
        alert(validation.error);
        return;
      }

      setFile(selectedFile);
      e.dataTransfer.clearData();
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      const validation = validateFile(selectedFile);

      if (!validation.isValid) {
        alert(validation.error);
        e.target.value = ""; // reset input
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const t = useTranslations("Contact")
  return (
    <div className="md:col-span-2">
      <label className="block font-medium text-black text-[16px] mb-2">
        {t("labelattachment")}{" "}
        <span className="text-[12px] font-light">
          {t("labelsubattachment")}
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
            {t("labeldropfile")}
            </p>
          </div>
        )}

        <input
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept={acceptedTypes.join(",")}
        />
      </div>
    </div>
  );
}
