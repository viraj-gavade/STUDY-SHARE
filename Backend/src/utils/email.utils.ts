import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

/**
 * Create a nodemailer transporter for sending emails
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

console.log('Email transporter created with user:', process.env.EMAIL_USER);
console.log('Email transporter created with password:', process.env.EMAIL_PASSWORD);
/**
 * Send an email
 * @param options Email options including recipient, subject, and content
 * @returns Promise that resolves when email is sent
 */
export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `${process.env.EMAIL_USER}`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${options.to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Error sending email');
  }
};
