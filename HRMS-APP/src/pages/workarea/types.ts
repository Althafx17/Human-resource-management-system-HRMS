// ==========================================
// 1. TYPES & INTERFACES
// ==========================================

export interface WorkArea {
  id: number;
  name: string;
  latitude: string | number;
  longitude: string | number;
  radius: number; // in meters
  status: 'ACTIVE' | 'INACTIVE';
}
