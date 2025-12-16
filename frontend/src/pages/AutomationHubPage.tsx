import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button, Input } from '@/components/ui';

/**
 * Automation Hub page for commercial automation projects
 */
export function AutomationHubPage() {
    const [search, setSearch] = useState('');

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Automação</h1>
                    <p className="text-gray-600 mt-1">
                        Fluxos de atendimento automatizado para vendas e suporte
                    </p>
                </div>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Projeto
                </Button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    placeholder="Buscar projetos..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Empty State */}
            <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl">
                <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                    <Plus className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Nenhum projeto ainda
                </h3>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                    Crie fluxos de atendimento para SDR, Closer ou Suporte com design
                    conversacional guiado.
                </p>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeiro Projeto
                </Button>
            </div>
        </div>
    );
}
