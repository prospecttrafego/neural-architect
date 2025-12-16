# NEURAL ARCHITECT - Technical Implementation Spec (TIS)
## Versão 1.0 | Dezembro 2025
## Documento para Implementação por IA ou Desenvolvedor

---

# PARTE 1: FUNDAMENTOS

---

## 1. CONTEXTO DO PROJETO

### 1.1 O que é o Neural Architect

Neural Architect é uma plataforma web de criação guiada que funciona como um "Exoesqueleto Cognitivo" para usuários Power User com TDAH. O sistema guia o usuário desde uma ideia inicial até especificações técnicas executáveis através de:

1. **Interface Visual (Canvas)** - Desenho de fluxos e arquiteturas usando drag-and-drop
2. **Assistente IA (Partner Thinking)** - Chat contextual que ajuda, ensina e sugere
3. **Knowledge Base** - Metodologias, templates e guias específicos por tipo de projeto
4. **Gerador de Documentos** - Output de TIS, PRD, e outras specs

### 1.2 As 3 Verticais

O sistema suporta 3 tipos de projetos, cada um com metodologia própria:

| Vertical | Descrição | Output Principal |
|----------|-----------|------------------|
| **Software/SaaS** | Produtos digitais (web apps, APIs, dashboards) | TIS + PRD + Blueprint |
| **Multi-Agents IA** | Sistemas de agentes inteligentes | Agent Spec + System Prompts |
| **Automação Comercial** | Fluxos de atendimento (SDR, Closer, Suporte) | Flow Spec + Conversation Scripts |

### 1.3 Público-Alvo

- Empreendedores técnicos com TDAH
- Founders que querem especificar antes de codar
- Product Managers que trabalham com IAs desenvolvedoras
- Desenvolvedores solo que precisam de estrutura

### 1.4 Princípios de UX para TDAH

- **Zero Cognitive Load**: Auto-save, undo/redo, resume automático
- **Visual Feedback Imediato**: Skeleton loaders, micro-animações, toasts
- **Chunking**: Steps pequenos, checklist visível, progressive disclosure
- **Dopamine Rewards**: Celebrações ao completar etapas, progress bars

---

## 2. STACK TECNOLÓGICO EXATO

### 2.1 Frontend


framework: React 19.2
bundler: Vite 7.3.0
language: TypeScript 5.9.3
styling:
  - TailwindCSS 4.4.16
components: 
  - shadcn/ui 3.6.1
canvas: "@xyflow/react" 12.10.0  # React Flow rebrand
animations: framer-motion 12.23.26
state:
  global: Zustand 5.0.9
  server: TanStack Query 5.90.12
forms: 
  - react-hook-form 7.54.0
  - "@hookform/resolvers"
validation: zod 4.1.13
icons: lucide-react 0.561.0
notifications: sonner 2.0.7
date: date-fns 4.1.0


### 2.2 Backend


framework: FastAPI 0.124.4
language: Python 3.13.7
ai_framework: agno 2.3.13  # Primary
ai_framework_tutorials: crewai 1.7.1 
crewai-tools: 0.76.0
anthropic: 0.75
openai: 2.12.0
validation: pydantic 2.12.5
orm: SQLAlchemy 2.0.45
migrations: alembic 1.17.2
async_db: asyncpg 0.31.0
http_client: httpx 0.28.1
background_tasks: celery 5.6.0 
cache: redis 8.4.0
Observability:
sentry: sentry-sdk 2.47.0

### CrewAI

ver arquivo "crewai.md" para todas as dependencias, tools e informações.

### Agno

ver arquivo "agno.md" para todas as dependencias, tools e versões.

### 2.3 Database


primary: Supabase (ou PostgreSQL 16)
vector_store: pgvector ou proprio supabase  # Para RAG futuro
cache: Redis 8.4.0
hosting: Supabase


### 2.4 Infraestrutura

containerization: Docker 29.0.1
orchestration: Docker Compose 5.0.0
reverse_proxy: Traefik 3.7.0
ssl: Let's Encrypt (auto)
hosting_options:
  - EasyPanel (recommended)
  - Docker Compose + VPS Ubuntu 24.04.3
  - Hospedagem no Hostinger 


### 2.5 Ferramentas de Desenvolvimento


package_manager_frontend: pnpm 10.25.0
package_manager_backend: uv 0.14.9
linting_frontend: 
  - eslint 9.39.2
  - prettier 3.7.0
linting_backend:
  - ruff 0.14.9
  - mypy 1.18.1
testing_frontend: vitest 4.0.15
testing_backend: pytest 9.0.2
git_hooks: husky + lint-staged


---

## 3. ESTRUTURA DE PASTAS

```
neural-architect/
│
├── 📁 frontend/
│   ├── 📁 public/
│   │   ├── favicon.ico
│   │   └── 📁 assets/
│   │       └── logo.svg
│   │
│   ├── 📁 src/
│   │   ├── 📁 app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── providers.tsx              # React Query, Zustand providers
│   │   │   ├── 📁 (auth)/
│   │   │   │   ├── login/page.tsx
│   │   │   │   ├── register/page.tsx
│   │   │   │   └── layout.tsx
│   │   │   ├── 📁 dashboard/
│   │   │   │   ├── page.tsx
│   │   │   │   └── loading.tsx
│   │   │   ├── 📁 software/
│   │   │   │   ├── page.tsx
│   │   │   │   └── 📁 [projectId]/
│   │   │   │       ├── page.tsx
│   │   │   │       └── loading.tsx
│   │   │   ├── 📁 agents/
│   │   │   │   ├── page.tsx
│   │   │   │   └── 📁 [projectId]/
│   │   │   │       └── page.tsx
│   │   │   └── 📁 automation/
│   │   │       ├── page.tsx
│   │   │       └── 📁 [projectId]/
│   │   │           └── page.tsx
│   │   │
│   │   ├── 📁 components/
│   │   │   ├── 📁 ui/                     # shadcn/ui (Radix UI)
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── dropdown-menu.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── select.tsx
│   │   │   │   ├── tabs.tsx
│   │   │   │   ├── toast.tsx
│   │   │   │   ├── tooltip.tsx
│   │   │   │   ├── skeleton.tsx
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── 📁 layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── MainLayout.tsx
│   │   │   │   └── MobileNav.tsx
│   │   │   │
│   │   │   ├── 📁 dashboard/
│   │   │   │   ├── CategoryCard.tsx
│   │   │   │   ├── WelcomeHero.tsx
│   │   │   │   ├── RecentProjects.tsx
│   │   │   │   └── QuickActions.tsx
│   │   │   │
│   │   │   ├── 📁 projects/
│   │   │   │   ├── ProjectCard.tsx
│   │   │   │   ├── ProjectGrid.tsx
│   │   │   │   ├── CreateProjectModal.tsx
│   │   │   │   ├── ProjectFilters.tsx
│   │   │   │   └── ProjectMenu.tsx
│   │   │   │
│   │   │   ├── 📁 workspace/
│   │   │   │   ├── WorkspaceLayout.tsx
│   │   │   │   ├── WorkspaceSidebar.tsx
│   │   │   │   ├── WorkspaceHeader.tsx
│   │   │   │   ├── TabsNavigation.tsx
│   │   │   │   └── ResizablePanels.tsx
│   │   │   │
│   │   │   ├── 📁 canvas/
│   │   │   │   ├── Canvas.tsx
│   │   │   │   ├── CanvasControls.tsx
│   │   │   │   ├── CanvasToolbar.tsx
│   │   │   │   ├── MiniMap.tsx
│   │   │   │   ├── 📁 nodes/
│   │   │   │   │   ├── index.ts           # Node registry
│   │   │   │   │   ├── BaseNode.tsx
│   │   │   │   │   ├── StartNode.tsx
│   │   │   │   │   ├── EndNode.tsx
│   │   │   │   │   ├── ProcessNode.tsx
│   │   │   │   │   ├── DecisionNode.tsx
│   │   │   │   │   ├── AgentNode.tsx
│   │   │   │   │   ├── ToolNode.tsx
│   │   │   │   │   ├── KnowledgeNode.tsx
│   │   │   │   │   ├── DatabaseNode.tsx
│   │   │   │   │   ├── ApiNode.tsx
│   │   │   │   │   ├── WebhookNode.tsx
│   │   │   │   │   ├── HumanLoopNode.tsx
│   │   │   │   │   ├── ConditionNode.tsx
│   │   │   │   │   ├── LoopNode.tsx
│   │   │   │   │   ├── IntegrationNode.tsx
│   │   │   │   │   └── MessageNode.tsx
│   │   │   │   ├── 📁 edges/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── DefaultEdge.tsx
│   │   │   │   │   ├── ConditionalEdge.tsx
│   │   │   │   │   └── AnimatedEdge.tsx
│   │   │   │   └── 📁 panels/
│   │   │   │       ├── NodeInspector.tsx
│   │   │   │       ├── NodePalette.tsx
│   │   │   │       ├── CanvasSettings.tsx
│   │   │   │       └── HistoryPanel.tsx
│   │   │   │
│   │   │   ├── 📁 partner/
│   │   │   │   ├── PartnerChat.tsx
│   │   │   │   ├── ChatMessage.tsx
│   │   │   │   ├── ChatInput.tsx
│   │   │   │   ├── SuggestedActions.tsx
│   │   │   │   ├── StreamingMessage.tsx
│   │   │   │   ├── ToolCallIndicator.tsx  # Mostra quando tool é chamada
│   │   │   │   ├── MemoryIndicator.tsx    # Mostra memória ativa
│   │   │   │   └── ModelSelector.tsx      # Haiku/Sonnet/Opus
│   │   │   │
│   │   │   ├── 📁 checklist/
│   │   │   │   ├── Checklist.tsx
│   │   │   │   ├── ChecklistItem.tsx
│   │   │   │   ├── ChecklistProgress.tsx
│   │   │   │   └── PhaseIndicator.tsx
│   │   │   │
│   │   │   ├── 📁 knowledge/
│   │   │   │   ├── KnowledgeBase.tsx
│   │   │   │   ├── ArticleCard.tsx
│   │   │   │   ├── ArticleViewer.tsx
│   │   │   │   ├── SearchBar.tsx
│   │   │   │   └── CategoryTree.tsx
│   │   │   │
│   │   │   ├── 📁 documents/
│   │   │   │   ├── DocumentGenerator.tsx
│   │   │   │   ├── DocumentPreview.tsx
│   │   │   │   ├── DocumentTypeSelector.tsx
│   │   │   │   ├── ExportOptions.tsx
│   │   │   │   ├── MarkdownRenderer.tsx
│   │   │   │   └── GenerationProgress.tsx
│   │   │   │
│   │   │   └── 📁 files/
│   │   │       ├── FileManager.tsx
│   │   │       ├── FileUploader.tsx
│   │   │       ├── FileList.tsx
│   │   │       ├── FilePreview.tsx
│   │   │       └── FileContextMenu.tsx
│   │   │
│   │   ├── 📁 hooks/
│   │   │   ├── index.ts
│   │   │   ├── useProjects.ts
│   │   │   ├── useProject.ts
│   │   │   ├── useCanvas.ts
│   │   │   ├── useCanvasHistory.ts
│   │   │   ├── useCanvasAutoSave.ts
│   │   │   ├── usePartnerChat.ts
│   │   │   ├── usePartnerStream.ts        # SSE streaming hook
│   │   │   ├── useChecklist.ts
│   │   │   ├── useKnowledge.ts
│   │   │   ├── useDocuments.ts
│   │   │   ├── useFiles.ts
│   │   │   ├── useAuth.ts
│   │   │   └── useLocalStorage.ts
│   │   │
│   │   ├── 📁 stores/
│   │   │   ├── index.ts
│   │   │   ├── useAppStore.ts
│   │   │   ├── useAuthStore.ts
│   │   │   ├── useCanvasStore.ts
│   │   │   ├── useProjectStore.ts
│   │   │   ├── useChatStore.ts
│   │   │   └── useUIStore.ts              # Panels, sidebars state
│   │   │
│   │   ├── 📁 lib/
│   │   │   ├── api.ts                     # Fetch wrapper + interceptors
│   │   │   ├── sse.ts                     # Server-Sent Events client
│   │   │   ├── utils.ts
│   │   │   ├── cn.ts
│   │   │   ├── constants.ts
│   │   │   └── validators.ts
│   │   │
│   │   ├── 📁 schemas/
│   │   │   ├── index.ts
│   │   │   ├── project.schema.ts
│   │   │   ├── canvas.schema.ts
│   │   │   ├── chat.schema.ts
│   │   │   ├── document.schema.ts
│   │   │   └── auth.schema.ts
│   │   │
│   │   ├── 📁 types/
│   │   │   ├── index.ts
│   │   │   ├── project.types.ts
│   │   │   ├── canvas.types.ts
│   │   │   ├── chat.types.ts
│   │   │   ├── node.types.ts
│   │   │   └── api.types.ts
│   │   │
│   │   ├── 📁 styles/
│   │   │   ├── globals.css
│   │   │   ├── canvas.css
│   │   │   └── markdown.css
│   │   │
│   │   └── main.tsx
│   │
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── postcss.config.js
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── components.json                    # shadcn/ui config
│   ├── package.json
│   └── .env.example
│
├── 📁 backend/
│   ├── 📁 app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   │
│   │   ├── 📁 api/
│   │   │   ├── __init__.py
│   │   │   ├── deps.py
│   │   │   ├── 📁 v1/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── router.py
│   │   │   │   ├── 📁 endpoints/
│   │   │   │   │   ├── __init__.py
│   │   │   │   │   ├── auth.py
│   │   │   │   │   ├── projects.py
│   │   │   │   │   ├── canvases.py
│   │   │   │   │   ├── partner.py
│   │   │   │   │   ├── documents.py
│   │   │   │   │   ├── files.py
│   │   │   │   │   ├── knowledge.py
│   │   │   │   │   └── health.py
│   │   │   │   └── 📁 schemas/
│   │   │   │       ├── __init__.py
│   │   │   │       ├── auth.py
│   │   │   │       ├── project.py
│   │   │   │       ├── canvas.py
│   │   │   │       ├── partner.py
│   │   │   │       ├── document.py
│   │   │   │       └── file.py
│   │   │
│   │   ├── 📁 models/
│   │   │   ├── __init__.py
│   │   │   ├── base.py
│   │   │   ├── user.py
│   │   │   ├── project.py
│   │   │   ├── canvas.py
│   │   │   ├── chat.py
│   │   │   ├── document.py
│   │   │   ├── file.py
│   │   │   └── knowledge.py
│   │   │
│   │   ├── 📁 crud/
│   │   │   ├── __init__.py
│   │   │   ├── base.py
│   │   │   ├── user.py
│   │   │   ├── project.py
│   │   │   ├── canvas.py
│   │   │   ├── chat.py
│   │   │   ├── document.py
│   │   │   └── file.py
│   │   │
│   │   ├── 📁 services/
│   │   │   ├── __init__.py
│   │   │   ├── auth_service.py
│   │   │   ├── project_service.py
│   │   │   ├── canvas_service.py
│   │   │   ├── partner_service.py
│   │   │   ├── document_service.py
│   │   │   ├── file_service.py
│   │   │   └── knowledge_service.py
│   │   │
│   │   ├── 📁 ai/
│   │   │   ├── __init__.py
│   │   │   │
│   │   │   ├── 📁 agents/                 # Agno v2.3.13 agents
│   │   │   │   ├── __init__.py
│   │   │   │   ├── partner_agent.py       # Main Partner Thinking
│   │   │   │   ├── document_agent.py      # Doc generation (Opus)
│   │   │   │   └── analysis_agent.py      # Canvas analysis (Haiku)
│   │   │   │
│   │   │   ├── 📁 tools/                  # @tool decorated functions
│   │   │   │   ├── __init__.py
│   │   │   │   ├── canvas_tools.py        # analyze_canvas, suggest_flow
│   │   │   │   ├── docs_tools.py          # Context7 integration
│   │   │   │   ├── web_tools.py           # Web search
│   │   │   │   ├── file_tools.py          # File operations
│   │   │   │   └── generator_tools.py     # TIS/PRD generation
│   │   │   │
│   │   │   ├── 📁 knowledge/              # Agno v2 Knowledge/RAG
│   │   │   │   ├── __init__.py
│   │   │   │   ├── setup.py               # LanceDB + embeddings setup
│   │   │   │   ├── methodology_kb.py      # Metodologias por categoria
│   │   │   │   └── loaders.py             # Load markdown to KB
│   │   │   │
│   │   │   ├── 📁 prompts/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── system_prompts.py      # Por categoria
│   │   │   │   ├── software_prompts.py
│   │   │   │   ├── agents_prompts.py
│   │   │   │   └── automation_prompts.py
│   │   │   │
│   │   │   ├── 📁 generators/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── base_generator.py
│   │   │   │   ├── tis_generator.py
│   │   │   │   ├── prd_generator.py
│   │   │   │   ├── agent_spec_generator.py
│   │   │   │   └── flow_spec_generator.py
│   │   │   │
│   │   │   ├── 📁 flows/                  # CrewAI v1.7.1 (opcional)
│   │   │   │   ├── __init__.py
│   │   │   │   ├── document_flow.py       # Multi-agent doc generation
│   │   │   │   └── research_flow.py       # Research + Write + Review
│   │   │   │
│   │   │   └── 📁 models/                 # Model configurations
│   │   │       ├── __init__.py
│   │   │       └── model_config.py        # Haiku/Sonnet/Opus configs
│   │   │
│   │   └── 📁 core/
│   │       ├── __init__.py
│   │       ├── security.py
│   │       ├── exceptions.py
│   │       ├── logging.py
│   │       └── events.py                  # Event bus for SSE
│   │
│   ├── 📁 migrations/
│   │   ├── env.py
│   │   ├── script.py.mako
│   │   └── 📁 versions/
│   │       ├── 001_initial.py
│   │       ├── 002_add_users.py
│   │       └── 003_add_chat_memory.py
│   │
│   ├── 📁 tests/
│   │   ├── __init__.py
│   │   ├── conftest.py
│   │   ├── 📁 api/
│   │   │   ├── test_projects.py
│   │   │   ├── test_canvases.py
│   │   │   └── test_partner.py
│   │   ├── 📁 services/
│   │   │   └── test_partner_service.py
│   │   └── 📁 ai/
│   │       ├── test_tools.py
│   │       └── test_agents.py
│   │
│   ├── 📁 data/                           # Runtime data
│   │   ├── 📁 lancedb/                    # Vector DB storage
│   │   └── 📁 uploads/                    # User uploads
│   │
│   ├── pyproject.toml
│   ├── alembic.ini
│   ├── Makefile
│   └── .env.example
│
├── 📁 knowledge-base/
│   ├── 📁 software/
│   │   ├── 📁 methodology/
│   │   │   ├── 00-overview.md
│   │   │   ├── 01-problem-discovery.md
│   │   │   ├── 02-ideation-validation.md
│   │   │   ├── 03-architecture-design.md
│   │   │   ├── 04-ui-ux-design.md
│   │   │   ├── 05-development.md
│   │   │   ├── 06-testing.md
│   │   │   └── 07-deployment.md
│   │   ├── 📁 patterns/
│   │   │   ├── dashboard-patterns.md
│   │   │   ├── form-patterns.md
│   │   │   ├── navigation-patterns.md
│   │   │   └── data-visualization.md
│   │   ├── 📁 templates/
│   │   │   ├── tis-template.md
│   │   │   ├── prd-template.md
│   │   │   └── architecture-template.md
│   │   └── 📁 checklists/
│   │       ├── mvp-checklist.md
│   │       ├── security-checklist.md
│   │       └── launch-checklist.md
│   │
│   ├── 📁 agents/
│   │   ├── 📁 methodology/
│   │   │   ├── 00-overview.md
│   │   │   ├── 01-problem-mapping.md
│   │   │   ├── 02-agent-design.md
│   │   │   ├── 03-prompt-engineering.md
│   │   │   ├── 04-workflow-patterns.md
│   │   │   ├── 05-implementation.md
│   │   │   └── 06-deployment-monitoring.md
│   │   ├── 📁 frameworks/
│   │   │   ├── agno-v2-guide.md           # Agno 2.3+ específico
│   │   │   ├── crewai-v1-guide.md         # CrewAI 1.7+ específico
│   │   │   ├── pydantic-ai-guide.md
│   │   │   └── comparison.md
│   │   ├── 📁 patterns/
│   │   │   ├── single-agent.md
│   │   │   ├── multi-agent-teams.md
│   │   │   ├── orchestrator-workers.md
│   │   │   ├── human-in-loop.md
│   │   │   ├── rag-patterns.md            # RAG/Knowledge patterns
│   │   │   └── memory-patterns.md         # Memory strategies
│   │   └── 📁 templates/
│   │       ├── agent-spec-template.md
│   │       ├── system-prompt-template.md
│   │       ├── tool-definition-template.md
│   │       └── flow-template.md           # CrewAI Flow template
│   │
│   └── 📁 automation/
│       ├── 📁 methodology/
│       │   ├── 00-overview.md
│       │   ├── 01-customer-journey.md
│       │   ├── 02-conversation-design.md
│       │   ├── 03-role-flows.md
│       │   ├── 04-integration.md
│       │   ├── 05-testing-optimization.md
│       │   └── 06-deployment.md
│       ├── 📁 flows/
│       │   ├── sdr-flows.md
│       │   ├── closer-flows.md
│       │   ├── support-flows.md
│       │   └── onboarding-flows.md
│       └── 📁 templates/
│           ├── flow-spec-template.md
│           └── conversation-script-template.md
│
├── 📁 docker/
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   ├── docker-compose.yml
│   ├── docker-compose.dev.yml
│   └── nginx.conf
│
├── 📁 scripts/
│   ├── setup.sh
│   ├── dev.sh
│   ├── deploy.sh
│   ├── migrate.sh
│   ├── seed-knowledge.sh                  # Popula knowledge base
│   └── test.sh
│
├── 📁 .github/
│   └── 📁 workflows/
│       ├── ci.yml
│       ├── deploy.yml
│       └── test.yml
│
├── .gitignore
├── .env.example
├── README.md
├── CHANGELOG.md
└── LICENSE
```
---

## 4. VARIÁVEIS DE AMBIENTE

### 4.1 Frontend (.env)

# API
VITE_API_URL=http://localhost:8000
VITE_API_VERSION=v1

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DARK_MODE=true

### 4.2 Backend (.env)

# App
APP_NAME=NeuralArchitect
APP_ENV=development
DEBUG=true
SECRET_KEY=your-secret-key-here-min-32-chars

# Database
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/neural_architect
REDIS_URL=redis://localhost:6379/0

# AI APIs
ANTHROPIC_API_KEY=sk-ant-xxxxx
OPENAI_API_KEY=sk-xxxxx

# AI Config
Usar modelos com reasoning e atuais (pesquisar)
MAX_TOKENS=4096
TEMPERATURE=0.7

# Storage
UPLOAD_DIR=/app/uploads
MAX_UPLOAD_SIZE_MB=50

# CORS
CORS_ORIGINS=["http://localhost:5173", "http://localhost:3000"]

---
# PARTE 2: SCHEMAS E DATABASE

---

## 5. SCHEMAS ZOD (FRONTEND)

### 5.1 Project Schema

```typescript
// frontend/src/schemas/project.schema.ts
import { z } from 'zod';

// Enums
export const ProjectCategoryEnum = z.enum(['software', 'agents', 'automation']);
export const ProjectStatusEnum = z.enum(['draft', 'in_progress', 'review', 'completed', 'archived']);

// Base Project Schema
export const ProjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').max(100),
  description: z.string().max(500).optional().nullable(),
  category: ProjectCategoryEnum,
  status: ProjectStatusEnum.default('draft'),
  progress: z.number().min(0).max(100).default(0),
  thumbnailUrl: z.string().url().optional().nullable(),
  settings: z.record(z.unknown()).default({}),
  metadata: z.record(z.unknown()).default({}),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  lastAccessedAt: z.string().datetime().optional(),
});

// Create Project Schema (input)
export const CreateProjectSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  category: ProjectCategoryEnum,
});

// Update Project Schema (input)
export const UpdateProjectSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  description: z.string().max(500).optional().nullable(),
  status: ProjectStatusEnum.optional(),
  progress: z.number().min(0).max(100).optional(),
  settings: z.record(z.unknown()).optional(),
  metadata: z.record(z.unknown()).optional(),
});

// Types
export type Project = z.infer<typeof ProjectSchema>;
export type CreateProject = z.infer<typeof CreateProjectSchema>;
export type UpdateProject = z.infer<typeof UpdateProjectSchema>;
export type ProjectCategory = z.infer<typeof ProjectCategoryEnum>;
export type ProjectStatus = z.infer<typeof ProjectStatusEnum>;
```

### 5.2 Canvas Schema

```typescript
// frontend/src/schemas/canvas.schema.ts
import { z } from 'zod';

// Node Types por categoria
export const SoftwareNodeTypeEnum = z.enum([
  'start', 'end', 'process', 'decision', 'database', 
  'api', 'user_interface', 'service', 'queue', 'cache'
]);

export const AgentNodeTypeEnum = z.enum([
  'start', 'end', 'agent', 'tool', 'knowledge', 
  'memory', 'human_loop', 'decision', 'parallel'
]);

export const AutomationNodeTypeEnum = z.enum([
  'start', 'end', 'message', 'wait_response', 'condition',
  'action', 'integration', 'human_handoff', 'schedule'
]);

// Position Schema
export const PositionSchema = z.object({
  x: z.number(),
  y: z.number(),
});

// Node Data Schema
export const NodeDataSchema = z.object({
  label: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  config: z.record(z.unknown()).optional(),
  // Educational content for ADHD users
  educationalContent: z.object({
    title: z.string(),
    summary: z.string(),
    learnMoreUrl: z.string().url().optional(),
  }).optional(),
});

// Flow Node Schema
export const FlowNodeSchema = z.object({
  id: z.string(),
  type: z.string(),  // Validado dinamicamente baseado na categoria
  position: PositionSchema,
  data: NodeDataSchema,
  width: z.number().optional(),
  height: z.number().optional(),
  selected: z.boolean().optional(),
  dragging: z.boolean().optional(),
});

// Flow Edge Schema
export const FlowEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  sourceHandle: z.string().optional().nullable(),
  targetHandle: z.string().optional().nullable(),
  label: z.string().max(100).optional(),
  type: z.enum(['default', 'smoothstep', 'step', 'straight']).default('smoothstep'),
  animated: z.boolean().default(false),
  style: z.record(z.unknown()).optional(),
});

// Viewport Schema
export const ViewportSchema = z.object({
  x: z.number(),
  y: z.number(),
  zoom: z.number().min(0.1).max(4),
});

// Canvas Schema
export const CanvasSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  name: z.string().min(1).max(200).default('Main Canvas'),
  nodes: z.array(FlowNodeSchema),
  edges: z.array(FlowEdgeSchema),
  viewport: ViewportSchema.default({ x: 0, y: 0, zoom: 1 }),
  isMain: z.boolean().default(false),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Save Canvas Schema (input)
export const SaveCanvasSchema = z.object({
  nodes: z.array(FlowNodeSchema),
  edges: z.array(FlowEdgeSchema),
  viewport: ViewportSchema.optional(),
});

// Create Node Schema (input)
export const CreateNodeSchema = z.object({
  type: z.string(),
  position: PositionSchema,
  data: NodeDataSchema,
});

// Types
export type FlowNode = z.infer<typeof FlowNodeSchema>;
export type FlowEdge = z.infer<typeof FlowEdgeSchema>;
export type Canvas = z.infer<typeof CanvasSchema>;
export type SaveCanvas = z.infer<typeof SaveCanvasSchema>;
export type CreateNode = z.infer<typeof CreateNodeSchema>;
export type Viewport = z.infer<typeof ViewportSchema>;
```

### 5.3 Chat Schema

```typescript
// frontend/src/schemas/chat.schema.ts
import { z } from 'zod';

export const ChatRoleEnum = z.enum(['user', 'assistant', 'system']);

export const ChatMessageSchema = z.object({
  id: z.string().uuid(),
  sessionId: z.string().uuid(),
  role: ChatRoleEnum,
  content: z.string(),
  canvasSnapshot: z.record(z.unknown()).optional().nullable(),
  suggestedActions: z.array(z.object({
    id: z.string(),
    label: z.string(),
    action: z.string(),
    params: z.record(z.unknown()).optional(),
  })).optional().nullable(),
  metadata: z.record(z.unknown()).default({}),
  createdAt: z.string().datetime(),
});

export const ChatSessionSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  title: z.string().max(200).optional().nullable(),
  contextSummary: z.string().optional().nullable(),
  messageCount: z.number().default(0),
  startedAt: z.string().datetime(),
  lastMessageAt: z.string().datetime().optional().nullable(),
});

// Send Message Schema (input)
export const SendMessageSchema = z.object({
  content: z.string().min(1).max(10000),
  canvasContext: z.object({
    nodes: z.array(z.unknown()),
    edges: z.array(z.unknown()),
  }).optional(),
});

// Streaming Response Event Schema
export const StreamEventSchema = z.object({
  type: z.enum(['start', 'token', 'tool_call', 'tool_result', 'end', 'error']),
  content: z.string().optional(),
  toolName: z.string().optional(),
  toolInput: z.record(z.unknown()).optional(),
  toolOutput: z.string().optional(),
  error: z.string().optional(),
});

// Types
export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export type ChatSession = z.infer<typeof ChatSessionSchema>;
export type SendMessage = z.infer<typeof SendMessageSchema>;
export type StreamEvent = z.infer<typeof StreamEventSchema>;
export type ChatRole = z.infer<typeof ChatRoleEnum>;
```

### 5.4 Document Schema

```typescript
// frontend/src/schemas/document.schema.ts
import { z } from 'zod';

export const DocumentTypeEnum = z.enum([
  'TIS',           // Technical Implementation Spec
  'PRD',           // Product Requirements Document
  'BLUEPRINT',     // Technical Blueprint
  'AGENT_SPEC',    // Agent Specification
  'FLOW_SPEC',     // Flow Specification
  'SYSTEM_PROMPT', // System Prompt
  'CUSTOM'         // Custom document
]);

export const DocumentFormatEnum = z.enum(['markdown', 'html', 'json']);

export const GeneratedDocumentSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  docType: DocumentTypeEnum,
  title: z.string().min(1).max(300),
  content: z.string(),
  format: DocumentFormatEnum.default('markdown'),
  version: z.number().default(1),
  metadata: z.record(z.unknown()).default({}),
  generatedAt: z.string().datetime(),
});

// Generate Document Schema (input)
export const GenerateDocumentSchema = z.object({
  docType: DocumentTypeEnum,
  options: z.object({
    includeCodeExamples: z.boolean().default(true),
    verbosityLevel: z.enum(['concise', 'normal', 'detailed']).default('normal'),
    targetAudience: z.enum(['ai', 'developer', 'stakeholder']).default('ai'),
    customInstructions: z.string().max(1000).optional(),
  }).optional(),
});

// Types
export type GeneratedDocument = z.infer<typeof GeneratedDocumentSchema>;
export type GenerateDocument = z.infer<typeof GenerateDocumentSchema>;
export type DocumentType = z.infer<typeof DocumentTypeEnum>;
export type DocumentFormat = z.infer<typeof DocumentFormatEnum>;
```

### 5.5 Index (Export all schemas)

```typescript
// frontend/src/schemas/index.ts
export * from './project.schema';
export * from './canvas.schema';
export * from './chat.schema';
export * from './document.schema';
```

---

## 6. SCHEMAS PYDANTIC (BACKEND)

### 6.1 Project Schemas

```python
# backend/app/api/v1/schemas/project.py
from datetime import datetime
from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict
from uuid import UUID


class ProjectCategory(str, Enum):
    SOFTWARE = "software"
    AGENTS = "agents"
    AUTOMATION = "automation"


class ProjectStatus(str, Enum):
    DRAFT = "draft"
    IN_PROGRESS = "in_progress"
    REVIEW = "review"
    COMPLETED = "completed"
    ARCHIVED = "archived"


class ProjectBase(BaseModel):
    name: str = Field(..., min_length=3, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    category: ProjectCategory


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=3, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    status: Optional[ProjectStatus] = None
    progress: Optional[int] = Field(None, ge=0, le=100)
    settings: Optional[dict] = None
    metadata: Optional[dict] = None


class ProjectResponse(ProjectBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: UUID
    status: ProjectStatus = ProjectStatus.DRAFT
    progress: int = 0
    thumbnail_url: Optional[str] = None
    settings: dict = {}
    metadata: dict = {}
    created_at: datetime
    updated_at: datetime
    last_accessed_at: Optional[datetime] = None


class ProjectListResponse(BaseModel):
    items: list[ProjectResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
```

### 6.2 Canvas Schemas

```python
# backend/app/api/v1/schemas/canvas.py
from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel, Field, ConfigDict
from uuid import UUID


class Position(BaseModel):
    x: float
    y: float


class NodeData(BaseModel):
    label: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    config: Optional[dict[str, Any]] = None
    educational_content: Optional[dict[str, Any]] = None


class FlowNode(BaseModel):
    id: str
    type: str
    position: Position
    data: NodeData
    width: Optional[float] = None
    height: Optional[float] = None
    selected: Optional[bool] = None
    dragging: Optional[bool] = None


class FlowEdge(BaseModel):
    id: str
    source: str
    target: str
    source_handle: Optional[str] = None
    target_handle: Optional[str] = None
    label: Optional[str] = Field(None, max_length=100)
    type: str = "smoothstep"
    animated: bool = False
    style: Optional[dict[str, Any]] = None


class Viewport(BaseModel):
    x: float = 0
    y: float = 0
    zoom: float = Field(1, ge=0.1, le=4)


class CanvasBase(BaseModel):
    name: str = Field("Main Canvas", min_length=1, max_length=200)


class CanvasCreate(CanvasBase):
    project_id: UUID


class CanvasSave(BaseModel):
    nodes: list[FlowNode]
    edges: list[FlowEdge]
    viewport: Optional[Viewport] = None


class CanvasResponse(CanvasBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: UUID
    project_id: UUID
    nodes: list[FlowNode] = []
    edges: list[FlowEdge] = []
    viewport: Viewport = Viewport()
    is_main: bool = False
    created_at: datetime
    updated_at: datetime
```

### 6.3 Partner (Chat) Schemas

```python
# backend/app/api/v1/schemas/partner.py
from datetime import datetime
from enum import Enum
from typing import Optional, Any
from pydantic import BaseModel, Field, ConfigDict
from uuid import UUID


class ChatRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class SuggestedAction(BaseModel):
    id: str
    label: str
    action: str
    params: Optional[dict[str, Any]] = None


class ChatMessageBase(BaseModel):
    content: str = Field(..., min_length=1, max_length=10000)


class SendMessage(ChatMessageBase):
    canvas_context: Optional[dict[str, Any]] = None


class ChatMessageResponse(ChatMessageBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: UUID
    session_id: UUID
    role: ChatRole
    canvas_snapshot: Optional[dict[str, Any]] = None
    suggested_actions: Optional[list[SuggestedAction]] = None
    metadata: dict = {}
    created_at: datetime


class ChatSessionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: UUID
    project_id: UUID
    title: Optional[str] = None
    context_summary: Optional[str] = None
    message_count: int = 0
    started_at: datetime
    last_message_at: Optional[datetime] = None


class StreamEventType(str, Enum):
    START = "start"
    TOKEN = "token"
    TOOL_CALL = "tool_call"
    TOOL_RESULT = "tool_result"
    END = "end"
    ERROR = "error"


class StreamEvent(BaseModel):
    type: StreamEventType
    content: Optional[str] = None
    tool_name: Optional[str] = None
    tool_input: Optional[dict[str, Any]] = None
    tool_output: Optional[str] = None
    error: Optional[str] = None
```

### 6.4 Document Schemas

```python
# backend/app/api/v1/schemas/document.py
from datetime import datetime
from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict
from uuid import UUID


class DocumentType(str, Enum):
    TIS = "TIS"
    PRD = "PRD"
    BLUEPRINT = "BLUEPRINT"
    AGENT_SPEC = "AGENT_SPEC"
    FLOW_SPEC = "FLOW_SPEC"
    SYSTEM_PROMPT = "SYSTEM_PROMPT"
    CUSTOM = "CUSTOM"


class DocumentFormat(str, Enum):
    MARKDOWN = "markdown"
    HTML = "html"
    JSON = "json"


class VerbosityLevel(str, Enum):
    CONCISE = "concise"
    NORMAL = "normal"
    DETAILED = "detailed"


class TargetAudience(str, Enum):
    AI = "ai"
    DEVELOPER = "developer"
    STAKEHOLDER = "stakeholder"


class GenerateOptions(BaseModel):
    include_code_examples: bool = True
    verbosity_level: VerbosityLevel = VerbosityLevel.NORMAL
    target_audience: TargetAudience = TargetAudience.AI
    custom_instructions: Optional[str] = Field(None, max_length=1000)


class GenerateDocument(BaseModel):
    doc_type: DocumentType
    options: Optional[GenerateOptions] = None


class DocumentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: UUID
    project_id: UUID
    doc_type: DocumentType
    title: str
    content: str
    format: DocumentFormat = DocumentFormat.MARKDOWN
    version: int = 1
    metadata: dict = {}
    generated_at: datetime


class DocumentListResponse(BaseModel):
    items: list[DocumentResponse]
    total: int
```

---

## 7. DATABASE SCHEMA (PostgreSQL)

```sql
-- ============================================================================
-- NEURAL ARCHITECT - DATABASE SCHEMA
-- Version: 1.0
-- PostgreSQL 16
-- ============================================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgvector";

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE project_category AS ENUM ('software', 'agents', 'automation');
CREATE TYPE project_status AS ENUM ('draft', 'in_progress', 'review', 'completed', 'archived');
CREATE TYPE chat_role AS ENUM ('user', 'assistant', 'system');
CREATE TYPE document_type AS ENUM ('TIS', 'PRD', 'BLUEPRINT', 'AGENT_SPEC', 'FLOW_SPEC', 'SYSTEM_PROMPT', 'CUSTOM');
CREATE TYPE document_format AS ENUM ('markdown', 'html', 'json');
CREATE TYPE file_type AS ENUM ('upload', 'generated', 'canvas_export');

-- ============================================================================
-- TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Projects
-- ----------------------------------------------------------------------------
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category project_category NOT NULL,
    status project_status NOT NULL DEFAULT 'draft',
    progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    thumbnail_url TEXT,
    settings JSONB NOT NULL DEFAULT '{}',
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_accessed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);

-- ----------------------------------------------------------------------------
-- Canvases
-- ----------------------------------------------------------------------------
CREATE TABLE canvases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL DEFAULT 'Main Canvas',
    viewport JSONB NOT NULL DEFAULT '{"x": 0, "y": 0, "zoom": 1}',
    is_main BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_canvases_project ON canvases(project_id);

-- Ensure only one main canvas per project
CREATE UNIQUE INDEX idx_canvases_main_per_project 
    ON canvases(project_id) WHERE is_main = TRUE;

-- ----------------------------------------------------------------------------
-- Flow Nodes (Normalized)
-- ----------------------------------------------------------------------------
CREATE TABLE flow_nodes (
    id VARCHAR(100) NOT NULL,
    canvas_id UUID NOT NULL REFERENCES canvases(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    position_x FLOAT NOT NULL,
    position_y FLOAT NOT NULL,
    width FLOAT,
    height FLOAT,
    data JSONB NOT NULL DEFAULT '{}',
    style JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    PRIMARY KEY (canvas_id, id)
);

CREATE INDEX idx_flow_nodes_canvas ON flow_nodes(canvas_id);
CREATE INDEX idx_flow_nodes_type ON flow_nodes(type);

-- ----------------------------------------------------------------------------
-- Flow Edges (Normalized)
-- ----------------------------------------------------------------------------
CREATE TABLE flow_edges (
    id VARCHAR(100) NOT NULL,
    canvas_id UUID NOT NULL REFERENCES canvases(id) ON DELETE CASCADE,
    source_node VARCHAR(100) NOT NULL,
    target_node VARCHAR(100) NOT NULL,
    source_handle VARCHAR(50),
    target_handle VARCHAR(50),
    label VARCHAR(100),
    edge_type VARCHAR(50) NOT NULL DEFAULT 'smoothstep',
    animated BOOLEAN NOT NULL DEFAULT FALSE,
    style JSONB DEFAULT '{}',
    
    PRIMARY KEY (canvas_id, id)
);

CREATE INDEX idx_flow_edges_canvas ON flow_edges(canvas_id);
CREATE INDEX idx_flow_edges_source ON flow_edges(canvas_id, source_node);
CREATE INDEX idx_flow_edges_target ON flow_edges(canvas_id, target_node);

-- ----------------------------------------------------------------------------
-- Chat Sessions
-- ----------------------------------------------------------------------------
CREATE TABLE chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(200),
    context_summary TEXT,
    message_count INTEGER NOT NULL DEFAULT 0,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_message_at TIMESTAMPTZ
);

CREATE INDEX idx_chat_sessions_project ON chat_sessions(project_id);
CREATE INDEX idx_chat_sessions_started ON chat_sessions(started_at DESC);

-- ----------------------------------------------------------------------------
-- Chat Messages
-- ----------------------------------------------------------------------------
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    role chat_role NOT NULL,
    content TEXT NOT NULL,
    canvas_snapshot JSONB,
    suggested_actions JSONB,
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_chat_messages_session ON chat_messages(session_id, created_at DESC);
CREATE INDEX idx_chat_messages_role ON chat_messages(role);

-- ----------------------------------------------------------------------------
-- Generated Documents
-- ----------------------------------------------------------------------------
CREATE TABLE generated_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    doc_type document_type NOT NULL,
    title VARCHAR(300) NOT NULL,
    content TEXT NOT NULL,
    format document_format NOT NULL DEFAULT 'markdown',
    version INTEGER NOT NULL DEFAULT 1,
    metadata JSONB NOT NULL DEFAULT '{}',
    generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_documents_project ON generated_documents(project_id);
CREATE INDEX idx_documents_type ON generated_documents(doc_type);
CREATE INDEX idx_documents_generated ON generated_documents(generated_at DESC);

-- ----------------------------------------------------------------------------
-- Project Files
-- ----------------------------------------------------------------------------
CREATE TABLE project_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    filename VARCHAR(500) NOT NULL,
    original_name VARCHAR(500) NOT NULL,
    mime_type VARCHAR(100),
    size_bytes BIGINT,
    storage_path TEXT NOT NULL,
    file_type file_type NOT NULL DEFAULT 'upload',
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_files_project ON project_files(project_id);
CREATE INDEX idx_files_type ON project_files(file_type);

-- ----------------------------------------------------------------------------
-- Checklist Templates
-- ----------------------------------------------------------------------------
CREATE TABLE checklist_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category project_category NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    items JSONB NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_checklist_templates_category ON checklist_templates(category);
CREATE UNIQUE INDEX idx_checklist_templates_default 
    ON checklist_templates(category) WHERE is_default = TRUE;

-- ----------------------------------------------------------------------------
-- Project Checklists (Instance of template)
-- ----------------------------------------------------------------------------
CREATE TABLE project_checklists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    template_id UUID REFERENCES checklist_templates(id),
    current_step INTEGER NOT NULL DEFAULT 0,
    completed_steps JSONB NOT NULL DEFAULT '[]',
    custom_items JSONB NOT NULL DEFAULT '[]',
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);

CREATE INDEX idx_project_checklists_project ON project_checklists(project_id);

-- ----------------------------------------------------------------------------
-- Knowledge Entries (For RAG)
-- ----------------------------------------------------------------------------
CREATE TABLE knowledge_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category project_category NOT NULL,
    title VARCHAR(300) NOT NULL,
    content TEXT NOT NULL,
    content_type VARCHAR(50) NOT NULL,
    tags TEXT[] DEFAULT '{}',
    file_path TEXT,
    embedding vector(1536),  -- OpenAI embedding dimension
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_knowledge_category ON knowledge_entries(category);
CREATE INDEX idx_knowledge_type ON knowledge_entries(content_type);
CREATE INDEX idx_knowledge_tags ON knowledge_entries USING GIN(tags);
CREATE INDEX idx_knowledge_embedding ON knowledge_entries USING ivfflat (embedding vector_cosine_ops);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_updated_at 
    BEFORE UPDATE ON projects 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER canvases_updated_at 
    BEFORE UPDATE ON canvases 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER knowledge_updated_at 
    BEFORE UPDATE ON knowledge_entries 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create main canvas when project is created
CREATE OR REPLACE FUNCTION create_main_canvas()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO canvases (project_id, name, is_main)
    VALUES (NEW.id, 'Main Canvas', TRUE);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_create_canvas
    AFTER INSERT ON projects
    FOR EACH ROW EXECUTE FUNCTION create_main_canvas();

-- Auto-update message count in chat session
CREATE OR REPLACE FUNCTION update_message_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE chat_sessions 
    SET 
        message_count = message_count + 1,
        last_message_at = NOW()
    WHERE id = NEW.session_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER messages_update_count
    AFTER INSERT ON chat_messages
    FOR EACH ROW EXECUTE FUNCTION update_message_count();

-- ============================================================================
-- INITIAL DATA: Default Checklist Templates
-- ============================================================================

-- Software Checklist Template
INSERT INTO checklist_templates (category, name, description, items, is_default)
VALUES (
    'software',
    'Software Development Checklist',
    'Checklist padrão para desenvolvimento de software',
    '[
        {"id": "step-1", "title": "🎯 Definir o Problema", "description": "Qual problema você está resolvendo?", "estimatedTime": "~5 min"},
        {"id": "step-2", "title": "👥 Identificar Usuários", "description": "Quem são seus usuários?", "estimatedTime": "~5 min"},
        {"id": "step-3", "title": "💡 Definir MVP", "description": "Qual o escopo mínimo viável?", "estimatedTime": "~10 min"},
        {"id": "step-4", "title": "🏗️ Desenhar Arquitetura", "description": "Como o sistema será estruturado?", "estimatedTime": "~15 min"},
        {"id": "step-5", "title": "🎨 Definir UI/UX", "description": "Como será a interface?", "estimatedTime": "~10 min"},
        {"id": "step-6", "title": "🔌 Definir Integrações", "description": "Quais serviços externos?", "estimatedTime": "~5 min"},
        {"id": "step-7", "title": "📄 Gerar Documentação", "description": "Gerar TIS/PRD", "estimatedTime": "~2 min"}
    ]'::jsonb,
    TRUE
);

-- Agents Checklist Template
INSERT INTO checklist_templates (category, name, description, items, is_default)
VALUES (
    'agents',
    'Multi-Agent System Checklist',
    'Checklist padrão para sistemas multi-agentes',
    '[
        {"id": "step-1", "title": "🎯 Mapear Dores", "description": "Quais problemas os agentes resolverão?", "estimatedTime": "~10 min"},
        {"id": "step-2", "title": "🔍 Avaliar Oportunidades", "description": "Onde IA agrega mais valor?", "estimatedTime": "~10 min"},
        {"id": "step-3", "title": "🤖 Definir Agentes", "description": "Quais agentes são necessários?", "estimatedTime": "~15 min"},
        {"id": "step-4", "title": "🔧 Selecionar Tools", "description": "Quais ferramentas os agentes usarão?", "estimatedTime": "~10 min"},
        {"id": "step-5", "title": "📚 Definir Knowledge", "description": "Qual conhecimento os agentes precisam?", "estimatedTime": "~10 min"},
        {"id": "step-6", "title": "🔄 Desenhar Workflow", "description": "Como os agentes colaboram?", "estimatedTime": "~15 min"},
        {"id": "step-7", "title": "📄 Gerar Specs", "description": "Gerar Agent Spec + Prompts", "estimatedTime": "~2 min"}
    ]'::jsonb,
    TRUE
);

-- Automation Checklist Template
INSERT INTO checklist_templates (category, name, description, items, is_default)
VALUES (
    'automation',
    'Automation Flow Checklist',
    'Checklist padrão para automações de atendimento',
    '[
        {"id": "step-1", "title": "🗺️ Mapear Jornada", "description": "Qual a jornada do cliente?", "estimatedTime": "~10 min"},
        {"id": "step-2", "title": "🎯 Identificar Touchpoints", "description": "Onde automatizar?", "estimatedTime": "~5 min"},
        {"id": "step-3", "title": "💬 Definir Tom de Voz", "description": "Como o bot deve falar?", "estimatedTime": "~5 min"},
        {"id": "step-4", "title": "📝 Criar Fluxos", "description": "Desenhar conversas", "estimatedTime": "~20 min"},
        {"id": "step-5", "title": "🔌 Definir Integrações", "description": "CRM, WhatsApp, etc", "estimatedTime": "~5 min"},
        {"id": "step-6", "title": "🚨 Definir Escalações", "description": "Quando transferir para humano?", "estimatedTime": "~5 min"},
        {"id": "step-7", "title": "📄 Gerar Specs", "description": "Gerar Flow Spec", "estimatedTime": "~2 min"}
    ]'::jsonb,
    TRUE
);
```

---
# PARTE 3: IMPLEMENTAÇÃO DAS FEATURES

---

## 8. FEATURE 1: PROJECT HUB

VER ARQUIVO "project_hub.md"

---

## 9. FEATURE 2: CANVAS WORKSPACE

Ver arquivo "canvas_workspace.md"


---
# PARTE 4: PARTNER THINKING (AI ASSISTANT)

## 10. FEATURE 3: PARTNER THINKING

VER ARQUIVO "Partner.thinking.md"


---
# PARTE 5: DOCUMENT GENERATOR E DEPLOY

VER ARQUIVO "Document_generator.md"
---

