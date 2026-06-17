import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireAdmin, requirePrestataire } from '../middleware/roles.js';
import {
  createReservation, getUserReservations, getReservationById,
  cancelReservation, updateReservationStatus
} from '../controllers/reservations.controller.js';

const router = Router();

router.use(requireAuth);
router.post('/', createReservation);
router.get('/mes-reservations', getUserReservations);
router.get('/:id', getReservationById);
router.patch('/:id/annuler', cancelReservation);
router.patch('/:id/statut', requirePrestataire, updateReservationStatus);

export default router;
