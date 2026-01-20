import './DocumentList.css';

const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const getDocumentIcon = (mimeType) => {
  if (mimeType.startsWith('image/')) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    );
  }
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
};

const getStatusInfo = (status) => {
  switch (status) {
    case 'pending_signature':
      return { label: 'Sign Required', className: 'pending-signature', showAction: true };
    case 'action_required':
      return { label: 'Action Required', className: 'action-required', showAction: true };
    case 'signed':
      return { label: 'Signed', className: 'signed', showAction: false };
    case 'verified':
      return { label: 'Verified', className: 'verified', showAction: false };
    case 'pending':
      return { label: 'Processing', className: 'pending', showAction: false };
    default:
      return { label: status, className: 'default', showAction: false };
  }
};

const DocumentList = ({ documents, onSign, onDownload }) => {
  if (documents.length === 0) {
    return (
      <div className="document-list-empty card">
        <div className="empty-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        </div>
        <h3>No Documents</h3>
        <p>Documents will appear here once uploaded.</p>
      </div>
    );
  }

  return (
    <div className="document-list">
      {documents.map((doc) => {
        const statusInfo = getStatusInfo(doc.status);

        return (
          <div key={doc.id} className={`document-item card status-${statusInfo.className}`}>
            <div className="doc-icon">
              {getDocumentIcon(doc.mimeType)}
            </div>

            <div className="doc-info">
              <span className="doc-name">{doc.name}</span>
              <div className="doc-meta">
                <span className="doc-size">{formatFileSize(doc.size)}</span>
                <span className="doc-date">{formatDate(doc.uploadedAt)}</span>
              </div>
            </div>

            <div className="doc-actions">
              <span className={`doc-status ${statusInfo.className}`}>
                {statusInfo.label}
              </span>

              {statusInfo.showAction && (
                <button
                  className="sign-btn btn btn-primary"
                  onClick={() => onSign?.(doc)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                  </svg>
                  Sign
                </button>
              )}

              {!statusInfo.showAction && (
                <button
                  className="download-btn"
                  onClick={() => onDownload?.(doc)}
                  aria-label="Download document"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DocumentList;
