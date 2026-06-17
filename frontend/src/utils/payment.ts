export const formatINR = (amount: number | undefined | null) =>
  `₹${(Number(amount) || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
  })}`;

export type PaymentStatus = 'paid' | 'unpaid';

export function paymentBadgeVariant(
  status: PaymentStatus
): 'confirmed' | 'due' {
  return status === 'paid' ? 'confirmed' : 'due';
}

export function paymentLabel(status: PaymentStatus): string {
  return status === 'paid' ? 'Paid' : 'Unpaid';
}
