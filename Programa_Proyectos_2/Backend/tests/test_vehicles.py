from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_vehicles_list():
    r = client.get('/api/v1/vehicles')
    assert r.status_code == 200