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
        user: gmailUser,
        pass: gmailPass,
      },
    });

    const adminMailOptions = {
      from: gmailUser,
      to: gmailUser,
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
          from: gmailUser,
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

  } catch (error: any) {
    console.error('Email error:', error?.message || error);
    console.error('Full error:', JSON.stringify(error, null, 2));
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to send empty leg inquiry. Please try again later.' 
    }, { status: 500 });
  }
}
