import { useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';
import LoanSummaryCard from '../../components/LoanSummaryCard/LoanSummaryCard';
import QuickActions from '../../components/QuickActions/QuickActions';
import UpcomingPayment from '../../components/UpcomingPayment/UpcomingPayment';
import DocumentAlerts from '../../components/DocumentAlerts/DocumentAlerts';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, activeLoan, documents } = useStore();

  const firstName = user?.name?.split(' ')[0] || 'there';

  const pendingDocuments = documents.filter(
    (doc) => doc.status === 'pending_signature' || doc.status === 'action_required'
  );

  // Calculate upcoming payment from active loan
  // Use repayment_schedule if available, otherwise use loan fields
  let upcomingPayment = null;
  if (activeLoan) {
    const monthlyPayment = activeLoan.avg_monthly_payment || activeLoan.monthlyPayment;

    // Find next unpaid payment from repayment_schedule
    const nextScheduledPayment = activeLoan.repayment_schedule?.find(p => p.status !== 'paid');

    if (nextScheduledPayment) {
      const dueDate = new Date(nextScheduledPayment.date);
      upcomingPayment = {
        id: 'upcoming-payment',
        amount: nextScheduledPayment.amount || monthlyPayment,
        dueDate: nextScheduledPayment.date,
        status: 'upcoming',
        daysUntilDue: Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24)),
      };
    } else if (activeLoan.nextPaymentDate) {
      const dueDate = new Date(activeLoan.nextPaymentDate);
      upcomingPayment = {
        id: 'upcoming-payment',
        amount: activeLoan.nextPaymentAmount || monthlyPayment,
        dueDate: activeLoan.nextPaymentDate,
        status: 'upcoming',
        daysUntilDue: Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24)),
      };
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-greeting">
        <h1>Hello, {firstName}</h1>
        <p>Here's your loan overview</p>
      </div>

      {activeLoan && (
        <LoanSummaryCard
          loan={activeLoan}
          onClick={() => navigate('/loans')}
        />
      )}

      <QuickActions />

      {upcomingPayment && upcomingPayment.daysUntilDue > 0 && (
        <UpcomingPayment
          payment={upcomingPayment}
          onMakePayment={() => navigate('/payments')}
        />
      )}

      {pendingDocuments.length > 0 && (
        <DocumentAlerts
          documents={pendingDocuments}
          onViewDocuments={() => navigate('/documents')}
        />
      )}
    </div>
  );
};

export default Dashboard;
