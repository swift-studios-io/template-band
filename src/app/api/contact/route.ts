import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { Resend } from "resend";

let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY || "");
  }
  return _resend;
}

const submissions = new Map<string, number[]>();
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 60 * 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const times = submissions.get(ip) || [];
  const recent = times.filter((t) => now - t < RATE_WINDOW_MS);
  submissions.set(ip, recent);
  return recent.length >= RATE_LIMIT;
}

function hasExcessiveLinks(text: string): boolean {
  const urlPattern = /https?:\/\/[^\s]+/gi;
  const matches = text.match(urlPattern);
  return (matches?.length || 0) >= 3;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { firstName, lastName, email, message, turnstileToken, website } = body;

    // Honeypot check
    if (website) {
      return NextResponse.json({ success: true });
    }

    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (hasExcessiveLinks(message)) {
      return NextResponse.json(
        { error: "Message contains too many links." },
        { status: 400 }
      );
    }

    // Verify Turnstile token
    if (process.env.TURNSTILE_SECRET_KEY) {
      const turnstileRes = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            secret: process.env.TURNSTILE_SECRET_KEY,
            response: turnstileToken || "",
            remoteip: ip,
          }),
        }
      );
      const turnstileData = await turnstileRes.json();
      if (!turnstileData.success) {
        return NextResponse.json(
          { error: "Security verification failed. Please refresh and try again." },
          { status: 403 }
        );
      }
    }

    // Record for rate limiting
    const times = submissions.get(ip) || [];
    times.push(Date.now());
    submissions.set(ip, times);

    // Save to Payload CMS
    try {
      const payload = await getPayload({ config });
      await payload.create({
        collection: "form-submissions",
        data: {
          firstName: String(firstName).slice(0, 200),
          lastName: String(lastName).slice(0, 200),
          email: String(email).slice(0, 200),
          message: String(message).slice(0, 5000),
        },
      });
    } catch (payloadErr) {
      console.error("Payload save error:", payloadErr);
    }

    // Send email via Resend
    const recipientEmail = process.env.CONTACT_FORM_RECIPIENT;
    const siteName = process.env.CONTACT_FORM_SITE_NAME || "Website";

    if (recipientEmail) {
      const { error: resendError } = await getResend().emails.send({
        from: `${siteName} Contact Form <onboarding@resend.dev>`,
        to: recipientEmail,
        replyTo: email,
        subject: `New Contact Form Submission from ${escapeHtml(firstName)} ${escapeHtml(lastName)}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333; border-bottom: 2px solid #333; padding-bottom: 10px;">
              New Contact Form Submission
            </h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555; width: 120px;">First Name:</td>
                <td style="padding: 8px 0; color: #333;">${escapeHtml(firstName)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Last Name:</td>
                <td style="padding: 8px 0; color: #333;">${escapeHtml(lastName)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
                <td style="padding: 8px 0; color: #333;">
                  <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>
                </td>
              </tr>
            </table>
            <div style="margin-top: 16px; padding: 16px; background: #f9f9f9; border-left: 3px solid #333;">
              <p style="font-weight: bold; color: #555; margin: 0 0 8px 0;">Message:</p>
              <p style="color: #333; margin: 0; white-space: pre-wrap;">${escapeHtml(message)}</p>
            </div>
            <p style="margin-top: 16px; font-size: 12px; color: #999;">
              Sent from ${escapeHtml(siteName)} contact form
            </p>
          </div>
        `,
      });

      if (resendError) {
        console.error("Resend error:", JSON.stringify(resendError));
        return NextResponse.json(
          { error: `Failed to send message: ${resendError.message || "Unknown error"}. Please try again.` },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
