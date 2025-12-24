import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Task, TaskStatus } from '@/types';
import { Calendar, MoreVertical, Trash2, Clock, CheckCircle2, Circle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface TaskItemProps {
  task: Task;
  onStatusChange: (taskId: number, status: TaskStatus) => void;
  onDelete: (taskId: number) => void;
}

const statusConfig: Record<TaskStatus, { label: string; variant: 'default' | 'secondary' | 'success'; icon: React.ElementType }> = {
  PENDING: { label: 'En attente', variant: 'secondary', icon: Circle },
  IN_PROGRESS: { label: 'En cours', variant: 'default', icon: Clock },
  COMPLETED: { label: 'Terminée', variant: 'success', icon: CheckCircle2 },
};

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onStatusChange,
  onDelete,
}) => {
  const config = statusConfig[task.status];
  const StatusIcon = config.icon;

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED';

  return (
    <Card className="p-4 hover:shadow-card-hover transition-all duration-200 border-border/50">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <button
            onClick={() => {
              const nextStatus: Record<TaskStatus, TaskStatus> = {
                PENDING: 'IN_PROGRESS',
                IN_PROGRESS: 'COMPLETED',
                COMPLETED: 'PENDING',
              };
              onStatusChange(task.id, nextStatus[task.status]);
            }}
            className="mt-0.5 flex-shrink-0"
          >
            <StatusIcon 
              className={`h-5 w-5 transition-colors ${
                task.status === 'COMPLETED' 
                  ? 'text-success' 
                  : task.status === 'IN_PROGRESS'
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            />
          </button>
          <div className="flex-1 min-w-0">
            <h4 className={`font-medium text-foreground line-clamp-1 ${
              task.status === 'COMPLETED' ? 'line-through text-muted-foreground' : ''
            }`}>
              {task.title}
            </h4>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {task.description}
            </p>
            <div className="flex items-center gap-3 mt-2">
              <div className={`flex items-center gap-1.5 text-sm ${
                isOverdue ? 'text-destructive' : 'text-muted-foreground'
              }`}>
                <Calendar className="h-3.5 w-3.5" />
                <span>{format(new Date(task.dueDate), 'dd MMM yyyy', { locale: fr })}</span>
              </div>
              <Badge variant={config.variant} className="text-xs">
                {config.label}
              </Badge>
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onStatusChange(task.id, 'PENDING')}>
              <Circle className="h-4 w-4 mr-2" />
              En attente
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange(task.id, 'IN_PROGRESS')}>
              <Clock className="h-4 w-4 mr-2" />
              En cours
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange(task.id, 'COMPLETED')}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Terminée
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(task.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
};
