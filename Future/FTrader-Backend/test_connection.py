import os
import psycopg2
from psycopg2 import OperationalError

try:
    print("Testing PostgreSQL connection...")
    print(f"DB_HOST: {os.environ.get('DB_HOST')}")
    print(f"DB_USER: {os.environ.get('DB_USER')}")
    print(f"DB_NAME: {os.environ.get('DB_NAME')}")
    
    conn = psycopg2.connect(
        host=os.environ.get('DB_HOST'),
        user=os.environ.get('DB_USER'),
        password=os.environ.get('DB_PASSWORD'),
        dbname=os.environ.get('DB_NAME')
    )
    
    print("Successfully connected to PostgreSQL!")
    
    # Test a simple query
    with conn.cursor() as cur:
        cur.execute("SELECT 1")
        result = cur.fetchone()
        print(f"Test query result: {result}")

except OperationalError as e:
    print(f"PostgreSQL connection failed: {e}")
except Exception as e:
    print(f"Unexpected error: {e}")
finally:
    if 'conn' in locals():
        conn.close()
