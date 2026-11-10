def test_list_vehicles(api, seed):
    response = api.get("/api/v1/vehicles/")
    assert response.status_code == 200
    assert len(response.json()) == 1
