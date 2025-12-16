import { Link } from 'react-router-dom';
import { Monitor, Bot, Phone, ArrowRight, Sparkles } from 'lucide-react';
import { Card, CardContent, Button } from '@/components/ui';

const categories = [
    {
        id: 'software',
        label: 'Software / SaaS',
        description: 'Web apps, APIs, dashboards e mais',
        icon: Monitor,
        color: 'indigo',
        gradient: 'from-indigo-500 to-indigo-600',
        path: '/software',
    },
    {
        id: 'agents',
        label: 'Multi-Agents IA',
        description: 'Sistemas de agentes inteligentes',
        icon: Bot,
        color: 'violet',
        gradient: 'from-violet-500 to-violet-600',
        path: '/agents',
    },
    {
        id: 'automation',
        label: 'Automação',
        description: 'SDR, Closer, Suporte automatizado',
        icon: Phone,
        color: 'emerald',
        gradient: 'from-emerald-500 to-emerald-600',
        path: '/automation',
    },
];

/**
 * Dashboard page with category selection and welcome message
 */
export function DashboardPage() {
    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Hero Section */}
            <div className="text-center py-8">
                <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                    <Sparkles className="h-4 w-4" />
                    Seu Exoesqueleto Cognitivo
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Bem-vindo ao Neural Architect
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Da ideia à especificação técnica. Escolha uma categoria para começar
                    a construir seu próximo projeto.
                </p>
            </div>

            {/* Category Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                        <Link key={category.id} to={category.path}>
                            <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-indigo-100 h-full">
                                <CardContent className="p-6 space-y-4">
                                    <div
                                        className={`w-14 h-14 bg-gradient-to-br ${category.gradient} rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}
                                    >
                                        <Icon className="h-7 w-7 text-white" />
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            {category.label}
                                        </h3>
                                        <p className="text-gray-600">{category.description}</p>
                                    </div>

                                    <div className="flex items-center text-indigo-600 font-medium group-hover:gap-2 transition-all">
                                        Explorar
                                        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-indigo-50 to-violet-50 rounded-2xl p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Precisa de ajuda para começar?
                        </h2>
                        <p className="text-gray-600">
                            O Partner Thinking vai te guiar em cada etapa do processo.
                        </p>
                    </div>
                    <Button size="lg" className="shrink-0">
                        <Sparkles className="h-5 w-5 mr-2" />
                        Iniciar com IA
                    </Button>
                </div>
            </div>
        </div>
    );
}
