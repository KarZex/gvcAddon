import json
import csv
import ast
import os

csv_path = open("csv/gunData.csv","r")
csv_reader = csv.reader(csv_path) 

row_count = 0

text = ""

item_json = json.load(open("resource_packs/GVCBedrock/textures/item_texture.json","r"))

directory = 'behavior_packs/GVCBedrock/items/item/' 
output_directory = 'resource_packs/GVCBedrock/attachables/item/' 
item_names = ""
for root, dirs, files in os.walk(directory):
    for file in files:
        if file.endswith('.json'):
            file_path = os.path.join(root, file)
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    print(content)
                    data = json.loads(content)

                item_id = data["minecraft:item"]["description"]["identifier"]
                item_icon = data["minecraft:item"]["components"]["minecraft:icon"]

                if item_icon in item_json["texture_data"]:
                    texture_path = item_json["texture_data"][item_icon]["textures"]
                else:
                    continue

                with open("tool/largeitem.json", "r", encoding="utf-8") as bf:
                    base = json.load(bf)

                base["minecraft:attachable"]["description"]["identifier"] = item_id
                base["minecraft:attachable"]["description"]["textures"]["default"] = texture_path

                output_path = os.path.join(output_directory, f"{item_icon}.json")
                with open(output_path, "w", encoding='utf-8') as item_file:
                    json.dump(base, item_file, indent=2)

            except json.JSONDecodeError as e:
                print(f"Error decoding JSON from {file_path}: {e}")



