import React, { useState } from 'react';
import SlideOverDrawer from './SlideOverDrawer';
import styles from './FormStyles.module.css';

interface AddWorkAreaFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
}

export default function AddWorkAreaForm({ isOpen, onClose, onSave }: AddWorkAreaFormProps) {
  const [name, setName] = useState('');
  const [status, setStatus] = useState('Active');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [radius, setRadius] = useState('100');

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
        + Save Work Area
      </button>
    </>
  );

  return (
    <SlideOverDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Add Work Area"
      subtitle="Define a geofenced area for onsite attendance logging"
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
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
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
