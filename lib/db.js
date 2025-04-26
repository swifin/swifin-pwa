// lib/db.js

import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

const adapter = new JSONFile('kyc-submissions.json');
const db = new Low(adapter);

// Read data from JSON file, if it exists
await db.read();
db.data ||= { submissions: [] };

export async function getAllKycSubmissions() {
  await db.read();
  return db.data.submissions;
}

export async function saveKycSubmission(submission) {
  await db.read();
  db.data.submissions.push(submission);
  await db.write();
}

export async function updateKycStatus(id, status) {
  await db.read();
  const kyc = db.data.submissions.find(sub => sub.id === id);
  if (kyc) {
    kyc.status = status;
    await db.write();
  }
}

