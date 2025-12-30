import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const USER_CONFIRMATION_SUBJECT = "We received your request - Vision Fly";

const SIGNATURE_HTML = `
<br><br>
<table cellspacing="0" cellpadding="0" border="0" style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.4; color: #333; max-width: 500px;">
  <tr>
    <td valign="top" style="padding-right: 20px; width: 120px;">
      <img src="https://www.visionfly.com.ng/email-icons/visionfly%20logo.PNG" alt="Vision Fly" width="110" style="display: block; border: 0;">
    </td>
    <td valign="top" style="border-left: 2px solid #0b3d91; padding-left: 20px;">
      <strong style="font-size: 18px; color: #000;">Adebusoye Adejumo</strong><br>
      <span style="font-size: 13px; color: #555; font-weight: bold;">CEO/Co-founder</span><br>
      <span style="font-size: 13px; color: #666; font-style: italic;">Airline Pilot | Drone Pilot</span><br>
      <div style="height: 10px;"></div>
      <table cellspacing="0" cellpadding="0" border="0" style="font-size: 13px; color: #333;">
        <tr>
          <td style="padding-bottom: 3px;"><strong style="color: #0b3d91;">m:</strong></td>
          <td style="padding-left: 8px; padding-bottom: 3px;">+234 810 181 5572</td>
        </tr>
        <tr>
          <td style="padding-bottom: 3px;"><strong style="color: #0b3d91;">w:</strong></td>
          <td style="padding-left: 8px; padding-bottom: 3px;">+234 705 615 3486</td>
        </tr>
      </table>
      <div style="height: 10px;"></div>
      <table cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td style="padding-right: 5px;">
            <a href="https://instagram.com/visionfly" style="text-decoration: none;">
              <img src="https://www.visionfly.com.ng/email-icons/instagram.png" alt="IG" width="24" style="border:0; display:block;">
            </a>
          </td>
          <td style="padding-right: 5px;">
            <a href="https://linkedin.com/company/visionfly" style="text-decoration: none;">
              <img src="https://www.visionfly.com.ng/email-icons/linkedin.png" alt="LI" width="24" style="border:0; display:block;">
            </a>
          </td>
          <td style="padding-right: 15px;">
            <a href="https://wa.me/2348101815572" style="text-decoration: none;">
              <img src="https://www.visionfly.com.ng/email-icons/whatsapp.png" alt="WA" width="24" style="border:0; display:block;">
            </a>
          </td>
          <td valign="middle">
            <a href="https://www.visionfly.com.ng" style="color: #0b3d91; text-decoration: none; font-weight: bold; font-size: 13px;">
              visionfly.com.ng
            </a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td colspan="2" style="padding-top: 20px;">
      <a href="https://www.visionfly.com.ng">
        <img src="https://www.visionfly.com.ng/email-icons/footeremail.png" alt="Book Your Flight" width="100%" style="display: block; border: 0; max-width: 500px; border-radius: 4px;">
      </a>
    </td>
  </tr>
</table>
`;

const USER_CONFIRMATION_BODY_TEXT = `Hello,

Thank you for choosing Vision Fly. We have successfully received your request.

Our flight operations team is currently scanning our network to secure the most competitive rate for your journey. We are dedicated to providing you with premium air travel at the best possible value, so please allow us a brief moment to finalize the most affordable options for your specific route.

We will be in touch shortly.

Safe travels,
The Vision Fly Team`;

export async function POST(request: Request) {
  console.log("DEBUG: Checking Env Vars for Empty Leg Route");
  console.log("EMAIL_HOST:", process.env.EMAIL_HOST ? `Set (${process.env.EMAIL_HOST})` : "Missing");
  console.log("EMAIL_USER:", process.env.EMAIL_USER ? `Set (length: ${process.env.EMAIL_USER.length})` : "Missing");
  console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? `Set (length: ${process.env.EMAIL_PASS.length})` : "Missing");

  try {
    const { 
      fullName,
      emailAddress,
      phoneNumber,
      numberOfPassengers,
      flightDetails
    } = await request.json();

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const adminMailOptions = {
      from: `"Vision Fly System" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || "visionfly.ng@gmail.com",
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
        <div style="font-family: Arial, sans-serif;">
          <h2 style="color: #0b3d91;">Empty Leg Flight Inquiry</h2>
          
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
        </div>
      `,
    };

    await transporter.sendMail(adminMailOptions);

    if (emailAddress && emailAddress.includes('@')) {
      try {
        const userMailOptions = {
          from: `"Vision Fly Support" <${process.env.EMAIL_USER}>`,
          to: emailAddress,
          subject: USER_CONFIRMATION_SUBJECT,
          text: USER_CONFIRMATION_BODY_TEXT,
          html: `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
              ${USER_CONFIRMATION_BODY_TEXT.replace(/\n/g, '<br>')}
              ${SIGNATURE_HTML}
            </div>
          `,
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
