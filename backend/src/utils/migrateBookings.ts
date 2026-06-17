import { Booking } from '../models/Booking';

export const migrateBookings = async (): Promise<void> => {
  await Booking.updateMany(
    { rejectedBy: { $exists: false } },
    { $set: { rejectedBy: [] } }
  );
  await Booking.updateMany(
    { spareParts: { $exists: false } },
    { $set: { spareParts: [] } }
  );
  await Booking.updateMany(
    { serviceImages: { $exists: false } },
    { $set: { serviceImages: [] } }
  );
  await Booking.updateMany(
    { statusHistory: { $exists: false } },
    { $set: { statusHistory: [] } }
  );

  const legacyAssigned = await Booking.find({
    assignedTechnicianId: { $exists: true, $ne: null },
    $or: [{ technicianId: null }, { technicianId: { $exists: false } }],
  });

  for (const doc of legacyAssigned) {
    await Booking.updateOne(
      { _id: doc._id },
      {
        $set: { technicianId: doc.assignedTechnicianId },
        $unset: { assignedTechnicianId: 1 },
      }
    );
  }
};
