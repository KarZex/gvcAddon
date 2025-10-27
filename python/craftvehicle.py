import json
import csv
import ast
from PIL import Image

item_json = json.load(open("resource_packs/GVCBedrock/textures/item_texture.json","r"))
row_count = 0


text = ""
eng_text = ""

vehicledata_json = {}
v_weapon1_func = "tag @s add weaponiattack\n"
v_weapon2_func = "tag @s add weaponiiattack\n"
v_weapon3_func = "tag @s add weaponiiiattack\n"
v_weapon4_func = "tag @s add weaponivattack\n"
b_func = "effect @s[tag=!ride] resistance 99999 70 true\neffect @s[tag=!ride] instant_health 1 255 true\n"

names = ""

#aasdasd
csv_path = open("csv/vehicleData.csv","r")
terrain_texture = json.load(open("resource_packs/GVCBedrock/textures/terrain_texture.json","r"))
csv_reader = csv.reader(csv_path)
for row in csv_reader:

    if( row_count >= 1 ):
        #from CSV
        v_name = row[0] #A on excel
        v_id = row[1] #B on excel
        v_type = row[2] #C
        v_health = int(row[3]) #D
        v_speed = float(row[4])
        v_weapon1 = row[5]
        v_weapon1_cool = int(row[6])
        v_weapon1_ammo = int(row[7])
        v_weapon2 = row[8]
        v_weapon2_cool = int(row[9])
        v_weapon2_ammo = int(row[10])
        v_weapon3 = row[11]
        v_weapon3_cool = int(row[12])
        v_weapon3_ammo = int(row[13])
        v_weapon4 = row[14]
        v_weapon4_cool = int(row[15])
        v_weapon4_ammo = int(row[16])
        v_antibullet = row[17]
        v_water = row[18]
        v_sizew = float(row[19])
        v_sizeh = float(row[20])
        v_menber = int(row[21])
        v_break = row[22]
        v_ridef = ast.literal_eval(row[23])
        v_position1 = row[24]
        v_position2 = row[25]
        v_position3 = row[26]
        v_position4 = row[27]
        v_position5 = row[28]
        v_position6 = row[29]

    

        #from Name CSV
        v_gattack = int(row[30])

        #inventory item
        v_inventory = row[31] 
        v_camera = int(row[32])
        v_turn = int(row[33])

        v_family = ast.literal_eval(row[34])
        v_engname = row[35]


        ##DATA START

        vehicledata_json["{}".format(v_id)] = { "type": v_type,"speed": v_speed,"Weapon1": v_weapon1,"Weapon2": v_weapon2,"Weapon3": v_weapon3,"Weapon4": v_weapon4,"turn": v_turn,"gattack":v_gattack }
    

        text += "entity.vehicle:{0}.name={1}\n".format(v_id,v_name)
        text += "item.spawn_egg.entity.vehicle:{0}.name={1}\n".format(v_id,v_name)
        text += "tile.gvcv5:spawn_vehicle_{0}.name={1}\n".format(v_id,v_name)
        text += "item.vehicle:{0}_spawn_egg={1}\n".format(v_id,v_name)

        eng_text += "entity.vehicle:{0}.name={1}\n".format(v_id,v_engname)
        eng_text += "item.spawn_egg.entity.vehicle:{0}.name={1}\n".format(v_id,v_engname)
        eng_text += "tile.gvcv5:spawn_vehicle_{0}.name={1}\n".format(v_id,v_engname)
        eng_text += "item.vehicle:{0}_spawn_egg={1}\n".format(v_id,v_engname)


        ## Block spawn_vehicle_lav25
        block_json = json.load(open("tool/_spawn.json","r"))
        block_json["minecraft:block"]["description"]["identifier"] = "gvcv5:spawn_vehicle_{}".format(v_id.replace(":","_"))
        block_json["minecraft:block"]["components"]["minecraft:material_instances"]["*"]["texture"] = "spawn_vehicle_{}".format(v_id.replace(":","_"))
        block_json["minecraft:block"]["components"]["minecraft:material_instances"]["*"]["texture"] = "spawn_vehicle_{}".format(v_id.replace(":","_"))
        block_json["minecraft:block"]["components"]["minecraft:loot"] = "loot_tables/empty.json"

        with open("behavior_packs/GVCBedrock/blocks/spawns/spawn_vehicle_{}.json".format(v_id.replace(":","_")),"w") as s:
            json.dump(block_json,s,indent=2)

        overlay_image = Image.open("resource_packs/GVCBedrock/textures/items/vehicle/{}.png".format(v_id)).convert("RGBA")
        base_image = Image.open("resource_packs/GVCBedrock/textures/spawn/base.png").convert("RGBA")
        combined = Image.alpha_composite(base_image, overlay_image)
        combined.save("resource_packs/GVCBedrock/textures/spawn/vehicle_{}.png".format(v_id) )

        terrain_texture["texture_data"]["spawn_vehicle_{}".format(v_id)] = { "textures": "textures/spawn/vehicle_{}".format(v_id) }


        if( v_type == "stank"):
            f_path = open("tool/fv101.json","r")
            entity_json = json.load(f_path)

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

        if( v_type == "tank" or v_type == "stank"  ):
            entity_json["minecraft:entity"]["component_groups"]["summon_enemy"]["minecraft:loot"]["table"] = "loot_tables/entities/{}_enemy.json".format(v_id)

        entity_json["minecraft:entity"]["description"]["identifier"] = "vehicle:{}".format(v_id)
        entity_json["minecraft:entity"]["components"]["minecraft:boss"]["name"] = "entity.vehicle:{}.name".format(v_id)
        entity_json["minecraft:entity"]["components"]["minecraft:interact"]["interactions"][1]["spawn_items"]["table"] = "loot_tables/entities/{}.json".format(v_id)
        entity_json["minecraft:entity"]["components"]["minecraft:type_family"]["family"] = v_family

        entity_json["minecraft:entity"]["components"]["minecraft:rideable"]["seat_count"] = v_menber
        entity_json["minecraft:entity"]["components"]["minecraft:rideable"]["family_types"] = v_ridef
        
        if v_menber == 1:
            entity_json["minecraft:entity"]["components"]["minecraft:rideable"]["seats"] = { "position" :ast.literal_eval(v_position1) }
            if v_camera > 0:
                entity_json["minecraft:entity"]["components"]["minecraft:rideable"]["seats"]["third_person_camera_radius"] = v_camera
        else:
            entity_json["minecraft:entity"]["components"]["minecraft:rideable"]["seats"] = []
            if v_camera > 0:
                entity_json["minecraft:entity"]["components"]["minecraft:rideable"]["seats"].append( { "position" :ast.literal_eval(v_position1),"third_person_camera_radius":v_camera} )
            else:
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
            entity_json["minecraft:entity"]["components"]["minecraft:behavior.float"] = {   "priority": 1   }
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

        if v_inventory != "":
            inventory_json = {
                "additional_slots_per_strength": 0,
                "can_be_siphoned_from": False,
                "container_type": "container",
                "inventory_size": int(v_inventory),
                "private": False,
                "restrict_to_owner": False
            }
            entity_json["minecraft:entity"]["components"]["minecraft:inventory"] = inventory_json

        with open("behavior_packs/GVCBedrock/entities/vehicle/{0}/{1}.json".format(v_type,v_id),"w") as f:
            json.dump(entity_json,f,indent=2)

        #loot_table (for mob)
        with open("tool/vloot.json","r") as f:
            loot_table = json.load(f)
            loot_table["pools"][0]["entries"][0]["functions"][0]["id"] = "vehicle:{}".format(v_id)
        
        with open("behavior_packs/GVCBedrock/loot_tables/entities/{}.json".format(v_id),"w") as f:
            json.dump(loot_table,f,indent=2)
                
        if v_weapon1 != "":
            v_weapon1_func += "\nexecute if entity @e[r=4,type=vehicle:{0}] run event entity @s[scores={{weaponi=..{2}}}] fire:{1}\n".format(v_id,v_weapon1,v_weapon1_ammo)
            v_weapon1_func += "\nexecute if entity @e[r=4,type=vehicle:{0}] run scoreboard players add @s[scores={{weaponi=..{2}}}] weaponi 1\n".format(v_id,v_weapon1,v_weapon1_ammo)
            v_weapon1_func += "\nexecute if entity @e[r=4,type=vehicle:{0}] run scoreboard players set @s weaponi_max {1}\n".format(v_id,v_weapon1_ammo)
            if v_weapon1_cool > 0:
                v_weapon1_func += "execute if entity @e[r=4,type=vehicle:{0}] run scoreboard players set @s weaponi_cool {1}\n".format(v_id,v_weapon1_cool+1)
            b_func += "\nexecute as @s[tag=!ride] if entity @e[r=4,type=vehicle:{0}] run event entity @s {1}\n".format(v_id,v_weapon1)

        if v_weapon2 != "":
            v_weapon2_func += "\nexecute if entity @e[r=4,type=vehicle:{0}] run event entity @s[scores={{weaponii=..{2}}}] fire:{1}\n".format(v_id,v_weapon2,v_weapon2_ammo)
            v_weapon2_func += "\nexecute if entity @e[r=4,type=vehicle:{0}] run scoreboard players add @s[scores={{weaponii=..{2}}}] weaponii 1\n".format(v_id,v_weapon2,v_weapon2_ammo)
            v_weapon2_func += "\nexecute if entity @e[r=4,type=vehicle:{0}] run scoreboard players set @s weaponii_max {1}\n".format(v_id,v_weapon2_ammo)
            if v_weapon2_cool > 0:
                v_weapon2_func += "execute if entity @e[r=4,type=vehicle:{0}] run scoreboard players set @s weaponii_cool {1}\n".format(v_id,v_weapon2_cool+1)
        
        if v_weapon3 != "":
            v_weapon3_func += "\nexecute if entity @e[r=4,type=vehicle:{0}] run event entity @s[scores={{weaponiii=..{2}}}] fire:{1}\n".format(v_id,v_weapon3,v_weapon3_ammo)
            v_weapon3_func += "\nexecute if entity @e[r=4,type=vehicle:{0}] run scoreboard players add @s[scores={{weaponiii=..{2}}}] weaponiii 1\n".format(v_id,v_weapon3,v_weapon3_ammo)
            v_weapon3_func += "\nexecute if entity @e[r=4,type=vehicle:{0}] run scoreboard players set @s weaponiii_max {1}\n".format(v_id,v_weapon3_ammo)
            if v_weapon3_cool > 0:
                v_weapon3_func += "execute if entity @e[r=4,type=vehicle:{0}] run scoreboard players set @s weaponiii_cool {1}\n".format(v_id,v_weapon3_cool+1)

        if v_weapon4 != "":
            v_weapon4_func += "\nexecute if entity @e[r=4,type=vehicle:{0}] run event entity @s[scores={{weaponiv=..{2}}}] fire:{1}\n".format(v_id,v_weapon4,v_weapon4_ammo)
            v_weapon4_func += "\nexecute if entity @e[r=4,type=vehicle:{0}] run scoreboard players add @s[scores={{weaponiv=..{2}}}] weaponiv 1\n".format(v_id,v_weapon4,v_weapon4_ammo)
            v_weapon4_func += "\nexecute if entity @e[r=4,type=vehicle:{0}] run scoreboard players set @s weaponiv_max {1}\n".format(v_id,v_weapon4_ammo)
            if v_weapon4_cool > 0:
                v_weapon4_func += "execute if entity @e[r=4,type=vehicle:{0}] run scoreboard players set @s weaponiv_cool {1}\n".format(v_id,v_weapon4_cool+1)


        item_json["texture_data"]["{}".format(v_id)] = { "textures": "textures/items/vehicle/{}".format(v_id) }
        print("created {}".format(v_id))
    row_count += 1

with open("behavior_packs/GVCBedrock/functions/weaponi.mcfunction","w") as f:
    f.write(v_weapon1_func)
with open("behavior_packs/GVCBedrock/functions/weaponii.mcfunction","w") as f:
    f.write(v_weapon2_func)
with open("behavior_packs/GVCBedrock/functions/weaponiii.mcfunction","w") as f:
    f.write(v_weapon3_func)
with open("behavior_packs/GVCBedrock/functions/weaponiv.mcfunction","w") as f:
    f.write(v_weapon4_func)

with open("behavior_packs/GVCBedrock/scripts/vehicle.json","w") as f:
    json.dump(vehicledata_json,f,indent=2)

with open("behavior_packs/GVCBedrock/scripts/vehicle.json","r") as f:
    export = "import { EntityDamageCause } from \"@minecraft/server\";\nexport const vehicleData = " 
    export += f.read()
    export += ";"

with open("behavior_packs/GVCBedrock/scripts/vehicle.js","w") as f:
    f.write(export)


with open("resource_packs/GVCBedrock/textures/terrain_texture.json","w") as f:
    json.dump(terrain_texture,f,indent=2)

with open("behavior_packs/GVCBedrock/functions/b1.mcfunction","w") as f:
    f.write(b_func)

with open("resource_packs/GVCBedrock/texts/vehicle_name.lang","w") as f:
    f.write(names)

with open("resource_packs/GVCBedrock/textures/item_texture.json","w") as f:
    json.dump(item_json,f,indent=2)
with open("resource_packs/GVCBedrock/textures/item_texture.json","w") as f:
    json.dump(item_json,f,indent=2)

with open("resource_packs/GVCBedrock/texts/vech.txt","w") as f:
    f.write(text)

with open("resource_packs/GVCBedrock/texts/evech.txt","w") as f:
    f.write(eng_text)