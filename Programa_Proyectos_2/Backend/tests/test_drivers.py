def test_list_drivers(api, seed):
    response = api.get("/api/v1/drivers/")
    assert response.status_code == 200
    assert len(response.json()) == 1
