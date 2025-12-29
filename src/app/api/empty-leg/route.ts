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
    const { 
      fullName,
      emailAddress,
      phoneNumber,
      numberOfPassengers,
      flightDetails
    } = await request.json();

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
      replyTo: emailAddress,
      subject: `[Vision Fly Empty Leg] New Inquiry from ${fullName}`,
      text: `
EMPTY LEG FLIGHT INQUIRY

Contact Information:
- Name: ${fullName}
- Email: ${emailAddress}
- Phone: ${phoneNumber}
- Number of Passengers: ${numberOfPassengers || 'Not specified'}

Flight Details:
- Route: ${flightDetails?.route || 'N/A'}
- Date: ${flightDetails?.date || 'N/A'}
- Aircraft: ${flightDetails?.aircraft || 'N/A'}
- Price: ${flightDetails?.price || 'N/A'}
      `,
      html: `
        <h2>Empty Leg Flight Inquiry</h2>
        
        <h3>Contact Information</h3>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${emailAddress}</p>
        <p><strong>Phone:</strong> ${phoneNumber}</p>
        <p><strong>Number of Passengers:</strong> ${numberOfPassengers || 'Not specified'}</p>
        
        <hr />
        
        <h3>Flight Details</h3>
        <p><strong>Route:</strong> ${flightDetails?.route || 'N/A'}</p>
        <p><strong>Date:</strong> ${flightDetails?.date || 'N/A'}</p>
        <p><strong>Aircraft:</strong> ${flightDetails?.aircraft || 'N/A'}</p>
        <p><strong>Price:</strong> ${flightDetails?.price || 'N/A'}</p>
      `,
    };

    await transporter.sendMail(adminMailOptions);

    if (emailAddress && emailAddress.includes('@')) {
      try {
        const userMailOptions = {
          from: process.env.GMAIL_USER,
          to: emailAddress,
          subject: USER_CONFIRMATION_SUBJECT,
          text: USER_CONFIRMATION_BODY,
          html: USER_CONFIRMATION_BODY.replace(/\n/g, '<br>'),
        };
        await transporter.sendMail(userMailOptions);
      } catch (userEmailError) {
        console.error('Failed to send user confirmation email:', userEmailError);
      }
    }

    return NextResponse.json({ success: true, message: 'Empty leg inquiry submitted!' }, { status: 200 });

  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json({ success: false, message: 'Failed to send empty leg inquiry' }, { status: 500 });
  }
}
