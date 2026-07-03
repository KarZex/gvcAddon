import json
import uuid
import sys
import ast

data = "manifest.json"
ver = "ver.txt"

with open(data, "r", encoding="utf-8") as f:
    manifest = json.load(f)
    name = manifest["header"]["name"]
    #ver = manifest["header"]["version"]
    description = manifest["header"]["description"]
    min_engine_version = manifest["header"]["min_engine_version"]

    f.close()

with open(ver, "r", encoding="utf-8") as f:
    version = [int(x) for x in f.read().strip().split(",")]
    f.close()

with open(ver, "w", encoding="utf-8") as f:
    f.write(f"{version[0]},{version[1]},{version[2]+1}")
    f.close()

behavior = "behavior_packs/GVCBedrockWTeam/manifest.json"
resource = "resource_packs/GVCBedrockW/manifest.json"

def generate_uuid():
    """Generate a unique identifier."""
    return str(uuid.uuid4())



behavior_uuid = "e16363f8-875a-4102-b476-eb9e505b9e27"
resource_uuid = "d42cc0e1-be19-4810-823c-5980db3291ac"

with open(behavior, "r",encoding="utf-8") as f:
    behavior_manifest = json.load(f)
    behavior_manifest["header"]["name"] = name + " (Team)"
    behavior_manifest["header"]["version"] = version
    behavior_manifest["header"]["description"] = description
    behavior_manifest["header"]["min_engine_version"] = min_engine_version
    behavior_manifest["header"]["uuid"] = behavior_uuid

    behavior_manifest["modules"][0]["uuid"] = "4904b529-a212-43b8-a8ed-ce3ce1cc3dcf"
    behavior_manifest["modules"][1]["uuid"] = "78184760-e92b-4b31-92b2-7a56e2cd77da"

    behavior_manifest["dependencies"].append({
        "uuid": resource_uuid,
        "version": version
    })

with open(behavior, "w") as f:
    json.dump(behavior_manifest, f, indent=4)

with open(resource, "r",encoding="utf-8") as f:
    resource_manifest = json.load(f)
    resource_manifest["header"]["name"] = name
    resource_manifest["header"]["version"] = version
    resource_manifest["header"]["description"] = description
    resource_manifest["header"]["min_engine_version"] = min_engine_version
    resource_manifest["header"]["uuid"] = resource_uuid

    resource_manifest["modules"][0]["uuid"] = generate_uuid()

    resource_manifest["dependencies"].append({
        "uuid": behavior_uuid,
        "version": version
    })

with open(resource, "w") as f:
    json.dump(resource_manifest, f, indent=4)