#!/bin/bash

PROTO_BASE_DIR="protobufs"
PROTO_DIR="${PROTO_BASE_DIR}/meshtastic"

OUTPUT_DIR="protos"
mkdir -p ${OUTPUT_DIR}

# Compile nanopb.proto file
protoc -I=${PROTO_BASE_DIR} --python_out=${OUTPUT_DIR} ${PROTO_BASE_DIR}/nanopb.proto

# Compile all the .proto files in the meshtastic directory
protoc -I=${PROTO_BASE_DIR} --python_out=${OUTPUT_DIR} ${PROTO_DIR}/*.proto

echo "Protobuf files have been compiled successfully to ${OUTPUT_DIR}."
