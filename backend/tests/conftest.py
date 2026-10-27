import pytest
from app.db.database import init_db
from app.main import seed_monitoring_demo_data

@pytest.fixture(scope="session", autouse=True)
def prepare_test_monitoring_db():
    init_db()
    seed_monitoring_demo_data()
