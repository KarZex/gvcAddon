import json
import csv
import ast
import os
from PIL import Image

item_json = json.load(open("resource_packs/GVCBedrock/textures/item_texture.json","r"))
texture_json = json.load(open("resource_packs/GVCBedrock/textures/terrain_texture.json","r"))
row_count = 0

item_directory = 'behavior_packs/GVCBedrock/items/item/block/' 
block_directory = 'behavior_packs/GVCBedrock/blocks/block2/'
item_names = ""
for root, dirs, files in os.walk(block_directory):
    for file in files:
        if file.endswith('.json'):
            file_path = os.path.join(root, file)
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    #print(content)
                    data = json.loads(content)

                block_id = data["minecraft:block"]["description"]["identifier"]
                block_icon = data["minecraft:block"]["description"]["identifier"].split(":")[1]

                if not block_icon in item_json["texture_data"]:
                    item_json["texture_data"][f"{block_icon}_item"] = {"textures": f"textures/items/block/{block_icon}"}

                block_textures = data["minecraft:block"]["components"]["minecraft:material_instances"]

                # Loot table
                if not os.path.isfile(f"behavior_packs/GVCBedrock/loot_tables/blocks/{block_icon}.json"):
                    with open("tool/block_loot.json", "r", encoding="utf-8") as lf:
                        loot = json.load(lf)

                    loot["pools"][0]["entries"][0]["name"] = f"{block_id}_item"
                    output_path = os.path.join("behavior_packs/GVCBedrock/loot_tables/blocks/", f"{block_icon}.json")
                    with open(output_path, "w", encoding='utf-8') as loot_file:
                        json.dump(loot, loot_file, indent=2)

                #process_material_instances(block_textures)
                for item in block_textures:
                    print(block_textures[f"{item}"]["texture"])
                    value = block_textures[f"{item}"]["texture"]
                    if not value in texture_json["texture_data"]:
                        texture_json["texture_data"][f"{value}"] = {"textures" : f"textures/blocks/{value}"}

                with open("tool/block_item.json", "r", encoding="utf-8") as bf:
                    base = json.load(bf)

                base["minecraft:item"]["description"]["identifier"] = f"{block_id}_item"
                base["minecraft:item"]["components"]["minecraft:icon"] = f"{block_icon}_item"
                base["minecraft:item"]["components"]["minecraft:block_placer"]["block"] = block_id


                output_path = os.path.join(item_directory, f"{block_icon}.json")
                with open(output_path, "w", encoding='utf-8') as item_file:
                    json.dump(base, item_file, indent=2)

            except json.JSONDecodeError as e:
                print(f"Error decoding JSON from {file_path}: {e}")


with open("resource_packs/GVCBedrock/textures/item_texture.json","w") as f:
    json.dump(item_json,f,indent=2)


with open("resource_packs/GVCBedrock/textures/terrain_texture.json","w") as f:
    json.dump(texture_json,f,indent=2)