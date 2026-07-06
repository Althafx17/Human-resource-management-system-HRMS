// ==========================================
// 1. IMPORTS & DEPENDENCIES
// ==========================================
import React, { useState, useEffect } from 'react';
import SlideOverDrawer from './SlideOverDrawer';
import styles from './FormStyles.module.css';
import type { WorkArea } from '../pages/workarea/types';

// ==========================================
// 2. TYPES & PROPS
// ==========================================
interface AddWorkAreaFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
  initialData?: WorkArea | null; // Null/undefined triggers Add mode
}

// ==========================================
// 3. MAIN FORM COMPONENT
// ==========================================
export default function AddWorkAreaForm({ isOpen, onClose, onSave, initialData }: AddWorkAreaFormProps) {
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [radius, setRadius] = useState('100');

  // Sync state variables with edit fields when opening drawer
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name);
        setStatus(initialData.status);
        setLatitude(String(initialData.latitude));
        setLongitude(String(initialData.longitude));
        setRadius(String(initialData.radius));
      } else {
        setName('');
        setStatus('ACTIVE');
        setLatitude('');
        setLongitude('');
        setRadius('100');
      }
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !latitude || !longitude || !radius) {
      alert('Please fill in all required fields.');
      return;
    }
    if (onSave) {
      onSave({
        name,
        status,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        radius: parseInt(radius, 10),
      });
    }
    onClose();
  };

  const footerActions = (
    <>
      <button 
        type="button" 
        className={styles.discardBtn} 
        onClick={onClose}
      >
        Discard
      </button>
      <button 
        type="button" 
        className={styles.saveBtn} 
        onClick={handleSubmit}
      >
        {initialData ? 'Save Changes' : '+ Save Work Area'}
      </button>
    </>
  );

  return (
    <SlideOverDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Work Area" : "Add Work Area"}
      subtitle={initialData ? "Modify geofence boundary coordinates" : "Define a geofenced area for onsite attendance logging"}
      footerActions={footerActions}
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        
        {/* Section: GENERAL INFORMATION */}
        <div className={styles.sectionHeader}>
          <div className={styles.pill}></div>
          <span className={styles.sectionTitle}>General Information</span>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Location Name *</label>
          <input
            type="text"
            className={styles.input}
            placeholder="e.g. Headquarters - Floor 3"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Status *</label>
          <select
            className={styles.select}
            value={status}
            onChange={(e) => setStatus(e.target.value as 'ACTIVE' | 'INACTIVE')}
            required
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>

        {/* Section: COORDINATES & BOUNDS */}
        <div className={styles.sectionHeader}>
          <div className={styles.pill}></div>
          <span className={styles.sectionTitle}>Coordinates & Bounds</span>
        </div>

        <div className={styles.grid2}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Latitude *</label>
            <input
              type="number"
              step="any"
              className={styles.input}
              placeholder="e.g. 40.7128"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Longitude *</label>
            <input
              type="number"
              step="any"
              className={styles.input}
              placeholder="e.g. -74.0060"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              required
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Radius (meters) *</label>
          <input
            type="number"
            className={styles.input}
            placeholder="e.g. 100"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            required
          />
        </div>

      </form>
    </SlideOverDrawer>
  );
}
