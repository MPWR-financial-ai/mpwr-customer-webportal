import { useState, useMemo } from 'react';
import './LoanSliderCard.css';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const LoanSliderCard = ({ loan }) => {
  const [extraPayment, setExtraPayment] = useState(0);

  // Handle API field names
  const monthlyPayment = loan.avg_monthly_payment || loan.monthlyPayment || 0;
  const interestRate = loan.interest_rate || loan.interestRate || 0;
  const loanAmount = loan.amount || loan.originalAmount || 0;
  const currentBalance = loan.current_balance || loan.currentBalance || loanAmount;

  const minPayment = loan.minPayment || monthlyPayment;
  const maxExtra = loan.maxExtraPayment || 1000;

  const calculations = useMemo(() => {
    const totalPayment = minPayment + extraPayment;
    const monthlyRate = interestRate / 100 / 12;
    const balance = currentBalance;

    // Calculate months to payoff with extra payment
    let remainingBalance = balance;
    let months = 0;
    let totalInterest = 0;

    while (remainingBalance > 0 && months < 360) {
      const interest = remainingBalance * monthlyRate;
      totalInterest += interest;
      const principal = Math.min(totalPayment - interest, remainingBalance);
      remainingBalance -= principal;
      months++;

      if (totalPayment <= interest) break;
    }

    // Calculate baseline (no extra payment)
    let baselineBalance = balance;
    let baselineMonths = 0;
    let baselineInterest = 0;

    while (baselineBalance > 0 && baselineMonths < 360) {
      const interest = baselineBalance * monthlyRate;
      baselineInterest += interest;
      const principal = Math.min(minPayment - interest, baselineBalance);
      baselineBalance -= principal;
      baselineMonths++;

      if (minPayment <= interest) break;
    }

    const monthsSaved = baselineMonths - months;
    const interestSaved = baselineInterest - totalInterest;

    return {
      totalPayment,
      monthsToPayoff: months,
      monthsSaved,
      interestSaved: Math.max(0, interestSaved),
      totalInterest,
    };
  }, [extraPayment, minPayment, interestRate, currentBalance]);

  const sliderPercentage = (extraPayment / maxExtra) * 100;

  return (
    <div className="loan-slider-card card">
      <div className="slider-card-header">
        <h3>Adjust Your Payment</h3>
        <p className="slider-subtitle">See how extra payments impact your loan</p>
      </div>

      <div className="payment-display">
        <div className="payment-breakdown">
          <div className="payment-item">
            <span className="payment-label">Minimum Payment</span>
            <span className="payment-value">{formatCurrency(minPayment)}</span>
          </div>
          <div className="payment-plus">+</div>
          <div className="payment-item extra">
            <span className="payment-label">Extra Payment</span>
            <span className="payment-value highlight">{formatCurrency(extraPayment)}</span>
          </div>
          <div className="payment-equals">=</div>
          <div className="payment-item total">
            <span className="payment-label">Total Payment</span>
            <span className="payment-value total-value">{formatCurrency(calculations.totalPayment)}</span>
          </div>
        </div>
      </div>

      <div className="slider-section">
        <div className="slider-header">
          <label>EXTRA PAYMENT AMOUNT</label>
          <span className="slider-value">{formatCurrency(extraPayment)}</span>
        </div>
        <input
          type="range"
          min={0}
          max={maxExtra}
          step={25}
          value={extraPayment}
          onChange={(e) => setExtraPayment(parseInt(e.target.value))}
          className="payment-slider"
          style={{
            background: `linear-gradient(to right, #10b981 0%, #10b981 ${sliderPercentage}%, #e5e7eb ${sliderPercentage}%, #e5e7eb 100%)`
          }}
        />
        <div className="slider-labels">
          <span>{formatCurrency(0)}</span>
          <span>{formatCurrency(maxExtra)}</span>
        </div>
      </div>

      {extraPayment > 0 && (
        <div className="savings-section">
          <div className="savings-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <span>Your Savings</span>
          </div>
          <div className="savings-grid">
            <div className="savings-item">
              <span className="savings-value">{calculations.monthsSaved}</span>
              <span className="savings-label">Months Saved</span>
            </div>
            <div className="savings-item">
              <span className="savings-value">{formatCurrency(calculations.interestSaved)}</span>
              <span className="savings-label">Interest Saved</span>
            </div>
          </div>
        </div>
      )}

      <div className="payoff-info">
        <div className="payoff-item">
          <span className="payoff-label">Estimated Payoff</span>
          <span className="payoff-value">{calculations.monthsToPayoff} months</span>
        </div>
        <div className="payoff-item">
          <span className="payoff-label">Total Interest</span>
          <span className="payoff-value">{formatCurrency(calculations.totalInterest)}</span>
        </div>
      </div>

      <button className="apply-payment-btn btn btn-primary">
        {extraPayment > 0 ? `Pay ${formatCurrency(calculations.totalPayment)}` : 'Make Minimum Payment'}
      </button>

      <div className="slider-info-box">
        <span className="info-icon">i</span>
        <p>
          Paying extra each month can significantly reduce your total interest and payoff time.
          Adjust the slider to see potential savings.
        </p>
      </div>
    </div>
  );
};

export default LoanSliderCard;
