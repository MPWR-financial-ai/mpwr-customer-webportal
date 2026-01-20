import './UpcomingPayment.css';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const UpcomingPayment = ({ payment, onMakePayment }) => {
  const getUrgencyClass = () => {
    if (payment.daysUntilDue <= 3) return 'urgent';
    if (payment.daysUntilDue <= 7) return 'soon';
    return 'normal';
  };

  return (
    <div className={`upcoming-payment card ${getUrgencyClass()}`}>
      <div className="payment-header">
        <div className="payment-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <div className="payment-title">
          <h3>Upcoming Payment</h3>
          <span className="due-badge">
            {payment.daysUntilDue === 0
              ? 'Due today'
              : payment.daysUntilDue === 1
              ? 'Due tomorrow'
              : `Due in ${payment.daysUntilDue} days`}
          </span>
        </div>
      </div>

      <div className="payment-details">
        <div className="payment-amount">
          <span className="amount-label">Amount Due</span>
          <span className="amount-value">{formatCurrency(payment.amount)}</span>
        </div>
        <div className="payment-date">
          <span className="date-label">Due Date</span>
          <span className="date-value">{formatDate(payment.dueDate)}</span>
        </div>
      </div>

      <button className="make-payment-btn btn btn-primary" onClick={onMakePayment}>
        Make Payment
      </button>
    </div>
  );
};

export default UpcomingPayment;
