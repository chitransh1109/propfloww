const User = require('../models/user')
const Property = require('../models/property')
const Otp = require('../models/otp')
const generateToken = require('../utils/generateToken')
const jwt = require('jsonwebtoken')
const https = require('https')
const cloudinary = require('cloudinary').v2

const sendResendEmail = (options) => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      from: 'PropFlow <no-reply@propfloww.online>',
      to: [options.to],
      subject: options.subject,
      html: options.html,
    })

    const reqOptions = {
      hostname: 'api.resend.com',
      port: 443,
      path: '/emails',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Length': Buffer.byteLength(data),
      },
    }

    const req = https.request(reqOptions, (res) => {
      let body = ''
      res.on('data', (chunk) => { body += chunk })
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(body))
          } catch (e) {
            resolve(body)
          }
        } else {
          reject(new Error(`Resend API error: ${res.statusCode} - ${body}`))
        }
      })
    })

    req.on('error', (err) => {
      reject(err)
    })

    req.write(data)
    req.end()
  })
}



// ── Generate a cryptographically random 6-digit OTP ──────
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString()

const getPublicId = (url) => {
  if (!url || !url.includes('cloudinary.com')) return null
  try {
    const parts = url.split('/')
    const uploadIdx = parts.indexOf('upload')
    if (uploadIdx === -1) return null
    const afterUpload = parts.slice(uploadIdx + 2).join('/')
    return afterUpload.replace(/\.[^/.]+$/, '')
  } catch { return null }
}

// public id extractor

const register = async (req, res) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({ message: 'Email service not configured. Please contact support.' })
    }

    const { name, password, role } = req.body
    const email = req.body.email?.toLowerCase().trim()

    // Check if email already exists and is verified
    const exists = await User.findOne({ email })
    if (exists && exists.isVerified) {
      return res.status(400).json({ message: 'Email already registered.' })
    }

    // If unverified account exists, delete it so they can re-register cleanly
    if (exists && !exists.isVerified) {
      await User.deleteOne({ email })
      await Otp.deleteMany({ email })
    }

    // Create the user as unverified
    await User.create({
      name,
      email,
      password,
      role: role || 'buyer',
      isVerified: false,
    })

    // Generate and save OTP (old ones removed first)
    await Otp.deleteMany({ email })
    const otpCode = generateOtp()
    await Otp.create({ email, otp: otpCode })

    console.log(`[OTP Verification] Code generated for ${email}: ${otpCode}`)

    // Send OTP email in the background (non-blocking) using Resend HTTP
    sendResendEmail({
      to: email,
      subject: 'PropFlow — Your Email Verification Code',
      html: `
        <div style="font-family:'Inter',sans-serif;background:#0a0a0b;color:#fff;padding:3rem;max-width:560px;margin:0 auto;border:1px solid rgba(212,175,55,0.15);">
          <h2 style="font-family:'Cormorant Garamond',serif;font-size:2rem;color:#d4af37;font-weight:300;margin-bottom:1.5rem;text-align:center;border-bottom:1px solid rgba(212,175,55,0.15);padding-bottom:1rem;">
            Prop<span style="color:#fff;">Flow</span>
          </h2>
          <p style="font-size:0.95rem;color:#a0a0b0;line-height:1.7;">Welcome, <strong style="color:#fff;">${name}</strong>.</p>
          <p style="font-size:0.95rem;color:#a0a0b0;line-height:1.7;">Use the code below to verify your email address. It expires in <strong style="color:#fff;">10 minutes</strong>.</p>
          <div style="text-align:center;margin:2.5rem 0;">
            <div style="display:inline-block;background:#1c1c22;border:1px solid rgba(212,175,55,0.3);padding:1.5rem 3rem;">
              <span style="font-family:'Cormorant Garamond',serif;font-size:3rem;font-weight:600;color:#d4af37;letter-spacing:0.5rem;">${otpCode}</span>
            </div>
          </div>
          <p style="font-size:0.8rem;color:#7a7a8a;border-top:1px solid rgba(255,255,255,0.07);padding-top:1.5rem;">If you did not create a PropFlow account, please ignore this email.</p>
        </div>
      `
    })
    .then(() => console.log(`[Mail Send Success] Code delivered to ${email}`))
    .catch(mailErr => console.error(`[Mail Send Error] Failed to send email to ${email}: ${mailErr.message}`))

    res.status(201).json({
      requiresVerification: true,
      email,
      message: `A 6-digit verification code has been sent to ${email}. Please check your inbox.`
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const login = async (req, res) => {
  try {
    const { password } = req.body
    const email = req.body.email?.toLowerCase().trim()

    const user = await User.findOne({ email })

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      token: generateToken(user._id),
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ── Verify OTP ────────────────────────────────────────────
const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body
    const email = req.body.email?.toLowerCase().trim()

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required.' })
    }

    const otpRecord = await Otp.findOne({ email, otp })
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP. Please request a new one.' })
    }

    // Mark user as verified
    const user = await User.findOneAndUpdate(
      { email },
      { isVerified: true },
      { new: true }
    )
    if (!user) {
      return res.status(404).json({ message: 'Account not found. Please register again.' })
    }

    // Clean up all OTPs for this email
    await Otp.deleteMany({ email })

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      token: generateToken(user._id),
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ── Resend OTP ────────────────────────────────────────────
const resendOtp = async (req, res) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({ message: 'Email service not configured.' })
    }
    const email = req.body.email?.toLowerCase().trim()
    if (!email) return res.status(400).json({ message: 'Email is required.' })

    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: 'No account found with this email.' })
    if (user.isVerified) return res.status(400).json({ message: 'This account is already verified.' })

    await Otp.deleteMany({ email })
    const otpCode = generateOtp()
    await Otp.create({ email, otp: otpCode })

    // Send OTP email in the background (non-blocking)
    sendResendEmail({
      to: email,
      subject: 'PropFlow — New Verification Code',
      html: `
        <div style="font-family:'Inter',sans-serif;background:#0a0a0b;color:#fff;padding:3rem;max-width:560px;margin:0 auto;border:1px solid rgba(212,175,55,0.15);">
          <h2 style="font-family:'Cormorant Garamond',serif;font-size:2rem;color:#d4af37;font-weight:300;margin-bottom:1.5rem;text-align:center;border-bottom:1px solid rgba(212,175,55,0.15);padding-bottom:1rem;">Prop<span style="color:#fff;">Flow</span></h2>
          <p style="font-size:0.95rem;color:#a0a0b0;line-height:1.7;">Here is your new verification code:</p>
          <div style="text-align:center;margin:2.5rem 0;">
            <div style="display:inline-block;background:#1c1c22;border:1px solid rgba(212,175,55,0.3);padding:1.5rem 3rem;">
              <span style="font-family:'Cormorant Garamond',serif;font-size:3rem;font-weight:600;color:#d4af37;letter-spacing:0.5rem;">${otpCode}</span>
            </div>
          </div>
          <p style="font-size:0.8rem;color:#7a7a8a;border-top:1px solid rgba(255,255,255,0.07);padding-top:1.5rem;">This code expires in 10 minutes.</p>
        </div>
      `
    })
    .then(() => console.log(`[Mail Send Success] New code delivered to ${email}`))
    .catch(mailErr => console.error(`[Mail Send Error] Failed to send email to ${email}: ${mailErr.message}`))

    res.json({
      message: `A new verification code has been sent to ${email}.`
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('savedProperties')

    res.json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const toggleSaveProperty = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    const propId = req.params.id

    const exists = user.savedProperties.some(
      id => id.toString() === propId.toString()
    )

    if (exists) {
      user.savedProperties = user.savedProperties.filter(
        id => id.toString() !== propId.toString()
      )
    } else {
      user.savedProperties.push(propId)
    }

    await user.save()

    res.json({ savedProperties: user.savedProperties })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const switchRole = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Admin accounts cannot switch roles.' })
    }

    user.role = user.role === 'owner' ? 'buyer' : 'owner'
    await user.save()

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      token: generateToken(user._id),
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const forgotPassword = async (req, res) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured in backend environment variables.')
      return res.status(500).json({ message: 'Mail server credentials are not configured on the backend. Please set RESEND_API_KEY.' })
    }

    const email = req.body.email?.toLowerCase().trim()
    const user = await User.findOne({ email })
    if (!user) {
      console.warn(`[Forgot Password Warning] Attempted forgot-password for non-existent email: ${email}`)
      return res.json({ message: 'If an account exists with that email, a reset link has been sent.' })
    }

    const resetToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '15m' })
    const frontendUrl = process.env.FRONTEND_URL || 'https://propfloww.vercel.app'
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`

    const mailOptions = {
      to: user.email,
      subject: 'PropFlow - Secure Password Reset Request',
      html: `
        <div style="font-family: 'Inter', sans-serif; background: #0a0a0b; color: #ffffff; padding: 3rem; max-width: 600px; margin: 0 auto; border: 1px solid rgba(212,175,55,0.15);">
          <h2 style="font-family: 'Cormorant Garamond', serif; font-size: 2rem; color: #d4af37; font-weight: 300; margin-bottom: 1.5rem; text-align: center; border-bottom: 1px solid rgba(212,175,55,0.15); padding-bottom: 1rem;">Prop<span style="color:#ffffff;">Flow</span></h2>
          <p style="font-size: 0.95rem; line-height: 1.7; color: #a0a0b0;">Greetings,</p>
          <p style="font-size: 0.95rem; line-height: 1.7; color: #a0a0b0;">A request was made to securely reset the password linked to your PropFlow account. If you did not make this request, you may safely ignore this email.</p>
          <div style="text-align: center; margin: 2.5rem 0;">
            <a href="${resetUrl}" style="background: #d4af37; color: #0a0a0b; text-decoration: none; padding: 1rem 2rem; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; display: inline-block;">Reset Password</a>
          </div>
          <p style="font-size: 0.8rem; line-height: 1.7; color: #7a7a8a; border-top: 1px solid rgba(255,255,255,0.07); padding-top: 1.5rem;">This secure link will expire in 15 minutes. For any questions, please contact our white-glove support team.</p>
        </div>
      `
    }

    sendResendEmail(mailOptions)
      .then(() => console.log(`[Mail Send Success] Forgot password link delivered to ${user.email}`))
      .catch(mailErr => console.error(`[Mail Send Error] Failed to send forgot password email: ${mailErr.message}`))

    res.json({ message: 'If an account exists with that email, a reset link has been sent.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body
    if (!token || !password) {
      return res.status(400).json({ message: 'Token and password are required.' })
    }

    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (e) {
      return res.status(400).json({ message: 'Reset link has expired or is invalid.' })
    }

    const user = await User.findOne({ email: decoded.email })
    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    user.password = password
    await user.save()

    res.json({ message: 'Password has been successfully updated.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const updateProfileImage = async (req, res) => {
  try {
    const { profileImage } = req.body
    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    user.profileImage = profileImage
    await user.save()

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      token: generateToken(user._id),
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id
    
    // Find all properties owned by user
    const properties = await Property.find({ owner: userId })
    
    // Delete property images from Cloudinary
    for (const p of properties) {
      if (p.images && Array.isArray(p.images)) {
        for (const img of p.images) {
          const publicId = getPublicId(img)
          if (publicId) await cloudinary.uploader.destroy(publicId).catch(() => {})
        }
      }
    }

    // Delete profile image from Cloudinary
    const user = await User.findById(userId)
    if (user) {
      const profilePublicId = getPublicId(user.profileImage)
      if (profilePublicId) await cloudinary.uploader.destroy(profilePublicId).catch(() => {})
    }

    await Property.deleteMany({ owner: userId })
    await User.findByIdAndDelete(userId)

    res.json({ message: 'Your account and all associated properties and images have been permanently deleted.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const testMail = async (req, res) => {
  try {
    const toEmail = req.query.email || 'yadavchitransh355@gmail.com'
    console.log(`[Test Mail] Attempting Resend HTTP to ${toEmail}`)
    console.log(`[Test Mail] Config - RESEND_API_KEY: ${process.env.RESEND_API_KEY ? 'Present' : 'Missing'}`)
    
    if (!process.env.RESEND_API_KEY) {
      return res.status(400).json({
        success: false,
        error: 'Missing RESEND_API_KEY environment variable on server.',
        config: {
          RESEND_API_KEY: false
        }
      })
    }

    const info = await sendResendEmail({
      to: toEmail,
      subject: 'PropFlow - Resend Diagnostic Test Mail',
      html: `<h2>Resend HTTP Test</h2><p>Your Resend integration is working perfectly!</p>`
    })

    res.json({
      success: true,
      message: `Resend test email sent successfully to ${toEmail}!`,
      info: info
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
      stack: err.stack,
      config: {
        RESEND_API_KEY: !!process.env.RESEND_API_KEY
      }
    })
  }
}

module.exports = {
  register,
  login,
  verifyOtp,
  resendOtp,
  getProfile,
  toggleSaveProperty,
  switchRole,
  forgotPassword,
  resetPassword,
  updateProfileImage,
  deleteAccount,
  testMail,
}