import { Router } from 'express';
import {
  createVenue,
  getMyVenues,
  getAllVenues,
  updateVenue,
  deleteVenue,
} from '../controllers/venueController';
import { authenticate, authorize } from '../middleware/auth';
import {
  createVenueRules,
  mongoIdParamRules,
  updateVenueRules,
  validate,
} from '../middleware/validators';

const router = Router();

router.use(authenticate);

router.post('/', authorize('client'), createVenueRules, validate, createVenue);
router.get('/my', getMyVenues);
router.get('/', authorize('admin'), getAllVenues);
router.patch('/:id', ...mongoIdParamRules('id'), updateVenueRules, validate, updateVenue);
router.delete('/:id', ...mongoIdParamRules('id'), validate, deleteVenue);

export default router;
