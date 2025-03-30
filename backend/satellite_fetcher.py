import os
from sentinelhub import SHConfig, BBox, CRS, SentinelHubRequest, DataCollection, MimeType
from datetime import datetime, timedelta
import numpy as np
from PIL import Image
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

# Define ABSOLUTE path to the shared data folder
data_folder = Path(__file__).resolve().parent.parent / "data"
os.makedirs(data_folder, exist_ok=True)

def get_sentinelhub_config():
    config = SHConfig()
    config.sh_client_id = os.getenv("SENTINELHUB_CLIENT_ID")
    config.sh_client_secret = os.getenv("SENTINELHUB_CLIENT_SECRET")
    config.instance_id = os.getenv("SENTINELHUB_INSTANCE_ID")

    print("🔐 CLIENT ID:", config.sh_client_id)
    print("🔐 CLIENT SECRET:", config.sh_client_secret[:6] + "...")
    print("🔐 INSTANCE ID:", config.instance_id)

    if not config.sh_client_id or not config.sh_client_secret or not config.instance_id:
        raise RuntimeError("❌ SentinelHub credentials not set properly.")

    return config

def fetch_satellite_images(bbox_coords, date_before, date_after, size=(512, 512)):
    config = get_sentinelhub_config()
    bbox = BBox(bbox=bbox_coords, crs=CRS.WGS84)

    evalscript = """
    //VERSION=3
    function setup() {
      return {
        input: ["B04", "B03", "B02"],
        output: { bands: 3 }
      };
    }
    function evaluatePixel(sample) {
      return [sample.B04, sample.B03, sample.B02];
    }
    """

    def request_image(date, suffix):
        target_date = datetime.strptime(date, "%Y-%m-%d")
        start = (target_date - timedelta(days=10)).strftime("%Y-%m-%d")
        end = (target_date + timedelta(days=10)).strftime("%Y-%m-%d")

        request = SentinelHubRequest(
            evalscript=evalscript,
            input_data=[SentinelHubRequest.input_data(
                data_collection=DataCollection.SENTINEL2_L1C,
                time_interval=(start, end),
                mosaicking_order='leastCC'
            )],
            responses=[SentinelHubRequest.output_response("default", MimeType.PNG)],
            bbox=bbox,
            size=size,
            config=config
        )

        image_data = request.get_data()[0]
        image = Image.fromarray(np.uint8(image_data))

        filename = data_folder / f"satellite_{date}_{suffix}.png"
        image.save(filename)
        print(f"📏 Saved image to: {filename}")
        return str(filename)

    print("📸 Fetching BEFORE image:", date_before)
    before_image = request_image(date_before, "before")

    print("📸 Fetching AFTER image:", date_after)
    after_image = request_image(date_after, "after")

    return before_image, after_image
