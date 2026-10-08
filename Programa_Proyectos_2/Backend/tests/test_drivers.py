from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_drivers_list():
    r = client.get('/api/v1/drivers')
    assert r.status_code == 200