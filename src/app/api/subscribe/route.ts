import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const USER_CONFIRMATION_SUBJECT = "Welcome to Vision Fly Updates";

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

Thank you for subscribing to the Vision Fly mailing list!

You will now receive exclusive updates on:
- Empty leg flight opportunities at highly preferred rates
- Special offers and promotions
- New routes and destinations

We're committed to bringing you the best in private aviation.

Safe travels,
The Vision Fly Team`;

export async function POST(request: Request) {
  console.log("DEBUG: Checking Env Vars for Subscribe Route");
  console.log("EMAIL_HOST:", process.env.EMAIL_HOST ? `Set (${process.env.EMAIL_HOST})` : "Missing");
  console.log("EMAIL_USER:", process.env.EMAIL_USER ? `Set (length: ${process.env.EMAIL_USER.length})` : "Missing");
  console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? `Set (length: ${process.env.EMAIL_PASS.length})` : "Missing");

  try {
    const { fullName, email } = await request.json();

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
      replyTo: email,
      subject: `[Vision Fly] New Mailing List Subscription`,
      text: `
NEW MAILING LIST SUBSCRIPTION

Subscriber Information:
- Name: ${fullName}
- Email: ${email}
      `,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2 style="color: #0b3d91;">New Mailing List Subscription</h2>
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${email}</p>
        </div>
      `,
    };

    await transporter.sendMail(adminMailOptions);

    if (email && email.includes('@')) {
      try {
        const userMailOptions = {
          from: `"Vision Fly Support" <${process.env.EMAIL_USER}>`,
          to: email,
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
        console.error('Failed to send subscription confirmation email:', userEmailError);
      }
    }

    return NextResponse.json({ success: true, message: 'Successfully subscribed!' }, { status: 200 });

  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json({ success: false, message: 'Failed to process subscription' }, { status: 500 });
  }
}
