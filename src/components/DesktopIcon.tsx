import { motion } from 'framer-motion';

interface DesktopIconProps {
  icon: string;
  label: string;
  onClick: () => void;
}

const DesktopIcon = ({ icon, label, onClick }: DesktopIconProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onDoubleClick={onClick}
      className="desktop-icon flex flex-col items-center gap-1 p-3 rounded-lg w-24 text-center"
    >
      <span className="text-4xl drop-shadow-lg">{icon}</span>
      <span className="text-xs text-foreground text-glow-sm leading-tight break-words">
        {label}
      </span>
    </motion.button>
  );
};

export default DesktopIcon;
