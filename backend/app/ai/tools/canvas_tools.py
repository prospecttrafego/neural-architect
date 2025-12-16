from agno.agent import Agent
from agno.tools import Tool
from backend.app.services.canvas_service import CanvasService
from backend.app.schemas.canvas import CanvasUpdate
from typing import List, Dict, Any
import json

class CanvasTools(Tool):
    """Tools for interacting with the Neural Architect Canvas"""
    
    def __init__(self, db_session):
        self.db = db_session
        self.canvas_service = CanvasService()

    def read_canvas_state(self, project_id: str) -> str:
        """
        Reads the current state of the canvas for a given project.
        Returns a JSON string of nodes and edges.
        """
        # Logic to fetch canvas by project_id
        # Assuming project has one canvas for now or we fetch by project
        # In reality, we might need a method in service to get canvas by project
        canvas = self.canvas_service.get_by_project_id(self.db, project_id)
        if not canvas:
            return "Canvas not found for this project."
        
        state = {
            "nodes": canvas.nodes_data,
            "edges": canvas.edges_data
        }
        return json.dumps(state, indent=2)

    def suggest_node_additions(self, project_id: str, suggestion: str) -> str:
        """
        Records a suggestion for adding nodes. 
        Note: This tool does not directly modify the canvas yet, but returns a structured suggestion 
        that the UI can offer to the user.
        """
        return f"Suggestion recorded: {suggestion}"
