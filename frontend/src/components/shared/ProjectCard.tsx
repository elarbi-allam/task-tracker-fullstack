import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Project } from '@/types';
import { Calendar, CheckCircle2, ListTodo, Trash2, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();

  const getProgressColor = (percentage: number) => {
    if (percentage === 100) return 'bg-success';
    if (percentage >= 50) return 'bg-warning';
    return 'bg-primary';
  };

  return (
    <Card 
      className="group hover:shadow-card-hover transition-all duration-300 cursor-pointer border-border/50 hover:border-primary/30"
      onClick={() => navigate(`/projects/${project.id}`)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {project.title}
          </CardTitle>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(project);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(project);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {project.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(project.createdAt), 'dd MMM yyyy', { locale: fr })}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <ListTodo className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{project.totalTasks} tâches</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span className="text-success">{project.completedTasks} terminées</span>
              </div>
            </div>
            <Badge variant="secondary" className="font-medium">
              {Math.round(project.progressPercentage)}%
            </Badge>
          </div>
          <Progress 
            value={project.progressPercentage} 
            className="h-2"
          />
        </div>
      </CardContent>
    </Card>
  );
};
