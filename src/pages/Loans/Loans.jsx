import { useState } from 'react';
import useStore from '../../store/useStore';
import LoanSliderCard from '../../components/LoanSliderCard/LoanSliderCard';
import PaymentSchedule from '../../components/PaymentSchedule/PaymentSchedule';
import './Loans.css';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const Loans = () => {
  const { activeLoan } = useStore();
  const [selectedTab, setSelectedTab] = useState('overview');

  if (!activeLoan) {
    return (
      <div className="loans-page">
        <div className="no-loan-state card">
          <div className="no-loan-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          </div>
          <h2>No Active Loan</h2>
          <p>You don't have any active loans at the moment.</p>
        </div>
      </div>
    );
  }

  // Handle API field names
  const loanName = activeLoan.loan_name || activeLoan.name || 'Personal Loan';
  const loanAmount = activeLoan.amount || activeLoan.originalAmount || 0;
  const currentBalance = activeLoan.current_balance || activeLoan.currentBalance || loanAmount;
  const interestRate = activeLoan.interest_rate || activeLoan.interestRate || 0;
  const monthlyPayment = activeLoan.avg_monthly_payment || activeLoan.monthlyPayment || 0;
  const term = activeLoan.term || `${activeLoan.totalPayments || 0} months`;
  const totalPayments = activeLoan.repayment_schedule?.length || activeLoan.totalPayments || 0;
  const paidPayments = activeLoan.repayment_schedule
    ? activeLoan.repayment_schedule.filter(p => p.status === 'paid').length
    : (activeLoan.paidPayments || 0);

  // Get next payment from repayment_schedule
  const nextPayment = activeLoan.repayment_schedule?.find(p => p.status !== 'paid');
  const nextPaymentDate = nextPayment?.date || activeLoan.nextPaymentDate;

  // Get start date from first payment or loan start
  const startDate = activeLoan.repayment_schedule?.[0]?.date || activeLoan.startDate;

  return (
    <div className="loans-page">
      <div className="loans-header">
        <h1>My Loan</h1>
        <span className={`loan-status-badge status-${activeLoan.status}`}>
          {activeLoan.status === 'active' ? 'Active' : activeLoan.status === 'pending' ? 'Pending' : activeLoan.status}
        </span>
      </div>

      <div className="loans-tabs">
        <button
          className={`tab-btn ${selectedTab === 'overview' ? 'active' : ''}`}
          onClick={() => setSelectedTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-btn ${selectedTab === 'schedule' ? 'active' : ''}`}
          onClick={() => setSelectedTab('schedule')}
        >
          Payment Schedule
        </button>
      </div>

      {selectedTab === 'overview' ? (
        <div className="loans-overview">
          <LoanSliderCard loan={activeLoan} />

          <div className="loan-details-section card">
            <h3>Loan Details</h3>
            <div className="details-grid">
              <div className="detail-row">
                <span className="detail-label">Loan Type</span>
                <span className="detail-value">{loanName}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Loan Amount</span>
                <span className="detail-value">
                  {formatCurrency(loanAmount)}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Current Balance</span>
                <span className="detail-value">
                  {formatCurrency(currentBalance)}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Interest Rate (APR)</span>
                <span className="detail-value">{interestRate}%</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Monthly Payment</span>
                <span className="detail-value">{formatCurrency(monthlyPayment)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Loan Term</span>
                <span className="detail-value">{term}</span>
              </div>
              {startDate && (
                <div className="detail-row">
                  <span className="detail-label">Start Date</span>
                  <span className="detail-value">
                    {new Date(startDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              )}
              {nextPaymentDate && (
                <div className="detail-row">
                  <span className="detail-label">Next Payment Date</span>
                  <span className="detail-value">
                    {new Date(nextPaymentDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              )}
              <div className="detail-row">
                <span className="detail-label">Payments Made</span>
                <span className="detail-value">
                  {paidPayments} of {totalPayments}
                </span>
              </div>
            </div>
          </div>

          {/* Show loan reasons if present */}
          {activeLoan.reasons && activeLoan.reasons.length > 0 && (
            <div className="loan-reasons-section card">
              <h3>Loan Purpose</h3>
              <ul className="reasons-list">
                {activeLoan.reasons.map((reason, index) => (
                  <li key={index}>{reason}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <PaymentSchedule loan={activeLoan} />
      )}
    </div>
  );
};

export default Loans;
