"""Simple test server to check if basic FastAPI works."""

from fastapi import FastAPI

app = FastAPI(title="Test API")

@app.get("/health")
def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)