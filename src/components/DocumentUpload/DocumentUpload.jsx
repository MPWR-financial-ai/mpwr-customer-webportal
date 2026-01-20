import { useState, useRef } from 'react';
import useStore from '../../store/useStore';
import './DocumentUpload.css';

const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const documentTypes = [
  { id: 'paystub', label: 'Pay Stubs', description: 'Recent pay stubs' },
  { id: 'id', label: 'Government ID', description: 'Driver license or passport' },
  { id: 'bank_statement', label: 'Bank Statements', description: 'Last 3 months' },
  { id: 'other', label: 'Other', description: 'Any other document' },
];

const DocumentUpload = ({ onComplete }) => {
  const { addDocument } = useStore();
  const [selectedType, setSelectedType] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = async (file) => {
    setError('');

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Please upload a PDF, JPG, or PNG file');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('File must be less than 10MB');
      return;
    }

    if (!selectedType) {
      setError('Please select a document type');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(10);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 20, 90));
      }, 200);

      // Simulate API call - replace with actual upload
      await new Promise((resolve) => setTimeout(resolve, 1500));

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Add document to store
      addDocument({
        id: `doc-${Date.now()}`,
        name: file.name,
        type: selectedType,
        status: 'pending',
        uploadedAt: new Date().toISOString(),
        size: file.size,
        mimeType: file.type,
      });

      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
        setSelectedType('');
        if (onComplete) onComplete();
      }, 500);
    } catch (err) {
      setError('Failed to upload document. Please try again.');
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    e.target.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  return (
    <div className="document-upload card">
      <div className="upload-header">
        <h3>Upload Document</h3>
        <button className="close-btn" onClick={onComplete}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="type-selector">
        <label>Document Type</label>
        <div className="type-options">
          {documentTypes.map((type) => (
            <button
              key={type.id}
              className={`type-option ${selectedType === type.id ? 'selected' : ''}`}
              onClick={() => setSelectedType(type.id)}
            >
              <span className="type-label">{type.label}</span>
              <span className="type-desc">{type.description}</span>
            </button>
          ))}
        </div>
      </div>

      {uploading ? (
        <div className="upload-progress-section">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${uploadProgress}%` }} />
          </div>
          <span className="progress-text">Uploading... {uploadProgress}%</span>
        </div>
      ) : (
        <div
          className={`upload-dropzone ${dragActive ? 'drag-active' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="dropzone-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <span className="dropzone-text">
            Drop file here or <span className="browse-link">browse</span>
          </span>
          <span className="dropzone-hint">PDF, JPG, or PNG up to 10MB</span>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleInputChange}
        style={{ display: 'none' }}
      />

      {error && <div className="upload-error">{error}</div>}
    </div>
  );
};

export default DocumentUpload;
