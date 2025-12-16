from agno.agent import Agent
from backend.app.ai.models.model_config import ModelConfig

class DocumentAgent:
    def __init__(self):
        # Using Opus for high quality generation
        self.agent = Agent(
            model=ModelConfig.get_opus(),
            markdown=True,
        )

    async def generate(self, system_prompt: str, user_prompt: str) -> str:
        # Create a temporary agent with the specific system prompt for this task
        # Or just use the generic agent with instructions
        
        # We can re-instantiate or just run with additional instructions.
        # For clarity, let's configure the agent per run or have specific methods.
        
        # Better approach:
        agent = Agent(
            model=ModelConfig.get_opus(),
            system_prompt=system_prompt,
            markdown=True
        )
        
        response = agent.run(user_prompt)
        # Agno agent.run returns a RunResponse object, content is in .content
        return response.content
