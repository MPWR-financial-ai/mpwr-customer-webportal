import apiClient from './client';
import ENDPOINTS from './endpoints';
import useStore from '../store/useStore';

/**
 * Customer Service
 * Handles all API calls for the customer's data
 */

// Helper to get customerId from store
const getCustomerId = () => useStore.getState().customerId;

// Fetch customer profile
export const fetchCustomerProfile = async () => {
  const customerId = getCustomerId();
  return apiClient.get(ENDPOINTS.CUSTOMER.GET(customerId));
};

// Update customer profile
export const updateCustomerProfile = async (profileData) => {
  const customerId = getCustomerId();
  return apiClient.put(ENDPOINTS.CUSTOMER.UPDATE(customerId), profileData);
};

// Fetch customer's loans
export const fetchLoans = async () => {
  const customerId = getCustomerId();
  return apiClient.get(ENDPOINTS.LOANS.LIST(customerId));
};

// Fetch a specific loan
export const fetchLoan = async (loanId) => {
  const customerId = getCustomerId();
  return apiClient.get(ENDPOINTS.LOANS.GET(customerId, loanId));
};

// Fetch loan payment schedule
export const fetchLoanSchedule = async (loanId) => {
  const customerId = getCustomerId();
  return apiClient.get(ENDPOINTS.LOANS.SCHEDULE(customerId, loanId));
};

// Make a payment
export const makePayment = async (loanId, paymentData) => {
  const customerId = getCustomerId();
  return apiClient.post(ENDPOINTS.LOANS.MAKE_PAYMENT(customerId, loanId), paymentData);
};

// Fetch customer's documents
export const fetchDocuments = async () => {
  const customerId = getCustomerId();
  return apiClient.get(ENDPOINTS.DOCUMENTS.LIST(customerId));
};

// Get upload URL for a new document
export const getDocumentUploadUrl = async (fileName, fileType) => {
  const customerId = getCustomerId();
  return apiClient.post(ENDPOINTS.DOCUMENTS.GET_UPLOAD_URL(customerId), { fileName, fileType });
};

// Confirm document upload
export const confirmDocumentUpload = async (uploadData) => {
  const customerId = getCustomerId();
  return apiClient.post(ENDPOINTS.DOCUMENTS.CONFIRM_UPLOAD(customerId), uploadData);
};

// Get download URL for a document
export const getDocumentDownloadUrl = async (docId) => {
  const customerId = getCustomerId();
  return apiClient.get(ENDPOINTS.DOCUMENTS.GET_DOWNLOAD_URL(customerId, docId));
};

// Delete a document
export const deleteDocument = async (docId) => {
  const customerId = getCustomerId();
  return apiClient.delete(ENDPOINTS.DOCUMENTS.DELETE(customerId, docId));
};

// Get signing URL for a document
export const getDocumentSigningUrl = async (docId) => {
  const customerId = getCustomerId();
  return apiClient.get(ENDPOINTS.DOCUMENTS.GET_SIGNING_URL(customerId, docId));
};

// Confirm document signature
export const confirmDocumentSignature = async (docId, signatureData) => {
  const customerId = getCustomerId();
  return apiClient.post(ENDPOINTS.DOCUMENTS.CONFIRM_SIGNATURE(customerId, docId), signatureData);
};

// Fetch customer's payments
export const fetchPayments = async () => {
  const customerId = getCustomerId();
  return apiClient.get(ENDPOINTS.PAYMENTS.LIST(customerId));
};

// Fetch upcoming payment
export const fetchUpcomingPayment = async () => {
  const customerId = getCustomerId();
  return apiClient.get(ENDPOINTS.PAYMENTS.UPCOMING(customerId));
};

// Fetch notifications
export const fetchNotifications = async () => {
  const customerId = getCustomerId();
  return apiClient.get(ENDPOINTS.NOTIFICATIONS.LIST(customerId));
};

// Mark notification as read
export const markNotificationRead = async (notificationId) => {
  const customerId = getCustomerId();
  return apiClient.post(ENDPOINTS.NOTIFICATIONS.MARK_READ(customerId, notificationId));
};

// Mark all notifications as read
export const markAllNotificationsRead = async () => {
  const customerId = getCustomerId();
  return apiClient.post(ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ(customerId));
};

/**
 * Fetch all customer data at once
 * Used for initial app load
 */
export const fetchAllCustomerData = async () => {
  const [profile, loans, documents, payments, notifications] = await Promise.all([
    fetchCustomerProfile().catch(() => null),
    fetchLoans().catch(() => []),
    fetchDocuments().catch(() => []),
    fetchPayments().catch(() => []),
    fetchNotifications().catch(() => []),
  ]);

  return {
    profile,
    loans,
    documents,
    payments,
    notifications,
  };
};

export default {
  fetchCustomerProfile,
  updateCustomerProfile,
  fetchLoans,
  fetchLoan,
  fetchLoanSchedule,
  makePayment,
  fetchDocuments,
  getDocumentUploadUrl,
  confirmDocumentUpload,
  getDocumentDownloadUrl,
  deleteDocument,
  getDocumentSigningUrl,
  confirmDocumentSignature,
  fetchPayments,
  fetchUpcomingPayment,
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  fetchAllCustomerData,
};
