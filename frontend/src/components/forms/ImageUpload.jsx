import { useState, useRef, useEffect } from 'react';
import { Camera, UploadCloud, X } from 'lucide-react';

export default function ImageUpload({ onChange, value }) {
  const [preview, setPreview] = useState(null);
  const inputRef = useRef(null);
  const objectUrlRef = useRef(null);

  // Cleanup object URL on unmount or when preview changes
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;

    // Cleanup previous object URL
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setPreview(url);
    onChange?.(file);
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setPreview(null);
    onChange?.(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div>
      <label className="block text-sm font-medium text-text mb-1.5">
        Item Photo <span className="text-text-tertiary font-normal">(optional)</span>
      </label>

      {preview ? (
        <div className="relative rounded-xl overflow-hidden border border-border bg-border-light">
          <img
            src={preview}
            alt="Uploaded item preview"
            className="w-full h-48 sm:h-56 object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 w-8 h-8 bg-surface/90 hover:bg-surface rounded-lg flex items-center justify-center shadow-sm transition-colors"
            aria-label="Remove image"
          >
            <X className="w-4 h-4 text-text" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-border hover:border-primary/40 rounded-xl p-6 sm:p-8 cursor-pointer transition-colors text-center"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
          aria-label="Upload an image of the item"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center">
              <Camera className="w-5 h-5 text-primary" />
            </div>
            <p className="text-sm font-medium text-text">
              Tap to upload a photo
            </p>
            <p className="text-xs text-text-tertiary">
              Take a photo or choose from gallery · JPG, PNG up to 5 MB
            </p>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
        aria-hidden="true"
      />
    </div>
  );
}
