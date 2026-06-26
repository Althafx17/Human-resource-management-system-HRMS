import { useState } from 'react';
import { Search, MapPin, Plus, Building2, Globe, Laptop } from 'lucide-react';
import styles from './WorkAreas.module.css';
import AddWorkAreaForm from '../../components/AddWorkAreaForm';

interface WorkArea {
  id: string;
  name: string;
  type: 'Onsite' | 'Remote' | 'Hybrid';
  location: string;
  employeeCount: number;
  manager: string;
}

const DUMMY_AREAS: WorkArea[] = [
  { id: 'WA001', name: 'Headquarters - Floor 3', type: 'Onsite', location: 'New York, USA', employeeCount: 45, manager: 'Alice Vance' },
  { id: 'WA002', name: 'Design Studio', type: 'Hybrid', location: 'London, UK', employeeCount: 18, manager: 'Sara John' },
  { id: 'WA003', name: 'Global Remote Team', type: 'Remote', location: 'Worldwide', employeeCount: 120, manager: 'John Smith' },
  { id: 'WA004', name: 'R&D Engineering Lab', type: 'Onsite', location: 'California, USA', employeeCount: 12, manager: 'Marcus Aurelius' },
];

export default function WorkAreas() {
  const [search, setSearch] = useState('');
  const [areas, setAreas] = useState<WorkArea[]>(DUMMY_AREAS);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const getAreaIcon = (type: string) => {
    switch (type) {
      case 'Onsite': return <Building2 size={20} className={styles.iconOnsite} />;
      case 'Remote': return <Globe size={20} className={styles.iconRemote} />;
      case 'Hybrid': return <Laptop size={20} className={styles.iconHybrid} />;
      default: return <MapPin size={20} />;
    }
  };

  const handleSave = (data: any) => {
    const newArea: WorkArea = {
      id: `WA00${areas.length + 1}`,
      name: data.name,
      type: 'Onsite', // Default type for geofences created on the fly
      location: `Lat: ${data.latitude.toFixed(4)}, Lon: ${data.longitude.toFixed(4)}`,
      employeeCount: 0,
      manager: 'Admin Manager',
    };
    setAreas(prev => [newArea, ...prev]);
  };

  const filteredAreas = areas.filter(area =>
    area.name.toLowerCase().includes(search.toLowerCase()) ||
    area.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Work Areas</h1>

      {/* Top action bar config */}
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
          onClick={() => setIsDrawerOpen(true)}
        >
          <Plus size={18} /> Add Area
        </button>
      </div>

      {/* Grid Layout representing cards */}
      <div className={styles.grid}>
        {filteredAreas.map((area) => (
          <div key={area.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.iconWrapper}>
                {getAreaIcon(area.type)}
              </div>
              <span className={`${styles.typeBadge} ${styles[area.type.toLowerCase()]}`}>
                {area.type}
              </span>
            </div>

            <div className={styles.cardBody}>
              <h3 className={styles.areaName}>{area.name}</h3>
              
              <div className={styles.metaRow}>
                <MapPin size={14} className={styles.metaIcon} />
                <span>{area.location}</span>
              </div>

              <div className={styles.divider}></div>

              <div className={styles.statsRow}>
                <div className={styles.statBox}>
                  <span className={styles.statLabel}>Employees</span>
                  <span className={styles.statValue}>{area.employeeCount}</span>
                </div>
                <div className={styles.statBox}>
                  <span className={styles.statLabel}>Lead Manager</span>
                  <span className={styles.statValue} title={area.manager}>{area.manager}</span>
                </div>
            </div>
          </div>
        </div>
      ))}
      </div>

      <AddWorkAreaForm 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        onSave={handleSave} 
      />
    </div>
  );
}