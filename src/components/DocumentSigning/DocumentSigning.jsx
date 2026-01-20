import { useState, useRef, useEffect } from 'react';
import useStore from '../../store/useStore';
import './DocumentSigning.css';

const documentDescriptions = {
  'loan-agreement': 'Review and sign your loan terms and conditions',
  'truth-in-lending': 'Federal disclosure of loan costs and terms',
  'ach-authorization': 'Authorize automatic payment withdrawals',
  'Loan Agreement': 'Review and sign your loan terms and conditions',
  'Truth in Lending Disclosure': 'Federal disclosure of loan costs and terms',
  'ACH Authorization': 'Authorize automatic payment withdrawals',
};

const DocumentSigning = ({ documents, onDocumentSigned }) => {
  const { updateDocument } = useStore();
  const [viewingDocument, setViewingDocument] = useState(null);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [signatureData, setSignatureData] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const canvasRef = useRef(null);
  const lastPosRef = useRef({ x: 0, y: 0 });

  // Filter to signable documents - handle both API format and legacy format
  const signableDocuments = documents.filter(
    (doc) => doc.status === 'pending_signature' || doc.status === 'signed' || doc.s3_url
  );

  const signedCount = signableDocuments.filter((doc) => doc.status === 'signed').length;
  const totalSignable = signableDocuments.length;

  // Initialize canvas when signature pad is shown
  useEffect(() => {
    if (showSignaturePad && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [showSignaturePad]);

  const getCanvasContext = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#101828';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    return ctx;
  };

  const getEventPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    setIsDrawing(true);
    const pos = getEventPos(e);
    lastPosRef.current = pos;
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const ctx = getCanvasContext();
    if (!ctx) return;

    const pos = getEventPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPosRef.current = pos;
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      const canvas = canvasRef.current;
      if (canvas) {
        setSignatureData(canvas.toDataURL());
      }
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    setSignatureData(null);
  };

  const handleDocumentClick = (doc) => {
    setViewingDocument(doc);
    setShowSignaturePad(false);
    setSignatureData(null);
  };

  const handleCloseModal = () => {
    setViewingDocument(null);
    setShowSignaturePad(false);
    setSignatureData(null);
  };

  const handleSignClick = () => {
    setShowSignaturePad(true);
    setSignatureData(null);
  };

  const handleConfirmSignature = async () => {
    if (!signatureData || !viewingDocument) return;

    setIsSigning(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Update document status
    updateDocument(viewingDocument.id, {
      status: 'signed',
      signedAt: new Date().toISOString(),
      signatureData: signatureData,
    });

    setIsSigning(false);
    setShowSignaturePad(false);
    setViewingDocument(null);
    setSignatureData(null);

    if (onDocumentSigned) {
      onDocumentSigned(viewingDocument);
    }
  };

  const getDocumentIcon = (doc) => {
    if (doc.status === 'signed') {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      );
    }
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    );
  };

  // Get document name - handle API format
  const getDocumentName = (doc) => {
    return doc.name || doc.type || 'Document';
  };

  // Get document description - handle API format
  const getDocumentDescription = (doc) => {
    return documentDescriptions[doc.type] || documentDescriptions[doc.name] || 'Review and sign this document';
  };

  // Get PDF URL - use s3_url from API if available
  const getPdfUrl = (doc) => {
    return doc.s3_url || doc.url || null;
  };

  return (
    <div className="document-signing-section">
      <div className="documents-header-row">
        <h3>Documents to Sign</h3>
        <span className="documents-count">{signedCount} of {totalSignable} signed</span>
      </div>

      <div className="documents-signing-list">
        {signableDocuments.map((doc) => (
          <div
            key={doc.id}
            className={`document-signing-row ${doc.status === 'signed' ? 'signed' : 'pending'}`}
            onClick={() => handleDocumentClick(doc)}
          >
            <div className={`document-icon ${doc.status === 'signed' ? 'signed' : 'pending'}`}>
              {getDocumentIcon(doc)}
            </div>
            <div className="document-info">
              <span className="document-name">{getDocumentName(doc)}</span>
              <span className="document-description">{getDocumentDescription(doc)}</span>
            </div>
            <div className="document-status-indicator">
              {doc.status === 'signed' ? (
                <span className="status-signed">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Signed
                </span>
              ) : (
                <span className="status-pending">Sign</span>
              )}
              <svg className="chevron-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Document Modal */}
      {viewingDocument && (
        <div className="document-modal-overlay" onClick={handleCloseModal}>
          <div className="document-modal" onClick={(e) => e.stopPropagation()}>
            <div className="document-modal-header">
              <h3>{getDocumentName(viewingDocument)}</h3>
              <button className="document-modal-close" onClick={handleCloseModal}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="document-modal-content">
              {getPdfUrl(viewingDocument) ? (
                <iframe
                  src={getPdfUrl(viewingDocument)}
                  className="document-pdf-viewer"
                  title={getDocumentName(viewingDocument)}
                />
              ) : (
                <div className="document-placeholder">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                  <p>Document preview not available</p>
                </div>
              )}
            </div>

            <div className="document-modal-footer">
              {viewingDocument.status === 'signed' ? (
                <div className="signature-complete">
                  <div className="signature-complete-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <span>Document signed{viewingDocument.signedAt && ` on ${new Date(viewingDocument.signedAt).toLocaleDateString()}`}</span>
                </div>
              ) : showSignaturePad ? (
                <div className="signature-pad-container">
                  <div className="signature-pad-header">
                    <span className="signature-pad-label">Draw your signature below</span>
                    <button className="clear-signature-btn" onClick={clearSignature}>
                      Clear
                    </button>
                  </div>
                  <div className="signature-canvas-wrapper">
                    <canvas
                      ref={canvasRef}
                      width={560}
                      height={160}
                      className="signature-canvas"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                    />
                    {!signatureData && (
                      <span className="signature-placeholder">Sign here</span>
                    )}
                  </div>
                  <div className="signature-pad-actions">
                    <button
                      className="btn btn-secondary"
                      onClick={() => setShowSignaturePad(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={handleConfirmSignature}
                      disabled={!signatureData || isSigning}
                    >
                      {isSigning ? 'Signing...' : 'Confirm Signature'}
                    </button>
                  </div>
                </div>
              ) : (
                <button className="sign-document-btn" onClick={handleSignClick}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 19l7-7 3 3-7 7-3-3z" />
                    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                    <path d="M2 2l7.586 7.586" />
                    <circle cx="11" cy="11" r="2" />
                  </svg>
                  Sign Document
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentSigning;
