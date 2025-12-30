import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const USER_CONFIRMATION_SUBJECT = "We received your request - Vision Fly";

// 1. The HTML Signature Design
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

// 2. The Text Message
const USER_CONFIRMATION_BODY_TEXT = `Hello,

Thank you for choosing Vision Fly. We have successfully received your request.

Our flight operations team is currently scanning our network to secure the most competitive rate for your journey. We are dedicated to providing you with premium air travel at the best possible value, so please allow us a brief moment to finalize the most affordable options for your specific route.

We will be in touch shortly.

Safe travels,
The Vision Fly Team`;

export async function POST(request: Request) {
  console.log("DEBUG: Checking Env Vars for Contact Route");
  console.log("EMAIL_HOST:", process.env.EMAIL_HOST ? `Set (${process.env.EMAIL_HOST})` : "Missing");
  console.log("EMAIL_USER:", process.env.EMAIL_USER ? `Set (length: ${process.env.EMAIL_USER.length})` : "Missing");
  console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? `Set (length: ${process.env.EMAIL_PASS.length})` : "Missing");

  try {
    const { name, email, subject, message } = await request.json();

    // 3. Updated Transporter for cPanel (mail.visionfly.com.ng)
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST, // mail.visionfly.com.ng
      port: 465,
      secure: true, // true for port 465
      auth: {
        user: process.env.EMAIL_USER, // info@visionfly.com.ng
        pass: process.env.EMAIL_PASS, // cPanel password
      },
    });

    // 4. Admin Email (Sent TO you, FROM info@)
    const adminMailOptions = {
      from: `"Vision Fly System" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || "visionfly.ng@gmail.com", // Your personal Gmail
      replyTo: email, // Hitting reply goes to the customer
      subject: subject ? `[Vision Fly Contact] ${subject}` : `New Contact Form Submission from ${name}`,
      text: `
Name: ${name}
Email: ${email}
Subject: ${subject || 'N/A'}

Message:
${message}
      `,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2 style="color: #0b3d91;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
          <hr />
          <p><strong>Message:</strong></p>
          <p style="background-color: #f4f4f4; padding: 15px; border-radius: 5px;">${message.replace(/\n/g, '<br>')}</p>
        </div>
      `,
    };

    // Send Admin Email
    await transporter.sendMail(adminMailOptions);

    // 5. User Email (Sent TO user, FROM info@, with Signature)
    if (email && email.includes('@')) {
      try {
        const userMailOptions = {
          from: `"Vision Fly Support" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: USER_CONFIRMATION_SUBJECT,
          text: USER_CONFIRMATION_BODY_TEXT, // Plain text fallback
          // Combine the Message + The Signature HTML
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

    return NextResponse.json({ success: true, message: 'Email sent!' }, { status: 200 });

  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json({ success: false, message: 'Failed to send email' }, { status: 500 });
  }
}