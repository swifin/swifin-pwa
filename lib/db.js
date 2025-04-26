// lib/db.js

// Dummy KYC Submission Database Logic

export async function getKycSubmissions() {
  return [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      kycStatus: 'pending',
      idDocumentUrl: '/uploads/kyc/john-id.jpg',
      selfieUrl: '/uploads/kyc/john-selfie.jpg',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      kycStatus: 'pending',
      idDocumentUrl: '/uploads/kyc/jane-id.jpg',
      selfieUrl: '/uploads/kyc/jane-selfie.jpg',
    },
  ];
}

export async function updateKycStatus(id, status) {
  console.log(`Updating KYC for ID ${id} to status ${status}`);
  return { success: true };
}
