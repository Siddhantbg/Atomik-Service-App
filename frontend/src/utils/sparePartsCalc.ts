export type SparePartLine = {
  name: string;
  quantity: number;
  unitCost: number;
};

export function sumSparePartsTotal(
  parts?: SparePartLine[] | null
): number {
  if (!parts?.length) return 0;
  return parts.reduce(
    (sum, p) => sum + (p.quantity ?? 1) * (p.unitCost ?? 0),
    0
  );
}

/** Technician-quoted spare parts subtotal + GST */
export function quotedSparePartsWithTax(
  parts?: SparePartLine[] | null,
  taxRate = 0.18
): number {
  const preTax = sumSparePartsTotal(parts);
  if (preTax <= 0) return 0;
  return preTax + Math.round(preTax * taxRate);
}

export function bookingHasSpareParts(booking: {
  spareParts?: SparePartLine[] | null;
}): boolean {
  return sumSparePartsTotal(booking.spareParts) > 0;
}
