import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProjectCategory } from '@/types/project.types';

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Nome deve ter pelo menos 2 caracteres.",
    }),
    description: z.string().optional(),
    category: z.nativeEnum(ProjectCategory, {
        errorMap: () => ({ message: "Selecione uma categoria." }),
    }),
});

interface CreateProjectModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: z.infer<typeof formSchema>) => Promise<void>;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ open, onOpenChange, onSubmit }) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            category: ProjectCategory.SOFTWARE,
        },
    });

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        await onSubmit(values);
        form.reset();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] bg-zinc-950 border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                        Novo Projeto
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Crie um novo projeto para começar a arquitetar sua ideia.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 pt-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-zinc-300">Nome do Projeto</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ex: Neural Architect SaaS" {...field} className="bg-white/5 border-white/10 focus:border-primary/50 text-white" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-zinc-300">Vertical</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value as string}>
                                        <FormControl>
                                            <SelectTrigger className="bg-white/5 border-white/10 focus:border-primary/50 text-white">
                                                <SelectValue placeholder="Selecione a vertical" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-zinc-900 border-white/10 text-white">
                                            <SelectItem value={ProjectCategory.SOFTWARE}>Software / SaaS</SelectItem>
                                            <SelectItem value={ProjectCategory.AGENTS}>Multi-Agents IA</SelectItem>
                                            <SelectItem value={ProjectCategory.AUTOMATION}>Automação Comercial</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-zinc-300">Descrição (Opcional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Descreva brevemente o objetivo..."
                                            className="resize-none bg-white/5 border-white/10 focus:border-primary/50 text-white min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="hover:bg-white/10 text-zinc-400 hover:text-white">
                                Cancelar
                            </Button>
                            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                Criar Projeto
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
