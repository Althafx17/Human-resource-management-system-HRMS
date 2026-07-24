import styles from './UpcomingInterviews.module.css';

// We define the shape of our data here
interface Interview {
  id: string;
  name: string;
  role: string;
  time: string;
  avatar: string;
}

const DUMMY_INTERVIEWS: Interview[] = [
  { id: '1', name: 'John', role: 'Finance Executive', time: '10:00 am-11:00am', avatar: '' },
  { id: '2', name: 'Justin', role: 'UI/UX Designer', time: '10:00 am-11:00am', avatar: '' },
  { id: '3', name: 'Sana', role: 'Sr.Developer', time: '10:00 am-11:00am', avatar: '' },
  { id: '4', name: 'Dia', role: 'Product Manager', time: '10:00 am-11:00am', avatar: '' },
];

export default function UpcomingInterviews() {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Upcoming Interviews</h3>
        <button className={styles.viewAllBtn}>View All</button>
      </div>

      <div className={styles.list}>
        {DUMMY_INTERVIEWS.map((interview) => (
          <div key={interview.id} className={styles.listItem}>
            <img src={interview.avatar} alt={interview.name} className={styles.avatar} />
            <div className={styles.info}>
              <span className={styles.name}>{interview.name}</span>
              <span className={styles.role}>{interview.role}</span>
            </div>
            <span className={styles.time}>{interview.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}