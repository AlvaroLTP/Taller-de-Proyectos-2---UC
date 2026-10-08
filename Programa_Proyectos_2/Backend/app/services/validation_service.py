# Shared validation helpers
class ValidationService:
    @staticmethod
    def validate_time_window(start: str, end: str):
        try:
            h1, m1 = map(int, start.split(':'))
            h2, m2 = map(int, end.split(':'))
            t1 = h1*60+m1
            t2 = h2*60+m2
            return t2 > t1
        except Exception:
            return False