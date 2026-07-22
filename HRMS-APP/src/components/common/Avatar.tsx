import styles from './Avatar.module.css';

// ==========================================
// AVATAR
// ==========================================
// Renders a profile image with an initial-letter fallback.
//
// Usage:
//   <Avatar src={employee.photo} name="Rihan Naseer" size="md" />
//   <Avatar name="John Smith" size="lg" />  ← no photo, shows "JS"

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  /** Image URL. Falls back to initials if undefined or fails to load. */
  src?: string | null;
  /** Full name — used to generate initials fallback. */
  name?: string;
  /** Size variant. Defaults to 'md'. */
  size?: AvatarSize;
  /** Extra class on the outer element. */
  className?: string;
}

const sizeMap: Record<AvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
};

/** Extracts up to 2 uppercase initials from a full name. */
function getInitials(name?: string): string {
  if (!name?.trim()) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Generates a deterministic background color from a string. */
function getColorFromName(name?: string): string {
  const palette = [
    '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b',
    '#ef4444', '#06b6d4', '#ec4899', '#6366f1',
  ];
  if (!name) return palette[0];
  const idx = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % palette.length;
  return palette[idx];
}

export default function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const px = sizeMap[size];
  const initials = getInitials(name);
  const bg = getColorFromName(name);

  return (
    <span
      className={`${styles.avatar} ${styles[size]} ${className ?? ''}`}
      style={{ width: px, height: px, minWidth: px }}
      aria-label={name ?? 'User avatar'}
      role="img"
    >
      {src ? (
        <img
          src={src}
          alt={name ?? 'Avatar'}
          className={styles.img}
          onError={(e) => {
            // On load failure, hide the img — the initials div underneath shows
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : null}
      {/* Always render initials — hidden behind image when image loads */}
      <span className={styles.initials} style={{ background: bg }} aria-hidden="true">
        {initials}
      </span>
    </span>
  );
}
