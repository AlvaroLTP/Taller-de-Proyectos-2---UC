from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_orders_list():
    r = client.get('/api/v1/orders')
    assert r.status_code == 200