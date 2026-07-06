// ==========================================
// 1. IMPORTS & DEPENDENCIES
// ==========================================
import type { WorkArea } from '../pages/workarea/types';

// ==========================================
// 2. MOCK PERSISTENCE SEEDING
// ==========================================

const DEFAULT_WORK_AREAS: WorkArea[] = [
  { id: 1, name: 'Main Office HQ', latitude: '40.7128', longitude: '-74.0060', radius: 100, status: 'ACTIVE' },
  { id: 2, name: 'London Design Hub', latitude: '51.5074', longitude: '-0.1278', radius: 250, status: 'ACTIVE' },
  { id: 3, name: 'California R&D Lab', latitude: '37.7749', longitude: '-122.4194', radius: 150, status: 'INACTIVE' },
];

/**
 * Reads geofenced work area list from browser storage.
 */
const getStoredAreas = (): WorkArea[] => {
  const data = localStorage.getItem('hrms_work_areas');
  if (!data) {
    localStorage.setItem('hrms_work_areas', JSON.stringify(DEFAULT_WORK_AREAS));
    return DEFAULT_WORK_AREAS;
  }
  return JSON.parse(data);
};

/**
 * Saves updated geofenced work area list to browser storage.
 */
const setStoredAreas = (areas: WorkArea[]) => {
  localStorage.setItem('hrms_work_areas', JSON.stringify(areas));
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ==========================================
// 3. API SERVICE OPERATIONS
// ==========================================

export const workAreaApi = {
  /**
   * Loads all registered geofenced work areas.
   */
  getAll: async (): Promise<WorkArea[]> => {
    await delay(300); // Simulate network latency
    return getStoredAreas();
  },

  /**
   * Registers a new geofenced work area.
   */
  create: async (data: Omit<WorkArea, 'id'>): Promise<WorkArea> => {
    await delay(400);
    const areas = getStoredAreas();
    const newId = areas.length > 0 ? Math.max(...areas.map(a => a.id)) + 1 : 1;
    const newArea: WorkArea = {
      ...data,
      id: newId,
    };
    areas.push(newArea);
    setStoredAreas(areas);
    return newArea;
  },

  /**
   * Updates coordinates, radius, or status rules for a work area.
   */
  update: async (id: number, data: Partial<WorkArea>): Promise<WorkArea> => {
    await delay(400);
    const areas = getStoredAreas();
    const index = areas.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Work area not found');
    const updatedArea = {
      ...areas[index],
      ...data,
    };
    areas[index] = updatedArea;
    setStoredAreas(areas);
    return updatedArea;
  },

  /**
   * Removes a geofenced work area.
   */
  delete: async (id: number): Promise<void> => {
    await delay(300);
    const areas = getStoredAreas();
    const filtered = areas.filter(a => a.id !== id);
    setStoredAreas(filtered);
  }
};
