const User = require('../models/user')
const generateToken = require('../utils/generateToken')
const Otp = require('../models/otp')
const nodemailer = require('nodemailer')

const getTransporter = async () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  }

  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })
  }

  const testAccount = await nodemailer.createTestAccount()
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  })
}

const register = async (req, res) => {
  try {
    const { name, password, role, otp } = req.body
    const email = req.body.email?.toLowerCase().trim()

    // 1. Enforce OTP verification
    if (!otp) {
      return res.status(400).json({ message: 'Email verification via OTP is mandatory.' })
    }

    const otpRecord = await Otp.findOne({ email, otp })
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP. Please verify your email first.' })
    }

    // OTP matches, verify if user already exists
    const exists = await User.findOne({ email })
    if (exists) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    // Create the user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'buyer',
    })

    // Clean up all OTPs for this email address
    await Otp.deleteMany({ email })

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
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
      token: generateToken(user._id),
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
      token: generateToken(user._id),
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const sendOTP = async (req, res) => {
  try {
    const { email } = req.body
    if (!email) {
      return res.status(400).json({ message: 'Email address is required.' })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    await Otp.deleteMany({ email: email.toLowerCase() })
    await Otp.create({ email: email.toLowerCase(), otp })

    const transporter = await getTransporter()
    const isEthereal = transporter.options.host === 'smtp.ethereal.email'
    const info = await transporter.sendMail({
      from: '"PropFlow Luxury" <no-reply@propflow.com>',
      to: email,
      subject: 'Verify Your Email Address - PropFlow OTP',
      text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #d4af37; background: #0a0a0b; color: #ffffff;">
          <h2 style="color: #d4af37; text-align: center; font-family: 'Cormorant Garamond', serif;">PropFlow Private Residences</h2>
          <p style="color: #a0a0b0;">Thank you for registering on PropFlow. Please use the following One-Time Password (OTP) to complete your email verification:</p>
          <div style="font-size: 28px; font-weight: bold; letter-spacing: 6px; text-align: center; margin: 30px auto; color: #0a0a0b; background: #d4af37; padding: 15px; max-width: 200px;">
            ${otp}
          </div>
          <p style="color: #7a7a8a; font-size: 13px;">This code is valid for 10 minutes. If you did not request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid rgba(212,175,55,0.2); margin-top: 30px;" />
          <p style="font-size: 11px; color: #7a7a8a; text-align: center;">PropFlow Elite Real Estate © 2026</p>
        </div>
      `,
    })

    if (isEthereal) {
      const previewUrl = nodemailer.getTestMessageUrl(info)
      console.log(`\n==================================================`)
      console.log(`[OTP Sent to Ethereal Mail]`)
      console.log(`Recipient: ${email}`)
      console.log(`OTP Code: ${otp}`)
      console.log(`Preview Email here: ${previewUrl}`)
      console.log(`==================================================\n`)
      return res.status(200).json({ 
        message: `OTP sent successfully. DEVELOPMENT MODE: Since no SMTP variables are set in .env, here is your OTP: ${otp}` 
      })
    }

    res.status(200).json({ message: 'OTP sent successfully to your email.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required.' })
    }

    const record = await Otp.findOne({ email: email.toLowerCase(), otp })
    if (!record) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' })
    }

    res.status(200).json({ verified: true, message: 'Email verified successfully.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = {
  register,
  login,
  getProfile,
  toggleSaveProperty,
  switchRole,
  sendOTP,
  verifyOTP,
}