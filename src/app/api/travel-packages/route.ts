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
            customerPhone,
            numberOfTravellers,
            packageName,
            destination,
            duration,
            price,
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
            <h1>New Travel Package Inquiry</h1>
        </div>
        <div class="content">
            <div class="highlight">
                <h2>Package: ${packageName}</h2>
                <p><span class="label">Destination:</span> ${destination}</p>
                <p><span class="label">Duration:</span> ${duration}</p>
                <p><span class="label">Price:</span> ${price}</p>
            </div>
            
            <h3 style="color: #065777;">Customer Details</h3>
            <p><span class="label">Name:</span> ${customerName}</p>
            <p><span class="label">Email:</span> ${customerEmail}</p>
            <p><span class="label">Phone:</span> ${customerPhone || "Not provided"}</p>
            <p><span class="label">Number of Travellers:</span> ${numberOfTravellers || "1"}</p>
            
            <p style="margin-top: 20px; padding: 15px; background: #fff3cd; border-radius: 8px;">
                <strong>Action Required:</strong> Please contact this customer within 2 hours to discuss their travel package inquiry.
            </p>
        </div>
        <div class="footer">
            <p>Vision Fly Travel - Making Dreams Take Flight</p>
        </div>
    </div>
</body>
</html>
        `;

        const customerEmailText = `Dear ${customerName},

Thank you for choosing Vision Fly!

We have received your interest in the ${packageName} package. Excellent choice!

Package Details:
- Package: ${packageName}
- Duration: ${duration}
- Price: ${price}
- Number of Travellers: ${numberOfTravellers || "1"}

Our travel architects are currently:
- Verifying real-time flight availability for your preferred dates
- Confirming the exclusive hotel rates included in this offer
- Checking for any seasonal bonuses we can add to your trip

What happens next?
One of our specialists will reach out to you via WhatsApp or Phone within the next 2 hours (during business hours) to finalize the details and answer any questions you might have.

No payment is required until we have confirmed your specific itinerary.

If you have urgent questions, feel free to reply to this email or call our priority line at:
+234 810 181 5572 or +1 778 522 4683

Stop dreaming, start packing!

Warm regards,
The VisionFly Team`;

        const customerEmailHtml = `
<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.8; max-width: 600px; margin: 0 auto;">
    <div style="background: #065777; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">We've received your inquiry for ${destination}!</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Hang tight, we are checking availability for you.</p>
    </div>
    
    <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e5e5;">
        <p>Dear <strong>${customerName}</strong>,</p>
        
        <p>Thank you for choosing <strong>VisionFly</strong>.</p>
        
        <p>We have received your interest in the <strong>${packageName}</strong> package. Excellent choice!</p>
        
        <div style="background: linear-gradient(135deg, #065777 0%, #06b6d4 100%); color: white; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center;">
            <h2 style="margin: 0 0 10px 0; font-size: 28px;">${packageName}</h2>
            <p style="margin: 5px 0;">${duration}</p>
            <p style="margin: 5px 0;">Travellers: ${numberOfTravellers || "1"}</p>
            <p style="font-size: 24px; font-weight: bold; margin: 10px 0 0 0;">${price}</p>
        </div>
        
        <p>Because we prioritize accuracy and the best possible rates, our travel architects are currently:</p>
        
        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <ul style="margin: 0; padding-left: 20px;">
                <li style="margin: 10px 0; color: #166534;">Verifying real-time flight availability for your preferred dates.</li>
                <li style="margin: 10px 0; color: #166534;">Confirming the exclusive hotel rates included in this offer.</li>
                <li style="margin: 10px 0; color: #166534;">Checking for any seasonal bonuses we can add to your trip.</li>
            </ul>
        </div>
        
        <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #065777;">
            <h3 style="margin-top: 0; color: #065777;">What happens next?</h3>
            <p>One of our specialists will reach out to you via <strong>WhatsApp or Phone</strong> within the next <strong>2 hours</strong> (during business hours) to finalize the details and answer any questions you might have.</p>
            <p style="margin-bottom: 0;"><strong>No payment is required</strong> until we have confirmed your specific itinerary.</p>
        </div>
        
        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <p style="margin: 0;"><strong>In the meantime:</strong></p>
            <p style="margin: 10px 0 0 0;">If you have urgent questions, feel free to reply to this email or call our priority line at:</p>
            <p style="margin: 10px 0 0 0; font-size: 16px;">
                <strong>+234 810 181 5572</strong> or <strong>+1 778 522 4683</strong>
            </p>
        </div>
        
        <p style="font-size: 20px; text-align: center; margin: 30px 0; color: #065777; font-weight: bold;">
            Stop dreaming, start packing!
        </p>
        
        ${SIGNATURE_HTML}
    </div>
    
    <div style="text-align: center; padding: 20px; color: #666; font-size: 12px; border-top: 1px solid #e5e5e5;">
        <p>&copy; ${new Date().getFullYear()} Vision Fly Travel. All rights reserved.</p>
        <p>Making Dreams Take Flight</p>
    </div>
</div>
        `;

        await transporter.sendMail({
            from: `"Vision Fly Travel" <${process.env.EMAIL_USER}>`,
            to: process.env.ADMIN_EMAIL || "info@visionfly.com.ng",
            replyTo: customerEmail,
            subject: `New Travel Package Inquiry: ${packageName}`,
            html: adminEmailHtml,
        });

        try {
            await transporter.sendMail({
                from: `"Vision Fly Travel" <${process.env.EMAIL_USER}>`,
                to: customerEmail,
                subject: `We've received your inquiry for ${destination}!`,
                text: customerEmailText,
                html: customerEmailHtml,
            });
        } catch (customerEmailError) {
            console.error("Failed to send customer confirmation email:", customerEmailError);
        }

        return NextResponse.json({ success: true, message: "Inquiry submitted successfully" });
    } catch (error) {
        console.error("Travel package inquiry error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to process inquiry" },
            { status: 500 }
        );
    }
}
