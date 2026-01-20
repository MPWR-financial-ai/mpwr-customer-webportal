import './LoanSummaryCard.css';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const LoanSummaryCard = ({ loan, onClick }) => {
  // Handle API field names: amount, loan_name, interest_rate, avg_monthly_payment, repayment_schedule
  const loanAmount = loan.amount || loan.originalAmount || 0;
  const currentBalance = loan.current_balance || loan.currentBalance || loanAmount;
  const loanName = loan.loan_name || loan.name || 'Personal Loan';
  const monthlyPayment = loan.avg_monthly_payment || loan.monthlyPayment || 0;
  const interestRate = loan.interest_rate || loan.interestRate || 0;
  const totalPayments = loan.repayment_schedule?.length || loan.totalPayments || 0;

  // Calculate paid payments from repayment_schedule if available
  const paidPayments = loan.repayment_schedule
    ? loan.repayment_schedule.filter(p => p.status === 'paid').length
    : (loan.paidPayments || 0);

  const progress = loanAmount > 0 ? ((loanAmount - currentBalance) / loanAmount) * 100 : 0;
  const paidAmount = loanAmount - currentBalance;

  return (
    <div className="loan-summary-card card" onClick={onClick} role="button" tabIndex={0}>
      <div className="loan-summary-header">
        <div className="loan-type">
          <span className="loan-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          </span>
          <span className="loan-name">{loanName}</span>
        </div>
        <span className={`loan-status status-${loan.status}`}>
          {loan.status === 'active' ? 'Active' : loan.status === 'pending' ? 'Pending' : loan.status}
        </span>
      </div>

      <div className="loan-balance-section">
        <div className="balance-label">Current Balance</div>
        <div className="balance-amount">{formatCurrency(currentBalance)}</div>
        <div className="balance-original">of {formatCurrency(loanAmount)}</div>
      </div>

      <div className="loan-progress-section">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="progress-labels">
          <span className="paid-label">{formatCurrency(paidAmount)} paid</span>
          <span className="progress-percent">{Math.round(progress)}% complete</span>
        </div>
      </div>

      <div className="loan-details-row">
        <div className="detail-item">
          <span className="detail-label">Monthly Payment</span>
          <span className="detail-value">{formatCurrency(monthlyPayment)}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">APR</span>
          <span className="detail-value">{interestRate}%</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Payments</span>
          <span className="detail-value">{paidPayments}/{totalPayments}</span>
        </div>
      </div>

      <div className="view-details-hint">
        <span>Tap to view details</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </div>
  );
};

export default LoanSummaryCard;
