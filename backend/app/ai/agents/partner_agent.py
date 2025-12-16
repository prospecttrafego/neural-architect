from agno.agent import Agent
from backend.app.ai.models.model_config import ModelConfig
from backend.app.ai.tools.canvas_tools import CanvasTools
from backend.app.ai.prompts.system_prompts import PARTNER_SYSTEM_PROMPT

class PartnerAgent:
    def __init__(self, db_session):
        self.db = db_session
        self.canvas_tools = CanvasTools(db_session)
        
        self.agent = Agent(
            model=ModelConfig.get_sonnet(),
            system_prompt=PARTNER_SYSTEM_PROMPT,
            tools=[self.canvas_tools],
            show_tool_calls=True,
            markdown=True,
        )

    def chat(self, message: str, project_id: str, stream: bool = True):
        # We can inject project_id into the context or prompt if needed
        # For now, we rely on the agent calling tools with the project_id if we provide it in the message
        # Or better, we prepend context.
        
        context_message = f"User is working on Project ID: {project_id}. {message}"
        
        if stream:
            return self.agent.run(context_message, stream=True)
        else:
            return self.agent.run(context_message, stream=False)
