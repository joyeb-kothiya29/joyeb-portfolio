import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';

async function sendTelegramNotification(data: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn('Telegram not configured - skipping notification.');
    return;
  }

  const phone = data.phone ? `📱 <b>Phone:</b> ${data.phone}\n` : '';

  const text =
    `📬 <b>New Portfolio Message</b>\n\n` +
    `👤 <b>Name:</b> ${data.name}\n` +
    `📧 <b>Email:</b> ${data.email}\n` +
    `${phone}` +
    `💬 <b>Message:</b>\n${data.message}\n\n` +
    `⏰ ${new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short',
    })}`;

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
    }),
  });
}

type RateLimitEntry = {
  count: number;
  resetTime: number;
};

const resend = new Resend(process.env.RESEND_API_KEY);
const rateLimitStore = new Map<string, RateLimitEntry>();

const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const CONTACT_RECIPIENT = 'joyebkofficial@gmail.com';

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required.').max(100),
  email: z.string().trim().email('A valid email is required.'),
  phone: z.string().trim().min(10).max(20).optional().or(z.literal('')),
  message: z.string().trim().min(1, 'Message is required.').max(1000),
});

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  return 'unknown';
}

function checkRateLimit(clientIP: string): {
  allowed: boolean;
  remaining: number;
} {
  const now = Date.now();
  const clientData = rateLimitStore.get(clientIP);

  if (!clientData || now > clientData.resetTime) {
    rateLimitStore.set(clientIP, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });

    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1 };
  }

  if (clientData.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }

  clientData.count += 1;
  rateLimitStore.set(clientIP, clientData);

  return {
    allowed: true,
    remaining: RATE_LIMIT_MAX_REQUESTS - clientData.count,
  };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildEmailHtml(data: z.infer<typeof contactSchema>): string {
  const safeName = escapeHtml(data.name);
  const safeEmail = escapeHtml(data.email);
  const safePhone = data.phone ? escapeHtml(data.phone) : '';
  const safeMessage = escapeHtml(data.message).replace(/\n/g, '<br/>');

  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#0a0a0a;color:#ffffff;border-radius:12px;">
      <h2 style="margin-bottom:8px;font-size:20px;">New Contact Form Message</h2>
      <p style="color:#888;font-size:13px;margin-bottom:24px;">
        Sent from your portfolio contact form
      </p>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #222;color:#888;font-size:13px;width:80px;">
            Name
          </td>
          <td style="padding:12px 0;border-bottom:1px solid #222;font-size:14px;">
            ${safeName}
          </td>
        </tr>
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #222;color:#888;font-size:13px;">
            Email
          </td>
          <td style="padding:12px 0;border-bottom:1px solid #222;font-size:14px;">
            <a href="mailto:${safeEmail}" style="color:#4ade80;text-decoration:none;">
              ${safeEmail}
            </a>
          </td>
        </tr>
        ${
          safePhone
            ? `<tr>
          <td style="padding:12px 0;border-bottom:1px solid #222;color:#888;font-size:13px;">
            Phone
          </td>
          <td style="padding:12px 0;border-bottom:1px solid #222;font-size:14px;">
            ${safePhone}
          </td>
        </tr>`
            : ''
        }
        <tr>
          <td style="padding:12px 0;color:#888;font-size:13px;vertical-align:top;">
            Message
          </td>
          <td style="padding:12px 0;font-size:14px;line-height:1.6;">
            ${safeMessage}
          </td>
        </tr>
      </table>
      <p style="margin-top:24px;font-size:12px;color:#555;">
        Reply directly to this email to respond to ${safeName}.
      </p>
    </div>
  `;
}

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);
    const rateLimit = checkRateLimit(clientIP);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
          retryAfter: RATE_LIMIT_WINDOW / 1000,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': (Date.now() + RATE_LIMIT_WINDOW).toString(),
          },
        },
      );
    }

    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured');
      return NextResponse.json(
        { error: 'Email service is not configured. Please try again later.' },
        { status: 500 },
      );
    }

    const body: unknown = await request.json();
    const validatedData = contactSchema.parse(body);

    const { error } = await resend.emails.send({
      from: 'Joyeb Portfolio <onboarding@resend.dev>',
      to: CONTACT_RECIPIENT,
      replyTo: validatedData.email,
      subject: `📬 New message from ${validatedData.name} — joyeb.me`,
      html: buildEmailHtml(validatedData),
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email. Please try again.' },
        { status: 500 },
      );
    }

    // Send Telegram notification (non-blocking)
    sendTelegramNotification(validatedData).catch((err) =>
      console.warn('Telegram notification failed:', err),
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Email sent successfully!',
      },
      {
        status: 200,
        headers: {
          'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        },
      },
    );
  } catch (error) {
    console.error('Contact API error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
