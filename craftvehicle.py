import json
import csv
import shutil

csv_path = open("vehicleData.csv","r")
csv_reader = csv.reader(csv_path)

item_json = json.load(open("resource_packs/GVCAddonV5(1)/textures/item_texture.json","r"))
row_count = 0

m_func = ""
s_func = ""
b_func = "effect @s[tag=!ride] resistance 99999 5 true"

#aasdasd
for row in csv_reader:

    if( row_count >= 1 ):
        #from CSV
        v_id = row[1]
        v_type = row[2]
        v_health = int(row[3])
        v_main = row[4]
        v_maincool = int(row[5])
        v_sub = row[6]
        v_subcool = int(row[7])
        v_speed = float(row[8])

        if v_main != "":
            m_func += "\nexecute if entity @e[r=2,type=vehicle:{0}] run event entity @s fire:{1}\n".format(v_id,v_main)
            b_func += "\nexecute as @s[tag=!ride] if entity @e[r=2,type=vehicle:{0}] run event entity @s {1}\n".format(v_id,v_main)
            if v_maincool > 0:
                m_func += "execute if entity @e[r=2,type=vehicle:{0}] run scoreboard players set @p mcool {1}\n".format(v_id,v_maincool)
                
        if v_sub != "":
            s_func += "\nexecute if entity @e[r=2,type=vehicle:{0}] run event entity @s fire:{1}\n".format(v_id,v_sub)
            if v_subcool > 0:
                s_func += "execute if entity @e[r=2,type=vehicle:{0}] run scoreboard players set @p scool {1}\n".format(v_id,v_subcool)
            if v_main == "":
                b_func += "\nexecute as @s[tag=!ride] if entity @e[r=2,type=vehicle:{0}] run event entity @s {1}\n".format(v_id,v_sub)

        item_json["texture_data"]["{}".format(v_id)] = { "textures": "textures/items/{}".format(v_id) }
        print("created {}".format(v_id))
    row_count += 1

with open("behavior_packs/GVCAddonV5(1)/functions/vmain.mcfunction","w") as f:
    f.write(m_func)

with open("behavior_packs/GVCAddonV5(1)/functions/vsub.mcfunction","w") as f:
    f.write(s_func)

with open("behavior_packs/GVCAddonV5(1)/functions/b1.mcfunction","w") as f:
    f.write(b_func)


with open("resource_packs/GVCAddonV5(1)/textures/item_texture.json","w") as f:
    json.dump(item_json,f,indent=2)