import json
import csv
import shutil

terrain_texture = json.load(open("terrain_texture.json","r"))
with open("_summon.txt","r") as f:
    l = f.readlines()
    for i in l:
        e_id = mode = ""
        if ";" in i.strip():
            e_id, mode = i.strip().split(";")
        else: e_id = i.strip()
        print(e_id)
        terrain_texture["texture_data"]["spawn_{}".format(e_id.replace(":","_"))] = { "textures": "textures/spawn/{}".format(e_id.replace(":","_")) }        

with open("terrain_texture.json","w") as f:
    json.dump(terrain_texture,f,indent=2)

terrain_texture = json.load(open("terrain_texture.json","r"))