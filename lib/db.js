// lib/db.js

let kycSubmissions = [];

export const db = {
  getSubmissions: () => kycSubmissions,
  addSubmission: (submission) => {
    kycSubmissions.push(submission);
  },
  clearSubmissions: () => {
    kycSubmissions = [];
  },
};

// Mocked functions (replace with your real database logic later)

export async function getAllKycSubmissions() {
  return db.getSubmissions();
}

export async function updateKycStatus(userId, action) {
  // Simulated update: not real database
  const submissions = db.getSubmissions();
  const index = submissions.findIndex((sub) => sub.id === userId);
  if (index !== -1) {
    submissions[index].kycStatus = action === 'approve' ? 'approved' : 'rejected';
  }
}

export async function saveKycSubmission(submission) {
  db.addSubmission(submission);
}

