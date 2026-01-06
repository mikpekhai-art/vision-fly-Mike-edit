import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

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

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            customerName,
            customerEmail,
            destination,
            travelers,
            budget,
            whatsapp,
        } = body;

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const adminEmailHtml = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #065777; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
        .highlight { background: #e8f4f8; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #06b6d4; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        h2 { color: #065777; margin-top: 0; }
        .label { font-weight: bold; color: #065777; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>New Custom Trip Request</h1>
        </div>
        <div class="content">
            <div class="highlight">
                <h2>Trip Preferences</h2>
                <p><span class="label">Destination:</span> ${destination || "Not specified"}</p>
                <p><span class="label">Number of Travelers:</span> ${travelers || "Not specified"}</p>
                <p><span class="label">Budget Range:</span> ₦${budget || "Not specified"}</p>
            </div>
            
            <h3 style="color: #065777;">Customer Details</h3>
            <p><span class="label">Name:</span> ${customerName}</p>
            <p><span class="label">Email:</span> ${customerEmail}</p>
            <p><span class="label">WhatsApp:</span> ${whatsapp || "Not provided"}</p>
            
            <p style="margin-top: 20px; padding: 15px; background: #fff3cd; border-radius: 8px;">
                <strong>Action Required:</strong> Please contact this customer within 2 hours to discuss their custom travel plans.
            </p>
        </div>
        <div class="footer">
            <p>This is an automated notification from VisionFly Travel</p>
        </div>
    </div>
</body>
</html>
        `;

        await transporter.sendMail({
            from: `"Vision Fly Travel" <${process.env.EMAIL_USER}>`,
            to: process.env.ADMIN_EMAIL || "info@visionfly.com.ng",
            replyTo: customerEmail,
            subject: `New Custom Trip Request from ${customerName}`,
            html: adminEmailHtml,
        });

        const customerEmailHtml = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #065777; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #ddd; }
        .highlight { background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #06b6d4; }
        h1 { margin: 0; font-size: 24px; }
        h2 { color: #065777; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>We've Received Your Request!</h1>
        </div>
        <div class="content">
            <p>Dear ${customerName},</p>
            
            <p>Thank you for reaching out to Vision Fly! We're excited to help you plan your dream trip.</p>
            
            <div class="highlight">
                <h3 style="margin-top: 0; color: #065777;">Your Request Details</h3>
                <p><strong>Destination:</strong> ${destination || "To be discussed"}</p>
                <p><strong>Number of Travelers:</strong> ${travelers || "To be confirmed"}</p>
                <p><strong>Budget Range:</strong> ₦${budget || "Flexible"}</p>
            </div>
            
            <p>Our travel architects are reviewing your request and will be in touch within <strong>2 hours</strong> to discuss your custom itinerary.</p>
            
            <p>In the meantime, feel free to browse our <a href="https://www.visionfly.com.ng/travel-packages" style="color: #065777;">curated travel packages</a> for inspiration.</p>
            
            <p>If you have any immediate questions, don't hesitate to reach us on WhatsApp at <strong>+234 810 181 5572</strong>.</p>
            
            <p style="margin-top: 30px;">We look forward to creating an unforgettable experience for you!</p>
            
            <p>Warm regards,<br><strong>The Vision Fly Team</strong></p>
            
            ${SIGNATURE_HTML}
        </div>
    </div>
</body>
</html>
        `;

        await transporter.sendMail({
            from: `"Vision Fly Travel" <${process.env.EMAIL_USER}>`,
            to: customerEmail,
            subject: "We've Received Your Custom Trip Request - Vision Fly",
            html: customerEmailHtml,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error processing custom trip request:", error);
        return NextResponse.json(
            { error: "Failed to process request" },
            { status: 500 }
        );
    }
}
