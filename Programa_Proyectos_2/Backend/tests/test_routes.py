from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_routes_validate_empty():
    r = client.post('/api/v1/routes/validate', json={'order_ids':[], 'vehicle_ids':[], 'driver_ids':[], 'date':'2026-01-01'})
    assert r.status_code == 200
    data = r.json()
    assert 'valid' in data
    assert 'errors' in data

def test_routes_generate_empty():
    r = client.post('/api/v1/routes/generate', json={'order_ids':[], 'vehicle_ids':[], 'driver_ids':[], 'date':'2026-01-01'})
    assert r.status_code == 200
    data = r.json()
    assert 'generation_time_ms' in data