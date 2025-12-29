import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const USER_CONFIRMATION_SUBJECT = "Welcome to Vision Fly Updates";

const USER_CONFIRMATION_BODY = `Hello,

Thank you for subscribing to the Vision Fly mailing list!

You will now receive exclusive updates on:
- Empty leg flight opportunities at highly preferred rates
- Special offers and promotions
- New routes and destinations

We're committed to bringing you the best in private aviation.

Safe travels,
The Vision Fly Team`;

export async function POST(request: Request) {
  console.log("DEBUG: Checking Env Vars");
  console.log("User length:", process.env.GMAIL_USER ? process.env.GMAIL_USER.length : "Missing");
  console.log("Pass length:", process.env.GMAIL_PASS ? process.env.GMAIL_PASS.length : "Missing");

  try {
    const { fullName, email } = await request.json();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const adminMailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      replyTo: email,
      subject: `[Vision Fly] New Mailing List Subscription`,
      text: `
NEW MAILING LIST SUBSCRIPTION

Subscriber Information:
- Name: ${fullName}
- Email: ${email}
      `,
      html: `
        <h2>New Mailing List Subscription</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
      `,
    };

    await transporter.sendMail(adminMailOptions);

    if (email && email.includes('@')) {
      try {
        const userMailOptions = {
          from: process.env.GMAIL_USER,
          to: email,
          subject: USER_CONFIRMATION_SUBJECT,
          text: USER_CONFIRMATION_BODY,
          html: USER_CONFIRMATION_BODY.replace(/\n/g, '<br>'),
        };
        await transporter.sendMail(userMailOptions);
      } catch (userEmailError) {
        console.error('Failed to send subscription confirmation email:', userEmailError);
      }
    }

    return NextResponse.json({ success: true, message: 'Successfully subscribed!' }, { status: 200 });

  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json({ success: false, message: 'Failed to process subscription' }, { status: 500 });
  }
}
