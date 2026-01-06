import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const USER_CONFIRMATION_SUBJECT = "We received your request - Vision Fly";

const SIGNATURE_HTML = `
<br><br>
<table cellspacing="0" cellpadding="0" border="0" style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.4; color: #333; max-width: 500px;">
  <tr>
    <td valign="top" style="padding-right: 20px; width: 120px;">
      <a href="https://www.visionfly.com.ng" style="text-decoration: none;">
        <img src="https://www.visionfly.com.ng/email-icons/visionfly%20logo.PNG" alt="Vision Fly" width="110" style="display: block; border: 0;">
      </a>
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
            <a href="https://www.instagram.com/vision_fly.ng" style="text-decoration: none;">
              <img src="https://www.visionfly.com.ng/email-icons/instagram.png" alt="IG" width="24" style="border:0; display:block;">
            </a>
          </td>
          <td style="padding-right: 5px;">
            <a href="https://ng.linkedin.com/in/adebusoye-adejumo-b8b07763" style="text-decoration: none;">
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
  console.log("DEBUG: Checking Env Vars for Booking Route");
  console.log("EMAIL_HOST:", process.env.EMAIL_HOST ? `Set (${process.env.EMAIL_HOST})` : "Missing");
  console.log("EMAIL_USER:", process.env.EMAIL_USER ? `Set (length: ${process.env.EMAIL_USER.length})` : "Missing");
  console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? `Set (length: ${process.env.EMAIL_PASS.length})` : "Missing");

  try {
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
      selectedFlightNumber,
      selectedFlightPrice
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
      to: process.env.ADMIN_EMAIL || "info@visionfly.com.ng",
      replyTo: contactEmail,
      subject: selectedFlightNumber 
        ? `[Vision Fly Booking] Flight ${selectedFlightNumber} - ${contactName}` 
        : `[Vision Fly Booking] New Inquiry from ${contactName}`,
      text: `
FLIGHT BOOKING INQUIRY
${selectedFlightNumber ? `\n*** SELECTED FLIGHT: ${selectedFlightNumber} ***` : ''}
${selectedFlightPrice ? `*** QUOTED PRICE: ${selectedFlightPrice} ***\n` : ''}

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
${selectedFlightNumber ? `- Selected Flight Number: ${selectedFlightNumber}` : '- No specific flight selected (Custom Quote Request)'}
${selectedFlightPrice ? `- Quoted Price: ${selectedFlightPrice}` : ''}

Passenger Manifest:
${passengerList || 'Not provided'}
      `,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2 style="color: #0b3d91;">Flight Booking Inquiry</h2>
          
          ${selectedFlightNumber ? `
          <div style="background: #e6f3ff; border-left: 4px solid #0b3d91; padding: 15px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 10px 0; color: #0b3d91;">Selected Flight: ${selectedFlightNumber}</h3>
            ${selectedFlightPrice ? `<p style="margin: 0; font-size: 18px; font-weight: bold;">Quoted Price: ${selectedFlightPrice}</p>` : ''}
          </div>
          ` : `
          <div style="background: #fff3e6; border-left: 4px solid #ff9800; padding: 15px; margin-bottom: 20px;">
            <p style="margin: 0; color: #e65100;"><strong>Custom Quote Request</strong> - No specific flight selected</p>
          </div>
          `}
          
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
        </div>
      `,
    };

    await transporter.sendMail(adminMailOptions);

    if (contactEmail && contactEmail.includes('@')) {
      try {
        const userMailOptions = {
          from: `"Vision Fly Support" <${process.env.EMAIL_USER}>`,
          to: contactEmail,
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

    return NextResponse.json({ success: true, message: 'Booking inquiry submitted!' }, { status: 200 });

  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json({ success: false, message: 'Failed to send booking inquiry' }, { status: 500 });
  }
}
