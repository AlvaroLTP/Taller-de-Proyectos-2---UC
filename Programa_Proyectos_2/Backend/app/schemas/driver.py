from typing import Literal
from uuid import UUID

from pydantic import Field, model_validator

from app.schemas.base import InputModel, TimeString, partial_model
from app.services.validation_service import ValidationService


class DriverBase(InputModel):
    name: str = Field(min_length=1)
    dni: str = Field(pattern=r"^\d{8}$")
    phone: str = Field(min_length=1)
    license: str = Field(min_length=1)
    license_type: str = "B-II"
    status: Literal["available", "in_route", "unavailable", "resting"] = "available"
    available: bool = True
    vehicle_id: UUID | None = None
    shift_start: TimeString = "08:00"
    shift_end: TimeString = "16:00"
    avatar_initials: str = "XX"

    @model_validator(mode="after")
    def coherent_shift(self):
        if (
            self.shift_start is not None
            and self.shift_end is not None
            and not ValidationService.validate_time_window(
                self.shift_start, self.shift_end
            )
        ):
            raise ValueError("El fin del turno debe ser posterior al inicio")
        return self


class DriverCreate(DriverBase):
    pass


DriverUpdate = partial_model("DriverUpdate", DriverBase)


class DriverResponse(DriverBase):
    id: UUID
