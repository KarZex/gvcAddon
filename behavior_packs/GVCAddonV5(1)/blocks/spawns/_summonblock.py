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
        if mode == "r":
            block_json["minecraft:block"]["events"]["gvcv5:spawn"]["run_command"]["command"].append("execute if block ~ ~1 ~ air run summon {}".format(e_id))
            block_json["minecraft:block"]["events"]["gvcv5:spawn"]["run_command"]["command"].append("execute if block ~ ~1 ~ air run fill ~~~ ~~~ air")
        elif mode == "v":
            block_json["minecraft:block"]["events"]["gvcv5:spawn"]["run_command"]["command"].append("execute if block ~ ~-1 ~ gvcv5:spawn_addon_ga run summon addon:ga ~~~ ~~ {}".format(e_id))
            block_json["minecraft:block"]["events"]["gvcv5:spawn"]["run_command"]["command"].append("execute if block ~ ~-1 ~ gvcv5:spawn_addon_ca run summon addon:ca ~~~ ~~ {}".format(e_id))
            block_json["minecraft:block"]["events"]["gvcv5:spawn"]["run_command"]["command"].append("execute unless block ~ ~-1 ~ gvcv5:spawn_addon_ga unless block ~ ~-1 ~ gvcv5:spawn_addon_ca run summon {}".format(e_id))
            block_json["minecraft:block"]["events"]["gvcv5:spawn"]["run_command"]["command"].append("fill ~~~ ~~-1~ air")
        else:
            block_json["minecraft:block"]["events"]["gvcv5:spawn"]["run_command"]["command"].append("summon {}".format(e_id))
            block_json["minecraft:block"]["events"]["gvcv5:spawn"]["run_command"]["command"].append("fill ~~~ ~~~ air")

        with open("spawn_{}.json".format(e_id.replace(":","_")),"w") as s:
            json.dump(block_json,s,indent=2)