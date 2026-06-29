const User = require('../models/user')
const generateToken = require('../utils/generateToken')
const jwt = require('jsonwebtoken')
const https = require('https')

const sendResendEmail = (options) => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      from: 'PropFlow Concierge <onboarding@resend.dev>',
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

const register = async (req, res) => {
  try {
    const { name, password, role } = req.body
    const email = req.body.email?.toLowerCase().trim()

    // Verify if user already exists
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

const forgotPassword = async (req, res) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured in backend environment variables.')
      return res.status(500).json({ message: 'Mail server credentials are not configured on the backend. Please set RESEND_API_KEY.' })
    }

    const email = req.body.email?.toLowerCase().trim()
    const user = await User.findOne({ email })
    if (!user) {
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

    await sendResendEmail(mailOptions)
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

module.exports = {
  register,
  login,
  getProfile,
  toggleSaveProperty,
  switchRole,
  forgotPassword,
  resetPassword,
}