def test_list_orders(api, seed):
    response = api.get("/api/v1/orders/")
    assert response.status_code == 200
    assert len(response.json()) == 1
