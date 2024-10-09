import service from "@/appwrite/config";
import conf from "@/conf/conf";
import * as React from "react";

interface UploadedFile {
  id: string;
  name: string;
  previewUrl?: string;
}

interface UseUploadFileProps {
  defaultUploadedFiles?: UploadedFile[];
  headers?: Record<string, string>;
  onUploadBegin?: () => void;
  onUploadProgress?: (progress: number) => void;
  skipPolling?: boolean;
}

export function useUploadFile(
  { defaultUploadedFiles = [], ...props }: UseUploadFileProps = {}
) {
  const [uploadedFiles, setUploadedFiles] =
    React.useState<UploadedFile[]>(defaultUploadedFiles);
  const [progresses, setProgresses] = React.useState<Record<string, number>>({});
  const [isUploading, setIsUploading] = React.useState(false);

  async function uploadThings(files: File[]) {
    setIsUploading(true);
    try {
      if (props.onUploadBegin) props.onUploadBegin();

      const uploadPromises = files.map(async (file) => {
        const result = await service.uploadFile(file);

        const previewUrl = `https://cloud.appwrite.io/v1/storage/buckets/${conf.appwriteBucketId}/files/${result.id}/preview?project=${conf.appwriteProjectId}`

        return {
          ...result,
          previewUrl,
        };
      });

      const res = await Promise.all(uploadPromises);

      setUploadedFiles((prev) => (prev ? [...prev, ...res] : res));
      return res;
    } catch (err) {
      console.log(err)
    } finally {
      setProgresses({});
      setIsUploading(false);
    }
  }

  return {
    uploadedFiles,
    progresses,
    uploadFiles: uploadThings,
    isUploading,
  };
}
