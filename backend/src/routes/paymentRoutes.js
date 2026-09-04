import { Router } from 'express';
import {
  createPayment,
  getPaymentById,
  getPaymentByBooking,
} from '../controllers/paymentController.js';

const router = Router();

router.post('/create', createPayment);
router.get('/:id', getPaymentById);
router.get('/booking/:bookingId', getPaymentByBooking);

export default router;
