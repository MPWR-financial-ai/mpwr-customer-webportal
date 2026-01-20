import { useState } from 'react';
import useStore from '../../store/useStore';
import DocumentUpload from '../../components/DocumentUpload/DocumentUpload';
import DocumentList from '../../components/DocumentList/DocumentList';
import DocumentSigning from '../../components/DocumentSigning/DocumentSigning';
import './Documents.css';

const Documents = () => {
  const { documents } = useStore();
  const [selectedTab, setSelectedTab] = useState('all');
  const [showUpload, setShowUpload] = useState(false);

  // Documents that require signing (agreements, disclosures)
  const signableDocuments = documents.filter(
    (doc) => doc.status === 'pending_signature' ||
             (doc.status === 'signed' && (doc.type === 'agreement' || doc.type === 'disclosure'))
  );

  // Documents for the general list (uploaded docs like paystubs, bank statements, IDs)
  const uploadedDocuments = documents.filter(
    (doc) => doc.type === 'paystub' ||
             doc.type === 'bank_statement' ||
             doc.type === 'id' ||
             doc.status === 'verified' ||
             doc.status === 'action_required'
  );

  const filteredDocuments = uploadedDocuments.filter((doc) => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'pending') {
      return doc.status === 'action_required';
    }
    if (selectedTab === 'verified') return doc.status === 'verified';
    return true;
  });

  const handleDocumentSigned = (doc) => {
    console.log('Document signed:', doc.name);
  };

  return (
    <div className="documents-page">
      <div className="documents-header">
        <div className="header-text">
          <h1>Documents</h1>
          <p>{documents.length} documents</p>
        </div>
        <button className="upload-btn btn btn-primary" onClick={() => setShowUpload(true)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Upload
        </button>
      </div>

      {showUpload && (
        <div className="upload-section">
          <DocumentUpload onComplete={() => setShowUpload(false)} />
        </div>
      )}

      {/* Document Signing Section - MPWR Lending Style */}
      {signableDocuments.length > 0 && (
        <div className="signing-section card">
          <DocumentSigning
            documents={signableDocuments}
            onDocumentSigned={handleDocumentSigned}
          />
        </div>
      )}

      {/* Uploaded Documents Section */}
      {uploadedDocuments.length > 0 && (
        <div className="uploaded-documents-section">
          <h2 className="section-title">Your Documents</h2>

          <div className="documents-tabs">
            <button
              className={`tab-btn ${selectedTab === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedTab('all')}
            >
              All
            </button>
            <button
              className={`tab-btn ${selectedTab === 'verified' ? 'active' : ''}`}
              onClick={() => setSelectedTab('verified')}
            >
              Verified
            </button>
            <button
              className={`tab-btn ${selectedTab === 'pending' ? 'active' : ''}`}
              onClick={() => setSelectedTab('pending')}
            >
              Pending
            </button>
          </div>

          <DocumentList documents={filteredDocuments} />
        </div>
      )}
    </div>
  );
};

export default Documents;
