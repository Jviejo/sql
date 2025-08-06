import nodemailer from 'nodemailer'

interface EmailConfig {
  host: string
  port: number
  secure: boolean
  auth?: {
    user: string
    pass: string
  }
}

const getEmailConfig = (): EmailConfig => {
  if (process.env.NODE_ENV === 'production') {
    // Resend configuration for production
    return {
      host: 'smtp.resend.com',
      port: 587,
      secure: false,
      auth: {
        user: 'resend',
        pass: process.env.RESEND_API_KEY || '',
      },
    }
  } else {
    // MailHog configuration for development
    return {
      host: 'localhost',
      port: 1025,
      secure: false,
    }
  }
}

const transporter = nodemailer.createTransport(getEmailConfig())

export const sendVerificationCode = async (email: string, code: string) => {
  const mailOptions = {
    from: process.env.NODE_ENV === 'production' 
      ? 'noreply@kfs.es' 
      : 'test@example.com',
    to: email,
    subject: 'Código de verificación',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Código de verificación</h2>
        <p>Tu código de verificación es:</p>
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #007bff; font-size: 32px; margin: 0; letter-spacing: 5px;">${code}</h1>
        </div>
        <p>Este código expirará en 10 minutos.</p>
        <p>Si no solicitaste este código, puedes ignorar este email.</p>
      </div>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error: 'Error al enviar el email' }
  }
} 