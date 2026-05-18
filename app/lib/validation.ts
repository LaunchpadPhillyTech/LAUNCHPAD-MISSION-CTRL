// lib/validation.ts - Zod validation schemas
import { z } from 'zod';

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional().default(false),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Confirm password required'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

// Partner Schemas
export const partnerSchema = z.object({
  organizationName: z.string().min(1, 'Organization name is required'),
  websiteUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  schoolType: z.string().optional(),
  officialStatusDate: z.string().optional(),
  courseNumber: z.number().optional(),
  makeVirtualHours: z.number().optional(),
  totalPaidContentSees: z.number().optional(),
  partnerType: z.string().optional(),
  partnerStatus: z.enum(['ACTIVE', 'PENDING', 'INACTIVE']).optional(),
  currentStatusNotes: z.string().optional(),
  earlyReleaseForSeniors: z.boolean().optional().default(false),
  originalJobNoticeDetails: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type PartnerFormData = z.infer<typeof partnerSchema>;

// Contact Schemas
export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  title: z.string().optional(),
  contactType: z.enum(['LEADERSHIP', 'PRIMARY', 'SECONDARY']),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// Interaction Schemas
export const interactionSchema = z.object({
  partnerId: z.string().min(1, 'Partner is required'),
  interactionType: z.enum(['INFOSESSION', 'TABLING', 'MEETING', 'OUTREACH', 'INTERVIEWS', 'STUDENT_APPLICATION']),
  date: z.string().min(1, 'Date is required'),
  studentCount: z.number().min(0, 'Student count must be 0 or more').optional().default(0),
  sharedNotes: z.string().optional(),
  needsFollowup: z.boolean().optional().default(false),
  followupDueDate: z.string().optional(),
});

export type InteractionFormData = z.infer<typeof interactionSchema>;

// Student Schemas
export const studentSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  partnerId: z.string().optional(),
  status: z.enum(['ACTIVE_MEMBER', 'APPLICANT', 'ALUMNI', 'PENDING']).optional().default('PENDING'),
  cohort: z.string().optional(),
  earlyReleaseEligible: z.boolean().optional().default(false),
  notes: z.string().optional(),
});

export type StudentFormData = z.infer<typeof studentSchema>;

// Email Schemas
export const emailSchema = z.object({
  to: z.string().email('Invalid recipient email'),
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(1, 'Message body is required'),
  tone: z.enum(['professional', 'casual', 'formal']).optional().default('professional'),
});

export type EmailFormData = z.infer<typeof emailSchema>;

// AI Email Generation Schema
export const aiEmailSchema = z.object({
  partnerId: z.string().min(1, 'Partner is required'),
  aiPrompt: z.string().min(10, 'Prompt must be at least 10 characters'),
  tone: z.enum(['professional', 'casual', 'formal']).optional().default('professional'),
});

export type AIEmailFormData = z.infer<typeof aiEmailSchema>;

// Staff Schemas
export const staffSchema = z.object({
  email: z.string().email('Invalid email address'),
  fullName: z.string().min(1, 'Full name is required'),
  title: z.string().optional(),
  role: z.enum(['ADMINISTRATOR', 'PROGRAM_COORDINATOR', 'PARTNERSHIP_MANAGER', 'STAFF_USER']).optional().default('STAFF_USER'),
  accessLevel: z.string().optional(),
});

export type StaffFormData = z.infer<typeof staffSchema>;
