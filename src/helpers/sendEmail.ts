import nodemailer from "nodemailer";
import { Attachment } from "nodemailer/lib/mailer";

interface emailParams {
  to: string;
  subject: string;
  html: string;
  attachments?: {
    originalname: string;
    buffer: Buffer;
    mimetype?: string;
  }[];
}

const sendEmail = async ({ to, subject, html, attachments }: emailParams) => {
  const devTransporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: Number(process.env.ETHERIAL_PORT),
    auth: {
      user: process.env.ETHERIAL_USER!,
      pass: process.env.ETHERIAL_PASS!,
    },
  });

  const prodTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER!,
      pass: process.env.GMAIL_PASS!,
    },
  });

  const transporter =
    process.env.NODE_ENV === "production" ? prodTransporter : devTransporter;

  const mappedAttachments: Attachment[] | undefined = attachments?.map(
    (file) => ({
      filename: file.originalname,
      content: file.buffer,
      contentType: file.mimetype,
    })
  );

  const mailOptions: nodemailer.SendMailOptions = {
    from: '"Meinhouse" <meinhouse@gmail.com>',
    to,
    subject,
    html,
    attachments: mappedAttachments,
  };

  return transporter.sendMail(mailOptions);
};

export default sendEmail;
