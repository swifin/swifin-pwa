// lib/db.js

// Simple in-memory storage for KYC submissions
// (For production: Replace this with a real database later.)

let kycSubmissions = [];

/**
 * Save a new KYC submission
 * @param {Object} submission
 */
export function saveKycSubmission(submission) {
  kycSubmissions.push({
    id: kycSubmissions.length + 1,
    ...submission,
    status: 'pending', // pending | approved | rejected
    createdAt: new Date(),
  });
}

/**
 * Get all KYC submissions
 */
export function getAllKycSubmissions() {
  return kycSubmissions;
}

/**
 * Update the status of a KYC submission
 * @param {number} id
 * @param {'approved' | 'rejected'} newStatus
 */
export function updateKycStatus(id, newStatus) {
  const submission = kycSubmissions.find((s) => s.id === id);
  if (submission) {
    submission.status = newStatus;
    submission.updatedAt = new Date();
  }
}

