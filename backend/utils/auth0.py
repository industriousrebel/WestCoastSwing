from fastapi import HTTPException, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import requests
import jwt
from jwt.algorithms import RSAAlgorithm
from functools import wraps
from typing import Optional, Dict, Any
from utils.config import Config


security = HTTPBearer()

def get_public_key(kid: str) -> Optional[Dict]:
    url = f"https://{Config.AUTH0_ISSUER_BASE_URL}/.well-known/jwks.json"
    response = requests.get(url)
    jwks = response.json()
    keys = jwks["keys"]
    for key in keys:
        if key["kid"] == kid:
            return key
    return None

def verify_token(token: str) -> Optional[Dict[str, Any]]:
    try:
        headers = jwt.get_unverified_header(token)
        kid = headers["kid"]
        key = get_public_key(kid)
        if not key:
            return None
        public_key = RSAAlgorithm.from_jwk(key)
        decoded_token = jwt.decode(
            token, public_key, algorithms=["RS256"]
        )
        return decoded_token
    except jwt.InvalidTokenError:
        return None

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    token = credentials.credentials
    validated_data = verify_token(token)
    if not validated_data:
        raise HTTPException(status_code=401, detail="Invalid token")
    return validated_data

# Alternative decorator approach (if you prefer decorators)
def check_jwt(f):
    @wraps(f)
    async def decorated_function(*args, **kwargs):
        # This would need to be adapted based on your specific FastAPI setup
        # The Depends approach above is more idiomatic for FastAPI
        return await f(*args, **kwargs)
    return decorated_function