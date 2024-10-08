#!/usr/bin/env python3
import sys
import os
import json
from google.protobuf.json_format import ParseDict
from google.protobuf.message import EncodeError

# Set up paths to include the root of the protos and meshtastic directories
sys.path.append(os.path.join(os.path.dirname(__file__), '../protos'))
sys.path.append(os.path.join(os.path.dirname(__file__), '../protos/meshtastic'))

# Import the protobuf module containing DeviceProfile
from clientonly_pb2 import DeviceProfile

def encrypt_profile(json_file_path):
  try:
    # Step 1: Read and Load JSON Configuration File
    with open(json_file_path, 'r', encoding='utf-8') as json_file:
      config_dict = json.load(json_file)

    # Step 2: Parse JSON to Protobuf using DeviceProfile
    config = DeviceProfile()
    try:
      ParseDict(config_dict, config)
      print("Successfully parsed JSON to DeviceProfile.")
    except Exception as e:
      raise ValueError(f"Failed to parse JSON to DeviceProfile: {e}")

    # Step 3: Serialize the DeviceProfile to a .cfg file
    cfg_file_path = os.path.join(os.path.dirname(json_file_path), os.path.basename(json_file_path).replace('.json', '.cfg'))
    with open(cfg_file_path, 'wb') as cfg_file:
      cfg_file.write(config.SerializeToString())
    print("Configuration has been written to .cfg file at:", cfg_file_path)

  except EncodeError as e:
    print(f"Error encoding DeviceProfile to binary: {e}")
  except Exception as e:
    print(f"Error: {e}")

if __name__ == "__main__":
  if len(sys.argv) != 2:
    print("Usage: ./scripts/profile_encrypt.py <path_to_json_file.json>")
    sys.exit(1)

  # Ensure the submodule is initialized
  if not os.path.exists("protos/meshtastic/config_pb2.py"):
    print("Error: The meshtastic protobuf submodule is not initialized.")
    print("Run 'git submodule update --init --recursive' to initialize the submodule.")
    sys.exit(1)

  json_file_path = sys.argv[1]
  encrypt_profile(json_file_path)
