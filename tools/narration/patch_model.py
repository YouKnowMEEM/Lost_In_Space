#!/usr/bin/env python3
"""
One-time step before building narration: add a "duration" output to the Kokoro ONNX
model so every phoneme's length (in frames of 600 samples at 24 kHz) comes back with
the audio. The read-along highlighting is built from those durations.

    python tools/narration/patch_model.py

Reads   tools/narration/models/kokoro-v1.0.onnx
Writes  tools/narration/models/kokoro-dur.onnx
"""
import os

import onnx
from onnx import TensorProto, helper

MODELS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "models")
src = os.path.join(MODELS, "kokoro-v1.0.onnx")
dst = os.path.join(MODELS, "kokoro-dur.onnx")

model = onnx.load(src)
graph = model.graph
graph.node.append(helper.make_node("Identity", ["/encoder/Cast_output_0"], ["duration"], name="duration_identity"))
graph.output.append(helper.make_tensor_value_info("duration", TensorProto.INT64, None))
onnx.save(model, dst)
print("Saved", dst)
