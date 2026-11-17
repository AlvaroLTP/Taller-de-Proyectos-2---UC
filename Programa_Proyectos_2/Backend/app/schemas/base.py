from typing import Annotated, Literal

from pydantic import BaseModel, ConfigDict, Field, create_model

TimeString = Annotated[str, Field(pattern=r"^([01]\d|2[0-3]):[0-5]\d$")]
FuelType = Literal["diesel", "gasoline", "electric", "hybrid", "cng"]


class InputModel(BaseModel):
    model_config = ConfigDict(
        extra="forbid",
        str_strip_whitespace=True,
        str_max_length=2000,
        allow_inf_nan=False,
        from_attributes=True,
    )


def partial_model(name, base):
    # Omitted fields stay unset. Explicit null retains the original type checks.
    return create_model(
        name,
        __base__=base,
        **{
            key: (Annotated[field.annotation, *field.metadata], None)
            if field.metadata
            else (field.annotation, None)
            for key, field in base.model_fields.items()
        },
    )
