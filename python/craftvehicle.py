import json
import csv
import ast

item_json = json.load(open("resource_packs/GVCBedrock/textures/item_texture.json","r"))
row_count = 0

m_func = ""
s_func = ""
b_func = "effect @s[tag=!ride] health_boost 99999 70 true\neffect @s[tag=!ride] instant_health 1 255 true\n"

#aasdasd
csv_path = open("csv/vehicleData.csv","r")
csv_reader = csv.reader(csv_path)
for row in csv_reader:

    if( row_count >= 1 ):
        #from CSV
        v_name = row[0]
        v_id = row[1]
        v_type = row[2]
        v_health = int(row[3])
        v_speed = float(row[4])
        v_sub = row[5]
        v_subcool = int(row[6])
        v_main = row[7]
        v_maincool = int(row[8])
        v_main2 = row[9]
        v_maincool2 = int(row[10])
        v_main3 = row[11]
        v_maincool3 = int(row[12])
        v_antibullet = row[13]
        v_water = row[14]
        v_sizew = float(row[15])
        v_sizeh = float(row[16])
        v_menber = int(row[17])
        v_break = row[18]
        v_ridef = ast.literal_eval(row[19])
        v_position1 = row[20]
        v_position2 = row[21]
        v_position3 = row[22]
        v_position4 = row[23]
        v_position5 = row[24]
        v_position6 = row[25]
        
        if( v_type == "tank" or v_type == "apc" ):
            f_path = open("tool/t34.json","r")
            entity_json = json.load(f_path)

        if( v_type == "set" ):
            f_path = open("tool/20mmaa.json","r")
            entity_json = json.load(f_path)

        if( v_type == "heri" ):
            f_path = open("tool/ka50.json","r")
            entity_json = json.load(f_path)

        if( v_type == "air" ):
            f_path = open("tool/f16.json","r")
            entity_json = json.load(f_path)

        entity_json["minecraft:entity"]["description"]["identifier"] = "vehicle:{}".format(v_id)
        entity_json["minecraft:entity"]["components"]["minecraft:boss"]["name"] = "entity.vehicle:{}.name".format(v_id)
        entity_json["minecraft:entity"]["components"]["minecraft:rideable"]["seat_count"] = v_menber
        entity_json["minecraft:entity"]["components"]["minecraft:rideable"]["family_types"] = v_ridef
        if v_menber == 1:
            entity_json["minecraft:entity"]["components"]["minecraft:rideable"]["seats"] = { "position" :ast.literal_eval(v_position1) }
        else:
            entity_json["minecraft:entity"]["components"]["minecraft:rideable"]["seats"] = []
            entity_json["minecraft:entity"]["components"]["minecraft:rideable"]["seats"].append( { "position" :ast.literal_eval(v_position1) } )
            entity_json["minecraft:entity"]["components"]["minecraft:rideable"]["seats"].append( { "position" :ast.literal_eval(v_position2) } )
            if( v_menber >= 3 ):
                entity_json["minecraft:entity"]["components"]["minecraft:rideable"]["seats"].append( { "position" :ast.literal_eval(v_position3) } )
            if( v_menber >= 4 ):
                entity_json["minecraft:entity"]["components"]["minecraft:rideable"]["seats"].append( { "position" :ast.literal_eval(v_position4) } )
            if( v_menber >= 5 ):
                entity_json["minecraft:entity"]["components"]["minecraft:rideable"]["seats"].append( { "position" :ast.literal_eval(v_position5) } )
            if( v_menber >= 6 ):
                entity_json["minecraft:entity"]["components"]["minecraft:rideable"]["seats"].append( { "position" :ast.literal_eval(v_position6) } )

        entity_json["minecraft:entity"]["components"]["minecraft:health"]["value"] = v_health
        entity_json["minecraft:entity"]["components"]["minecraft:health"]["max"] = v_health
        entity_json["minecraft:entity"]["components"]["minecraft:movement"]["value"] = v_speed 
        entity_json["minecraft:entity"]["components"]["minecraft:collision_box"]["width"] = v_sizew 
        entity_json["minecraft:entity"]["components"]["minecraft:collision_box"]["height"] = v_sizeh
        if v_water != "":
            entity_json["minecraft:entity"]["components"]["minecraft:underwater_movement"] = { "value": float(v_water) }
        
        if v_antibullet == "T":
            entity_json["minecraft:entity"]["components"]["minecraft:damage_sensor"]["triggers"].append( {  "cause": "override","deals_damage": False } )
        if v_break == "T":
            entity_json["minecraft:entity"]["components"]["minecraft:break_blocks"] = { 
                "breakable_blocks": [
                    "bamboo",
                    "bamboo_sapling",
                    "beetroot",
                    "brown_mushroom",
                    "carrots",
                    "carved_pumpkin",
                    "chorus_flower",
                    "chorus_plant",
                    "deadbush",
                    "double_plant",
                    "leaves",
                    "leaves2",
                    "log",
                    "log2",
                    "lit_pumpkin",
                    "melon_block",
                    "melon_stem",
                    "potatoes",
                    "pumpkin",
                    "pumpkin_stem",
                    "red_flower",
                    "red_mushroom",
                    "crimson_fungus",
                    "warped_fungus",
                    "reeds",
                    "sapling",
                    "sweet_berry_bush",
                    "tallgrass",
                    "turtle_egg",
                    "vine",
                    "waterlily",
                    "wheat",
                    "yellow_flower"
                ] 
            }

        with open("behavior_packs/GVCBedrock/entities/vehicle/{0}/{1}.json".format(v_type,v_id),"w") as f:
            json.dump(entity_json,f,indent=2)

        #loot_table (for mob)
        with open("tool/vloot.json","r") as f:
            loot_table = json.load(f)
            loot_table["pools"][0]["entries"][0]["functions"][0]["id"] = "vehicle:{}".format(v_id)
        
        with open("behavior_packs/GVCBedrock/loot_tables/entities/{}.json".format(v_id),"w") as f:
            json.dump(loot_table,f,indent=2)

        if v_main != "":
            m_func += "\nexecute if entity @e[r=4,type=vehicle:{0}] run event entity @s fire:{1}\n".format(v_id,v_main)
            b_func += "\nexecute as @s[tag=!ride] if entity @e[r=4,type=vehicle:{0}] run event entity @s {1}\n".format(v_id,v_main)
            if v_maincool > 0:
                m_func += "execute if entity @e[r=4,type=vehicle:{0}] run scoreboard players set @p mcool {1}\n".format(v_id,v_maincool)
                
        if v_sub != "":
            s_func += "\nexecute if entity @e[r=4,type=vehicle:{0}] run event entity @s fire:{1}\n".format(v_id,v_sub)
            if v_subcool > 0:
                s_func += "execute if entity @e[r=4,type=vehicle:{0}] run scoreboard players set @p scool {1}\n".format(v_id,v_subcool)
            if v_main == "":
                b_func += "\nexecute as @s[tag=!ride] if entity @e[r=4,type=vehicle:{0}] run event entity @s {1}\n".format(v_id,v_sub)

        item_json["texture_data"]["{}".format(v_id)] = { "textures": "textures/items/{}".format(v_id) }
        print("created {}".format(v_id))
    row_count += 1

with open("behavior_packs/GVCBedrock/functions/vmain.mcfunction","w") as f:
    f.write(m_func)

with open("behavior_packs/GVCBedrock/functions/vsub.mcfunction","w") as f:
    f.write(s_func)

with open("behavior_packs/GVCBedrock/functions/b1.mcfunction","w") as f:
    f.write(b_func)


with open("resource_packs/GVCBedrock/textures/item_texture.json","w") as f:
    json.dump(item_json,f,indent=2)