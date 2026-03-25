interface AvatarProps {
  name: string;
  className?: string;
}

function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
}

function getInitials(name: string) {
  const parts = name.trim().split(' ');
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function Avatar({ name, className = '' }: AvatarProps) {
  const bgColor = stringToColor(name);
  const initials = getInitials(name);

  return (
    <div className={`relative inline-block ${className}`} title={name}>
      <div
        className="flex items-center justify-center w-8 h-8 rounded-full text-white text-xs font-semibold relative z-10"
        style={{ backgroundColor: bgColor }}
      >
        {initials}
      </div>
      {/* 1.5px stroke, 0.35 opacity ring around the avatar */}
      <div 
        className="absolute inset-[-3px] rounded-full pointer-events-none"
        style={{ border: `1.5px solid ${bgColor}`, opacity: 0.35 }}
      />
    </div>
  );
}
