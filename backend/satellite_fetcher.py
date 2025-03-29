import os
from sentinelhub import SHConfig

def get_sentinelhub_config():
    config = SHConfig()
    config.instance_id = os.getenv("SENTINELHUB_INSTANCE_ID", "")
    config.sh_client_id = os.getenv("SENTINELHUB_CLIENT_ID", "")
    config.sh_client_secret = os.getenv("SENTINELHUB_CLIENT_SECRET", "")

    if not config.sh_client_id or not config.sh_client_secret:
        raise ValueError("🚨 SentinelHub API keys are not set properly in .env")

    return config

def fetch_satellite_images(bbox, date_from, date_to):
    # Placeholder for now — you'll implement this later
    print(f"🛰️ Fetching satellite images for: {bbox}, {date_from} to {date_to}")
    return "placeholder_image_path_before", "placeholder_image_path_after"
