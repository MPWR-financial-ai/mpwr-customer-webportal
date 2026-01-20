// Endpoints are functions that take customerId to build the full path
export const ENDPOINTS = {
  // Customer Profile
  CUSTOMER: {
    GET: (customerId) => `/api/customers/${customerId}`,
    UPDATE: (customerId) => `/api/customers/${customerId}`,
  },

  // Loans
  LOANS: {
    LIST: (customerId) => `/api/customers/${customerId}/loans`,
    GET: (customerId, loanId) => `/api/customers/${customerId}/loans/${loanId}`,
    SCHEDULE: (customerId, loanId) => `/api/customers/${customerId}/loans/${loanId}/schedule`,
    MAKE_PAYMENT: (customerId, loanId) => `/api/customers/${customerId}/loans/${loanId}/payment`,
  },

  // Documents
  DOCUMENTS: {
    LIST: (customerId) => `/api/customers/${customerId}/documents`,
    GET_UPLOAD_URL: (customerId) => `/api/customers/${customerId}/documents/upload-url`,
    CONFIRM_UPLOAD: (customerId) => `/api/customers/${customerId}/documents/confirm`,
    GET_DOWNLOAD_URL: (customerId, docId) => `/api/customers/${customerId}/documents/${docId}/download-url`,
    DELETE: (customerId, docId) => `/api/customers/${customerId}/documents/${docId}`,
    // Document signing
    GET_SIGNING_URL: (customerId, docId) => `/api/customers/${customerId}/documents/${docId}/sign`,
    CONFIRM_SIGNATURE: (customerId, docId) => `/api/customers/${customerId}/documents/${docId}/confirm-signature`,
    SIGNING_STATUS: (customerId, docId) => `/api/customers/${customerId}/documents/${docId}/signing-status`,
  },

  // Payments
  PAYMENTS: {
    LIST: (customerId) => `/api/customers/${customerId}/payments`,
    GET: (customerId, paymentId) => `/api/customers/${customerId}/payments/${paymentId}`,
    UPCOMING: (customerId) => `/api/customers/${customerId}/payments/upcoming`,
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: (customerId) => `/api/customers/${customerId}/notifications`,
    MARK_READ: (customerId, notificationId) => `/api/customers/${customerId}/notifications/${notificationId}/read`,
    MARK_ALL_READ: (customerId) => `/api/customers/${customerId}/notifications/read-all`,
  },
};

export const WS_ENDPOINTS = {
  NOTIFICATIONS: (customerId) => `/ws/customers/${customerId}/notifications`,
};

export default ENDPOINTS;
