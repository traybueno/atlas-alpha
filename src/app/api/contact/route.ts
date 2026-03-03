import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = 'force-dynamic';

const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "splitsubjects@gmail.com";

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { name, email, message, useCase } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    await resend.emails.send({
      from: "Epstein Atlas Contact <hello@corners.world>",
      to: CONTACT_EMAIL,
      replyTo: email,
      subject: `New interest form: ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #111; border-bottom: 1px solid #eee; padding-bottom: 12px;">
            New contact from Epstein Atlas
          </h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666; width: 100px;"><strong>Name</strong></td>
              <td style="padding: 8px 0; color: #111;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Email</strong></td>
              <td style="padding: 8px 0; color: #111;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            ${useCase ? `
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Use case</strong></td>
              <td style="padding: 8px 0; color: #111;">${useCase}</td>
            </tr>` : ""}
          </table>
          <div style="margin-top: 16px; padding: 16px; background: #f9f9f9; border-radius: 8px;">
            <strong style="color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Message</strong>
            <p style="color: #111; margin: 8px 0 0; white-space: pre-wrap;">${message}</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
