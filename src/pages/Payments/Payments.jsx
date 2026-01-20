import { useState, useEffect } from 'react';
import useStore from '../../store/useStore';
import './Payments.css';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const Payments = () => {
  const { payments, setPayments, upcomingPayment, setUpcomingPayment } = useStore();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    // Mock data - replace with actual API call
    if (payments.length === 0) {
      setPayments([
        { id: 'pay-008', amount: 225, date: '2026-01-15', status: 'completed', type: 'scheduled' },
        { id: 'pay-007', amount: 225, date: '2025-12-15', status: 'completed', type: 'scheduled' },
        { id: 'pay-006', amount: 225, date: '2025-11-15', status: 'completed', type: 'scheduled' },
        { id: 'pay-005', amount: 225, date: '2025-10-15', status: 'completed', type: 'scheduled' },
        { id: 'pay-004', amount: 250, date: '2025-09-15', status: 'completed', type: 'extra' },
        { id: 'pay-003', amount: 225, date: '2025-09-15', status: 'completed', type: 'scheduled' },
        { id: 'pay-002', amount: 225, date: '2025-08-15', status: 'completed', type: 'scheduled' },
        { id: 'pay-001', amount: 225, date: '2025-07-15', status: 'completed', type: 'scheduled' },
      ]);
    }

    if (!upcomingPayment) {
      setUpcomingPayment({
        id: 'payment-009',
        amount: 225,
        dueDate: '2026-02-15',
        status: 'upcoming',
        daysUntilDue: 27,
      });
    }
  }, []);

  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

  const getStatusIcon = (status, type) => {
    if (status === 'completed') {
      return (
        <span className="status-icon success">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
      );
    }
    return (
      <span className="status-icon pending">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      </span>
    );
  };

  return (
    <div className="payments-page">
      <div className="payments-header">
        <h1>Payments</h1>
      </div>

      {upcomingPayment && (
        <div className="upcoming-payment-card card">
          <div className="upcoming-header">
            <div className="upcoming-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div className="upcoming-info">
              <h3>Next Payment Due</h3>
              <span className="due-date">{formatDate(upcomingPayment.dueDate)}</span>
            </div>
            <span className="due-days">
              {upcomingPayment.daysUntilDue === 0
                ? 'Today'
                : `${upcomingPayment.daysUntilDue} days`}
            </span>
          </div>
          <div className="upcoming-amount">
            <span className="amount-label">Amount Due</span>
            <span className="amount-value">{formatCurrency(upcomingPayment.amount)}</span>
          </div>
          <button
            className="btn btn-primary pay-now-btn"
            onClick={() => setShowPaymentModal(true)}
          >
            Pay Now
          </button>
        </div>
      )}

      <div className="payment-stats">
        <div className="stat-card card">
          <span className="stat-label">Total Paid</span>
          <span className="stat-value">{formatCurrency(totalPaid)}</span>
        </div>
        <div className="stat-card card">
          <span className="stat-label">Payments Made</span>
          <span className="stat-value">{payments.length}</span>
        </div>
      </div>

      <div className="payment-history">
        <h2>Payment History</h2>
        <div className="history-list">
          {payments.map((payment) => (
            <div key={payment.id} className="payment-item card">
              {getStatusIcon(payment.status, payment.type)}
              <div className="payment-info">
                <span className="payment-date">{formatDate(payment.date)}</span>
                <span className="payment-type">
                  {payment.type === 'extra' ? 'Extra Payment' : 'Scheduled Payment'}
                </span>
              </div>
              <span className="payment-amount">{formatCurrency(payment.amount)}</span>
            </div>
          ))}
        </div>
      </div>

      {showPaymentModal && (
        <div className="payment-modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="payment-modal card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Make a Payment</h3>
              <button className="close-btn" onClick={() => setShowPaymentModal(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="modal-content">
              <div className="payment-option selected">
                <div className="option-radio" />
                <div className="option-info">
                  <span className="option-label">Minimum Payment</span>
                  <span className="option-amount">{formatCurrency(upcomingPayment.amount)}</span>
                </div>
              </div>
              <div className="payment-method">
                <label>Payment Method</label>
                <div className="method-selector">
                  <span className="method-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                      <line x1="2" y1="10" x2="22" y2="10" />
                    </svg>
                  </span>
                  <span>Bank Account ****4521</span>
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowPaymentModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary">
                Pay {formatCurrency(upcomingPayment.amount)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
