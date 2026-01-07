import React, { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { storage, db } from "../firebase";
import { useUser } from "@clerk/clerk-react";

const Upload = (): React.JSX.Element => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { user } = useUser();

  const isAdmin = user?.publicMetadata?.role === "admin";

  const handleUpload = async () => {
    if (!file || !user || !isAdmin) return;

    setLoading(true);

    try {
      const storageRef = ref(storage, `music/${user.id}/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      await addDoc(collection(db, "tracks"), {
        name: file.name,
        url,
        uploadedBy: user.id,
        createdAt: new Date(),
      });

      alert("Music uploaded successfully!");
      setFile(null);
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith("audio/")) {
        setFile(droppedFile);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  if (!isAdmin) {
    return (
      <div style={styles.restrictedContainer}>
        <div style={styles.restrictedContent}>
          <svg
            style={styles.restrictedIcon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <h3 style={styles.restrictedTitle}>Admin Access Required</h3>
          <p style={styles.restrictedText}>
            Only admins can upload tracks to the platform.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Upload Music</h2>
          <p style={styles.subtitle}>
            Share your tracks with the community
          </p>
        </div>

        <div
          style={{
            ...styles.dropzone,
            ...(dragActive ? styles.dropzoneActive : {}),
          }}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            style={styles.fileInput}
            id="file-upload"
          />

          {!file ? (
            <label htmlFor="file-upload" style={styles.dropzoneLabel}>
              <div style={styles.uploadIcon}>
                <svg
                  style={styles.iconSvg}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <p style={styles.dropzoneText}>
                <span style={styles.dropzoneTextBold}>Click to upload</span> or
                drag and drop
              </p>
              <p style={styles.dropzoneHint}>MP3, WAV, FLAC, or M4A files</p>
            </label>
          ) : (
            <div style={styles.filePreview}>
              <div style={styles.fileIcon}>
                <svg
                  style={styles.iconSvg}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  />
                </svg>
              </div>
              <div style={styles.fileInfo}>
                <p style={styles.fileName}>{file.name}</p>
                <p style={styles.fileSize}>{formatFileSize(file.size)}</p>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setFile(null);
                }}
                style={styles.removeButton}
                type="button"
              >
                <svg
                  style={styles.removeIcon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          style={{
            ...styles.uploadButton,
            ...(!file || loading ? styles.uploadButtonDisabled : {}),
          }}
        >
          {loading ? (
            <>
              <svg style={styles.spinner} viewBox="0 0 24 24">
                <circle
                  style={styles.spinnerCircle}
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
              </svg>
              Uploading...
            </>
          ) : (
            <>
              <svg
                style={styles.uploadButtonIcon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                />
              </svg>
              Upload Track
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    marginBottom: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "600px",
    background: "linear-gradient(135deg, #1f2937 0%, #111827 100%)",
    borderRadius: "20px",
    padding: "40px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },
  header: {
    marginBottom: "30px",
    textAlign: "center" as const,
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    background: "linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "10px",
  },
  subtitle: {
    color: "#9ca3af",
    fontSize: "16px",
  },
  dropzone: {
    border: "2px dashed #374151",
    borderRadius: "16px",
    padding: "40px 20px",
    textAlign: "center" as const,
    cursor: "pointer",
    transition: "all 0.3s ease",
    background: "rgba(31, 41, 55, 0.5)",
    marginBottom: "24px",
  },
  dropzoneActive: {
    border: "2px dashed #60a5fa",
    background: "rgba(96, 165, 250, 0.1)",
    transform: "scale(1.02)",
  },
  fileInput: {
    display: "none",
  },
  dropzoneLabel: {
    cursor: "pointer",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "12px",
  },
  uploadIcon: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "8px",
  },
  iconSvg: {
    width: "32px",
    height: "32px",
    color: "white",
  },
  dropzoneText: {
    color: "#e5e7eb",
    fontSize: "16px",
    margin: 0,
  },
  dropzoneTextBold: {
    fontWeight: "600",
    color: "#60a5fa",
  },
  dropzoneHint: {
    color: "#6b7280",
    fontSize: "14px",
    margin: 0,
  },
  filePreview: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "20px",
    background: "rgba(59, 130, 246, 0.1)",
    borderRadius: "12px",
    border: "1px solid rgba(96, 165, 250, 0.3)",
  },
  fileIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  fileInfo: {
    flex: 1,
    textAlign: "left" as const,
    overflow: "hidden",
  },
  fileName: {
    color: "#f3f4f6",
    fontSize: "16px",
    fontWeight: "600",
    margin: "0 0 4px 0",
    whiteSpace: "nowrap" as const,
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  fileSize: {
    color: "#9ca3af",
    fontSize: "14px",
    margin: 0,
  },
  removeButton: {
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    border: "none",
    background: "rgba(239, 68, 68, 0.2)",
    color: "#ef4444",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    flexShrink: 0,
  },
  removeIcon: {
    width: "20px",
    height: "20px",
  },
  uploadButton: {
    width: "100%",
    padding: "16px 32px",
    background: "linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "18px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    boxShadow: "0 10px 30px rgba(96, 165, 250, 0.3)",
  },
  uploadButtonDisabled: {
    background: "#374151",
    cursor: "not-allowed",
    boxShadow: "none",
    opacity: 0.6,
  },
  uploadButtonIcon: {
    width: "24px",
    height: "24px",
  },
  spinner: {
    width: "24px",
    height: "24px",
    animation: "spin 1s linear infinite",
  },
  spinnerCircle: {
    opacity: 0.25,
  },
  restrictedContainer: {
    marginBottom: "20px",
    padding: "20px",
    display: "flex",
    justifyContent: "center",
  },
  restrictedContent: {
    maxWidth: "400px",
    background: "linear-gradient(135deg, #1f2937 0%, #111827 100%)",
    borderRadius: "20px",
    padding: "40px",
    textAlign: "center" as const,
    border: "1px solid rgba(239, 68, 68, 0.3)",
  },
  restrictedIcon: {
    width: "64px",
    height: "64px",
    color: "#ef4444",
    margin: "0 auto 20px",
  },
  restrictedTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#f3f4f6",
    marginBottom: "12px",
  },
  restrictedText: {
    color: "#9ca3af",
    fontSize: "16px",
    lineHeight: "1.5",
  },
};

const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default Upload;
