"use client"

import type React from "react"

import { useState, useRef } from "react"
import { upload } from "@vercel/blob/client"
import Image from "next/image"

export function ImageUploader() {
  const inputFileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setUploading(true)

    try {
      const file = inputFileRef.current?.files?.[0]
      if (!file) throw new Error("No file selected")

      const newBlob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      })

      setUploadedUrl(newBlob.url)
    } catch (error) {
      console.error("Upload failed:", error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input ref={inputFileRef} type="file" accept="image/*" disabled={uploading} />
        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload Image"}
        </button>
      </form>
      {uploadedUrl && (
        <div>
          <p>Uploaded successfully!</p>
          <Image src={uploadedUrl || "/placeholder.svg"} alt="Uploaded image" className="mt-4 max-w-full h-auto" />
        </div>
      )}
    </div>
  )
}

