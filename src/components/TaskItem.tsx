import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { Task } from '@/types';

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

export const TaskItem = ({ task, onToggle, onDelete }: TaskItemProps) => {
  return (
    <motion.div
      className="flex items-center gap-3 p-3 bg-secondary rounded-md border border-border group hover:bg-accent transition-colors"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5, scale: 0.98 }}
      transition={{ duration: 0.15 }}
    >
      <motion.button
        onClick={() => onToggle(task.id)}
        className={`
          w-4 h-4 rounded-sm border flex items-center justify-center transition-all duration-200
          ${task.completed 
            ? 'bg-primary border-primary text-primary-foreground' 
            : 'border-muted-foreground hover:border-foreground'
          }
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence>
          {task.completed && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Check className="w-3 h-3" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <motion.span
        className={`
          flex-1 text-sm transition-all duration-200
          ${task.completed 
            ? 'text-muted-foreground line-through opacity-50' 
            : 'text-foreground'
          }
        `}
        animate={{
          opacity: task.completed ? 0.5 : 1,
        }}
      >
        {task.text}
      </motion.span>

      <motion.button
        onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-60 text-muted-foreground hover:text-destructive transition-all duration-200 p-1 hover:bg-destructive/10 rounded"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <X className="w-3 h-3" />
      </motion.button>
    </motion.div>
  );
};