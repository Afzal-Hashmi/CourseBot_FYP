#!/bin/bash

# Start containers in detached mode
docker-compose up -d

# Wait for the database to be ready
echo "Waiting for Postgres to be ready..."
until docker-compose exec db pg_isready -U coursebot -d coursebotdb; do
  sleep 2
done

# Run Alembic migrations
echo "Running Alembic migrations..."
docker-compose exec backend alembic upgrade head

# Optionally seed roles if not present
echo "Seeding roles if needed..."
docker-compose exec backend bash -c "
python3 <<EOF
import os
from sqlalchemy import create_engine, text

db_url = os.environ.get('DATABASE_URL')
if db_url:
    engine = create_engine(db_url)
    with engine.connect() as conn:
        result = conn.execute(text(\"SELECT COUNT(*) FROM roles WHERE role IN ('teacher', 'student')\"))
        count = result.scalar()
        if count == 0:
            conn.execute(text(\"INSERT INTO roles (role) VALUES ('teacher'), ('student')\"))
            print('Seeded roles: teacher, student')
        else:
            print('Roles already seeded')
EOF
"

echo "All done! Backend should be running at http://localhost:8000" 