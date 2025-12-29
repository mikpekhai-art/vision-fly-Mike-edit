import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const USER_CONFIRMATION_SUBJECT = "We received your request - Vision Fly";

const USER_CONFIRMATION_BODY = `Hello,

Thank you for choosing Vision Fly. We have successfully received your request.

Our flight operations team is currently scanning our network to secure the most competitive rate for your journey. We are dedicated to providing you with premium air travel at the best possible value, so please allow us a brief moment to finalize the most affordable options for your specific route.

We will be in touch shortly.

Safe travels,
The Vision Fly Team`;

export async function POST(request: Request) {
  try {
    // Validate credentials first
    const gmailUser = process.env.GMAIL_USER?.trim();
    const gmailPass = process.env.GMAIL_PASS?.trim();
    
    if (!gmailUser || !gmailPass) {
      console.error('Missing or empty email credentials - GMAIL_USER exists:', !!gmailUser, 'GMAIL_PASS exists:', !!gmailPass);
      console.error('GMAIL_USER length:', process.env.GMAIL_USER?.length, 'GMAIL_PASS length:', process.env.GMAIL_PASS?.length);
      return NextResponse.json({ 
        success: false, 
        message: 'Email service not configured. Please contact support.' 
      }, { status: 500 });
    }

    const { name, email, subject, message } = await request.json();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });

    const adminMailOptions = {
      from: gmailUser,
      to: gmailUser,
      replyTo: email,
      subject: subject ? `[Vision Fly Contact] ${subject}` : `New Contact Form Submission from ${name}`,
      text: `
Name: ${name}
Email: ${email}
Subject: ${subject || 'N/A'}

Message:
${message}
      `,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    };

    await transporter.sendMail(adminMailOptions);

    if (email && email.includes('@')) {
      try {
        const userMailOptions = {
          from: gmailUser,
          to: email,
          subject: USER_CONFIRMATION_SUBJECT,
          text: USER_CONFIRMATION_BODY,
          html: USER_CONFIRMATION_BODY.replace(/\n/g, '<br>'),
        };
        await transporter.sendMail(userMailOptions);
      } catch (userEmailError) {
        console.error('Failed to send user confirmation email:', userEmailError);
      }
    }

    return NextResponse.json({ success: true, message: 'Email sent!' }, { status: 200 });

  } catch (error: any) {
    console.error('Email error:', error?.message || error);
    console.error('Full error:', JSON.stringify(error, null, 2));
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to send email. Please try again later.' 
    }, { status: 500 });
  }
}
