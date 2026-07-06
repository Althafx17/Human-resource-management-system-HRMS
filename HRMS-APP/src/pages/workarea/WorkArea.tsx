// ==========================================
// 1. IMPORTS & DEPENDENCIES
// ==========================================
import { useState, useEffect } from 'react';
import { Search, MapPin, Plus, Globe, Pencil, Trash2 } from 'lucide-react';
import styles from './WorkAreas.module.css';
import AddWorkAreaForm from '../../components/AddWorkAreaForm';
import { workAreaApi } from '../../services/workAreaApi';
import { useToast } from '../../components/ToastContext';
import type { WorkArea } from './types';

// ==========================================
// 2. MAIN PAGE COMPONENT
// ==========================================

/**
 * WorkAreas Page Component (Default Export)
 * 
 * Manages the registration and bounds check of geofenced onsite coordinates.
 * Connects to the local storage mock service simulating backend API endpoints.
 */
export default function WorkAreas() {
  const { showToast } = useToast();

  // Search input and drawer control states
  const [search, setSearch] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Selected item cache for updating/editing
  const [selectedArea, setSelectedArea] = useState<WorkArea | null>(null);
  
  // Geofence areas list state
  const [areas, setAreas] = useState<WorkArea[]>([]);

  /**
   * Fetches work area list from the storage service.
   */
  const loadAreas = () => {
    setIsLoading(true);
    workAreaApi.getAll()
      .then(data => {
        setAreas(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load work areas:', err);
        showToast('Failed to load work areas.', 'error');
        setIsLoading(false);
      });
  };

  // Initial listing call on mount
  useEffect(() => {
    loadAreas();
  }, []);

  /**
   * Orchestrates geofence saves (creating new entries or updating existing records).
   * 
   * @param {Omit<WorkArea, 'id'>} data - Fields returned by the form drawer.
   */
  const handleSave = (data: Omit<WorkArea, 'id'>) => {
    if (selectedArea) {
      // Edit Mode
      workAreaApi.update(selectedArea.id, data)
        .then(() => {
          showToast('Work area details updated successfully!', 'success');
          loadAreas();
        })
        .catch(err => {
          console.error(err);
          showToast('Failed to update work area.', 'error');
        });
    } else {
      // Add Mode
      workAreaApi.create(data)
        .then(() => {
          showToast('Work area registered successfully!', 'success');
          loadAreas();
        })
        .catch(err => {
          console.error(err);
          showToast('Failed to create work area.', 'error');
        });
    }
    setIsDrawerOpen(false);
    setSelectedArea(null);
  };

  /**
   * Removes a geofenced area by ID.
   */
  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this work area?")) {
      workAreaApi.delete(id)
        .then(() => {
          showToast('Work area removed successfully!', 'success');
          loadAreas();
        })
        .catch(err => {
          console.error(err);
          showToast('Failed to remove work area.', 'error');
        });
    }
  };

  /**
   * Opens the drawer form pre-loaded with selected area parameters.
   */
  const openEditDrawer = (area: WorkArea) => {
    setSelectedArea(area);
    setIsDrawerOpen(true);
  };

  /**
   * Resets form selection and opens the drawer to create a new entry.
   */
  const openAddDrawer = () => {
    setSelectedArea(null);
    setIsDrawerOpen(true);
  };

  // Perform case-insensitive search filtering across name or coordinates
  const filteredAreas = areas.filter(area =>
    area.name.toLowerCase().includes(search.toLowerCase()) ||
    String(area.latitude).includes(search) ||
    String(area.longitude).includes(search)
  );

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Work Areas</h1>

      {/* Top action bar configuration */}
      <div className={styles.toolbar}>
        <div className={styles.searchContainer}>
          <Search className={styles.searchIcon} size={18} />
          <input 
            type="text" 
            placeholder="Search work areas..." 
            className={styles.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button 
          className={styles.addBtn}
          onClick={openAddDrawer}
          type="button"
        >
          <Plus size={18} /> Add Work Area
        </button>
      </div>

      {/* Data Table Wrapper */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Coordinates</th>
              <th>Radius</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                  Loading work areas...
                </td>
              </tr>
            ) : filteredAreas.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                  No work areas found.
                </td>
              </tr>
            ) : (
              filteredAreas.map((area) => (
                <tr key={area.id}>
                  {/* NAME COLUMN (Circular MapPin wrapper next to name) */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        backgroundColor: '#eff6ff',
                        color: '#2563eb',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <MapPin size={16} />
                      </div>
                      <span style={{ fontWeight: '500', color: '#0f172a' }}>{area.name}</span>
                    </div>
                  </td>
                  
                  {/* COORDINATES COLUMN (Globe icon next to Lat/Lon strings) */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '13px' }}>
                      <Globe size={15} color="#94a3b8" />
                      <span>{parseFloat(String(area.latitude)).toFixed(4)}, {parseFloat(String(area.longitude)).toFixed(4)}</span>
                    </div>
                  </td>
                  
                  {/* RADIUS COLUMN (Radius in meters) */}
                  <td>
                    <span style={{ color: '#475569', fontWeight: '500', fontSize: '13px' }}>{area.radius}m</span>
                  </td>
                  
                  {/* STATUS COLUMN (Colored Pill badge) */}
                  <td>
                    <span className={`${styles.statusPill} ${area.status === 'ACTIVE' ? styles.active : styles.inactive}`}>
                      {area.status}
                    </span>
                  </td>
                  
                  {/* ACTIONS COLUMN (Edit/Delete icon button control pairs) */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <button
                        type="button"
                        title="Edit boundaries"
                        onClick={() => openEditDrawer(area)}
                        style={{
                          border: 'none',
                          background: 'none',
                          cursor: 'pointer',
                          padding: '4px',
                          color: '#475569',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '4px',
                          transition: 'all 0.2s',
                          outline: 'none'
                        }}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        title="Remove location"
                        onClick={() => handleDelete(area.id)}
                        style={{
                          border: 'none',
                          background: 'none',
                          cursor: 'pointer',
                          padding: '4px',
                          color: '#ef4444',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '4px',
                          transition: 'all 0.2s',
                          outline: 'none'
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Slide-out Add/Edit Work Area Drawer */}
      <AddWorkAreaForm 
        isOpen={isDrawerOpen} 
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedArea(null);
        }} 
        onSave={handleSave}
        initialData={selectedArea}
      />
    </div>
  );
}