import { prisma } from '../config/database.js';
import { sendReservationConfirmation } from '../services/email.service.js';
import { notifyUser } from '../config/socket.js';
import { ah } from '../utils/asyncHandler.js';

export const createReservation = ah(async (req, res) => {
  const { serviceId, dateDebut, dateFin, nombrePersonnes = 1, notes } = req.body;
  const userId = req.user.id;

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    include: { provider: true }
  });

  if (!service || !service.disponible) {
    return res.status(404).json({ error: 'Service indisponible' });
  }

  const prixTotal = service.prix * nombrePersonnes;

  const reservation = await prisma.reservation.create({
    data: {
      userId,
      serviceId,
      providerId: service.providerId,
      dateDebut: new Date(dateDebut),
      dateFin: dateFin ? new Date(dateFin) : null,
      nombrePersonnes,
      prixTotal,
      notes
    },
    include: {
      service: { select: { nomFr: true, nomEn: true, type: true } },
      provider: { select: { nomEntreprise: true, telephone: true } }
    }
  });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  sendReservationConfirmation(reservation, user).catch(() => {});

  const dateStr = new Date(dateDebut).toLocaleDateString('fr-FR');
  await prisma.notification.create({
    data: {
      userId: service.provider.userId,
      type: 'nouvelle_reservation',
      titre: 'Nouvelle réservation reçue',
      message: `${user.prenom} ${user.nom} a réservé "${service.nomFr}" pour le ${dateStr} (${nombrePersonnes} pers.)`,
      lien: '/profil/prestataire'
    }
  });

  notifyUser(service.provider.userId, 'nouvelle_reservation', {
    reservationId: reservation.id,
    service: service.nomFr,
    tourist: `${user.prenom} ${user.nom}`,
    dateDebut
  });

  res.status(201).json(reservation);
});

export const getUserReservations = ah(async (req, res) => {
  const reservations = await prisma.reservation.findMany({
    where: { userId: req.user.id },
    include: {
      service: { select: { nomFr: true, nomEn: true, type: true, images: true } },
      provider: { select: { nomEntreprise: true, telephone: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
  res.json(reservations);
});

export const getReservationById = ah(async (req, res) => {
  const reservation = await prisma.reservation.findFirst({
    where: { id: req.params.id, userId: req.user.id },
    include: { service: true, provider: true }
  });
  if (!reservation) return res.status(404).json({ error: 'Réservation introuvable' });
  res.json(reservation);
});

export const cancelReservation = ah(async (req, res) => {
  const reservation = await prisma.reservation.findFirst({
    where: { id: req.params.id, userId: req.user.id }
  });
  if (!reservation) return res.status(404).json({ error: 'Réservation introuvable' });
  if (['TERMINEE', 'ANNULEE'].includes(reservation.statut)) {
    return res.status(400).json({ error: "Impossible d'annuler cette réservation" });
  }
  const updated = await prisma.reservation.update({
    where: { id: req.params.id },
    data: { statut: 'ANNULEE' }
  });
  res.json(updated);
});

export const updateReservationStatus = ah(async (req, res) => {
  const { statut } = req.body;
  const reservation = await prisma.reservation.update({
    where: { id: req.params.id },
    data: { statut },
    include: { service: { select: { nomFr: true } } }
  });

  const statutLabels = {
    CONFIRMEE: 'confirmée', REFUSEE: 'refusée',
    EN_COURS: 'en cours', TERMINEE: 'terminée', ANNULEE: 'annulée'
  };
  await prisma.notification.create({
    data: {
      userId: reservation.userId,
      type: 'statut_reservation',
      titre: 'Réservation mise à jour',
      message: `Votre réservation pour "${reservation.service.nomFr}" est ${statutLabels[statut] ?? statut}`,
      lien: '/profil/reservations'
    }
  });

  notifyUser(reservation.userId, 'statut_reservation', {
    reservationId: reservation.id,
    statut
  });

  res.json(reservation);
});
