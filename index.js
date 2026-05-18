const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

const prisma = new PrismaClient();
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret-supersecret-supersecret';

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || 'your-gmail@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD || 'your-app-password'
  }
});

// Auth Endpoints
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, fullName, role = 'STAFF_USER' } = req.body;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });
    
    const passwordHash = await bcrypt.hash(password, 12);
    
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        role
      }
    });
    
    const token = jwt.sign({ 
      id: user.id, 
      email: user.email,
      role: user.role 
    }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        fullName: user.fullName, 
        role: user.role 
      } 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ 
      id: user.id, 
      email: user.email,
      role: user.role 
    }, JWT_SECRET, { expiresIn: '7d' });
    
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });
    
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        fullName: user.fullName, 
        role: user.role 
      } 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Email Send
app.post('/api/email/send', async (req, res) => {
  try {
    const { to, subject, text, html } = req.body;
    
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to,
      subject,
      text,
      html
    });
    
    res.json({ success: true, message: 'Email sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Send failed' });
  }
});

// Partners Endpoints
app.get('/api/partners', async (req, res) => {
  const partners = await prisma.partner.findMany({
    include: { contacts: true }
  });
  res.json(partners);
});

app.get('/api/partners/:id', async (req, res) => {
  const { id } = req.params;
  const partner = await prisma.partner.findUnique({
    where: { id },
    include: { contacts: true, interactions: true }
  });
  res.json(partner);
});

app.post('/api/partners', async (req, res) => {
  const { organizationName, websiteUrl, schoolType, createdById, contacts } = req.body;
  const partner = await prisma.partner.create({
    data: {
      organizationName,
      websiteUrl,
      schoolType,
      createdBy: { connect: { id: createdById } },
      contacts: {
        create: contacts
      }
    }
  });
  res.json(partner);
});

// Interactions Endpoints
app.get('/api/interactions', async (req, res) => {
  const interactions = await prisma.interaction.findMany({
    include: { partner: true, staff: true }
  });
  res.json(interactions);
});

app.post('/api/interactions', async (req, res) => {
  const { partnerId, interactionType, staffId, date, studentCount, sharedNotes, needsFollowup, followupDueDate } = req.body;
  const interaction = await prisma.interaction.create({
    data: {
      partner: { connect: { id: partnerId } },
      interactionType,
      staff: { connect: { id: staffId } },
      date: new Date(date),
      studentCount,
      sharedNotes,
      needsFollowup,
      followupDueDate: followupDueDate ? new Date(followupDueDate) : null
    }
  });
  res.json(interaction);
});

// Students Endpoints
app.get('/api/students', async (req, res) => {
  const students = await prisma.student.findMany({
    include: { partner: true }
  });
  res.json(students);
});

app.post('/api/students', async (req, res) => {
  const { fullName, email, partnerId, status, cohort, earlyReleaseEligible, addedById } = req.body;
  const student = await prisma.student.create({
    data: {
      fullName,
      email,
      partner: { connect: { id: partnerId } },
      status,
      cohort,
      earlyReleaseEligible,
      addedBy: { connect: { id: addedById } }
    }
  });
  res.json(student);
});

// Dashboard/Stats
app.get('/api/staff/dashboard', async (req, res) => {
  const recentInteractions = await prisma.interaction.findMany({
    take: 5,
    orderBy: { date: 'desc' },
    include: { partner: true, staff: true }
  });
  
  const pendingFollowups = await prisma.interaction.count({
    where: { needsFollowup: true }
  });

  res.json({
    recentInteractions,
    pendingFollowups
  });
});

// AI Email Generation
app.post('/api/ai/generate-email', async (req, res) => {
  try {
    const { userPrompt, partnerId } = req.body;
    
    const partner = await prisma.partner.findUnique({
      where: { id: partnerId },
      include: { contacts: true }
    });
    
    if (!partner) return res.status(404).json({ error: 'Partner not found' });
    
    const partnerContext = `Organization: ${partner.organizationName}\nType: ${partner.schoolType || 'N/A'}\nWebsite: ${partner.websiteUrl || 'N/A'}\nContacts: ${partner.contacts.map(c => c.name + ' (' + c.email + ')').join('; ') || 'None'}`;
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an email assistant for partnerships. Generate professional email draft (Subject: ... Body: ...) based on context/input. Do NOT retain any data/PII - one-time generation only.',
        },
        {
          role: 'user',
          content: `Prompt: ${userPrompt}\n\nContext:\n${partnerContext}`,
        },
      ],
      temperature: 0.4,
    });
    
    const email = response.choices[0].message.content.trim();
    res.json({ email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Email Drafts
app.get('/api/email-drafts', async (req, res) => {
  const { staffId } = req.query;
  const drafts = await prisma.emailDraft.findMany({
    where: { staffId },
    include: { partner: true },
    orderBy: { createdAt: 'desc' }
  });
  res.json(drafts);
});

app.post('/api/email-drafts', async (req, res) => {
  const draft = await prisma.emailDraft.create({
    data: req.body,
    include: { partner: true }
  });
  res.json(draft);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Saved Search Endpoints
app.get('/api/saved-searches/:searchType', authenticateToken, async (req, res) => {
  const { searchType } = req.params;
  try {
    const savedSearches = await prisma.savedSearch.findMany({
      where: {
        userId: req.user.id,
        searchType
      },
      orderBy: { updatedAt: 'desc' }
    });
    res.json(savedSearches);
  } catch (error) {
    console.error('Error fetching saved searches:', error);
    res.status(500).json({ error: 'Failed to fetch saved searches' });
  }
});

app.post('/api/saved-searches', authenticateToken, async (req, res) => {
  const { name, searchType, filters, isDefault = false } = req.body;
  try {
    // If setting as default, unset other defaults for this user and search type
    if (isDefault) {
      await prisma.savedSearch.updateMany({
        where: {
          userId: req.user.id,
          searchType,
          isDefault: true
        },
        data: { isDefault: false }
      });
    }

    const savedSearch = await prisma.savedSearch.create({
      data: {
        userId: req.user.id,
        name,
        searchType,
        filters,
        isDefault
      }
    });

    // Log the creation
    await prisma.activityLog.create({
      data: {
        userId: req.user.id,
        action: 'ADDED',
        targetType: 'saved_search',
        targetId: savedSearch.id,
        targetName: savedSearch.name
      }
    });

    res.json(savedSearch);
  } catch (error) {
    console.error('Error creating saved search:', error);
    res.status(500).json({ error: 'Failed to create saved search' });
  }
});

app.put('/api/saved-searches/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, filters, isDefault = false } = req.body;
  try {
    const existingSearch = await prisma.savedSearch.findUnique({
      where: { id }
    });

    if (!existingSearch || existingSearch.userId !== req.user.id) {
      return res.status(404).json({ error: 'Saved search not found' });
    }

    // If setting as default, unset other defaults for this user and search type
    if (isDefault) {
      await prisma.savedSearch.updateMany({
        where: {
          userId: req.user.id,
          searchType: existingSearch.searchType,
          isDefault: true,
          id: { not: id }
        },
        data: { isDefault: false }
      });
    }

    const savedSearch = await prisma.savedSearch.update({
      where: { id },
      data: {
        name,
        filters,
        isDefault
      }
    });

    // Log the update
    await prisma.activityLog.create({
      data: {
        userId: req.user.id,
        action: 'EDITED',
        targetType: 'saved_search',
        targetId: savedSearch.id,
        targetName: savedSearch.name
      }
    });

    res.json(savedSearch);
  } catch (error) {
    console.error('Error updating saved search:', error);
    res.status(500).json({ error: 'Failed to update saved search' });
  }
});

app.delete('/api/saved-searches/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const savedSearch = await prisma.savedSearch.findUnique({
      where: { id }
    });

    if (!savedSearch || savedSearch.userId !== req.user.id) {
      return res.status(404).json({ error: 'Saved search not found' });
    }

    await prisma.savedSearch.delete({ where: { id } });

    // Log the deletion
    await prisma.activityLog.create({
      data: {
        userId: req.user.id,
        action: 'DELETED',
        targetType: 'saved_search',
        targetId: savedSearch.id,
        targetName: savedSearch.name
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting saved search:', error);
    res.status(500).json({ error: 'Failed to delete saved search' });
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});
