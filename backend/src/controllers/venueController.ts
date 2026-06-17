import { Response, NextFunction } from 'express';
import { Venue } from '../models/Venue';
import { AuthRequest } from '../middleware/auth';
import { pickVenueFields, toObjectId } from '../utils/mongoQuery';

export const createVenue = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = pickVenueFields(req.body as Record<string, unknown>);
    const venue = await Venue.create({ ...data, ownerId: req.user!.id });
    res.status(201).json({ success: true, venue });
  } catch (err) {
    next(err);
  }
};

export const getMyVenues = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const venues = await Venue.find({ ownerId: req.user!.id, isActive: true });
    res.status(200).json({ success: true, venues });
  } catch (err) {
    next(err);
  }
};

export const getAllVenues = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const venues = await Venue.find({ isActive: true })
      .populate('ownerId', 'name email');
    res.status(200).json({ success: true, venues });
  } catch (err) {
    next(err);
  }
};

export const updateVenue = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const venueId = toObjectId(req.params.id);
    const data = pickVenueFields(req.body as Record<string, unknown>);
    const venue = await Venue.findOneAndUpdate(
      { _id: venueId, ownerId: req.user!.id },
      data,
      { new: true, runValidators: true }
    );
    if (!venue) {
      res.status(404).json({ success: false, message: 'Venue not found' });
      return;
    }
    res.status(200).json({ success: true, venue });
  } catch (err) {
    next(err);
  }
};

export const deleteVenue = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const venueId = toObjectId(req.params.id);
    const venue = await Venue.findOneAndUpdate(
      { _id: venueId, ownerId: req.user!.id },
      { isActive: false },
      { new: true }
    );
    if (!venue) {
      res.status(404).json({ success: false, message: 'Venue not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Venue removed' });
  } catch (err) {
    next(err);
  }
};
