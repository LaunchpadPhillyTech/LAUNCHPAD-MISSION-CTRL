'use server';

import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api';

export async function sendEmailAction({ to, subject, text }: { to: string; subject: string; text: string }) {
  // Initialize OAuth2 client inside the server action for security
  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  oAuth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

  let accessToken;
  try {
    accessToken = await oAuth2Client.getAccessToken();
    if (!accessToken || !accessToken.token) {
      throw new Error('No access token');
    }
  } catch (err) {
    throw new Error('Authentication with Google failed. Please check your connection.');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.EMAIL_SENDER,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      accessToken: accessToken.token,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_SENDER,
      to,
      subject,
      text,
    });
  } catch (err) {
    throw new Error('Failed to send email. Please try again later.');
  }
}

export async function generateAIEmailAction({ userPrompt, partnerId, tone }: { userPrompt: string; partnerId: string; tone: string }) {
  try {
    // Fetch partner data
    const res = await fetch(`${API_BASE}/partners`);
    if (!res.ok) {
      throw new Error('Failed to fetch partners');
    }
    const partners = await res.json();
    const partner = partners.find((p: any) => p.id === partnerId);
    if (!partner) {
      throw new Error('Partner not found');
    }

    const prompt = `Write a professional email to ${partner.organizationName} about: ${userPrompt}. Use a ${tone} tone. Include a subject line and the email body. Format as: Subject: [subject]\n\n[body]`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
    });

    const emailContent = completion.choices[0]?.message?.content?.trim();
    if (!emailContent) {
      throw new Error('No response from AI');
    }

    return { email: emailContent };
  } catch (error) {
    console.error('AI generation error:', error);
    throw new Error('Failed to generate AI email');
  }
}
