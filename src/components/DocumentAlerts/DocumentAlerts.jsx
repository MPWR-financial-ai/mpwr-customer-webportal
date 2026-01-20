import './DocumentAlerts.css';

const DocumentAlerts = ({ documents, onViewDocuments }) => {
  const getDocIcon = (doc) => {
    if (doc.status === 'pending_signature') {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
        </svg>
      );
    }
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    );
  };

  return (
    <div className="document-alerts card">
      <div className="alerts-header">
        <div className="alerts-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        </div>
        <div className="alerts-title">
          <h3>Action Required</h3>
          <span className="alerts-count">{documents.length} document{documents.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      <div className="alerts-list">
        {documents.slice(0, 3).map((doc) => (
          <div key={doc.id} className={`alert-item status-${doc.status}`}>
            <span className="alert-doc-icon">{getDocIcon(doc)}</span>
            <div className="alert-content">
              <span className="alert-doc-name">{doc.name}</span>
              <span className="alert-doc-status">
                {doc.status === 'pending_signature' ? 'Signature required' : 'Action required'}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button className="view-docs-btn btn btn-secondary" onClick={onViewDocuments}>
        View All Documents
      </button>
    </div>
  );
};

export default DocumentAlerts;
