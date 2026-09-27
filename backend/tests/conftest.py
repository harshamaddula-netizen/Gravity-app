import pytest
import asyncio
import os
import sys
from pathlib import Path

# Add backend directory to sys.path so app can be imported
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))
sys.path.insert(0, str(backend_dir / "app"))

from app.database.database import init_db

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    asyncio.run(init_db())
