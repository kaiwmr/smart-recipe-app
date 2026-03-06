from slowapi import Limiter
from slowapi.util import get_remote_address

# Wir identifizieren die User anhand ihrer IP-Adresse
limiter = Limiter(key_func=get_remote_address)