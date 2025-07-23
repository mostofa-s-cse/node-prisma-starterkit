import { addToEmailQueue } from '../services/emailQueue.service';

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
}

export const sendEmail = async (options: EmailOptions) => {
  try {
    await addToEmailQueue(options);
  } catch (error) {
    console.error('Failed to queue email:', error);
    throw error;
  }
}; 