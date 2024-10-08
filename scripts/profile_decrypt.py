#!/usr/bin/env python3
import sys
import os
import json
from google.protobuf.json_format import MessageToDict, ParseError
from google.protobuf.message import DecodeError

# Set up paths to include the root of the protos and meshtastic directories
sys.path.append(os.path.join(os.path.dirname(__file__), '../protos'))
sys.path.append(os.path.join(os.path.dirname(__file__), '../protos/meshtastic'))

# Import the protobuf module containing DeviceProfile
from clientonly_pb2 import DeviceProfile

def decrypt_profile(file_path):
  try:
    # Step 1: Read and Deserialize the Configuration File
    with open(file_path, 'rb') as f:
      config_data = f.read()

    # Step 2: Parse using DeviceProfile
    try:
      config = DeviceProfile()
      config.ParseFromString(config_data)
      print("Successfully parsed with message type: DeviceProfile")
    except DecodeError as e:
      raise ValueError(f"Failed to parse with message type DeviceProfile: {e}")

    # Step 3: Write the Configuration to JSON
    try:
      # Handle fields that might not be UTF-8 compliant
      config_dict = MessageToDict(config, preserving_proto_field_name=True, including_default_value_fields=True)
      json_file_path = os.path.join(os.path.dirname(file_path), os.path.basename(file_path).replace('.cfg', '.json'))
      with open(json_file_path, 'w', encoding='utf-8') as json_file:
        json.dump(config_dict, json_file, indent=2, ensure_ascii=False)
      print("Configuration has been written to JSON file at:", json_file_path)
    except ParseError as e:
      print(f"Error converting message to JSON: {e}")

  except Exception as e:
    print(f"Error: {e}")

if __name__ == "__main__":
  if len(sys.argv) != 2:
    print("Usage: ./scripts/profile_decrypt.py <path_to_config_file.cfg>")
    sys.exit(1)

  # Ensure the submodule is initialized
  if not os.path.exists("protos/meshtastic/config_pb2.py"):
    print("Error: The meshtastic protobuf submodule is not initialized.")
    print("Run 'git submodule update --init --recursive' to initialize the submodule.")
    sys.exit(1)

  config_file_path = sys.argv[1]
  decrypt_profile(config_file_path)
