import { useState } from 'react';
import { motion } from 'framer-motion';
import { useProjects } from '@/hooks/useProjects';
import { ProjectCard } from '@/components/dashboard/ProjectCard';
import { CreateProjectModal } from '@/components/dashboard/CreateProjectModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import type { ProjectCreate } from '@/types/project.types';

export default function DashboardPage() {
    const { projects, isLoading, isError, createProject, deleteProject } = useProjects();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const handleCreateProject = async (data: ProjectCreate) => {
        try {
            await createProject.mutateAsync(data);
            toast.success("Projeto criado com sucesso!");
        } catch {
            toast.error("Erro ao criar projeto.");
        }
    };

    const handleDeleteProject = async (id: string) => {
        try {
            await deleteProject.mutateAsync(id);
            toast.success("Projeto excluído.");
        } catch {
            toast.error("Erro ao excluir projeto.");
        }
    };

    if (isError) {
        return <div className="p-8 text-center text-red-400">Erro ao carregar projetos. Verifique sua conexão.</div>;
    }

    return (
        <div className="container mx-auto py-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                        Meus Projetos
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Gerencie seus projetos e arquiteturas.
                    </p>
                </div>
                <Button onClick={() => setIsCreateModalOpen(true)} className="bg-primary hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" /> Novo Projeto
                </Button>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-[200px] w-full rounded-xl bg-white/5" />
                    ))}
                </div>
            ) : projects.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center min-h-[400px] border border-dashed border-white/10 rounded-2xl bg-white/5 p-8 text-center"
                >
                    <div className="p-4 rounded-full bg-primary/10 mb-4">
                        <Plus className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Nenhum projeto encontrado</h3>
                    <p className="text-muted-foreground max-w-sm mb-6">
                        Comece criando seu primeiro projeto para arquitetar sua próxima grande ideia.
                    </p>
                    <Button onClick={() => setIsCreateModalOpen(true)} variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
                        Criar Primeiro Projeto
                    </Button>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ staggerChildren: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {projects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            onDelete={handleDeleteProject}
                        />
                    ))}
                </motion.div>
            )}

            <CreateProjectModal
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
                onSubmit={handleCreateProject}
            />
        </div>
    );
}
