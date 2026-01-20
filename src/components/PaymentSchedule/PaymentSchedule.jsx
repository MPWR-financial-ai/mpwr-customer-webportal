import { useState, useMemo } from 'react';
import './PaymentSchedule.css';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (date) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatDateInput = (date) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
};

const PaymentSchedule = ({ loan }) => {
  const [editingPayment, setEditingPayment] = useState(null);
  const [editedAmount, setEditedAmount] = useState('');
  const [editedDate, setEditedDate] = useState('');
  const [paymentModifications, setPaymentModifications] = useState({});

  // Get loan values with API field name fallbacks
  const monthlyPayment = loan.avg_monthly_payment || loan.monthlyPayment || 0;
  const interestRate = loan.interest_rate || loan.interestRate || 0;
  const loanAmount = loan.amount || loan.originalAmount || 0;

  const schedule = useMemo(() => {
    // If loan has repayment_schedule from API, use it directly
    if (loan.repayment_schedule && loan.repayment_schedule.length > 0) {
      return loan.repayment_schedule.map((payment, index) => {
        const paymentNumber = index + 1;
        const mod = paymentModifications[paymentNumber];
        const paymentDate = new Date(payment.date);
        const modifiedDate = mod?.date ? new Date(mod.date) : paymentDate;
        const paymentAmount = payment.amount || monthlyPayment;
        const modifiedAmount = mod?.amount || paymentAmount;

        // Determine status
        let status = 'scheduled';
        if (payment.status === 'paid') {
          status = 'paid';
        } else if (index === loan.repayment_schedule.findIndex(p => p.status !== 'paid')) {
          status = 'upcoming';
        }

        return {
          number: paymentNumber,
          date: modifiedDate,
          originalDate: paymentDate,
          payment: modifiedAmount,
          originalPayment: paymentAmount,
          principal: payment.principal || 0,
          interest: payment.interest || 0,
          balance: payment.balance || 0,
          status,
          isModified: !!mod,
        };
      });
    }

    // Fallback: Calculate schedule from loan parameters
    const payments = [];
    const monthlyRate = interestRate / 100 / 12;
    const startDate = new Date(loan.startDate || Date.now());
    let balance = loanAmount;
    const totalPayments = loan.totalPayments || 24;
    const paidPayments = loan.paidPayments || 0;

    for (let i = 0; i < totalPayments; i++) {
      const paymentDate = new Date(startDate);
      paymentDate.setMonth(paymentDate.getMonth() + i + 1);

      const interest = balance * monthlyRate;
      const principal = monthlyPayment - interest;
      const newBalance = Math.max(0, balance - principal);

      const isPaid = i < paidPayments;
      const isCurrent = i === paidPayments;

      const mod = paymentModifications[i + 1];
      const modifiedDate = mod?.date ? new Date(mod.date) : paymentDate;
      const modifiedAmount = mod?.amount || monthlyPayment;

      payments.push({
        number: i + 1,
        date: modifiedDate,
        originalDate: paymentDate,
        payment: modifiedAmount,
        originalPayment: monthlyPayment,
        principal: principal,
        interest: interest,
        balance: newBalance,
        status: isPaid ? 'paid' : isCurrent ? 'upcoming' : 'scheduled',
        isModified: !!mod,
      });

      balance = newBalance;
    }

    return payments;
  }, [loan, paymentModifications, monthlyPayment, interestRate, loanAmount]);

  const paidCount = schedule.filter(p => p.status === 'paid').length;
  const totalCount = schedule.length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return <span className="status-badge paid">Paid</span>;
      case 'upcoming':
        return <span className="status-badge upcoming">Upcoming</span>;
      default:
        return <span className="status-badge scheduled">Scheduled</span>;
    }
  };

  const handleEditClick = (payment) => {
    setEditingPayment(payment.number);
    setEditedAmount(payment.payment.toString());
    setEditedDate(formatDateInput(payment.date));
  };

  const handleSaveEdit = (paymentNumber) => {
    const amount = parseFloat(editedAmount);
    if (isNaN(amount) || amount < monthlyPayment * 0.5) {
      return;
    }

    setPaymentModifications((prev) => ({
      ...prev,
      [paymentNumber]: {
        amount: amount,
        date: editedDate,
      },
    }));
    setEditingPayment(null);
  };

  const handleCancelEdit = () => {
    setEditingPayment(null);
    setEditedAmount('');
    setEditedDate('');
  };

  const handleResetPayment = (paymentNumber) => {
    setPaymentModifications((prev) => {
      const updated = { ...prev };
      delete updated[paymentNumber];
      return updated;
    });
  };

  const minPayment = monthlyPayment * 0.5;
  const maxPayment = monthlyPayment * 3;

  return (
    <div className="payment-schedule">
      <div className="schedule-summary card">
        <div className="summary-item">
          <span className="summary-label">Total Payments</span>
          <span className="summary-value">{totalCount}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Completed</span>
          <span className="summary-value paid">{paidCount}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Remaining</span>
          <span className="summary-value">{totalCount - paidCount}</span>
        </div>
      </div>

      <div className="schedule-list">
        {schedule.map((payment) => (
          <div
            key={payment.number}
            className={`schedule-item card ${payment.status} ${payment.isModified ? 'modified' : ''}`}
          >
            <div className="schedule-item-header">
              <div className="payment-number">
                <span className="number-label">Payment</span>
                <span className="number-value">#{payment.number}</span>
              </div>
              <div className="header-actions">
                {payment.isModified && (
                  <span className="modified-badge">Modified</span>
                )}
                {getStatusBadge(payment.status)}
              </div>
            </div>

            <div className="schedule-item-date">
              {payment.status === 'paid' && (
                <span className="checkmark-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
              )}
              <span>{formatDate(payment.date)}</span>
              {payment.isModified && payment.date.getTime() !== payment.originalDate.getTime() && (
                <span className="original-date">(was {formatDate(payment.originalDate)})</span>
              )}
            </div>

            {editingPayment === payment.number ? (
              <div className="edit-payment-form">
                <div className="edit-row">
                  <div className="edit-field">
                    <label>Payment Amount</label>
                    <div className="amount-input-wrapper">
                      <span className="currency-symbol">$</span>
                      <input
                        type="number"
                        value={editedAmount}
                        onChange={(e) => setEditedAmount(e.target.value)}
                        min={minPayment}
                        max={maxPayment}
                        step="0.01"
                        className="amount-input"
                      />
                    </div>
                    <span className="input-hint">
                      Min: {formatCurrency(minPayment)} / Max: {formatCurrency(maxPayment)}
                    </span>
                  </div>
                  <div className="edit-field">
                    <label>Payment Date</label>
                    <input
                      type="date"
                      value={editedDate}
                      onChange={(e) => setEditedDate(e.target.value)}
                      className="date-input"
                    />
                  </div>
                </div>
                <div className="edit-actions">
                  <button className="btn btn-secondary" onClick={handleCancelEdit}>
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={() => handleSaveEdit(payment.number)}>
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="schedule-item-details">
                  <div className="detail-col">
                    <span className="detail-label">Payment</span>
                    <span className={`detail-value ${payment.isModified ? 'modified-value' : ''}`}>
                      {formatCurrency(payment.payment)}
                    </span>
                    {payment.isModified && payment.payment !== payment.originalPayment && (
                      <span className="original-value">was {formatCurrency(payment.originalPayment)}</span>
                    )}
                  </div>
                  {payment.principal > 0 && (
                    <div className="detail-col">
                      <span className="detail-label">Principal</span>
                      <span className="detail-value">{formatCurrency(payment.principal)}</span>
                    </div>
                  )}
                  {payment.interest > 0 && (
                    <div className="detail-col">
                      <span className="detail-label">Interest</span>
                      <span className="detail-value">{formatCurrency(payment.interest)}</span>
                    </div>
                  )}
                  {payment.balance > 0 && (
                    <div className="detail-col">
                      <span className="detail-label">Balance</span>
                      <span className="detail-value">{formatCurrency(payment.balance)}</span>
                    </div>
                  )}
                </div>

                {(payment.status === 'upcoming' || payment.status === 'scheduled') && (
                  <div className="payment-actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleEditClick(payment)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      Reschedule
                    </button>
                    {payment.isModified && (
                      <button
                        className="reset-btn"
                        onClick={() => handleResetPayment(payment.number)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                          <path d="M3 3v5h5" />
                        </svg>
                        Reset
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentSchedule;
