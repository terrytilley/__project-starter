import nodemailer from 'nodemailer';

interface EmailTemplate {
  from: string;
  to: string;
  subject: string;
  html: string;
}

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASSWORD,
  },
});

export const sendEmail = async (emailTemplate: EmailTemplate) => {
  return transporter.sendMail(emailTemplate);
};
