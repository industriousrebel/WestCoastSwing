from fastapi import HTTPException, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import requests
import jwt,os
from jwt.algorithms import RSAAlgorithm
from functools import wraps
from typing import Optional, Dict, Any
from pathlib import Path
from dotenv import load_dotenv
from auth0.authentication import Users
security = HTTPBearer()

env_path = Path(__file__).resolve().parents[1] / ".env"
load_dotenv(dotenv_path=env_path)


AUTH0_ISSUER_BASE_URL = os.getenv("AUTH0_ISSUER_BASE_URL")
AUTH0_AUDIENCE = os.getenv("AUTH0_AUDIANCE_URL")

def get_public_key(kid: str) -> Optional[Dict]:

    url = f"https://{AUTH0_ISSUER_BASE_URL}/.well-known/jwks.json"
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
            token, public_key, algorithms=["RS256"], audience=f"{AUTH0_AUDIENCE}"
        )
        print(decoded_token)
        return decoded_token
    except jwt.InvalidTokenError:
        return None

def get_current_user(token: str) -> Optional[Dict[str, Any]]:
       # Initialize the Users class with your Auth0 domain
       users = Users(domain=AUTH0_ISSUER_BASE_URL)
       # Replace with your actual access token
       access_token = token
       try:
           user_info = users.userinfo(access_token)
           print(user_info, 'here')
       except Exception as e:
           print(f"Error fetching user info: {e}")
    

# Or better yet, create a dependency function that can be used with Depends()
def require_auth(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    """Dependency function that can be used with Depends() to require authentication"""
    token = credentials.credentials
    validated_data = verify_token(token)
    if not validated_data:
        raise HTTPException(status_code=401, detail="Invalid token")
    