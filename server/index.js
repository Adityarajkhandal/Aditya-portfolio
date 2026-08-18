require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  // Validation
  if (!name || !email || !message) {
    return res.status(400).json({ 
      success: false, 
      error: 'Please provide name, email, and message.' 
    });
  }

  // Email regex validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Please provide a valid email address.' 
    });
  }

  // Check if SMTP is configured
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📩 NEW CONTACT FORM SUBMISSION');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Name:    ${name}`);
    console.log(`Email:   ${email}`);
    console.log(`Message: ${message}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  SMTP not configured — email not sent.');
    console.log('   Configure .env with SMTP credentials to enable email delivery.');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    return res.json({ 
      success: true, 
      message: 'Message received! (Email delivery not configured yet)' 
    });
  }

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send email
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      to: process.env.RECEIVER_EMAIL || 'er.adityarajkhandal@gmail.com',
      replyTo: email,
      subject: `Portfolio Contact: ${name}`,
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #0a192f, #112240); padding: 30px; border-radius: 12px; color: #ccd6f6;">
            <h2 style="color: #64ffda; margin-top: 0;">New Message from Portfolio</h2>
            <p><strong style="color: #64ffda;">Name:</strong> ${name}</p>
            <p><strong style="color: #64ffda;">Email:</strong> <a href="mailto:${email}" style="color: #ccd6f6;">${email}</a></p>
            <hr style="border: 1px solid #233554; margin: 20px 0;">
            <p><strong style="color: #64ffda;">Message:</strong></p>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
        </div>
      `,
    });

    console.log(`✅ Email sent from ${name} (${email})`);
    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('❌ Email error:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send message. Please try again later.' 
    });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`\n🚀 Portfolio server running on http://localhost:${PORT}`);
  console.log(`📧 Contact form endpoint: POST http://localhost:${PORT}/api/contact`);
  if (!process.env.SMTP_USER) {
    console.log('⚠️  SMTP not configured — form submissions will be logged to console');
  }
  console.log('');
});
