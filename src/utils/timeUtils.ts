export const hour_start = '10:00';
export const hour_end = '24:00';

export function toMin(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

export function toHHMM(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
}

export function addMin(hhmm: string, minutes: number): string {
  return toHHMM(toMin(hhmm) + minutes);
}

export function overlaps(startA: string, endA: string, startB: string, endB: string) {
  const a1 = toMin(startA), a2 = toMin(endA), b1 = toMin(startB), b2 = toMin(endB);
  return a1 <= b2 && b1 <= a2;
}

export function normalizeTimeOverflow(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
 
  if (isNaN(h) || isNaN(m)) 
    return hhmm;

  const totalMin = (h * 60 + m) % (24 * 60);
  const newH = Math.floor(totalMin / 60);
  const newM = totalMin % 60;
  
  return `${newH.toString().padStart(2, '0')}:${newM.toString().padStart(2, '0')}`;
}