import { Router, Response, NextFunction } from 'express';
import { Notification } from '../models/Notification';
import { authenticate, AuthRequest } from '../middleware/auth';
import { mongoIdParamRules, validate } from '../middleware/validators';

const router = Router();

router.use(authenticate);

router.get('/unread-count', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const count = await Notification.countDocuments({
      userId: req.user!.id,
      isRead: false,
    });
    res.json({ success: true, count });
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const notifications = await Notification.find({ userId: req.user!.id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ success: true, notifications });
  } catch (err) {
    next(err);
  }
});

router.patch(
  '/:id/read',
  ...mongoIdParamRules('id'),
  validate,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await Notification.findOneAndUpdate(
        { _id: req.params.id, userId: req.user!.id },
        { isRead: true }
      );
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  }
);

router.patch('/mark-all-read', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await Notification.updateMany({ userId: req.user!.id, isRead: false }, { isRead: true });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
