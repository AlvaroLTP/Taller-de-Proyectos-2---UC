from pydantic import BaseModel
from typing import List

class Preferences(BaseModel):
    preferred_time: str = '09:00'
    time_window_start: str = '09:00'
    time_window_end: str = '12:00'
    priority: str = 'medium'
    restrictions: List[str] = []
    requires_special_attention: bool = False
    no_lunch_hours: bool = False
    requires_phone_coordination: bool = False
    observations: str = ''

class Restrictions(BaseModel):
    restrictions: List[str] = []