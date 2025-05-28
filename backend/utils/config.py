import os
from dotenv import load_dotenv

load_dotenv('../.env')

class Config:
    AUTH0_CLIENT_ID = os.getenv('AUTH0_CLIENT_ID')
    AUTH0_CLIENT_SECRET = os.getenv('AUTH0_CLIENT_SECRET')
    AUTH0_DOMAIN = os.getenv('AUTH0_DOMAIN')
    AUTH0_ISSUER_BASE_URL = f"https://{AUTH0_DOMAIN}"