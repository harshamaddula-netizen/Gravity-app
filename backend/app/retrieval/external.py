from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
import logging

logger = logging.getLogger("truthlens")

class ExternalEvidenceProvider(ABC):
    @abstractmethod
    async def search(self, claim: str, limit: int = 5) -> List[Dict[str, Any]]:
        """Search an external provider for evidence relating to the claim."""
        pass

class MockExternalEvidenceProvider(ExternalEvidenceProvider):
    """
    Default mock external adapter when no third-party API credentials are configured.
    Maintains clean decoupling for future Tavily, Bing, or Google Fact Check API integration.
    """
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key

    async def search(self, claim: str, limit: int = 5) -> List[Dict[str, Any]]:
        # In MVP demo mode with no external credentials, returns empty list so local corpus is prioritized
        return []
