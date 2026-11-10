def test_health(api):
    api.headers.clear()
    assert api.get("/health").json() == {"status": "ok"}
    assert api.get("/health/ready").json() == {"status": "ok", "db": True}
