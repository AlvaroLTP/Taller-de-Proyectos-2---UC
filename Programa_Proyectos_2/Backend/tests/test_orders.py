def test_list_orders(api, seed):
    response = api.get("/api/v1/orders/")
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_list_orders_accepts_bounded_pagination_and_filters(api, seed):
    response = api.get("/api/v1/orders/?limit=1&offset=0&status=pending&delivery_date=2026-10-26")
    assert response.status_code == 200
    assert response.headers["X-Total-Count"] == "1"
    assert [item["id"] for item in response.json()] == [seed["order"]["id"]]
