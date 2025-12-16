import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreVertical, Folder, Cpu, Bot, Edit, Trash2, ExternalLink } from 'lucide-react';
import { ProjectCategory, ProjectStatus, type Project } from '@/types/project.types';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';

interface ProjectCardProps {
    project: Project;
    onDelete: (id: string) => void;
}

const MotionCard = motion(Card);

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onDelete }) => {
    const getCategoryIcon = (category: ProjectCategory) => {
        switch (category) {
            case ProjectCategory.SOFTWARE:
                return <Cpu className="w-5 h-5 text-blue-400" />;
            case ProjectCategory.AGENTS:
                return <Bot className="w-5 h-5 text-purple-400" />;
            case ProjectCategory.AUTOMATION:
                return <Folder className="w-5 h-5 text-green-400" />; // Or another icon
            default:
                return <Folder className="w-5 h-5 text-gray-400" />;
        }
    };

    const getStatusColor = (status: ProjectStatus) => {
        switch (status) {
            case ProjectStatus.COMPLETED:
                return 'bg-green-500/10 text-green-400 border-green-500/20';
            case ProjectStatus.IN_PROGRESS:
                return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case ProjectStatus.REVIEW:
                return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
            default:
                return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
        }
    };


    return (
        <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="group relative overflow-hidden bg-black/40 border-white/10 hover:border-white/20 transition-colors hover:shadow-2xl hover:shadow-primary/5"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/5 border border-white/5 group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors duration-300">
                        {getCategoryIcon(project.category)}
                    </div>
                    <div className="flex flex-col gap-1">
                        <CardTitle className="text-lg font-medium leading-none tracking-tight text-white group-hover:text-primary transition-colors">
                            {project.name}
                        </CardTitle>
                        <span className="text-xs text-muted-foreground">
                            Atualizado em {formatDistanceToNow(new Date(project.created_at || new Date()), { addSuffix: true, locale: ptBR })}
                        </span>
                    </div>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px] bg-black/90 border-white/10 text-white backdrop-blur-xl">
                        <DropdownMenuItem className="cursor-pointer hover:bg-white/10 focus:bg-white/10">
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-900/20 focus:bg-red-900/20"
                            onClick={() => onDelete(project.id)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>

            <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                    {project.description || "Sem descrição..."}
                </p>

                <div className="mt-4 flex items-center justify-between">
                    <Badge variant="outline" className={`capitalize ${getStatusColor(project.status)}`}>
                        {project.status.replace('_', ' ')}
                    </Badge>

                    <div className="flex -space-x-2">
                        {/* Avatars placeholder if we had collaborators */}
                    </div>
                </div>
            </CardContent>

            <CardFooter className="pt-2">
                <Link to={`/software/${project.id}`} className="w-full">
                    <Button className="w-full bg-white/5 border border-white/10 hover:bg-white/10 hover:text-primary transition-all group-hover:border-primary/50">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Abrir Projeto
                    </Button>
                </Link>
            </CardFooter>
        </MotionCard>
    );
};
