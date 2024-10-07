#!/bin/bash

# Function to display usage information
function usage() {
    echo "Usage: $0 --device <device_address> [--pin <pin>]"
    echo "  --device <device_address>  The Bluetooth device address to pair (e.g., F0:D9:3A:F9:2A:E0)"
    echo "  --pin <pin>                The optional PIN code for pairing (default is 123456)"
    exit 1
}

# Default PIN value
PIN="123456"
DEFAULT_PIN_USED=true

# Parse named parameters
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --device) DEVICE="$2"; shift ;;
        --pin) PIN="$2"; DEFAULT_PIN_USED=false; shift ;;
        *) echo "Unknown parameter passed: $1"; usage ;;
    esac
    shift
done

# Check if the device address is provided
if [ -z "$DEVICE" ]; then
    echo "Error: Missing required parameter --device."
    usage
fi

# Improved log messages
echo "Starting Bluetooth pairing process for device: $DEVICE"

if [ "$DEFAULT_PIN_USED" = true ]; then
    echo "Using the default PIN code: $PIN"
else
    echo "Using the provided PIN code."
fi

# Execute bluetoothctl with the required commands
{
    echo "pairable on"
    echo "pair $DEVICE"
    echo "trust $DEVICE"
    echo "disconnect $DEVICE"
    echo "exit"
} | bluetoothctl | while read -r line; do
    echo "[LOG $(date +'%Y-%m-%d %H:%M:%S')] $line"
done

echo "Bluetooth pairing process completed."
