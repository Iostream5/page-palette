// Floating Action Button with animations
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FABAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color?: string;
}

interface AnimatedFABProps {
  actions?: FABAction[];
  icon?: React.ReactNode;
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center' | 'top-right' | 'top-left';
  variant?: 'default' | 'extended' | 'speed-dial';
  label?: string;
  onClick?: () => void;
  className?: string;
}

const positionClasses = {
  'bottom-right': 'bottom-6 right-6',
  'bottom-left': 'bottom-6 left-6',
  'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2',
  'top-right': 'top-6 right-6',
  'top-left': 'top-6 left-6',
};

export function AnimatedFAB({
  actions = [],
  icon = <Plus className="w-6 h-6" />,
  position = 'bottom-right',
  variant = 'default',
  label,
  onClick,
  className,
}: AnimatedFABProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasActions = actions.length > 0;

  const handleClick = () => {
    if (hasActions && variant === 'speed-dial') {
      setIsOpen(!isOpen);
    } else {
      onClick?.();
    }
  };

  if (variant === 'extended') {
    return (
      <motion.button
        className={cn(
          'fixed z-50 flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground shadow-lg font-medium',
          positionClasses[position],
          className
        )}
        onClick={onClick}
        whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {icon}
        {label && <span>{label}</span>}
      </motion.button>
    );
  }

  if (variant === 'speed-dial') {
    return (
      <div className={cn('fixed z-50', positionClasses[position], className)}>
        {/* Action buttons */}
        <AnimatePresence>
          {isOpen && (
            <div className="absolute bottom-16 right-0 flex flex-col gap-3 items-end">
              {actions.map((action, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.8 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <motion.span
                    className="px-3 py-1.5 rounded-lg bg-card text-sm font-medium shadow-md whitespace-nowrap"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 + 0.1 }}
                  >
                    {action.label}
                  </motion.span>
                  <motion.button
                    className="w-12 h-12 rounded-full bg-card text-foreground shadow-lg flex items-center justify-center hover:bg-muted transition-colors"
                    onClick={() => {
                      action.onClick();
                      setIsOpen(false);
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    style={action.color ? { backgroundColor: action.color, color: 'white' } : undefined}
                  >
                    {action.icon}
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Main FAB */}
        <motion.button
          className="w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center"
          onClick={handleClick}
          whileHover={{ scale: 1.1, boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}
          whileTap={{ scale: 0.9 }}
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {isOpen ? <X className="w-6 h-6" /> : icon}
        </motion.button>
      </div>
    );
  }

  // Default variant
  return (
    <motion.button
      className={cn(
        'fixed z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center',
        positionClasses[position],
        className
      )}
      onClick={handleClick}
      whileHover={{ 
        scale: 1.1, 
        boxShadow: '0 15px 40px rgba(0,0,0,0.25)',
        rotate: 90,
      }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {icon}
    </motion.button>
  );
}

// ============= Expandable FAB Menu =============
interface ExpandableFABProps {
  items: {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
  }[];
  position?: 'bottom-right' | 'bottom-left';
  className?: string;
}

export function ExpandableFAB({ 
  items, 
  position = 'bottom-right',
  className 
}: ExpandableFABProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      className={cn(
        'fixed z-50 bottom-6',
        position === 'bottom-right' ? 'right-6' : 'left-6',
        className
      )}
      initial={false}
      animate={{ width: isExpanded ? 'auto' : 56 }}
    >
      <motion.div
        className="flex items-center gap-2 bg-primary rounded-full shadow-lg overflow-hidden p-2"
        layout
      >
        {/* Main button */}
        <motion.button
          className="w-10 h-10 flex items-center justify-center text-primary-foreground shrink-0"
          onClick={() => setIsExpanded(!isExpanded)}
          whileTap={{ scale: 0.9 }}
        >
          <motion.div animate={{ rotate: isExpanded ? 45 : 0 }}>
            <Plus className="w-6 h-6" />
          </motion.div>
        </motion.button>

        {/* Expanded items */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="flex items-center gap-1 pr-2"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
            >
              {items.map((item, index) => (
                <motion.button
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 rounded-full text-primary-foreground hover:bg-primary-foreground/20 transition-colors whitespace-nowrap"
                  onClick={() => {
                    item.onClick();
                    setIsExpanded(false);
                  }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.icon}
                  <span className="text-sm font-medium">{item.label}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

// ============= Morphing FAB =============
interface MorphingFABProps {
  icon: React.ReactNode;
  expandedContent: React.ReactNode;
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  className?: string;
}

export function MorphingFAB({
  icon,
  expandedContent,
  position = 'bottom-right',
  className,
}: MorphingFABProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      className={cn(
        'fixed z-50',
        positionClasses[position],
        className
      )}
      layout
    >
      <motion.div
        className="bg-primary text-primary-foreground shadow-xl overflow-hidden"
        layout
        animate={{
          borderRadius: isExpanded ? 16 : 28,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div
              key="expanded"
              className="p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex justify-end mb-3">
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1 hover:bg-primary-foreground/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {expandedContent}
            </motion.div>
          ) : (
            <motion.button
              key="collapsed"
              className="w-14 h-14 flex items-center justify-center"
              onClick={() => setIsExpanded(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {icon}
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
