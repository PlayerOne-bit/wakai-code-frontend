// context/UploadContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../api/config';

type PendingUpload = {
  id: string;
  postId: string;
  fileCount: number;
};

type UploadContextType = {
  pendingUploads: PendingUpload[];
  startUpload: (postId: string, formData: FormData, fileCount: number) => void;
  onUploadComplete: (callback: () => void) => () => void;
};

const UploadContext = createContext<UploadContextType>({
  pendingUploads: [],
  startUpload: () => {},
  onUploadComplete: () => () => {},
});

export function UploadProvider({ children }: { children: React.ReactNode }) {
  const [pendingUploads, setPendingUploads] = useState<PendingUpload[]>([]);
  // Listeners other screens register to hear "something finished uploading"
  const [listeners, setListeners] = useState<(() => void)[]>([]);

  function startUpload(postId: string, formData: FormData, fileCount: number) {
    const uploadId = `${postId}-${Date.now()}`;
    setPendingUploads(prev => [...prev, { id: uploadId, postId, fileCount }]);

    // Deliberately not awaited by the caller — this runs independently
    // of whatever screen triggered it, even if that screen has already
    // been navigated away from.
    api
      .post(`/api/upload/post-media/${postId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .catch(err => console.error('Background upload failed:', err.response?.data ?? err.message))
      .finally(() => {
        setPendingUploads(prev => prev.filter(u => u.id !== uploadId));
        listeners.forEach(fn => fn());
      });
  }

  const onUploadComplete = useCallback((callback: () => void) => {
    setListeners(prev => [...prev, callback]);
    // Returns an unsubscribe function, so screens can clean up
    // when they unmount and stop listening.
    return () => setListeners(prev => prev.filter(fn => fn !== callback));
  }, []);

  return (
    <UploadContext.Provider value={{ pendingUploads, startUpload, onUploadComplete }}>
      {children}
    </UploadContext.Provider>
  );
}

export function useUpload() {
  return useContext(UploadContext);
}