# PARTE 5: DOCUMENT GENERATOR E DEPLOY

## 11. FEATURE 4: DOCUMENT GENERATOR

### 11.1 TIS Generator

```python
# backend/app/ai/generators/tis_generator.py
from typing import Any
from agno.agent import Agent
from agno.models.anthropic import Claude


TIS_SYSTEM_PROMPT = """Você é um gerador de TIS (Technical Implementation Spec).

O TIS é um documento extremamente específico e executável, projetado para que uma IA (Claude, Cursor, Replit) possa implementar o projeto sem ambiguidade.

ESTRUTURA DO TIS:

```markdown
# TIS - [Nome do Projeto]
## Technical Implementation Specification
### Gerado por Neural Architect | [Data]

---

## 1. CONTEXTO
[2 parágrafos: O que é, para quem, problema que resolve]

## 2. STACK EXATO
```yaml
frontend:
  framework: [especificar versão exata]
  ...
backend:
  ...
database:
  ...
```

## 3. ESTRUTURA DE PASTAS
```
project/
├── ...
```

## 4. SCHEMAS
[Código real: Zod, Pydantic, SQL]

## 5. IMPLEMENTAÇÃO POR FEATURE
### Feature 1: [Nome]
**Arquivos a criar:**
- [ ] `path/to/file`

**Dependências:**
- ...

**Código de exemplo:**
```language
// código específico
```

**Acceptance criteria:**
- [ ] Critério técnico 1
- [ ] Critério técnico 2

## 6. REGRAS DE IMPLEMENTAÇÃO
- ✅ Fazer: [lista]
- ❌ Não fazer: [lista]

## 7. DEPLOY
[Instruções de deploy]
```

REGRAS:
1. SEJA EXTREMAMENTE ESPECÍFICO - nenhuma ambiguidade
2. Use versões exatas de todas as dependências
3. Inclua código real, não pseudo-código
4. Cada feature deve ter arquivos, código e critérios claros
5. O documento deve ser auto-contido
"""


async def generate_tis(
    project_name: str,
    project_description: str,
    canvas_state: dict[str, Any],
    category: str
) -> str:
    """
    Generate TIS document from canvas state.
    
    Args:
        project_name: Name of the project
        project_description: Description
        canvas_state: Current canvas with nodes and edges
        category: Project category (software, agents, automation)
    
    Returns:
        Complete TIS document in markdown
    """
    # Build context from canvas
    nodes = canvas_state.get("nodes", [])
    edges = canvas_state.get("edges", [])
    
    canvas_description = _describe_canvas(nodes, edges, category)
    
    # Create agent for generation
    agent = Agent(
        model=Claude(id="claude-sonnet-4-20250514"),
        instructions=TIS_SYSTEM_PROMPT,
        markdown=True
    )
    
    prompt = f"""Gere um TIS completo para o seguinte projeto:

**Nome:** {project_name}
**Descrição:** {project_description}
**Categoria:** {category}

**Estrutura do Canvas:**
{canvas_description}

Gere o documento TIS completo seguindo a estrutura especificada.
Use o stack tecnológico mais apropriado para {category} em dezembro de 2025.
Seja extremamente específico e inclua código real.
"""
    
    response = await agent.arun(prompt)
    return response.content


def _describe_canvas(nodes: list, edges: list, category: str) -> str:
    """Convert canvas to text description."""
    if not nodes:
        return "Canvas vazio - gere uma arquitetura básica apropriada"
    
    description = []
    
    # Describe nodes by type
    node_types = {}
    for node in nodes:
        node_type = node.get("type", "unknown")
        if node_type not in node_types:
            node_types[node_type] = []
        node_types[node_type].append(node.get("data", {}).get("label", "Unnamed"))
    
    description.append("### Componentes:")
    for node_type, labels in node_types.items():
        description.append(f"- **{node_type}**: {', '.join(labels)}")
    
    # Describe connections
    if edges:
        description.append("\n### Fluxo:")
        for edge in edges:
            source = _find_node_label(nodes, edge.get("source"))
            target = _find_node_label(nodes, edge.get("target"))
            label = edge.get("label", "→")
            description.append(f"- {source} {label} {target}")
    
    return "\n".join(description)


def _find_node_label(nodes: list, node_id: str) -> str:
    """Find node label by ID."""
    for node in nodes:
        if node.get("id") == node_id:
            return node.get("data", {}).get("label", node_id)
    return node_id
```

### 11.2 PRD Generator

```python
# backend/app/ai/generators/prd_generator.py
from typing import Any
from agno.agent import Agent
from agno.models.anthropic import Claude


PRD_SYSTEM_PROMPT = """Você é um gerador de PRD (Product Requirements Document).

O PRD é um documento de alto nível para stakeholders e desenvolvedores humanos, focado em valor de negócio e requisitos funcionais.

ESTRUTURA DO PRD:

```markdown
# PRD - [Nome do Projeto]
## Product Requirements Document
### Versão 1.0 | [Data]

---

## 1. VISÃO GERAL

### 1.1 Problema
[Qual problema estamos resolvendo?]

### 1.2 Solução
[Como resolvemos?]

### 1.3 Público-Alvo
[Para quem é?]

## 2. OBJETIVOS E MÉTRICAS

### 2.1 Objetivos
- Objetivo 1
- Objetivo 2

### 2.2 Métricas de Sucesso (KPIs)
| Métrica | Meta | Como medir |
|---------|------|------------|
| ... | ... | ... |

## 3. REQUISITOS FUNCIONAIS

### 3.1 User Stories

#### Epic 1: [Nome]

**US-001: [Título]**
- Como [persona]
- Quero [ação]
- Para [benefício]

**Critérios de Aceite:**
- [ ] Critério 1
- [ ] Critério 2

## 4. REQUISITOS NÃO-FUNCIONAIS

### 4.1 Performance
- ...

### 4.2 Segurança
- ...

### 4.3 Escalabilidade
- ...

## 5. ARQUITETURA DE ALTO NÍVEL

[Descrição da arquitetura]

## 6. ESCOPO E LIMITAÇÕES

### 6.1 Dentro do Escopo
- ...

### 6.2 Fora do Escopo (v1)
- ...

## 7. RISCOS E MITIGAÇÕES

| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|-----------|
| ... | ... | ... | ... |

## 8. TIMELINE

| Fase | Duração | Entregáveis |
|------|---------|-------------|
| ... | ... | ... |
```

REGRAS:
1. Foque em valor de negócio, não em implementação técnica
2. Use linguagem clara para não-técnicos
3. Inclua métricas mensuráveis
4. Seja realista sobre escopo e riscos
"""


async def generate_prd(
    project_name: str,
    project_description: str,
    canvas_state: dict[str, Any],
    category: str
) -> str:
    """Generate PRD document from canvas state."""
    nodes = canvas_state.get("nodes", [])
    edges = canvas_state.get("edges", [])
    
    canvas_description = _describe_canvas_for_prd(nodes, edges)
    
    agent = Agent(
        model=Claude(id="claude-sonnet-4-20250514"),
        instructions=PRD_SYSTEM_PROMPT,
        markdown=True
    )
    
    prompt = f"""Gere um PRD completo para:

**Nome:** {project_name}
**Descrição:** {project_description}

**Arquitetura Planejada:**
{canvas_description}

Gere o documento PRD completo focando em valor de negócio e requisitos.
"""
    
    response = await agent.arun(prompt)
    return response.content


def _describe_canvas_for_prd(nodes: list, edges: list) -> str:
    """Convert canvas to business-friendly description."""
    if not nodes:
        return "Arquitetura ainda não definida"
    
    # Extract high-level components
    components = []
    for node in nodes:
        label = node.get("data", {}).get("label", "")
        description = node.get("data", {}).get("description", "")
        if label:
            components.append(f"- {label}: {description}" if description else f"- {label}")
    
    return "Componentes principais:\n" + "\n".join(components)
```

### 11.3 Agent Spec Generator

```python
# backend/app/ai/generators/agent_spec_generator.py
from typing import Any
from agno.agent import Agent
from agno.models.anthropic import Claude


AGENT_SPEC_PROMPT = """Você é um gerador de Agent Specification.

Este documento especifica completamente um sistema de agentes IA, incluindo system prompts, tools, e configurações.

ESTRUTURA:

```markdown
# Agent Specification - [Nome]
## Sistema Multi-Agente
### Gerado por Neural Architect | [Data]

---

## 1. VISÃO GERAL DO SISTEMA

### 1.1 Objetivo
[O que o sistema de agentes faz]

### 1.2 Arquitetura
[Single agent / Multi-agent / Swarm]

## 2. AGENTES

### Agent: [Nome]

**Role:** [Papel do agente]
**Goal:** [Objetivo]
**Backstory:** [Contexto/história]

**System Prompt:**
```
[System prompt completo]
```

**Tools:**
| Tool | Descrição | Input | Output |
|------|-----------|-------|--------|
| ... | ... | ... | ... |

**Configuração:**
```python
agent = Agent(
    model=...,
    tools=[...],
    instructions="...",
    ...
)
```

## 3. WORKFLOW

### 3.1 Fluxo de Execução
[Descrição do fluxo]

### 3.2 Comunicação entre Agentes
[Como os agentes se comunicam]

## 4. TOOLS DETALHADAS

### Tool: [Nome]

```python
@tool
def tool_name(param: type) -> return_type:
    \"\"\"
    Descrição detalhada.
    
    Args:
        param: descrição
    
    Returns:
        descrição
    \"\"\"
    # Implementação
    pass
```

## 5. KNOWLEDGE BASE

### 5.1 Fontes de Dados
- ...

### 5.2 Estratégia de RAG
- ...

## 6. CONFIGURAÇÕES DE DEPLOY

```yaml
model: pesquisar melhor opção
temperature: 0.7
max_tokens: 4096
...
```

## 7. EXEMPLOS DE USO

### Exemplo 1: [Cenário]
**Input:**
```
[exemplo de input]
```

**Output esperado:**
```
[exemplo de output]
```
```
"""


async def generate_agent_spec(
    project_name: str,
    project_description: str,
    canvas_state: dict[str, Any]
) -> str:
    """Generate Agent Specification from canvas."""
    nodes = canvas_state.get("nodes", [])
    edges = canvas_state.get("edges", [])
    
    # Extract agent nodes
    agents = [n for n in nodes if n.get("type") == "agent"]
    tools = [n for n in nodes if n.get("type") == "tool"]
    knowledge = [n for n in nodes if n.get("type") == "knowledge"]
    
    agent = Agent(
        model=Claude(id="claude-sonnet-4-20250514"),
        instructions=AGENT_SPEC_PROMPT,
        markdown=True
    )
    
    prompt = f"""Gere uma Agent Specification completa para:

**Nome:** {project_name}
**Descrição:** {project_description}

**Agentes identificados:**
{_format_agents(agents)}

**Tools disponíveis:**
{_format_tools(tools)}

**Knowledge bases:**
{_format_knowledge(knowledge)}

**Conexões:**
{_format_edges(edges, nodes)}

Gere a especificação completa incluindo system prompts detalhados.
"""
    
    response = await agent.arun(prompt)
    return response.content


def _format_agents(agents: list) -> str:
    if not agents:
        return "Nenhum agente definido - sugira agentes apropriados"
    
    lines = []
    for a in agents:
        data = a.get("data", {})
        lines.append(f"- {data.get('label', 'Agent')}: {data.get('description', '')}")
    return "\n".join(lines)


def _format_tools(tools: list) -> str:
    if not tools:
        return "Nenhuma tool definida"
    
    lines = []
    for t in tools:
        data = t.get("data", {})
        lines.append(f"- {data.get('label', 'Tool')}: {data.get('description', '')}")
    return "\n".join(lines)


def _format_knowledge(knowledge: list) -> str:
    if not knowledge:
        return "Nenhuma knowledge base definida"
    
    lines = []
    for k in knowledge:
        data = k.get("data", {})
        lines.append(f"- {data.get('label', 'KB')}: {data.get('description', '')}")
    return "\n".join(lines)


def _format_edges(edges: list, nodes: list) -> str:
    if not edges:
        return "Sem conexões definidas"
    
    def get_label(node_id):
        for n in nodes:
            if n.get("id") == node_id:
                return n.get("data", {}).get("label", node_id)
        return node_id
    
    lines = []
    for e in edges:
        source = get_label(e.get("source"))
        target = get_label(e.get("target"))
        label = e.get("label", "→")
        lines.append(f"- {source} {label} {target}")
    return "\n".join(lines)
```

### 11.4 Document API Endpoint

```python
# backend/app/api/v1/endpoints/documents.py
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.api.v1.schemas.document import (
    GenerateDocument, DocumentResponse, DocumentListResponse
)
from app.services.document_service import DocumentService
from app.services.project_service import ProjectService
from app.services.canvas_service import CanvasService

router = APIRouter(prefix="/documents", tags=["documents"])


@router.get("/project/{project_id}", response_model=DocumentListResponse)
async def list_documents(
    project_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """List all generated documents for a project."""
    service = DocumentService(db)
    documents = await service.list_documents(project_id)
    return DocumentListResponse(items=documents, total=len(documents))


@router.post("/project/{project_id}/generate", response_model=DocumentResponse)
async def generate_document(
    project_id: UUID,
    data: GenerateDocument,
    db: AsyncSession = Depends(get_db)
):
    """Generate a new document (TIS, PRD, Agent Spec, etc.)."""
    # Get project
    project_service = ProjectService(db)
    project = await project_service.get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Get canvas
    canvas_service = CanvasService(db)
    canvas = await canvas_service.get_main_canvas(project_id)
    if not canvas:
        raise HTTPException(status_code=404, detail="Canvas not found")
    
    # Generate document
    document_service = DocumentService(db)
    document = await document_service.generate_document(
        project=project,
        canvas=canvas,
        doc_type=data.doc_type,
        options=data.options
    )
    
    return document


@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(
    document_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific document."""
    service = DocumentService(db)
    document = await service.get_document(document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    return document


@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_document(
    document_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Delete a document."""
    service = DocumentService(db)
    success = await service.delete_document(document_id)
    if not success:
        raise HTTPException(status_code=404, detail="Document not found")
```

---

## 12. DEPLOY CONFIGURATION

### 12.1 Dockerfile - Frontend

```dockerfile
# docker/Dockerfile.frontend
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY frontend/package.json frontend/pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source
COPY frontend/ .

# Build
RUN pnpm build

# Production image
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 12.2 Dockerfile - Backend

```dockerfile
# docker/Dockerfile.backend
FROM python:3.12-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install uv
RUN pip install uv

# Copy dependency files
COPY backend/pyproject.toml backend/uv.lock ./

# Install dependencies
RUN uv sync --frozen

# Copy source
COPY backend/ .

# Create uploads directory
RUN mkdir -p /app/uploads

# Expose port
EXPOSE 8000

# Run with uvicorn
CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 12.3 Docker Compose

```yaml
# docker/docker-compose.yml
version: '5.0.0'

services:
  # ==========================================================================
  # FRONTEND
  # ==========================================================================
  frontend:
    build:
      context: ..
      dockerfile: docker/Dockerfile.frontend
    ports:
      - "3000:80"
    environment:
      - VITE_API_URL=http://backend:8000
    depends_on:
      - backend
    networks:
      - neural-network
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.frontend.rule=Host(`${DOMAIN:-localhost}`)"
      - "traefik.http.routers.frontend.entrypoints=websecure"
      - "traefik.http.routers.frontend.tls.certresolver=letsencrypt"
      - "traefik.http.services.frontend.loadbalancer.server.port=80"

  # ==========================================================================
  # BACKEND
  # ==========================================================================
  backend:
    build:
      context: ..
      dockerfile: docker/Dockerfile.backend
    ports:
      - "8000:8000"
    environment:
      - APP_ENV=production
      - DEBUG=false
      - SECRET_KEY=${SECRET_KEY}
      - DATABASE_URL=postgresql+asyncpg://postgres:${POSTGRES_PASSWORD}@db:5432/neural_architect
      - REDIS_URL=redis://redis:6379/0
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - CORS_ORIGINS=["https://${DOMAIN:-localhost}"]
    volumes:
      - uploads:/app/uploads
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
    networks:
      - neural-network
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.backend.rule=Host(`${DOMAIN:-localhost}`) && PathPrefix(`/api`)"
      - "traefik.http.routers.backend.entrypoints=websecure"
      - "traefik.http.routers.backend.tls.certresolver=letsencrypt"
      - "traefik.http.services.backend.loadbalancer.server.port=8000"

  # ==========================================================================
  # DATABASE
  # ==========================================================================
  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=neural_architect
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ../backend/migrations/init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - neural-network

  # ==========================================================================
  # REDIS
  # ==========================================================================
  redis:
    image: redis:8.4.0-alpine
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes
    networks:
      - neural-network

  # ==========================================================================
  # TRAEFIK (Reverse Proxy + SSL)
  # ==========================================================================
  traefik:
    image: traefik:v3.7.0
    command:
      - "--api.insecure=true"
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.letsencrypt.acme.tlschallenge=true"
      - "--certificatesresolvers.letsencrypt.acme.email=${ACME_EMAIL}"
      - "--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json"
      # Redirect HTTP to HTTPS
      - "--entrypoints.web.http.redirections.entryPoint.to=websecure"
      - "--entrypoints.web.http.redirections.entryPoint.scheme=https"
    ports:
      - "80:80"
      - "443:443"
      - "8080:8080"  # Traefik dashboard
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - letsencrypt:/letsencrypt
    networks:
      - neural-network

networks:
  neural-network:
    driver: bridge

volumes:
  postgres_data:
  redis_data:
  uploads:
  letsencrypt:
```

### 12.4 Environment Variables Template

```bash
# .env.example

# =============================================================================
# APP
# =============================================================================
DOMAIN=neural-architect.seudominio.com
SECRET_KEY=your-secret-key-min-32-characters-here

# =============================================================================
# DATABASE
# =============================================================================
POSTGRES_PASSWORD=your-secure-password-here

# =============================================================================
# AI APIS
# =============================================================================
ANTHROPIC_API_KEY=sk-ant-xxxxx
OPENAI_API_KEY=sk-xxxxx

# =============================================================================
# SSL
# =============================================================================
ACME_EMAIL=seu@email.com
```

### 12.5 EasyPanel Setup Script

```bash
#!/bin/bash
# scripts/setup-easypanel.sh

# =============================================================================
# Neural Architect - EasyPanel Setup
# =============================================================================

set -e

echo "🚀 Configurando Neural Architect no EasyPanel..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo "❌ Execute como root (sudo)"
  exit 1
fi

# =============================================================================
# 1. Install Docker (if not installed)
# =============================================================================
if ! command -v docker &> /dev/null; then
    echo "📦 Instalando Docker..."
    curl -fsSL https://get.docker.com | sh
fi

# =============================================================================
# 2. Install EasyPanel
# =============================================================================
if ! docker ps | grep -q easypanel; then
    echo "📦 Instalando EasyPanel..."
    docker run --rm -it \
        -v /etc/easypanel:/etc/easypanel \
        -v /var/run/docker.sock:/var/run/docker.sock:ro \
        easypanel/easypanel setup
fi

# =============================================================================
# 3. Open Firewall Ports
# =============================================================================
echo "🔥 Configurando firewall..."
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 3000/tcp  # EasyPanel dashboard
ufw --force enable

# =============================================================================
# 4. Create Project Directory
# =============================================================================
PROJECT_DIR="/opt/neural-architect"
mkdir -p $PROJECT_DIR
cd $PROJECT_DIR

# =============================================================================
# 5. Clone Repository (or copy files)
# =============================================================================
echo "📥 Baixando código..."
# git clone https://github.com/seu-usuario/neural-architect.git .

# =============================================================================
# 6. Create .env file
# =============================================================================
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cp .env.example .env
    
    # Generate secret key
    SECRET_KEY=$(openssl rand -hex 32)
    sed -i "s/your-secret-key-min-32-characters-here/$SECRET_KEY/" .env
    
    # Generate DB password
    DB_PASSWORD=$(openssl rand -hex 16)
    sed -i "s/your-secure-password-here/$DB_PASSWORD/" .env
    
    echo "⚠️  Configure as chaves de API no arquivo .env:"
    echo "    - ANTHROPIC_API_KEY"
    echo "    - OPENAI_API_KEY"
    echo "    - DOMAIN"
    echo "    - ACME_EMAIL"
fi

echo ""
echo "✅ Setup concluído!"
echo ""
echo "Próximos passos:"
echo "1. Edite o arquivo .env com suas configurações"
echo "2. Acesse o EasyPanel em http://$(hostname -I | awk '{print $1}'):3000"
echo "3. Crie um novo projeto e importe o docker-compose.yml"
echo ""
```

### 12.6 Nginx Configuration

```nginx
# docker/nginx.conf
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing - always serve index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Health check
    location /health {
        return 200 'OK';
        add_header Content-Type text/plain;
    }
}
```

### 12.7 Deploy Commands

```bash
# scripts/deploy.sh

#!/bin/bash
set -e

echo "🚀 Deploying Neural Architect..."

# Load environment
source .env

# Pull latest changes
git pull origin main

# Build and start containers
docker compose -f docker/docker-compose.yml build
docker compose -f docker/docker-compose.yml up -d

# Run migrations
docker compose -f docker/docker-compose.yml exec backend uv run alembic upgrade head

# Show status
docker compose -f docker/docker-compose.yml ps

echo ""
echo "✅ Deploy concluído!"
echo "🌐 Acesse: https://$DOMAIN"
```

---

## 13. REGRAS DE IMPLEMENTAÇÃO

### 13.1 Fazer (DO) ✅

```
FRONTEND:
✅ Usar TypeScript strict mode
✅ Validar com Zod antes de enviar ao backend
✅ Usar React.memo() em componentes de lista
✅ Implementar skeleton loaders (não spinners)
✅ Auto-save a cada 5 segundos no canvas
✅ Manter undo/redo com mínimo 50 estados
✅ SSE para streaming do chat
✅ Dark mode por padrão

BACKEND:
✅ Validar com Pydantic em todos endpoints
✅ Usar async/await em todas operações I/O
✅ Implementar rate limiting
✅ Logs estruturados (JSON)
✅ Health check endpoint
✅ Graceful shutdown

AI:
✅ SEMPRE usar Context7 antes de responder sobre libs
✅ Streaming para todas respostas do Partner
✅ Truncar contexto do canvas para economizar tokens
✅ SEMPRE pesquisar as versões mais recentes das libs

DATABASE:
✅ Índices em foreign keys
✅ Soft delete quando apropriado
✅ Timestamps em todas tabelas
✅ JSONB para dados flexíveis
```

### 13.2 Não Fazer (DON'T) ❌

```
FRONTEND:
❌ Não usar spinners (causa ansiedade em TDAH)
❌ Não bloquear UI durante operações
❌ Não usar localStorage para dados sensíveis
❌ Não fazer requests em useEffect sem cleanup
❌ Não ignorar erros de validação Zod

BACKEND:
❌ Não usar sync operations (sempre async)
❌ Não expor stack traces em produção
❌ Não armazenar API keys no código
❌ Não confiar em input do frontend

AI:
❌ Não assumir que sabe versões atuais (usar Context7)
❌ Não enviar canvas completo a cada request
❌ Não usar GPT-4 Turbo (usar Claude)
❌ Não ignorar rate limits das APIs

DATABASE:
❌ Não usar SELECT * em queries
❌ Não fazer N+1 queries
❌ Não armazenar dados sensíveis sem criptografia
```

---

## 14. ACCEPTANCE CRITERIA FINAL

### 14.1 Checklist

```
□ Project Hub
  □ Listar projetos por categoria
  □ Criar projeto com nome, descrição, categoria
  □ Editar projeto
  □ Excluir projeto
  □ Filtrar por status

□ Canvas
  □ Criar nodes via drag-and-drop
  □ Conectar nodes
  □ Editar node (label, description)
  □ Deletar node/edge
  □ Auto-save a cada 5 segundos
  □ Undo/Redo (50 estados)
  □ Minimap
  □ Zoom/Pan

□ Partner Thinking
  □ Chat com streaming
  □ Contexto do canvas
  □ Context7 integration
  □ Sugestões de ações
  □ Gerar fluxos

□ Document Generator
  □ Gerar TIS
  □ Gerar PRD
  □ Gerar Agent Spec (para categoria agents)
  □ Preview do documento
  □ Download como Markdown

□ Deploy
  □ Docker Compose funcionando
  □ SSL automático
  □ Health checks
  □ Logs estruturados
```

---

**FIM DO TIS - Neural Architect v1.0**

*Documento gerado para implementação por IA ou desenvolvedor.*
*Dezembro 2025*