import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectService } from '@/services/project.service';
import { taskService } from '@/services/task.service';
import { Project, Task, Page, TaskStatus, CreateTaskRequest } from '@/types';
import { TaskItem } from '@/components/shared/TaskItem';
import { Pagination } from '@/components/shared/Pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  Plus,
  ListTodo,
  CheckCircle2,
  Calendar,
  Filter,
  Loader2,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AxiosError } from 'axios';
import { ApiError } from '@/types';

type FilterStatus = TaskStatus | 'ALL';

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Page<Task> | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [isTasksLoading, setIsTasksLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateTaskRequest>({
    title: '',
    description: '',
    dueDate: '',
  });

  const projectId = parseInt(id || '0', 10);

  const fetchProject = useCallback(async () => {
    try {
      const data = await projectService.getById(projectId);
      setProject(data);
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      toast({
        title: 'Erreur',
        description: axiosError.response?.data?.message || 'Projet introuvable',
        variant: 'destructive',
      });
      navigate('/projects');
    } finally {
      setIsLoading(false);
    }
  }, [projectId, navigate, toast]);

  const fetchTasks = useCallback(async () => {
    setIsTasksLoading(true);
    try {
      const status = statusFilter === 'ALL' ? undefined : statusFilter;
      const data = await taskService.getByProject(projectId, currentPage, 5, status);
      setTasks(data);
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      toast({
        title: 'Erreur',
        description: axiosError.response?.data?.message || 'Impossible de charger les tâches',
        variant: 'destructive',
      });
    } finally {
      setIsTasksLoading(false);
    }
  }, [projectId, currentPage, statusFilter, toast]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  useEffect(() => {
    if (project) {
      fetchTasks();
    }
  }, [project, fetchTasks]);

  const handleStatusChange = async (taskId: number, status: TaskStatus) => {
    try {
      await taskService.update(taskId, { status });
      toast({
        title: 'Succès',
        description: 'Statut mis à jour',
      });
      fetchTasks();
      fetchProject();
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      toast({
        title: 'Erreur',
        description: axiosError.response?.data?.message || 'Impossible de modifier le statut',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await taskService.delete(taskId);
      toast({
        title: 'Succès',
        description: 'Tâche supprimée',
      });
      fetchTasks();
      fetchProject();
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      toast({
        title: 'Erreur',
        description: axiosError.response?.data?.message || 'Impossible de supprimer la tâche',
        variant: 'destructive',
      });
    }
  };

  const handleCreateTask = async () => {
    if (!formData.title.trim() || !formData.dueDate) {
      toast({
        title: 'Erreur',
        description: 'Le titre et la date sont requis',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await taskService.create(projectId, formData);
      toast({
        title: 'Succès',
        description: 'Tâche créée avec succès',
      });
      setIsDialogOpen(false);
      setFormData({ title: '', description: '', dueDate: '' });
      fetchTasks();
      fetchProject();
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      toast({
        title: 'Erreur',
        description: axiosError.response?.data?.message || 'Impossible de créer la tâche',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate('/projects')}
        className="gap-2 -ml-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux projets
      </Button>

      {/* Project Header */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-card">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">{project.title}</h1>
            <p className="text-muted-foreground">{project.description}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>Créé le {format(new Date(project.createdAt), 'dd MMMM yyyy', { locale: fr })}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3 min-w-[200px]">
            <Badge variant="outline" className="text-lg px-4 py-1">
              {Math.round(project.progressPercentage)}%
            </Badge>
            <Progress value={project.progressPercentage} className="h-2 w-full" />
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <ListTodo className="h-4 w-4" />
                <span>{project.totalTasks} tâches</span>
              </div>
              <div className="flex items-center gap-1.5 text-success">
                <CheckCircle2 className="h-4 w-4" />
                <span>{project.completedTasks} terminées</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl font-semibold text-foreground">Tâches</h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value as FilterStatus);
                  setCurrentPage(0);
                }}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Toutes</SelectItem>
                  <SelectItem value="PENDING">En attente</SelectItem>
                  <SelectItem value="IN_PROGRESS">En cours</SelectItem>
                  <SelectItem value="COMPLETED">Terminées</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Nouvelle tâche
            </Button>
          </div>
        </div>

        {isTasksLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        ) : tasks?.content.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-border rounded-xl">
            <div className="p-3 bg-muted rounded-full mb-3">
              <ListTodo className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-foreground mb-1">Aucune tâche</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {statusFilter !== 'ALL'
                ? 'Aucune tâche avec ce statut'
                : 'Ajoutez votre première tâche'}
            </p>
            {statusFilter === 'ALL' && (
              <Button onClick={() => setIsDialogOpen(true)} variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Ajouter une tâche
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {tasks?.content.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
            {tasks && (
              <Pagination
                currentPage={currentPage}
                totalPages={tasks.totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>

      {/* Create Task Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvelle tâche</DialogTitle>
            <DialogDescription>
              Ajoutez une nouvelle tâche à ce projet
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="task-title">Titre</Label>
              <Input
                id="task-title"
                placeholder="Titre de la tâche"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-description">Description</Label>
              <Textarea
                id="task-description"
                placeholder="Description de la tâche..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-dueDate">Date d'échéance</Label>
              <Input
                id="task-dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateTask} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création...
                </>
              ) : (
                'Créer'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectDetails;
