import { type NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

export async function POST(request: NextRequest) {

  const isDevelopment = process.env.NODE_ENV === 'development';

  const { email, name, message } = await request.json();

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.MY_PASSWORD,
    },
    tls: {
      // This allows self-signed certificates in development environment only
      rejectUnauthorized: !isDevelopment,
    },
  });

  const mailOptions: Mail.Options = {
    from: process.env.MY_EMAIL,
    to: email,
    bcc: process.env.MY_EMAIL,
    subject: `Thank you for your interest, ${name}`,
    text: `This is a copy of your submission on Kate.\nThank you for getting in touch, we wil get back to you as soon as possible.\n\n${message}`,
  };

  const sendMailPromise = () =>
    new Promise<string>((resolve, reject) => {
      transport.sendMail(mailOptions, function (err) {
        if (!err) {
          resolve("Email sent");
        } else {
          reject(err.message);
        }
      });
    });

  try {
    await sendMailPromise();
    return NextResponse.json({ message: "Email sent" });
  } catch (err) {
    console.error("Error sending email:", err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
