import re


class ValidationService:
    @staticmethod
    def validate_time_window(start: str, end: str):
        pattern = r"([01]\d|2[0-3]):[0-5]\d"
        return bool(
            isinstance(start, str)
            and isinstance(end, str)
            and re.fullmatch(pattern, start)
            and re.fullmatch(pattern, end)
            and start < end
        )
