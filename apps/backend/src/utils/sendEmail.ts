import nodemailer from 'nodemailer'

/**
 * Sends a one-time password (OTP) email to the specified recipient.
 * 
 * @param to - The email address of the recipient
 * @param otp - The one-time password to send
 */
export async function sendOtpToEmail(to: string, otp: string): Promise<void> {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const mailOptions = {
      from: process.env.SMTP_FROM || '"Swifin" <no-reply@swifin.com>',
      to,
      subject: 'Your One-Time Password (OTP)',
      text: `Your Swifin OTP is: ${otp}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.5;">
          <h2>Welcome to Swifin</h2>
          <p>Your OTP is:</p>
          <h1 style="background: #f3f4f6; padding: 10px 20px; display: inline-block;">${otp}</h1>
          <p>This code will expire in 10 minutes. Please do not share it with anyone.</p>
        </div>
      `,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log(`✅ OTP sent to ${to}: ${info.messageId}`)
  } catch (error) {
    console.error(`❌ Failed to send OTP to ${to}`, error)
    throw new Error('Failed to send OTP email')
  }
}

export const sendEmail = async (to: string, subject: string, html: string): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });
};
