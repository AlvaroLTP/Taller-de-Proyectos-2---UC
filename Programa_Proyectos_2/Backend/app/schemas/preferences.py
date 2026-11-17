from typing import Annotated, Literal

from pydantic import Field, model_validator

from app.schemas.base import InputModel, TimeString
from app.services.validation_service import ValidationService

RestrictionList = Annotated[
    list[Annotated[str, Field(min_length=1, max_length=200)]], Field(max_length=30)
]


class Preferences(InputModel):
    preferred_time: TimeString = "09:00"
    time_window_start: TimeString = "09:00"
    time_window_end: TimeString = "12:00"
    priority: Literal["high", "medium", "low"] = "medium"
    restrictions: RestrictionList = Field(default_factory=list)
    requires_special_attention: bool = False
    no_lunch_hours: bool = False
    requires_phone_coordination: bool = False
    observations: str = ""

    @model_validator(mode="after")
    def coherent_window(self):
        if not ValidationService.validate_time_window(
            self.time_window_start, self.time_window_end
        ):
            raise ValueError("Ventana horaria inválida")
        if not self.time_window_start <= self.preferred_time <= self.time_window_end:
            raise ValueError("La hora preferida debe estar dentro de la ventana")
        return self


class Restrictions(InputModel):
    restrictions: RestrictionList = Field(default_factory=list)
