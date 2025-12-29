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
      contactName,
      contactEmail,
      contactPhone,
      tripType,
      origin,
      destination,
      departureDate,
      returnDate,
      passengerCount,
      passengerList,
      notes
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
      replyTo: contactEmail,
      subject: `[Vision Fly Private Charter] New Request from ${contactName}`,
      text: `
PRIVATE CHARTER REQUEST

Contact Information:
- Name: ${contactName}
- Email: ${contactEmail}
- Phone: ${contactPhone}

Flight Details:
- Trip Type: ${tripType}
- Origin: ${origin}
- Destination: ${destination}
- Departure Date: ${departureDate}
- Return Date: ${returnDate || 'N/A (One-way)'}
- Passenger Count: ${passengerCount}

Passenger Manifest:
${passengerList || 'Not provided'}

Additional Notes:
${notes || 'None'}
      `,
      html: `
        <h2>Private Charter Request</h2>
        
        <h3>Contact Information</h3>
        <p><strong>Name:</strong> ${contactName}</p>
        <p><strong>Email:</strong> ${contactEmail}</p>
        <p><strong>Phone:</strong> ${contactPhone}</p>
        
        <hr />
        
        <h3>Flight Details</h3>
        <p><strong>Trip Type:</strong> ${tripType}</p>
        <p><strong>Origin:</strong> ${origin}</p>
        <p><strong>Destination:</strong> ${destination}</p>
        <p><strong>Departure Date:</strong> ${departureDate}</p>
        <p><strong>Return Date:</strong> ${returnDate || 'N/A (One-way)'}</p>
        <p><strong>Passenger Count:</strong> ${passengerCount}</p>
        
        <hr />
        
        <h3>Passenger Manifest</h3>
        <p>${(passengerList || 'Not provided').replace(/\n/g, '<br>')}</p>
        
        <hr />
        
        <h3>Additional Notes</h3>
        <p>${(notes || 'None').replace(/\n/g, '<br>')}</p>
      `,
    };

    await transporter.sendMail(adminMailOptions);

    if (contactEmail && contactEmail.includes('@')) {
      try {
        const userMailOptions = {
          from: gmailUser,
          to: contactEmail,
          subject: USER_CONFIRMATION_SUBJECT,
          text: USER_CONFIRMATION_BODY,
          html: USER_CONFIRMATION_BODY.replace(/\n/g, '<br>'),
        };
        await transporter.sendMail(userMailOptions);
      } catch (userEmailError) {
        console.error('Failed to send user confirmation email:', userEmailError);
      }
    }

    return NextResponse.json({ success: true, message: 'Charter request submitted!' }, { status: 200 });

  } catch (error: any) {
    console.error('Email error:', error?.message || error);
    console.error('Full error:', JSON.stringify(error, null, 2));
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to send charter request. Please try again later.' 
    }, { status: 500 });
  }
}
