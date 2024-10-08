# Scripts for Meshtastic Configuration

This folder contains utility scripts for working with Meshtastic configuration files. The scripts help with tasks like decrypting and converting configuration files into a more human-readable format.

## Prerequisites

- Make sure `protoc` (the Protocol Buffers compiler) is installed on your system.

  You can install `protoc` using your system's package manager or download it from the official [Protocol Buffers GitHub releases](https://github.com/protocolbuffers/protobuf/releases).

  For Debian-based Linux distributions, you can install `protoc` with the following command:

  ```sh
  sudo apt install protobuf-compiler
  ```

- Make sure you have all the protobuf dependencies set up correctly.
- Run the following command to initialize the protobuf submodule if not already done:

  ```sh
  git submodule update --init --recursive
  ```

- To ensure all necessary Python dependencies are available, it's recommended to create a virtual environment and install the required packages using `pip`.

  ```sh
  python3 -m venv venv
  source venv/bin/activate
  pip install -r requirements.txt
  ```

## Available Scripts

### 2. `compile_protos.sh`

This script compiles all the protobuf (`.proto`) files in the project to generate the corresponding Python files needed for working with Meshtastic configuration.

```sh
./scripts/compile_protos.sh
```

The script will generate Python files for all protobuf definitions and place them in the `protos` directory.

### 1. `profile_decrypt.py`

This script reads a Meshtastic configuration file in `.cfg` format and converts it to a JSON file for easier readability.

```sh
./scripts/profile_decrypt.py <path_to_all.cfg>
```

- `<path_to_all.cfg>`: Path to the configuration file you want to decrypt.

The script will parse the `.cfg` file, convert it to a JSON format, and save it in the same directory as the original file with a `.json` extension.

### 3. `profile_encrypt.py`

This script reads a JSON file representing a Meshtastic device profile and converts it back to a `.cfg` binary file.

```sh
./scripts/profile_encrypt.py <path_to_json_file.json>
```

- `<path_to_json_file.json>`: Path to the JSON file you want to encrypt.

The script will parse the JSON file and generate the corresponding `.cfg` binary file in the same directory as the original JSON file.

### Notes

- The script automatically detects the appropriate protobuf message type to parse the configuration file.
- The output JSON file provides a human-readable representation of the configuration data, which can be used for analysis or modification.
