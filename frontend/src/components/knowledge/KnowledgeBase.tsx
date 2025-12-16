import { useState, useMemo } from 'react';
import { useKnowledge, useArticle } from '@/hooks/useKnowledge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Search, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Markdown from 'react-markdown';
import type { Article, CategoryGroup } from '@/types/knowledge.types';

export function KnowledgeBase() {
    const { data: articles, isLoading } = useKnowledge();
    const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const { data: selectedArticle } = useArticle(selectedArticleId || '');

    // Group articles by category
    const categories: CategoryGroup[] = useMemo(() => {
        if (!articles) return [];

        const groups: Record<string, Article[]> = {};

        articles.forEach(article => {
            const cat = article.category || 'Uncategorized';
            if (!groups[cat]) {
                groups[cat] = [];
            }
            groups[cat].push(article);
        });

        return Object.entries(groups).map(([title, items]) => ({
            id: title,
            title: title.charAt(0).toUpperCase() + title.slice(1),
            articles: items
        }));
    }, [articles]);

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground">Loading knowledge base...</div>;
    }

    return (
        <div className="h-full flex gap-4 p-4">
            <div className="w-1/3 flex flex-col gap-4">
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search methodology..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <ScrollArea className="flex-1 border rounded-lg p-2 bg-card">
                    {categories?.map((cat) => (
                        <div key={cat.id} className="mb-6">
                            <h3 className="font-semibold px-2 mb-2 text-primary flex items-center gap-2">
                                <BookOpen className="h-4 w-4" />
                                {cat.title}
                            </h3>
                            <div className="space-y-1">
                                {cat.articles.map((article) => (
                                    <button
                                        key={article.id}
                                        onClick={() => setSelectedArticleId(article.id)}
                                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between group
                                           ${selectedArticleId === article.id
                                                ? 'bg-primary/10 text-primary'
                                                : 'hover:bg-muted text-muted-foreground'}`}
                                    >
                                        <span>{article.title}</span>
                                        <ChevronRight className={`h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity ${selectedArticleId === article.id ? 'opacity-100' : ''}`} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </ScrollArea>
            </div>

            <div className="flex-1 border rounded-lg bg-card overflow-hidden flex flex-col">
                {selectedArticle ? (
                    <ScrollArea className="h-full">
                        <div className="p-8 max-w-3xl mx-auto">
                            <div className="mb-6 border-b pb-4">
                                <div className="flex gap-2 mb-4">
                                    <Badge variant="outline">{selectedArticle.category}</Badge>
                                    {selectedArticle.tags && typeof selectedArticle.tags === 'string' && selectedArticle.tags.split(',').map(tag => (
                                        <Badge key={tag} variant="secondary" className="text-xs">#{tag.trim()}</Badge>
                                    ))}
                                </div>
                                <h1 className="text-3xl font-bold mb-2">{selectedArticle.title}</h1>
                                <div className="text-sm text-muted-foreground">
                                    Last updated: {new Date(selectedArticle.updated_at).toLocaleDateString()}
                                </div>
                            </div>
                            <div className="prose prose-invert max-w-none">
                                <Markdown>{selectedArticle.content}</Markdown>
                            </div>
                        </div>
                    </ScrollArea>
                ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                        <div className="text-center">
                            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>Select an article to start reading</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
