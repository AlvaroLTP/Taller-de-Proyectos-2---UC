import asyncio
from types import SimpleNamespace as Item
from uuid import uuid4

import pytest

from app.schemas.parameter import ParameterBase
from app.services.optimization_service import BasicOptimizationService


def context(**parameter_changes):
    driver = Item(id=uuid4(), vehicle_id=None, shift_start="08:00", shift_end="16:00")
    vehicle = Item(
        id=uuid4(),
        driver_id=None,
        capacity_kg=100,
        capacity_m3=10,
        emissions_per_km=0.2,
    )
    order = Item(
        id=uuid4(),
        code="P-1",
        priority="high",
        weight_kg=10,
        volume_m3=1,
        lat=-12.04,
        lng=-77.03,
        time_window_start="09:00",
        time_window_end="16:00",
        pref_time_window_start="09:00",
        pref_time_window_end="16:00",
        requires_special_attention=False,
        no_lunch_hours=False,
        street="Lima",
        district="Lima",
    )
    return {
        "drivers": [driver],
        "vehicles": [vehicle],
        "orders": [order],
        "date": "2026-10-26",
        "parameters": ParameterBase(**parameter_changes),
    }


def plan(ctx):
    return asyncio.run(BasicOptimizationService().generate_routes(ctx))


def test_deterministic_plan():
    ctx = context()
    assert plan(ctx) == plan(ctx)


@pytest.mark.parametrize("field,value", [("weight_kg", 101), ("volume_m3", 11)])
def test_capacity_constraints(field, value):
    ctx = context()
    setattr(ctx["orders"][0], field, value)
    assert plan(ctx).metrics["errors"]


def test_distance_limit():
    ctx = context(max_distance_km=1)
    another = Item(**vars(ctx["orders"][0]))
    another.id, another.code, another.lng = uuid4(), "P-2", -76.8
    ctx["orders"].append(another)
    assert plan(ctx).routes == []


def test_delivery_count_limit_no_partial_result():
    ctx = context(max_deliveries_per_route=1)
    another = Item(**vars(ctx["orders"][0]))
    another.id = uuid4()
    ctx["orders"].append(another)
    assert plan(ctx).routes == []


def test_shift_and_operation_limit():
    ctx = context(max_operation_time_h=0.5)
    assert plan(ctx).metrics["errors"]
    ctx = context()
    ctx["drivers"][0].shift_end = "09:05"
    assert plan(ctx).metrics["errors"]


def test_lunch_window_and_special_attention():
    ctx = context()
    order = ctx["orders"][0]
    order.no_lunch_hours = True
    order.requires_special_attention = True
    order.time_window_start = order.pref_time_window_start = "12:00"
    assert plan(ctx).routes[0]["estimated_arrival_time"] == "14:20"
    order.time_window_end = order.pref_time_window_end = "13:00"
    assert plan(ctx).metrics["errors"]


def test_incompatible_vehicle_assignment():
    ctx = context()
    ctx["drivers"][0].vehicle_id = uuid4()
    assert plan(ctx).metrics["errors"]
