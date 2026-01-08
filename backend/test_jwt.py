"""
Test JWT Token Generation and Validation
"""
import jwt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

print("=" * 50)
print("JWT Token Test")
print("=" * 50)
print(f"SECRET_KEY: {SECRET_KEY[:10]}...")
print(f"ALGORITHM: {ALGORITHM}")
print(f"EXPIRE_MINUTES: {ACCESS_TOKEN_EXPIRE_MINUTES}")
print()

# Create a test token for user ID 1 (must be string!)
print("1. Creating test token for user_id=1...")
data = {"sub": "1"}  # JWT sub must be a string
to_encode = data.copy()
expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
to_encode.update({"exp": expire})
token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
print(f"   Token: {token[:50]}...")
print()

# Decode the token
print("2. Decoding the token...")
try:
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    print(f"   Payload: {payload}")
    user_id_str = payload.get("sub")
    print(f"   User ID string: {user_id_str} (type: {type(user_id_str)})")
    user_id = int(user_id_str)
    print(f"   Converted to int: {user_id} (type: {type(user_id)})")
    print("   [OK] Token is valid!")
except jwt.PyJWTError as e:
    print(f"   [ERROR] {e}")
print()

# Test with wrong secret
print("3. Testing with wrong secret...")
try:
    payload = jwt.decode(token, "wrong-secret", algorithms=[ALGORITHM])
    print("   ✗ Should have failed!")
except jwt.PyJWTError as e:
    print(f"   ✓ Correctly failed: {type(e).__name__}")
print()

# Test with expired token
print("4. Testing with expired token...")
expired_data = {"sub": "1", "exp": datetime.utcnow() - timedelta(minutes=1)}
expired_token = jwt.encode(expired_data, SECRET_KEY, algorithm=ALGORITHM)
try:
    payload = jwt.decode(expired_token, SECRET_KEY, algorithms=[ALGORITHM])
    print("   [ERROR] Should have failed!")
except jwt.ExpiredSignatureError:
    print("   [OK] Correctly failed: ExpiredSignatureError")
except jwt.PyJWTError as e:
    print(f"   [OK] Correctly failed: {type(e).__name__}")
print()

print("=" * 50)
print("All tests completed!")
print("=" * 50)
