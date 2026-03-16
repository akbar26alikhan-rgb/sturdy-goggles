import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(value: number) {
  if (value >= 10000000) {
    return (value / 10000000).toFixed(2) + ' Cr';
  }
  if (value >= 100000) {
    return (value / 100000).toFixed(2) + ' L';
  }
  return value.toLocaleString('en-IN');
}
