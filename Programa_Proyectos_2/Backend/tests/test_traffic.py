def test_traffic(api):
    response = api.get("/api/v1/traffic/status")
    assert response.status_code == 200
    assert response.json()["available"] is False
