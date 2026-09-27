#!/usr/bin/env python3
import sys
import httpx

def main():
    base_url = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:8000"
    health_url = f"{base_url}/api/v1/health"
    print(f"Checking health at {health_url}...")
    try:
        res = httpx.get(health_url, timeout=5.0)
        if res.status_code == 200:
            print("HEALTH CHECK SUCCESSFUL:")
            print(res.json())
            sys.exit(0)
        else:
            print(f"Health check failed with status code {res.status_code}: {res.text}")
            sys.exit(1)
    except Exception as e:
        print(f"Health check failed: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
