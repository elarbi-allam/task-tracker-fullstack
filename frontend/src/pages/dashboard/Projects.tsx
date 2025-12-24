import React, { useState, useEffect, useCallback } from 'react';
import { projectService } from '@/services/project.service';
import { Project, Page, CreateProjectRequest } from '@/types';
import { ProjectCard } from '@/components/shared/ProjectCard';
import { Pagination } from '@/components/shared/Pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Plus, FolderKanban, Loader2 } from 'lucide-react';
import { AxiosError } from 'axios';
import { ApiError } from '@/types';

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Page<Project> | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateProjectRequest>({
    title: '',
    description: '',
  });
  const { toast } = useToast();

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await projectService.getAll(currentPage, 6);
      setProjects(data);
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      toast({
        title: 'Erreur',
        description: axiosError.response?.data?.message || 'Impossible de charger les projets',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, toast]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleOpenDialog = (project?: Project) => {
    if (project) {
      setSelectedProject(project);
      setFormData({ title: project.title, description: project.description });
    } else {
      setSelectedProject(null);
      setFormData({ title: '', description: '' });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedProject(null);
    setFormData({ title: '', description: '' });
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      toast({
        title: 'Erreur',
        description: 'Le titre est requis',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (selectedProject) {
        await projectService.update(selectedProject.id, formData);
        toast({
          title: 'Succès',
          description: 'Projet mis à jour avec succès',
        });
      } else {
        await projectService.create(formData);
        toast({
          title: 'Succès',
          description: 'Projet créé avec succès',
        });
      }
      handleCloseDialog();
      fetchProjects();
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      toast({
        title: 'Erreur',
        description: axiosError.response?.data?.message || 'Une erreur est survenue',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (project: Project) => {
    setSelectedProject(project);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProject) return;

    try {
      await projectService.delete(selectedProject.id);
      toast({
        title: 'Succès',
        description: 'Projet supprimé avec succès',
      });
      setIsDeleteDialogOpen(false);
      setSelectedProject(null);
      fetchProjects();
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      toast({
        title: 'Erreur',
        description: axiosError.response?.data?.message || 'Impossible de supprimer le projet',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mes Projets</h1>
          <p className="text-muted-foreground mt-1">
            Gérez vos projets et suivez leur progression
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus className="h-4 w-4" />
          Nouveau projet
        </Button>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full rounded-lg" />
            </div>
          ))}
        </div>
      ) : projects?.content.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="p-4 bg-muted rounded-full mb-4">
            <FolderKanban className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-1">Aucun projet</h3>
          <p className="text-muted-foreground mb-4">
            Créez votre premier projet pour commencer
          </p>
          <Button onClick={() => handleOpenDialog()} className="gap-2">
            <Plus className="h-4 w-4" />
            Créer un projet
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects?.content.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={handleOpenDialog}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
          {projects && (
            <Pagination
              currentPage={currentPage}
              totalPages={projects.totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedProject ? 'Modifier le projet' : 'Nouveau projet'}
            </DialogTitle>
            <DialogDescription>
              {selectedProject
                ? 'Modifiez les informations de votre projet'
                : 'Créez un nouveau projet pour organiser vos tâches'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                placeholder="Mon nouveau projet"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Description du projet..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Annuler
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {selectedProject ? 'Mise à jour...' : 'Création...'}
                </>
              ) : selectedProject ? (
                'Mettre à jour'
              ) : (
                'Créer'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le projet ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Toutes les tâches associées seront également supprimées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Projects;
