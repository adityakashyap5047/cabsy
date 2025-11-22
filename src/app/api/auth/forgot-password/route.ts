import { NextResponse } from 'next/server';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json(
        { message: 'If an account exists with this email, you will receive a password reset link.' },
        { status: 200 }
      );
    }

    // Check if user is a guest (no password set)
    if (!user.password) {
      return NextResponse.json(
        { message: 'This account was created as a guest. Please sign up with a password to enable password reset.' },
        { status: 400 }
      );
    }

    // Check if there's already a valid reset token
    if (user.resetToken && user.resetTokenExpiry) {
      const now = new Date();
      if (user.resetTokenExpiry > now) {
        // Token is still valid, don't send a new email
        return NextResponse.json(
          { message: 'A password reset link has already been sent to your email. Please check your inbox or wait for the link to expire before requesting a new one.' },
          { status: 200 }
        );
      }
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Save token to database
    await prisma.user.update({
      where: { email },
      data: {
        resetToken: hashedToken,
        resetTokenExpiry
      }
    });

    // Create reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    // Configure email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    // Send email
    await transporter.sendMail({
      from: `"Cabsy" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request - Cabsy',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <tr>
                    <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); border-radius: 8px 8px 0 0;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Password Reset</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 40px 30px;">
                      <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                        Hello ${user.firstName},
                      </p>
                      <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                        We received a request to reset your password for your Cabsy account. Click the button below to reset your password:
                      </p>
                      <table role="presentation" style="margin: 30px auto; border-collapse: collapse;">
                        <tr>
                          <td align="center" style="border-radius: 4px; background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);">
                            <a href="${resetUrl}" target="_blank" style="display: inline-block; padding: 14px 40px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 4px;">
                              Reset Password
                            </a>
                          </td>
                        </tr>
                      </table>
                      <p style="margin: 20px 0; color: #666666; font-size: 14px; line-height: 1.6;">
                        Or copy and paste this link into your browser:
                      </p>
                      <p style="margin: 0 0 20px; color: #f59e0b; font-size: 14px; line-height: 1.6; word-break: break-all;">
                        ${resetUrl}
                      </p>
                      <p style="margin: 20px 0; color: #666666; font-size: 14px; line-height: 1.6;">
                        This link will expire in 1 hour for security reasons.
                      </p>
                      <p style="margin: 20px 0; color: #666666; font-size: 14px; line-height: 1.6;">
                        If you didn't request a password reset, please ignore this email or contact support if you have concerns.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 30px; text-align: center; background-color: #f9f9f9; border-radius: 0 0 8px 8px; border-top: 1px solid #eeeeee;">
                      <p style="margin: 0; color: #999999; font-size: 12px; line-height: 1.6;">
                        This is an automated email. Please do not reply to this message.
                      </p>
                      <p style="margin: 10px 0 0; color: #999999; font-size: 12px; line-height: 1.6;">
                        © ${new Date().getFullYear()} Cabsy. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    });

    return NextResponse.json(
      { message: 'If an account exists with this email, you will receive a password reset link.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { message: 'An error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
