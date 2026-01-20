import { create } from 'zustand';
import customerService from '../api/customerService';
import { normalizeApiObject } from '../utils/apiHelpers';

const useStore = create((set, get) => ({
  // Customer ID - set via URL query param
  customerId: null,
  setCustomerId: (customerId) => set({ customerId, dataLoaded: false }),

  // User/Auth state
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  signOut: () => set({
    user: null,
    isAuthenticated: false,
    loans: [],
    activeLoan: null,
    documents: [],
    payments: [],
    upcomingPayment: null,
    notifications: [],
    unreadCount: 0,
  }),

  // Customer's loans
  loans: [],
  activeLoan: null,
  setLoans: (loans) => set({ loans }),
  setActiveLoan: (loan) => set({ activeLoan: loan }),
  updateLoan: (loanId, updates) => set((state) => ({
    loans: state.loans.map((loan) =>
      loan.id === loanId ? { ...loan, ...updates } : loan
    ),
    activeLoan: state.activeLoan?.id === loanId
      ? { ...state.activeLoan, ...updates }
      : state.activeLoan,
  })),

  // Documents
  documents: [],
  setDocuments: (documents) => set({ documents }),
  addDocument: (document) => set((state) => ({
    documents: [...state.documents, document],
  })),
  removeDocument: (docId) => set((state) => ({
    documents: state.documents.filter((doc) => doc.id !== docId),
  })),
  updateDocument: (docId, updates) => set((state) => ({
    documents: state.documents.map((doc) =>
      doc.id === docId ? { ...doc, ...updates } : doc
    ),
  })),

  // Payments
  payments: [],
  upcomingPayment: null,
  setPayments: (payments) => set({ payments }),
  setUpcomingPayment: (payment) => set({ upcomingPayment: payment }),

  // Notifications
  notifications: [],
  unreadCount: 0,
  setNotifications: (notifications) => set({
    notifications,
    unreadCount: notifications.filter((n) => !n.read).length,
  }),
  markNotificationRead: (notificationId) => set((state) => {
    const notifications = state.notifications.map((n) =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    return {
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
    };
  }),
  markAllNotificationsRead: () => set((state) => ({
    notifications: state.notifications.map((n) => ({ ...n, read: true })),
    unreadCount: 0,
  })),

  // UI State
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
  error: null,
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  dataLoaded: false,
  setDataLoaded: (loaded) => set({ dataLoaded: loaded }),

  // Load all customer data from API
  loadCustomerData: async () => {
    const { setIsLoading, setError } = get();
    setIsLoading(true);
    setError(null);

    try {
      const data = await customerService.fetchAllCustomerData();

      // Extract customer from response
      const customerRaw = data.profile?.customer || data.profile;

      // Normalize all data to convert {text, score} objects to plain text values
      const customer = normalizeApiObject(customerRaw);

      // Extract and normalize loans - prefer loans_full from customer profile, fallback to loans endpoint
      const loansRaw = customer?.loans_full || data.loans?.loans || data.loans || [];
      const loans = normalizeApiObject(loansRaw);

      // Extract and normalize documents - from customer profile or documents endpoint
      const documentsRaw = customer?.documents || data.documents?.documents || data.documents || [];
      const documents = normalizeApiObject(documentsRaw);

      // Extract and normalize payments
      const paymentsRaw = data.payments?.payments || data.payments || [];
      const payments = normalizeApiObject(paymentsRaw);

      // Extract and normalize notifications
      const notificationsRaw = data.notifications?.notifications || data.notifications || [];
      const notifications = normalizeApiObject(notificationsRaw);

      // Build user object from normalized customer data
      const user = customer ? {
        id: customer.id,
        name: customer.name || customer.identity?.name,
        email: customer.email || customer.identity?.email,
        phone: customer.phone || customer.identity?.phone,
        status: customer.status,
        lead_id: customer.lead_id,
        person_id: customer.person_id,
        identity: customer.identity,
        employment: customer.employment,
        financials: customer.financials,
        risk: customer.risk,
      } : null;

      set({
        user,
        loans,
        activeLoan: loans[0] || null,
        documents,
        payments,
        notifications,
        unreadCount: notifications.filter((n) => !n.read).length,
        isLoading: false,
        dataLoaded: true,
      });

      return data;
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
      throw error;
    }
  },

  // Refresh specific data
  refreshLoans: async () => {
    try {
      const response = await customerService.fetchLoans();
      const loansRaw = response?.loans || response || [];
      const loans = normalizeApiObject(loansRaw);
      set({
        loans,
        activeLoan: loans[0] || null,
      });
    } catch (error) {
      console.error('Failed to refresh loans:', error);
    }
  },

  refreshDocuments: async () => {
    try {
      const response = await customerService.fetchDocuments();
      const documentsRaw = response?.documents || response || [];
      const documents = normalizeApiObject(documentsRaw);
      set({ documents });
    } catch (error) {
      console.error('Failed to refresh documents:', error);
    }
  },

  refreshPayments: async () => {
    try {
      const response = await customerService.fetchPayments();
      const paymentsRaw = response?.payments || response || [];
      const payments = normalizeApiObject(paymentsRaw);
      set({ payments });
    } catch (error) {
      console.error('Failed to refresh payments:', error);
    }
  },

  refreshNotifications: async () => {
    try {
      const response = await customerService.fetchNotifications();
      const notificationsRaw = response?.notifications || response || [];
      const notifications = normalizeApiObject(notificationsRaw);
      set({
        notifications,
        unreadCount: notifications.filter((n) => !n.read).length,
      });
    } catch (error) {
      console.error('Failed to refresh notifications:', error);
    }
  },
}));

export default useStore;
