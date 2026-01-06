import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            customerName,
            customerEmail,
            customerPhone,
            packageName,
            destination,
            duration,
            price,
        } = body;

        const transporter = nodemailer.createTransport({
            host: "smtp.zoho.com",
            port: 465,
            secure: true,
            auth: {
                user: "info@visionfly.com.ng",
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
            <h1>✈️ New Travel Package Inquiry</h1>
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
            
            <p style="margin-top: 20px; padding: 15px; background: #fff3cd; border-radius: 8px;">
                <strong>⏰ Action Required:</strong> Please contact this customer within 2 hours to discuss their travel package inquiry.
            </p>
        </div>
        <div class="footer">
            <p>Vision Fly Travel - Making Dreams Take Flight</p>
        </div>
    </div>
</body>
</html>
        `;

        const customerEmailHtml = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.8; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #065777; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e5e5e5; }
        .package-box { background: linear-gradient(135deg, #065777 0%, #06b6d4 100%); color: white; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center; }
        .package-box h2 { margin: 0 0 10px 0; font-size: 28px; }
        .checklist { background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .checklist ul { margin: 0; padding-left: 20px; }
        .checklist li { margin: 10px 0; color: #166534; }
        .next-steps { background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #065777; }
        .contact-box { background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; border-top: 1px solid #e5e5e5; }
        .cta { color: #06b6d4; font-weight: bold; }
        .signature { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e5; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✈️ We've received your inquiry for ${destination}!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Hang tight, we are checking availability for you.</p>
        </div>
        <div class="content">
            <p>Dear <strong>${customerName}</strong>,</p>
            
            <p>Thank you for choosing <strong>VisionFly</strong>.</p>
            
            <p>We have received your interest in the <strong>${packageName}</strong> package. Excellent choice!</p>
            
            <div class="package-box">
                <h2>${packageName}</h2>
                <p style="margin: 5px 0;">${duration}</p>
                <p style="font-size: 24px; font-weight: bold; margin: 10px 0 0 0;">${price}</p>
            </div>
            
            <p>Because we prioritize accuracy and the best possible rates, our travel architects are currently:</p>
            
            <div class="checklist">
                <ul>
                    <li>✅ Verifying real-time flight availability for your preferred dates.</li>
                    <li>✅ Confirming the exclusive hotel rates included in this offer.</li>
                    <li>✅ Checking for any seasonal bonuses we can add to your trip.</li>
                </ul>
            </div>
            
            <div class="next-steps">
                <h3 style="margin-top: 0; color: #065777;">What happens next?</h3>
                <p>One of our specialists will reach out to you via <strong>WhatsApp or Phone</strong> within the next <strong>2 hours</strong> (during business hours) to finalize the details and answer any questions you might have.</p>
                <p style="margin-bottom: 0;"><strong>No payment is required</strong> until we have confirmed your specific itinerary.</p>
            </div>
            
            <div class="contact-box">
                <p style="margin: 0;"><strong>In the meantime:</strong></p>
                <p style="margin: 10px 0 0 0;">If you have urgent questions, feel free to reply to this email or call our priority line at:</p>
                <p style="margin: 10px 0 0 0; font-size: 16px;">
                    <strong>📞 +234 810 181 5572</strong> or <strong>+1 778 522 4683</strong>
                </p>
            </div>
            
            <p style="font-size: 20px; text-align: center; margin: 30px 0; color: #065777; font-weight: bold;">
                Stop dreaming, start packing. ✨
            </p>
            
            <div class="signature">
                <p style="margin: 0;">Warm regards,</p>
                <p style="margin: 5px 0; font-weight: bold; color: #065777;">The VisionFly Team</p>
                <p style="margin: 5px 0; font-size: 12px; color: #666;">
                    Vision Fly Travel<br>
                    📧 info@visionfly.com.ng<br>
                    📞 +234 810 181 5572 | +1 778 522 4683<br>
                    🌐 www.visionfly.com.ng
                </p>
            </div>
        </div>
        <div class="footer">
            <p>© ${new Date().getFullYear()} Vision Fly Travel. All rights reserved.</p>
            <p>Making Dreams Take Flight</p>
        </div>
    </div>
</body>
</html>
        `;

        await transporter.sendMail({
            from: '"Vision Fly Travel" <info@visionfly.com.ng>',
            to: "info@visionfly.com.ng",
            subject: `✈️ New Travel Package Inquiry: ${packageName}`,
            html: adminEmailHtml,
        });

        try {
            await transporter.sendMail({
                from: '"Vision Fly Travel" <info@visionfly.com.ng>',
                to: customerEmail,
                subject: `✈️ We've received your inquiry for ${destination}!`,
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
