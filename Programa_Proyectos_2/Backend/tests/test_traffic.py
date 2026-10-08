from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_traffic_status():
    r = client.get('/api/v1/traffic/status')
    assert r.status_code == 200
    data = r.json()
    assert 'available' in data
    assert data['available'] == False