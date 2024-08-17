import json
import csv
import shutil

with open("_summon.txt","r") as f:
    l = f.readlines()
    for i in l:
        e_id = mode = ""
        if ";" in i.strip():
            e_id, mode = i.strip().split(";")
        else: e_id = i.strip()
        print(e_id)
        block_json = json.load(open("_spawn.json","r"))
        block_json["minecraft:block"]["description"]["identifier"] = "gvcv5:spawn_{}".format(e_id.replace(":","_"))
        block_json["minecraft:block"]["components"]["minecraft:material_instances"]["*"]["texture"] = "spawn_{}".format(e_id.replace(":","_"))
        block_json["minecraft:block"]["components"]["minecraft:material_instances"]["*"]["texture"] = "spawn_{}".format(e_id.replace(":","_"))
        block_json["minecraft:block"]["components"]["minecraft:loot"] = "loot_tables/empty.json"

        with open("spawn_{}.json".format(e_id.replace(":","_")),"w") as s:
            json.dump(block_json,s,indent=2)