import { axiosInstance } from '../config/axiosInstance';
import type { WorkArea } from '../../pages/workarea/types';

export interface WorkAreaPayload {
  name: string;
  latitude: string | number;
  longitude: string | number;
  radius: number;
  status: 'ACTIVE' | 'INACTIVE';
}

/**
 * Normalizes backend raw data into camelCase or UI-expected property keys.
 */
function normalizeWorkArea(apiData: any): WorkArea {
  if (!apiData) return apiData;
  return {
    id: apiData.id,
    name: apiData.location_name || apiData.name || '',
    latitude: apiData.latitude,
    longitude: apiData.longitude,
    radius: Number(apiData.radius),
    status: apiData.status,
  };
}

/**
 * Denormalizes UI models back into snake_case backend parameters.
 */
function denormalizeWorkArea(data: Partial<WorkAreaPayload>): any {
  if (!data) return data;
  const apiData: any = {};
  if (data.name !== undefined) apiData.location_name = data.name;
  if (data.latitude !== undefined) apiData.latitude = data.latitude;
  if (data.longitude !== undefined) apiData.longitude = data.longitude;
  if (data.radius !== undefined) apiData.radius = Number(data.radius);
  if (data.status !== undefined) apiData.status = data.status;
  return apiData;
}

export const workAreaApi = {
  /**
   * Loads all registered geofenced work areas.
   * Target endpoint: GET /api/work-areas/work-areas/
   */
  async getWorkAreas(): Promise<WorkArea[]> {
    const response = await axiosInstance.get<any>('/work-areas/work-areas/');
    // Handle both paginated responses (under .results) and raw lists
    const data = response.data.results ? response.data.results : response.data;
    if (Array.isArray(data)) {
      return data.map(normalizeWorkArea);
    }
    return [];
  },

  /**
   * Fetches a specific work area by ID.
   * Target endpoint: GET /api/work-areas/work-areas/{id}/
   */
  async getWorkAreaById(id: string | number): Promise<WorkArea> {
    const response = await axiosInstance.get<any>(`/work-areas/work-areas/${id}/`);
    return normalizeWorkArea(response.data);
  },

  /**
   * Registers a new geofenced work area.
   * Target endpoint: POST /api/work-areas/work-areas/
   */
  async createWorkArea(data: WorkAreaPayload): Promise<WorkArea> {
    const payload = denormalizeWorkArea(data);
    const response = await axiosInstance.post<any>('/work-areas/work-areas/', payload);
    return normalizeWorkArea(response.data);
  },

  /**
   * Replaces an existing work area.
   * Target endpoint: PUT /api/work-areas/work-areas/{id}/
   */
  async updateWorkArea(id: string | number, data: WorkAreaPayload): Promise<WorkArea> {
    const payload = denormalizeWorkArea(data);
    const response = await axiosInstance.put<any>(`/work-areas/work-areas/${id}/`, payload);
    return normalizeWorkArea(response.data);
  },

  /**
   * Partially updates an existing work area.
   * Target endpoint: PATCH /api/work-areas/work-areas/{id}/
   */
  async patchWorkArea(id: string | number, data: Partial<WorkAreaPayload>): Promise<WorkArea> {
    const payload = denormalizeWorkArea(data);
    const response = await axiosInstance.patch<any>(`/work-areas/work-areas/${id}/`, payload);
    return normalizeWorkArea(response.data);
  },

  /**
   * Removes a geofenced work area.
   * Target endpoint: DELETE /api/work-areas/work-areas/{id}/
   */
  async deleteWorkArea(id: string | number): Promise<void> {
    await axiosInstance.delete(`/work-areas/work-areas/${id}/`);
  }
};
