from agno.models.anthropic import Claude
from agno.models.openai import OpenAIChat
from backend.app.config import settings

class ModelConfig:
    """Configuration for AI Models used in Neural Architect"""
    
    @staticmethod
    def get_haiku():
        """Fast model for simple tasks/tools"""
        return Claude(
            id="claude-3-haiku-20240307",
            api_key=settings.ANTHROPIC_API_KEY
        )

    @staticmethod
    def get_sonnet():
        """Balanced model for reasoning and chat"""
        return Claude(
            id="claude-3-5-sonnet-20240620",
            api_key=settings.ANTHROPIC_API_KEY
        )

    @staticmethod
    def get_opus():
        """Powerful model for complex generation"""
        return Claude(
            id="claude-3-opus-20240229",
            api_key=settings.ANTHROPIC_API_KEY
        )
    
    @staticmethod
    def get_gpt4o():
        """Alternative strong model"""
        return OpenAIChat(
            id="gpt-4o",
            api_key=settings.OPENAI_API_KEY
        )
