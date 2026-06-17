import nodemailer from 'nodemailer';

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

export async function sendReservationConfirmation(reservation, user) {
  if (!process.env.SMTP_HOST) return;

  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"BeninExplore" <${process.env.SMTP_USER}>`,
    to: user.email,
    subject: `✅ Réservation confirmée — ${reservation.service.nomFr}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0D3B5C;">Votre réservation est confirmée !</h2>
        <p>Bonjour ${user.prenom},</p>
        <p>Votre réservation pour <strong>${reservation.service.nomFr}</strong> est confirmée.</p>
        <ul>
          <li>Date : ${new Date(reservation.dateDebut).toLocaleDateString('fr-FR')}</li>
          <li>Personnes : ${reservation.nombrePersonnes}</li>
          <li>Total : ${reservation.prixTotal.toLocaleString()} XOF</li>
        </ul>
        <p style="color: #8B7355;">Merci de choisir BeninExplore pour découvrir le Bénin !</p>
      </div>
    `
  });
}

export async function sendWelcomeEmail(user) {
  if (!process.env.SMTP_HOST) return;

  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"BeninExplore" <${process.env.SMTP_USER}>`,
    to: user.email,
    subject: '🇧🇯 Bienvenue sur BeninExplore !',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0D3B5C;">Bienvenue, ${user.prenom} !</h2>
        <p>Votre compte BeninExplore a été créé avec succès.</p>
        <p>Découvrez les merveilles du Bénin : Ganvié, Ouidah, Abomey, la Pendjari et bien plus encore.</p>
        <a href="${process.env.FRONTEND_URL}" style="background: #0D3B5C; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">
          Explorer le Bénin
        </a>
      </div>
    `
  });
}
