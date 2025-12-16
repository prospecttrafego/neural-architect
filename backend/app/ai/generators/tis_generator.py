from backend.app.ai.agents.document_agent import DocumentAgent
from backend.app.ai.prompts.document_prompts import TIS_SYSTEM_PROMPT
import json

class TisGenerator:
    def __init__(self):
        self.agent = DocumentAgent()

    async def generate_tis(self, project_name: str, project_description: str, canvas_data: dict) -> str:
        nodes_str = json.dumps(canvas_data.get('nodes', []), indent=2)
        edges_str = json.dumps(canvas_data.get('edges', []), indent=2)
        
        user_prompt = f"""
        Generate a TIS for Project: {project_name}
        Description: {project_description}
        
        Canvas Nodes:
        {nodes_str}
        
        Canvas Edges:
        {edges_str}
        """
        
        return await self.agent.generate(
            system_prompt=TIS_SYSTEM_PROMPT,
            user_prompt=user_prompt
        )
