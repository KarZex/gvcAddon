import json
import uuid
import sys
import ast

name = "§l§gGVCBedrock Addon V" + input("Enter the name of the pack Ver: ")
ver1 = int(input("Enter the Minecraft version 1st number: "))
ver2 = int(input("Enter the Minecraft version 2nd number: "))
ver3 = int(input("Enter the Minecraft version 3rd number: "))

ver = [ver1, ver2, ver3]

behavior = "behavior_packs/GVCBedrockWTeam/manifest.json"
resource = "resource_packs/GVCBedrockW/manifest.json"
behaviorii = "behavior_packs/GVCBedrockWii/manifest.json"

text = "import \"./team\";\n"
text2 = "import \"./teamCompornents\";"
with open("behavior_packs/GVCBedrockWTeam/scripts/main.js", "r") as f:
    content = f.read()
    content = text + text2 + "\n" + content


with open("behavior_packs/GVCBedrockWTeam/scripts/main.js", "w") as f:
    f.write(content)

with open("main.js", "w") as f:
    f.write(content)

def generate_uuid():
    """Generate a unique identifier."""
    return str(uuid.uuid4())

with open(behavior, "r",encoding="utf-8") as f:
    behavior_manifest = json.load(f)
    behavior_manifest["header"]["name"] = name + " (Team)"
    behavior_manifest["header"]["version"] = ver
    behavior_manifest["header"]["min_engine_version"] = ver
    behavior_manifest["header"]["uuid"] = generate_uuid()

    behavior_manifest["modules"][0]["uuid"] = generate_uuid()
    behavior_manifest["modules"][1]["uuid"] = generate_uuid()

with open(behavior, "w") as f:
    json.dump(behavior_manifest, f, indent=4)

with open(behaviorii, "r",encoding="utf-8") as f:
    behavior_manifest = json.load(f)
    behavior_manifest["header"]["name"] = name
    behavior_manifest["header"]["version"] = ver
    behavior_manifest["header"]["min_engine_version"] = ver
    behavior_manifest["header"]["uuid"] = generate_uuid()

    behavior_manifest["modules"][0]["uuid"] = generate_uuid()
    behavior_manifest["modules"][1]["uuid"] = generate_uuid()

with open(behaviorii, "w") as f:
    json.dump(behavior_manifest, f, indent=4)

with open(resource, "r",encoding="utf-8") as f:
    resource_manifest = json.load(f)
    resource_manifest["header"]["name"] = name
    resource_manifest["header"]["version"] = ver
    resource_manifest["header"]["min_engine_version"] = ver
    resource_manifest["header"]["uuid"] = generate_uuid()

    resource_manifest["modules"][0]["uuid"] = generate_uuid()

with open(resource, "w") as f:
    json.dump(resource_manifest, f, indent=4)