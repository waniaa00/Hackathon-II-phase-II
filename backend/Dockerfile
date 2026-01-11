FROM python:3.11-slim

WORKDIR /app

# Cache buster - change this value to force rebuild
ARG CACHEBUST=2

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency files
COPY requirements.txt ./

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code (updated: SHA256 password fix)
COPY . ./

# Verify the SHA256 fix is present (forces cache invalidation)
RUN grep -q "_hash_password_sha256" main.py || echo "Warning: SHA256 fix not found"

# Create necessary directories
RUN mkdir -p /app/logs

# Expose standard port for Render (Render will set this)
EXPOSE 8000

# Health check endpoint - Render typically uses port 10000+ for internal checks
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Run the application with Render's PORT environment variable
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000} --workers 1"]
