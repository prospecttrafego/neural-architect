## PARTE 4: PARTNER THINKING (AI ASSISTANT)

### 10 Arquitetura do Partner Thinking

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       PARTNER THINKING ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  USER INPUT                                                                 │
│      │                                                                      │
│      ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    FASTAPI ENDPOINT                                  │   │
│  │                    POST /api/v1/partner/chat                        │   │
│  │                    (SSE Streaming)                                   │   │
│  └──────────────────────────┬──────────────────────────────────────────┘   │
│                             │                                               │
│                             ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    AGNO AGENT                                        │   │
│  │  ┌─────────────────────────────────────────────────────────────┐    │   │
│  │  │  SYSTEM PROMPT (Category-specific)                          │    │   │
│  │  │  - Software: SDLC expertise                                 │    │   │
│  │  │  - Agents: AI/ML expertise                                  │    │   │
│  │  │  - Automation: Conversational design expertise              │    │   │
│  │  └─────────────────────────────────────────────────────────────┘    │   │
│  │                                                                      │   │
│  │  ┌─────────────────────────────────────────────────────────────┐    │   │
│  │  │  TOOLS                                                       │    │   │
│  │  │  ├── analyze_canvas      # Analisa estado do canvas         │    │   │
│  │  │  ├── suggest_flow        # Sugere fluxos/nodes              │    │   │
│  │  │  ├── fetch_documentation # Context7 - docs atualizadas      │    │   │
│  │  │  ├── web_search          # Busca informações atuais         │    │   │
│  │  │  ├── generate_document   # Gera TIS/PRD/Specs               │    │   │
│  │  │  └── update_checklist    # Atualiza progresso               │    │   │
│  │  └─────────────────────────────────────────────────────────────┘    │   │
│  │                                                                      │   │
│  │  ┌─────────────────────────────────────────────────────────────┐    │   │
│  │  │  CONTEXT                                                     │    │   │
│  │  │  ├── Canvas State (nodes, edges)                            │    │   │
│  │  │  ├── Project Info (category, name, description)             │    │   │
│  │  │  ├── Chat History (últimas N mensagens)                     │    │   │
│  │  │  └── Checklist Progress                                     │    │   │
│  │  └─────────────────────────────────────────────────────────────┘    │   │
│  └──────────────────────────┬──────────────────────────────────────────┘   │
│                             │                                               │
│                             ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    SSE STREAM RESPONSE                               │   │
│  │  { type: "start" }                                                   │   │
│  │  { type: "token", content: "..." }                                   │   │
│  │  { type: "tool_call", tool_name: "...", tool_input: {...} }         │   │
│  │  { type: "tool_result", tool_output: "..." }                        │   │
│  │  { type: "end", suggested_actions: [...] }                          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 10.2 Partner Agent (Agno)

# backend/app/ai/partner_agent.py

from typing import Optional, AsyncIterator
from uuid import uuid4

from agno.agent import Agent, RunOutputEvent
from agno.models.anthropic import Claude
from agno.db.postgres import PostgresDb
from agno.knowledge.knowledge import Knowledge
from agno.knowledge.embedder.openai import OpenAIEmbedder
from agno.vectordb.lancedb import LanceDb, SearchType

from app.ai.tools.canvas_tools import (
    analyze_canvas,
    suggest_flow,
    add_nodes_to_canvas,
)
from app.ai.tools.docs_tools import fetch_documentation
from app.ai.tools.generator_tools import generate_tis, generate_prd
from app.ai.prompts.system_prompts import get_system_prompt
from app.core.config import settings


def create_knowledge_base() -> Knowledge:
    """Cria Knowledge Base para RAG de metodologias."""
    return Knowledge(
        vector_db=LanceDb(
            uri="./data/lancedb",
            table_name="neural_architect_knowledge",
            search_type=SearchType.hybrid,
            embedder=OpenAIEmbedder(id="text-embedding-3-small"),
        ),
        max_results=3,
    )


def create_partner_agent(
    project_id: str,
    project_name: str,
    project_description: str,
    project_category: str,  # "software" | "agents" | "automation"
    user_id: str,
    session_id: Optional[str] = None,
) -> Agent:
    """
    Cria uma instância do Partner Thinking Agent.
    
    Agno v2.3+ Features:
    - Memory persistente por usuário
    - Session summaries automáticos
    - Knowledge base com RAG
    - Tools com hooks e cache
    """
    
    # Database para persistência de memória e sessões
    db = PostgresDb(db_url=settings.DATABASE_URL)
    
    # Knowledge base para RAG
    knowledge = create_knowledge_base()
    
    # System prompt específico por categoria
    system_prompt = get_system_prompt(
        category=project_category,
        project_name=project_name,
        project_description=project_description,
    )
    
    agent = Agent(
        # Model
        model=Claude(
            id="claude-sonnet-4-20250514",
            max_tokens=4096,
            cache_system_prompt=True,  # Economiza tokens!
        ),
        
        # Identifiers
        session_id=session_id or str(uuid4()),
        user_id=user_id,
        
        # Instructions
        instructions=system_prompt,
        
        # Tools
        tools=[
            analyze_canvas,
            suggest_flow,
            add_nodes_to_canvas,
            fetch_documentation,
            generate_tis,
            generate_prd,
        ],
        
        # Knowledge (RAG)
        knowledge=knowledge,
        search_knowledge=True,  # Busca automática no knowledge base
        
        # Memory
        db=db,
        enable_user_memories=True,      # Lembra do usuário entre sessões
        enable_session_summaries=True,  # Resume conversas longas
        
        # Output
        markdown=True,
        show_tool_calls=True,
        
        # Context
        additional_context={
            "project_id": project_id,
            "project_category": project_category,
        },
    )
    
    return agent


async def chat_stream(
    agent: Agent,
    message: str,
    canvas_context: Optional[dict] = None,
) -> AsyncIterator[RunOutputEvent]:
    """
    Stream de resposta do Partner Agent.
    
    Yields RunOutputEvent com:
    - event.content: texto gerado
    - event.tool_calls: chamadas de tools
    - event.thinking: reasoning (se habilitado)
    """
    
    # Adiciona contexto do canvas se fornecido
    full_message = message
    if canvas_context:
        canvas_summary = _summarize_canvas(canvas_context)
        full_message = f"""
[Contexto do Canvas Atual]
{canvas_summary}

[Mensagem do Usuário]
{message}
"""
    
    # Stream com Agno v2
    async for event in agent.arun(full_message, stream=True):
        yield event


def _summarize_canvas(canvas: dict) -> str:
    """Resume o canvas para contexto (economiza tokens)."""
    nodes = canvas.get("nodes", [])
    edges = canvas.get("edges", [])
    
    node_summary = []
    for node in nodes[:20]:  # Limita a 20 nodes
        node_type = node.get("type", "unknown")
        label = node.get("data", {}).get("label", "Sem nome")
        node_summary.append(f"- {node_type}: {label}")
    
    return f"""
Nodes ({len(nodes)} total):
{chr(10).join(node_summary)}

Conexões: {len(edges)} edges
"""

### 10.3 Docs_Tools

# backend/app/ai/tools/docs_tools.py

import httpx
from typing import Optional
from agno.tools import tool


CONTEXT7_BASE_URL = "https://context7.com/api"


@tool(
    name="fetch_documentation",
    description="Busca documentação atualizada de uma biblioteca/framework usando Context7",
    cache_results=True,
    cache_ttl=3600,  # 1 hora
)
async def fetch_documentation(
    library_name: str,
    topic: Optional[str] = None,
    version: Optional[str] = None,
) -> str:
    """
    Busca documentação via Context7.
    
    Args:
        library_name: Nome da biblioteca (ex: "react", "fastapi", "agno")
        topic: Tópico específico (ex: "hooks", "routing")
        version: Versão específica (opcional)
        
    Returns:
        Documentação formatada em markdown
    """
    async with httpx.AsyncClient() as client:
        # Resolve library ID
        resolve_response = await client.get(
            f"{CONTEXT7_BASE_URL}/resolve",
            params={"library": library_name},
        )
        
        if resolve_response.status_code != 200:
            return f"Biblioteca '{library_name}' não encontrada no Context7."
        
        library_id = resolve_response.json().get("library_id")
        
        # Fetch docs
        docs_params = {
            "library_id": library_id,
            "mode": "code",  # code examples
        }
        if topic:
            docs_params["topic"] = topic
        if version:
            docs_params["version"] = version
        
        docs_response = await client.get(
            f"{CONTEXT7_BASE_URL}/docs",
            params=docs_params,
        )
        
        if docs_response.status_code != 200:
            return f"Erro ao buscar documentação: {docs_response.status_code}"
        
        docs = docs_response.json()
        
        # Formata resultado
        result = f"## Documentação: {library_name}"
        if topic:
            result += f" ({topic})"
        result += "\n\n"
        
        for snippet in docs.get("snippets", [])[:5]:
            result += f"### {snippet.get('title', 'Exemplo')}\n\n"
            result += f"```{snippet.get('language', 'python')}\n"
            result += snippet.get("code", "")
            result += "\n```\n\n"
        
        return result[:4000]  # Limita tamanho

### 10.4 Canvas Tools

# backend/app/ai/tools/canvas_tools.py

import json
from typing import Dict, List, Any
from agno.tools import tool


@tool(
    name="analyze_canvas",
    description="Analisa o canvas atual e identifica problemas ou oportunidades de melhoria",
    cache_results=True,
    cache_ttl=300,  # 5 minutos
)
def analyze_canvas(canvas_state: Dict[str, Any]) -> str:
    """
    Analisa o estado atual do canvas.
    
    Args:
        canvas_state: Estado do canvas com nodes e edges
        
    Returns:
        Análise textual do canvas
    """
    nodes = canvas_state.get("nodes", [])
    edges = canvas_state.get("edges", [])
    
    # Análise por tipo de node
    node_types = {}
    for node in nodes:
        node_type = node.get("type", "unknown")
        node_types[node_type] = node_types.get(node_type, 0) + 1
    
    # Identifica nodes desconectados
    connected_nodes = set()
    for edge in edges:
        connected_nodes.add(edge.get("source"))
        connected_nodes.add(edge.get("target"))
    
    disconnected = [
        n.get("data", {}).get("label", n.get("id"))
        for n in nodes
        if n.get("id") not in connected_nodes
    ]
    
    # Verifica start/end
    has_start = any(n.get("type") == "start" for n in nodes)
    has_end = any(n.get("type") == "end" for n in nodes)
    
    # Monta análise
    analysis = f"""
## Análise do Canvas

### Composição
- Total de nodes: {len(nodes)}
- Total de conexões: {len(edges)}

### Tipos de Nodes
{json.dumps(node_types, indent=2)}

### Verificações
- ✅ Node de início: {"Presente" if has_start else "❌ AUSENTE"}
- ✅ Node de fim: {"Presente" if has_end else "❌ AUSENTE"}
- Nodes desconectados: {len(disconnected)}
"""
    
    if disconnected:
        analysis += f"\n### ⚠️ Nodes Desconectados\n"
        for name in disconnected[:5]:
            analysis += f"- {name}\n"
    
    return analysis


@tool(
    name="suggest_flow",
    description="Sugere um fluxo completo baseado no tipo de projeto e descrição",
)
def suggest_flow(
    project_type: str,
    description: str,
    category: str = "software",
) -> Dict[str, Any]:
    """
    Sugere estrutura de nodes e edges para um projeto.
    
    Args:
        project_type: Tipo do projeto (api, dashboard, agent, chatbot, etc)
        description: Descrição do que precisa ser construído
        category: Categoria (software, agents, automation)
        
    Returns:
        Dict com nodes e edges sugeridos
    """
    
    # Templates por tipo
    templates = {
        "api": {
            "nodes": [
                {"type": "start", "label": "Request"},
                {"type": "api", "label": "API Gateway"},
                {"type": "service", "label": "Business Logic"},
                {"type": "database", "label": "Database"},
                {"type": "end", "label": "Response"},
            ],
            "flow": "linear",
        },
        "dashboard": {
            "nodes": [
                {"type": "start", "label": "User Access"},
                {"type": "user_interface", "label": "Dashboard UI"},
                {"type": "api", "label": "API Layer"},
                {"type": "service", "label": "Data Service"},
                {"type": "database", "label": "Database"},
                {"type": "cache", "label": "Cache Layer"},
                {"type": "end", "label": "Render"},
            ],
            "flow": "branched",
        },
        "single_agent": {
            "nodes": [
                {"type": "start", "label": "User Input"},
                {"type": "agent", "label": "Main Agent"},
                {"type": "tool", "label": "Tools"},
                {"type": "knowledge", "label": "Knowledge Base"},
                {"type": "end", "label": "Response"},
            ],
            "flow": "linear",
        },
        "multi_agent": {
            "nodes": [
                {"type": "start", "label": "Task Input"},
                {"type": "agent", "label": "Orchestrator"},
                {"type": "agent", "label": "Researcher"},
                {"type": "agent", "label": "Writer"},
                {"type": "tool", "label": "Web Search"},
                {"type": "knowledge", "label": "Knowledge Base"},
                {"type": "human_loop", "label": "Human Review"},
                {"type": "end", "label": "Final Output"},
            ],
            "flow": "parallel",
        },
        "chatbot": {
            "nodes": [
                {"type": "start", "label": "Message Received"},
                {"type": "message", "label": "Parse Intent"},
                {"type": "condition", "label": "Route by Intent"},
                {"type": "action", "label": "Process Action"},
                {"type": "integration", "label": "External API"},
                {"type": "message", "label": "Format Response"},
                {"type": "end", "label": "Send Message"},
            ],
            "flow": "conditional",
        },
    }
    
    template = templates.get(project_type, templates["api"])
    
    # Gera nodes com posições
    nodes = []
    y_offset = 0
    for i, node_data in enumerate(template["nodes"]):
        nodes.append({
            "id": f"node_{i}",
            "type": node_data["type"],
            "position": {"x": 250, "y": y_offset},
            "data": {
                "label": node_data["label"],
                "description": f"Parte do fluxo: {description[:50]}...",
            },
        })
        y_offset += 120
    
    # Gera edges
    edges = []
    for i in range(len(nodes) - 1):
        edges.append({
            "id": f"edge_{i}",
            "source": nodes[i]["id"],
            "target": nodes[i + 1]["id"],
            "type": "smoothstep",
        })
    
    return {
        "nodes": nodes,
        "edges": edges,
        "description": f"Fluxo sugerido para {project_type}: {description}",
    }


@tool(
    name="add_nodes_to_canvas",
    description="Prepara adição de novos nodes ao canvas",
    stop_after_tool_call=False,  # Continua após chamar
)
def add_nodes_to_canvas(
    nodes_to_add: List[Dict[str, Any]],
    edges_to_add: List[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """
    Prepara nodes e edges para serem adicionados ao canvas.
    
    Args:
        nodes_to_add: Lista de nodes para adicionar
        edges_to_add: Lista de edges para conectar (opcional)
        
    Returns:
        Estrutura pronta para o frontend aplicar
    """
    return {
        "action": "add_to_canvas",
        "nodes": nodes_to_add,
        "edges": edges_to_add or [],
    }

### 10.5 System Prompts

# backend/app/ai/prompts/system_prompts.py

def get_system_prompt(
    category: str,
    project_name: str,
    project_description: str,
) -> str:
    """Retorna system prompt específico por categoria."""
    
    base = f"""
Você é o Partner Thinking, um assistente especializado em arquitetura de software e desenvolvimento de projetos.

## Projeto Atual
- Nome: {project_name}
- Descrição: {project_description}
- Categoria: {category}

## Suas Responsabilidades
1. **Guiar** o usuário no design da arquitetura
2. **Ensinar** conceitos e boas práticas
3. **Analisar** o canvas e sugerir melhorias
4. **Responder** dúvidas técnicas com precisão

## Regras Importantes
- SEMPRE use fetch_documentation antes de responder sobre frameworks/bibliotecas
- Seja didático e explique o "porquê" das decisões
- Quando não souber algo, admita e sugira pesquisar
- Mantenha respostas concisas (máx 400 palavras)

## Formato de Resposta
- Use markdown para formatação
- Negrite termos importantes
- Use listas apenas quando necessário (máx 5 itens)
- Inclua exemplos de código quando relevante
"""
    
    category_specific = {
        "software": """
## Expertise em Software
Você é especialista em:
- Arquitetura de sistemas (monolito, microserviços, serverless)
- Frontend (React, Vue, Next.js, Vite)
- Backend (FastAPI, Node.js, Go)
- Databases (PostgreSQL, Redis, MongoDB)
- DevOps (Docker, Kubernetes, CI/CD)
- Design Patterns (SOLID, Clean Architecture, DDD)

Priorize:
- Escalabilidade e manutenibilidade
- Separação de responsabilidades
- APIs RESTful bem documentadas
""",
        "agents": """
## Expertise em Agentes IA
Você é especialista em:
- Frameworks de agentes (Agno, CrewAI, LangChain, Pydantic AI)
- Prompt Engineering avançado
- Tool Calling e Function Calling
- RAG (Retrieval Augmented Generation)
- Orquestração multi-agente
- Memory e session management

Priorize:
- Agno v2.3+ como framework principal
- Claude claude-sonnet-4-20250514 como modelo default
- PgVector ou LanceDB para knowledge base
- Tools bem definidas com docstrings claras
""",
        "automation": """
## Expertise em Automação
Você é especialista em:
- Design conversacional
- Chatbots (WhatsApp, Telegram, Slack)
- Integração com CRMs
- Fluxos de vendas e suporte
- Handoff humano inteligente
- NLU e classificação de intents

Priorize:
- Experiência do usuário (UX conversacional)
- Fallbacks e tratamento de erros
- Métricas e analytics
- Escalabilidade de atendimento
""",
    }
    
    return base + category_specific.get(category, category_specific["software"])

### 10.6 Partner API Endpoint (FastAPI)

# backend/app/api/v1/endpoints/partner.py

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional
import json

from app.ai.partner_agent import create_partner_agent, chat_stream
from app.api.deps import get_current_user, get_db
from app.models.user import User
from app.crud import projects as crud_projects

router = APIRouter()


class SendMessageRequest(BaseModel):
    content: str
    canvas_context: Optional[dict] = None


@router.post("/projects/{project_id}/chat")
async def chat_with_partner(
    project_id: str,
    request: SendMessageRequest,
    current_user: User = Depends(get_current_user),
    db = Depends(get_db),
):
    """
    Chat com o Partner Thinking via SSE.
    
    Retorna Server-Sent Events com:
    - event: token (texto gerado)
    - event: tool_call (chamada de ferramenta)
    - event: tool_result (resultado da ferramenta)
    - event: end (fim do stream)
    """
    # Busca projeto
    project = await crud_projects.get(db, id=project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Projeto não encontrado")
    
    # Cria agent
    agent = create_partner_agent(
        project_id=project_id,
        project_name=project.name,
        project_description=project.description or "",
        project_category=project.category,
        user_id=str(current_user.id),
        session_id=f"project_{project_id}",
    )
    
    async def event_generator():
        try:
            async for event in chat_stream(
                agent=agent,
                message=request.content,
                canvas_context=request.canvas_context,
            ):
                # Formata como SSE
                if event.content:
                    yield f"event: token\ndata: {json.dumps({'content': event.content})}\n\n"
                
                if event.tool_calls:
                    for tool_call in event.tool_calls:
                        yield f"event: tool_call\ndata: {json.dumps({'name': tool_call.name, 'args': tool_call.arguments})}\n\n"
                
                if event.tool_results:
                    for result in event.tool_results:
                        yield f"event: tool_result\ndata: {json.dumps({'name': result.tool_name, 'result': str(result.content)[:500]})}\n\n"
            
            yield f"event: end\ndata: {json.dumps({'status': 'complete'})}\n\n"
            
        except Exception as e:
            yield f"event: error\ndata: {json.dumps({'error': str(e)})}\n\n"
    
    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        },
    )

### 10.7 Partner Chat Component (Frontend)

```tsx
// frontend/src/components/partner/PartnerChat.tsx
import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Loader2, Sparkles, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from './ChatMessage';
import { SuggestedActions } from './SuggestedActions';
import { StreamingIndicator } from './StreamingIndicator';
import { usePartnerChat } from '@/hooks/usePartnerChat';
import { useCanvasStore } from '@/stores/useCanvasStore';
import type { ChatMessage as ChatMessageType } from '@/schemas';

interface PartnerChatProps {
  projectId: string;
}

export function PartnerChat({ projectId }: PartnerChatProps) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  const { nodes, edges } = useCanvasStore();
  
  const {
    messages,
    isStreaming,
    streamingContent,
    suggestedActions,
    sendMessage,
  } = usePartnerChat(projectId);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingContent]);

  // Handle send
  const handleSend = useCallback(async () => {
    if (!input.trim() || isStreaming) return;
    
    const message = input.trim();
    setInput('');
    
    await sendMessage(message, { nodes, edges });
    
    // Focus input after send
    inputRef.current?.focus();
  }, [input, isStreaming, sendMessage, nodes, edges]);

  // Handle key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Handle suggested action click
  const handleActionClick = (action: string, params?: Record<string, unknown>) => {
    // Execute action or send as message
    const actionMessages: Record<string, string> = {
      suggest_flow: 'Sugira um fluxo inicial para meu projeto',
      generate_document: 'Gere a documentação TIS para este projeto',
      explain_next_step: 'Qual deve ser meu próximo passo?',
    };
    
    const message = actionMessages[action] || action;
    setInput(message);
    handleSend();
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200">
        <Sparkles className="h-5 w-5 text-indigo-500" />
        <h3 className="font-semibold text-gray-900">Partner Thinking</h3>
        {isStreaming && (
          <span className="text-xs text-gray-500 ml-auto">pensando...</span>
        )}
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <Sparkles className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              Olá! Sou seu assistente de desenvolvimento.
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Pergunte qualquer coisa sobre seu projeto!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            
            {/* Streaming message */}
            {isStreaming && streamingContent && (
              <ChatMessage
                message={{
                  id: 'streaming',
                  role: 'assistant',
                  content: streamingContent,
                  createdAt: new Date().toISOString(),
                } as ChatMessageType}
                isStreaming
              />
            )}
            
            {/* Streaming indicator */}
            {isStreaming && !streamingContent && (
              <StreamingIndicator />
            )}
          </div>
        )}
      </ScrollArea>

      {/* Suggested Actions */}
      {suggestedActions.length > 0 && !isStreaming && (
        <div className="px-4 py-2 border-t border-gray-100">
          <SuggestedActions
            actions={suggestedActions}
            onActionClick={handleActionClick}
          />
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua mensagem..."
            className="min-h-[44px] max-h-[120px] resize-none"
            disabled={isStreaming}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            size="icon"
            className="h-11 w-11"
          >
            {isStreaming ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
```

### 10.8 Partner Chat Hook

```typescript
// frontend/src/hooks/usePartnerChat.ts
import { useState, useCallback, useRef } from 'react';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import type { ChatMessage, StreamEvent } from '@/schemas';

interface SuggestedAction {
  id: string;
  label: string;
  action: string;
  params?: Record<string, unknown>;
}

interface CanvasContext {
  nodes: unknown[];
  edges: unknown[];
}

export function usePartnerChat(projectId: string) {
  const queryClient = useQueryClient();
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [suggestedActions, setSuggestedActions] = useState<SuggestedAction[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Fetch messages
  const { data: messages = [] } = useQuery<ChatMessage[]>({
    queryKey: ['chat-messages', projectId],
    queryFn: async () => {
      // Get or create session, then fetch messages
      const response = await fetch(`/api/v1/partner/projects/${projectId}/sessions`);
      const sessions = await response.json();
      
      if (sessions.length === 0) return [];
      
      const messagesResponse = await fetch(
        `/api/v1/partner/sessions/${sessions[0].id}/messages`
      );
      return messagesResponse.json();
    },
  });

  // Send message with streaming
  const sendMessage = useCallback(async (
    content: string,
    canvasContext?: CanvasContext
  ) => {
    setIsStreaming(true);
    setStreamingContent('');
    setSuggestedActions([]);
    
    // Create abort controller
    abortControllerRef.current = new AbortController();
    
    try {
      const response = await fetch(`/api/v1/partner/projects/${projectId}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          canvas_context: canvasContext,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Read SSE stream
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const event: StreamEvent = JSON.parse(line.slice(6));
                
                switch (event.type) {
                  case 'token':
                    fullContent += event.content || '';
                    setStreamingContent(fullContent);
                    break;
                    
                  case 'tool_call':
                    // Show tool call indicator
                    setStreamingContent(
                      fullContent + `\n\n🔧 Usando: ${event.toolName}...`
                    );
                    break;
                    
                  case 'end':
                    setSuggestedActions(
                      (event as any).suggested_actions || []
                    );
                    break;
                    
                  case 'error':
                    console.error('Stream error:', event.error);
                    break;
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      }

      // Invalidate messages to refetch
      queryClient.invalidateQueries({ queryKey: ['chat-messages', projectId] });
      
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Chat error:', error);
      }
    } finally {
      setIsStreaming(false);
      setStreamingContent('');
    }
  }, [projectId, queryClient]);

  // Cancel streaming
  const cancelStream = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsStreaming(false);
    setStreamingContent('');
  }, []);

  return {
    messages,
    isStreaming,
    streamingContent,
    suggestedActions,
    sendMessage,
    cancelStream,
  };
}
```
