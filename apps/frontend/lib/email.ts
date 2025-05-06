// apps/frontend/lib/email.ts

export interface EmailOptions {
  to: string;
  subject: string;
  text: string;
}

/**
 * Stub for OTP emails. Replace with real mailer logic (e.g. Nodemailer, SendGrid).
 */
export async function sendEmail({ to, subject, text }: EmailOptions) {
  console.log(`📧 [Stub] Sending email to ${to}
Subject: ${subject}

${text}
`);
}

