import json
import csv
import shutil

csv_path = open("csv/feature.csv","r")
csv_reader = csv.reader(csv_path)

text = ""
endtext = ""
e_text = ""
se_text = ""

row_count = 0
#aasdasd
for row in csv_reader:
        
    if( row_count >= 1 and row[4] != "" ):
        #from CSV
        structure_id = row[2]
        structure_loadx = int(row[4])
        structure_loadz = int(row[5])
        structure_loady = int(row[6])
        structure_chance = float(row[7])
        structure_flag_type = row[8]
        structure_is_ship = row[9]
        structure_loot = row[10]
        text += "tile.gvcv5:building_{0}.name={1}\n".format(structure_id,row[0])

        
        if structure_flag_type != "":

            e_text += "entity.gvcv5:flag_{0}_ca.name=§b{1}\n".format(structure_id,row[0].replace("ダンジョン","同盟軍拠点"))
            se_text += "item.spawn_egg.entity.gvcv5:flag_{0}_ca.name={1}\n".format(structure_id,row[0].replace("ダンジョン","同盟軍拠点"))
            e_text += "entity.gvcv5:flag_{0}_ga.name=§8{1}\n".format(structure_id,row[0].replace("ダンジョン","ゲリラ拠点"))
            se_text += "item.spawn_egg.entity.gvcv5:flag_{0}_ga.name={1}\n".format(structure_id,row[0].replace("ダンジョン","ゲリラ拠点"))
            e_text += "entity.gvcv5:flag_red_{0}.name=§c{1}\n".format(structure_id,row[0].replace("ダンジョン","赤チーム拠点"))
            e_text += "entity.gvcv5:flag_blue_{0}.name=§9{1}\n".format(structure_id,row[0].replace("ダンジョン","青チーム拠点"))
            e_text += "entity.gvcv5:flag_green_{0}.name=§a{1}\n".format(structure_id,row[0].replace("ダンジョン","緑チーム拠点"))
            e_text += "entity.gvcv5:flag_yellow_{0}.name=§e{1}\n".format(structure_id,row[0].replace("ダンジョン","黄チーム拠点"))

            with open("tool/a1.json","r") as f:
                flag_json = json.load(f)
                flag_json["minecraft:entity"]["description"]["identifier"] = "gvcv5:flag_{}_ca".format(structure_id)
                flag_json["minecraft:entity"]["components"]["minecraft:interact"]["interactions"][5]["spawn_items"]["table"] = "loot_tables/flag/flag_{}_ca.json".format(structure_id)
                flag_json["minecraft:entity"]["events"]["minecraft:entity_spawned"] = { "queue_command": { "command":[ "scriptevent zex:flagStart CA {}".format(structure_id) ] } }
                flag_json["minecraft:entity"]["events"]["become_CA"]["queue_command"]["command"][0] = "summon gvcv5:flag_{}_ca ~~~".format(structure_id)
                flag_json["minecraft:entity"]["events"]["become_CA"]["queue_command"]["command"][1] = "scriptevent zex:flagChange CA {}".format(structure_id)
                flag_json["minecraft:entity"]["events"]["become_GA"]["queue_command"]["command"][0] = "summon gvcv5:flag_{}_ga ~~~".format(structure_id)
                flag_json["minecraft:entity"]["events"]["become_GA"]["queue_command"]["command"][1] = "scriptevent zex:flagChange CA {}".format(structure_id)
                flag_json["minecraft:entity"]["events"]["gvcv5:become_redteam"]["queue_command"]["command"][0] = "summon gvcv5:flag_red_{} ~~~".format(structure_id)
                flag_json["minecraft:entity"]["events"]["gvcv5:become_redteam"]["queue_command"]["command"][1] = "scriptevent zex:flagChange CA {}".format(structure_id)
                flag_json["minecraft:entity"]["events"]["gvcv5:become_blueteam"]["queue_command"]["command"][0] = "summon gvcv5:flag_blue_{} ~~~".format(structure_id)
                flag_json["minecraft:entity"]["events"]["gvcv5:become_blueteam"]["queue_command"]["command"][1] = "scriptevent zex:flagChange CA {}".format(structure_id)
                flag_json["minecraft:entity"]["events"]["gvcv5:become_greenteam"]["queue_command"]["command"][0] = "summon gvcv5:flag_green_{} ~~~".format(structure_id)
                flag_json["minecraft:entity"]["events"]["gvcv5:become_greenteam"]["queue_command"]["command"][1] = "scriptevent zex:flagChange CA {}".format(structure_id)
                flag_json["minecraft:entity"]["events"]["gvcv5:become_yellowteam"]["queue_command"]["command"][0] = "summon gvcv5:flag_yellow_{} ~~~".format(structure_id)
                flag_json["minecraft:entity"]["events"]["gvcv5:become_yellowteam"]["queue_command"]["command"][1] = "scriptevent zex:flagChange CA {}".format(structure_id)
                flag_json["minecraft:entity"]["components"]["minecraft:type_family"]["family"] = [ "CAflag", "inanimate" ]
                if structure_flag_type == "L":
                    flag_json["minecraft:entity"]["components"]["minecraft:boss"]["name"] = "entity.gvcv5:flag_{0}_ca.name".format(structure_id)
                if structure_flag_type == "L":
                    flag_json["minecraft:entity"]["components"]["minecraft:health"]["value"] = 400
                    flag_json["minecraft:entity"]["components"]["minecraft:health"]["max"] = 400
                    flag_json["minecraft:entity"]["components"]["minecraft:damage_sensor"]["triggers"] = [ {  "cause": "all", "deals_damage": False } ]

            with open("behavior_packs/GVCBedrock/entities/flag/{}_ca.json".format(structure_id),"w") as f:
                json.dump(flag_json,f,indent=2)

            with open("tool/a2.json","r") as f:
                flag_json = json.load(f)
                flag_json["minecraft:entity"]["description"]["identifier"] = "gvcv5:flag_{}_ga".format(structure_id)
                flag_json["minecraft:entity"]["events"]["minecraft:entity_spawned"] = { "queue_command": { "command":[ "scriptevent zex:flagStart GA {}".format(structure_id) ] } }
                flag_json["minecraft:entity"]["events"]["become_CA"]["queue_command"]["command"][0] = "summon gvcv5:flag_{}_ca ~~~".format(structure_id)
                flag_json["minecraft:entity"]["events"]["become_CA"]["queue_command"]["command"][1] = "scriptevent zex:flagChange GA {}".format(structure_id)
                flag_json["minecraft:entity"]["events"]["become_GA"]["queue_command"]["command"][0] = "summon gvcv5:flag_{}_ga ~~~".format(structure_id)
                flag_json["minecraft:entity"]["events"]["become_GA"]["queue_command"]["command"][1] = "scriptevent zex:flagChange GA {}".format(structure_id)
                flag_json["minecraft:entity"]["events"]["become_R"]["queue_command"]["command"][0] = "summon gvcv5:flag_red_{} ~~~".format(structure_id)
                flag_json["minecraft:entity"]["events"]["become_R"]["queue_command"]["command"][1] = "scriptevent zex:flagChange GA {}".format(structure_id)
                flag_json["minecraft:entity"]["events"]["become_B"]["queue_command"]["command"][0] = "summon gvcv5:flag_blue_{} ~~~".format(structure_id)
                flag_json["minecraft:entity"]["events"]["become_B"]["queue_command"]["command"][1] = "scriptevent zex:flagChange GA {}".format(structure_id)
                flag_json["minecraft:entity"]["events"]["become_G"]["queue_command"]["command"][0] = "summon gvcv5:flag_green_{} ~~~".format(structure_id)
                flag_json["minecraft:entity"]["events"]["become_G"]["queue_command"]["command"][1] = "scriptevent zex:flagChange GA {}".format(structure_id)
                flag_json["minecraft:entity"]["events"]["become_Y"]["queue_command"]["command"][0] = "summon gvcv5:flag_yellow_{} ~~~".format(structure_id)
                flag_json["minecraft:entity"]["events"]["become_Y"]["queue_command"]["command"][1] = "scriptevent zex:flagChange GA {}".format(structure_id)
                flag_json["minecraft:entity"]["components"]["minecraft:type_family"]["family"] = [ "GAflag", "inanimate" ]
                if structure_flag_type == "L":
                    flag_json["minecraft:entity"]["components"]["minecraft:health"]["value"] = 400
                    flag_json["minecraft:entity"]["components"]["minecraft:health"]["max"] = 400
                    
            with open("behavior_packs/GVCBedrock/entities/flag/{}_ga.json".format(structure_id),"w") as f:
                json.dump(flag_json,f,indent=2)



            red_interact = {
                "on_interact": {
                    "filters": {
                        "all_of": [
                            {
                                "test": "is_family",
                                "subject": "other",
                                "value": "redteam"
                            }
                        ]
                    }
                },
                "cooldown": 300.0,
                "swing": True,
                "use_item": False,
                "interact_text": "アイテムを取得",
                "spawn_items": {
                    "table": "loot_tables/boss/{}.json".format(structure_loot)
                }
            }
            blue_interact = {
                "on_interact": {
                    "filters": {
                        "all_of": [
                            {
                                "test": "is_family",
                                "subject": "other",
                                "value": "blueteam"
                            }
                        ]
                    }
                },
                "cooldown": 300.0,
                "swing": True,
                "use_item": False,
                "interact_text": "アイテムを取得",
                "spawn_items": {
                    "table": "loot_tables/boss/{}.json".format(structure_loot)
                }
            }
            green_interact = {
                "on_interact": {
                    "filters": {
                        "all_of": [
                            {
                                "test": "is_family",
                                "subject": "other",
                                "value": "greenteam"
                            }
                        ]
                    }
                },
                "cooldown": 300.0,
                "swing": True,
                "use_item": False,
                "interact_text": "アイテムを取得",
                "spawn_items": {
                    "table": "loot_tables/boss/{}.json".format(structure_loot)
                }
            }
            yellow_interact = {
                "on_interact": {
                    "filters": {
                        "all_of": [
                            {
                                "test": "is_family",
                                "subject": "other",
                                "value": "yellowteam"
                            }
                        ]
                    }
                },
                "cooldown": 300.0,
                "swing": True,
                "use_item": False,
                "interact_text": "アイテムを取得",
                "spawn_items": {
                    "table": "loot_tables/boss/{}.json".format(structure_loot)
                }
            }
                


            with open("tool/a1red.json","r") as f:
                flag_json = json.load(f)
                flag_json["minecraft:entity"]["components"]["minecraft:boss"]["name"] = "entity.gvcv5:flag_red_{0}.name".format(structure_id)
                flag_json["minecraft:entity"]["description"]["identifier"] = "gvcv5:flag_red_{}".format(structure_id)
                flag_json["minecraft:entity"]["components"]["minecraft:interact"]["interactions"].append(red_interact)
                flag_json["minecraft:entity"]["events"]["minecraft:entity_spawned"] = { "queue_command": { "command":[ "scriptevent zex:flagStart red {}".format(structure_id) ] } }
                flag_json["minecraft:entity"]["events"]["become_GA"]["queue_command"]["command"][0] = "summon gvcv5:flag_{}_ga ~~~".format(structure_id)
                flag_json["minecraft:entity"]["events"]["become_GA"]["queue_command"]["command"][1] = "scriptevent zex:flagChange red {}".format(structure_id)
                flag_json["minecraft:entity"]["events"]["become_R"]["queue_command"]["command"][0] = "summon gvcv5:flag_red_{} ~~~".format(structure_id)
                flag_json["minecraft:entity"]["events"]["become_R"]["queue_command"]["command"][1] = "scriptevent zex:flagChange red {}".format(structure_id)
                flag_json["minecraft:entity"]["events"]["become_B"]["queue_command"]["command"][0] = "summon gvcv5:flag_blue_{} ~~~".format(structure_id)
                flag_json["minecraft:entity"]["events"]["become_B"]["queue_command"]["command"][1] = "scriptevent zex:flagChange red {}".format(structure_id)
                flag_json["minecraft:entity"]["events"]["become_G"]["queue_command"]["command"][0] = "summon gvcv5:flag_green_{} ~~~".format(structure_id)
                flag_json["minecraft:entity"]["events"]["become_G"]["queue_command"]["command"][1] = "scriptevent zex:flagChange red {}".format(structure_id)
                flag_json["minecraft:entity"]["events"]["become_Y"]["queue_command"]["command"][0] = "summon gvcv5:flag_yellow_{} ~~~".format(structure_id)
                flag_json["minecraft:entity"]["events"]["become_Y"]["queue_command"]["command"][1] = "scriptevent zex:flagChange red {}".format(structure_id)
                flag_json["minecraft:entity"]["components"]["minecraft:type_family"]["family"] = [ "Rflag", "inanimate" ]
                if structure_flag_type == "L":
                    flag_json["minecraft:entity"]["components"]["minecraft:health"]["value"] = 400
                    flag_json["minecraft:entity"]["components"]["minecraft:health"]["max"] = 400

            with open("behavior_packs/GVCBedrock/entities/flag/flag_red_{}.json".format(structure_id),"w") as f:
                json.dump(flag_json,f,indent=2)

            with open("tool/a1blue.json","r") as f:
                flag_json = json.load(f)
                flag_json["minecraft:entity"]["components"]["minecraft:boss"]["name"] = "entity.gvcv5:flag_blue_{0}.name".format(structure_id)
                flag_json["minecraft:entity"]["description"]["identifier"] = "gvcv5:flag_blue_{}".format(structure_id)
                flag_json["minecraft:entity"]["components"]["minecraft:interact"]["interactions"].append(blue_interact)
                flag_json["minecraft:entity"]["events"]["minecraft:entity_spawned"] = { "queue_command": { "command":[ "scriptevent zex:flagStart blue {}".format(structure_id) ] } }
                flag_json["minecraft:entity"]["events"]["become_GA"]["queue_command"]["command"][0] = "summon gvcv5:flag_{}_ga ~~~".format(structure_id)
                flag_json["minecraft:entity"]["events"]["become_GA"]["queue_command"]["command"][1] = "scriptevent zex:flagChange blue {}".format(structure_id)
                flag_json["minecraft:entity"]["events"]["become_R"]["queue_command"]["command"][0] = "summon gvcv5:flag_red_{} ~~~".format(structure_id)
                flag_json["minecraft:entity"]["events"]["become_R"]["queue_command"]["command"][1] = "scriptevent zex:flagChange blue {}".format(structure_id)
                flag_json["minecraft:entity"]["events"]["become_B"]["queue_command"]["command"][0] = "summon gvcv5:flag_blue_{} ~~~".format(structure_id)
                flag_json["minecraft:entity"]["events"]["become_B"]["queue_command"]["command"][1] = "scriptevent zex:flagChange blue {}".format(structure_id)
                flag_json["minecraft:entity"]["events"]["become_G"]["queue_command"]["command"][0] = "summon gvcv5:flag_green_{} ~~~".format(structure_id)
                flag_json["minecraft:entity"]["events"]["become_G"]["queue_command"]["command"][1] = "scriptevent zex:flagChange blue {}".format(structure_id)
                flag_json["minecraft:entity"]["events"]["become_Y"]["queue_command"]["command"][0] = "summon gvcv5:flag_yellow_{} ~~~".format(structure_id)
                flag_json["minecraft:entity"]["events"]["become_Y"]["queue_command"]["command"][1] = "scriptevent zex:flagChange blue {}".format(structure_id)
                flag_json["minecraft:entity"]["components"]["minecraft:type_family"]["family"] = [ "Bflag", "inanimate" ]
                if structure_flag_type == "L":
                    flag_json["minecraft:entity"]["components"]["minecraft:health"]["value"] = 400
                    flag_json["minecraft:entity"]["components"]["minecraft:health"]["max"] = 400

            with open("behavior_packs/GVCBedrock/entities/flag/flag_blue_{}.json".format(structure_id),"w") as f:
                json.dump(flag_json,f,indent=2)

            with open("tool/a1green.json","r") as f:
                flag_json = json.load(f)
                flag_json["minecraft:entity"]["components"]["minecraft:boss"]["name"] = "entity.gvcv5:flag_green_{0}.name".format(structure_id)
                flag_json["minecraft:entity"]["description"]["identifier"] = "gvcv5:flag_green_{}".format(structure_id)
                flag_json["minecraft:entity"]["components"]["minecraft:interact"]["interactions"].append(green_interact)
                flag_json["minecraft:entity"]["events"]["minecraft:entity_spawned"] = { "queue_command": { "command":[ "scriptevent zex:flagStart green {}".format(structure_id) ] } }
                flag_json["minecraft:entity"]["events"]["become_GA"]["queue_command"]["command"][0] = "summon gvcv5:flag_{}_ga ~~~".format(structure_id)
                flag_json["minecraft:entity"]["events"]["become_GA"]["queue_command"]["command"][1] = "scriptevent zex:flagChange green {}".format(structure_id)
                flag_json["minecraft:entity"]["events"]["become_R"]["queue_command"]["command"][0] = "summon gvcv5:flag_red_{} ~~~".format(structure_id)
                flag_json["minecraft:entity"]["events"]["become_R"]["queue_command"]["command"][1] = "scriptevent zex:flagChange green {}".format(structure_id)
                flag_json["minecraft:entity"]["events"]["become_B"]["queue_command"]["command"][0] = "summon gvcv5:flag_blue_{} ~~~".format(structure_id)
                flag_json["minecraft:entity"]["events"]["become_B"]["queue_command"]["command"][1] = "scriptevent zex:flagChange green {}".format(structure_id)
                flag_json["minecraft:entity"]["events"]["become_G"]["queue_command"]["command"][0] = "summon gvcv5:flag_green_{} ~~~".format(structure_id)
                flag_json["minecraft:entity"]["events"]["become_G"]["queue_command"]["command"][1] = "scriptevent zex:flagChange green {}".format(structure_id)
                flag_json["minecraft:entity"]["events"]["become_Y"]["queue_command"]["command"][0] = "summon gvcv5:flag_yellow_{} ~~~".format(structure_id)
                flag_json["minecraft:entity"]["events"]["become_Y"]["queue_command"]["command"][1] = "scriptevent zex:flagChange green {}".format(structure_id)
                flag_json["minecraft:entity"]["components"]["minecraft:type_family"]["family"] = [ "Gflag", "inanimate" ]
                if structure_flag_type == "L":
                    flag_json["minecraft:entity"]["components"]["minecraft:health"]["value"] = 400
                    flag_json["minecraft:entity"]["components"]["minecraft:health"]["max"] = 400

            with open("behavior_packs/GVCBedrock/entities/flag/flag_green_{}.json".format(structure_id),"w") as f:
                json.dump(flag_json,f,indent=2)

            with open("tool/a1yellow.json","r") as f:
                flag_json = json.load(f)
                flag_json["minecraft:entity"]["components"]["minecraft:boss"]["name"] = "entity.gvcv5:flag_yellow_{0}.name".format(structure_id)
                flag_json["minecraft:entity"]["description"]["identifier"] = "gvcv5:flag_yellow_{}".format(structure_id)
                flag_json["minecraft:entity"]["components"]["minecraft:interact"]["interactions"].append(yellow_interact)
                flag_json["minecraft:entity"]["events"]["minecraft:entity_spawned"] = { "queue_command": { "command":[ "scriptevent zex:flagStart yellow {}".format(structure_id) ] } }
                flag_json["minecraft:entity"]["events"]["become_GA"]["queue_command"]["command"][0] = "summon gvcv5:flag_{}_ga ~~~".format(structure_id)
                flag_json["minecraft:entity"]["events"]["become_GA"]["queue_command"]["command"][1] = "scriptevent zex:flagChange yellow {}".format(structure_id)
                flag_json["minecraft:entity"]["events"]["become_R"]["queue_command"]["command"][0] = "summon gvcv5:flag_red_{} ~~~".format(structure_id)
                flag_json["minecraft:entity"]["events"]["become_R"]["queue_command"]["command"][1] = "scriptevent zex:flagChange yellow {}".format(structure_id)
                flag_json["minecraft:entity"]["events"]["become_B"]["queue_command"]["command"][0] = "summon gvcv5:flag_blue_{} ~~~".format(structure_id)
                flag_json["minecraft:entity"]["events"]["become_B"]["queue_command"]["command"][1] = "scriptevent zex:flagChange yellow {}".format(structure_id)
                flag_json["minecraft:entity"]["events"]["become_G"]["queue_command"]["command"][0] = "summon gvcv5:flag_green_{} ~~~".format(structure_id)
                flag_json["minecraft:entity"]["events"]["become_G"]["queue_command"]["command"][1] = "scriptevent zex:flagChange yellow {}".format(structure_id)
                flag_json["minecraft:entity"]["events"]["become_Y"]["queue_command"]["command"][0] = "summon gvcv5:flag_yellow_{} ~~~".format(structure_id)
                flag_json["minecraft:entity"]["events"]["become_Y"]["queue_command"]["command"][1] = "scriptevent zex:flagChange yellow {}".format(structure_id)
                flag_json["minecraft:entity"]["components"]["minecraft:type_family"]["family"] = [ "Yflag", "inanimate" ]
                if structure_flag_type == "L":
                    flag_json["minecraft:entity"]["components"]["minecraft:health"]["value"] = 400
                    flag_json["minecraft:entity"]["components"]["minecraft:health"]["max"] = 400

            with open("behavior_packs/GVCBedrock/entities/flag/flag_yellow_{}.json".format(structure_id),"w") as f:
                json.dump(flag_json,f,indent=2)


            with open("behavior_packs/GVCBedrock/functions/flag/{}.mcfunction".format(structure_id),"w") as f:
                if(structure_flag_type == "L" or structure_flag_type == "M"): f.write("summon gvcv5:flag_{}_ga\n".format(structure_id))
                elif(structure_flag_type == "A"): f.write("summon gvcv5:flag_{}_ca\n".format(structure_id))
                f.write("fill ~~~ ~~~ air\n")
            
            
            with open("tool/flag_ca.json","r") as f:
                flag_r_json = json.load(f)
                flag_r_json["minecraft:client_entity"]["description"]["identifier"] = "gvcv5:flag_{}_ca".format(structure_id)
            with open("resource_packs/GVCBedrock/entity/flag/{}_ca.json".format(structure_id),"w") as f:
                json.dump(flag_r_json,f,indent=2)

            with open("tool/flag_ga.json","r") as f:
                flag_r_json = json.load(f)
                flag_r_json["minecraft:client_entity"]["description"]["identifier"] = "gvcv5:flag_{}_ga".format(structure_id)
            with open("resource_packs/GVCBedrock/entity/flag/{}_ga.json".format(structure_id),"w") as f:
                json.dump(flag_r_json,f,indent=2)
                

            with open("tool/flag_color.json","r") as f:
                flag_r_json = json.load(f)

            with open("resource_packs/GVCBedrock/entity/flag/{}_red.json".format(structure_id),"w") as f:
                flag_r_json["minecraft:client_entity"]["description"]["identifier"] = "gvcv5:flag_red_{}".format(structure_id)
                flag_r_json["minecraft:client_entity"]["description"]["textures"]["default"] = "textures/flag/redteam"
                json.dump(flag_r_json,f,indent=2)
            with open("resource_packs/GVCBedrock/entity/flag/{}_blue.json".format(structure_id),"w") as f:
                flag_r_json["minecraft:client_entity"]["description"]["identifier"] = "gvcv5:flag_blue_{}".format(structure_id)
                flag_r_json["minecraft:client_entity"]["description"]["textures"]["default"] = "textures/flag/blueteam"
                json.dump(flag_r_json,f,indent=2)
            with open("resource_packs/GVCBedrock/entity/flag/{}_green.json".format(structure_id),"w") as f:
                flag_r_json["minecraft:client_entity"]["description"]["identifier"] = "gvcv5:flag_green_{}".format(structure_id)
                flag_r_json["minecraft:client_entity"]["description"]["textures"]["default"] = "textures/flag/greenteam"
                json.dump(flag_r_json,f,indent=2)
            with open("resource_packs/GVCBedrock/entity/flag/{}_yellow.json".format(structure_id),"w") as f:
                flag_r_json["minecraft:client_entity"]["description"]["identifier"] = "gvcv5:flag_yellow_{}".format(structure_id)
                flag_r_json["minecraft:client_entity"]["description"]["textures"]["default"] = "textures/flag/yellowteam"
                json.dump(flag_r_json,f,indent=2)

            print("{}\n".format(structure_id))

            


    
    row_count += 1

with open("resource_packs/GVCBedrock/texts/buildings.txt","w") as f:
    f.write(text)
with open("resource_packs/GVCBedrock/texts/endtext.txt","w") as f:
    f.write(endtext)
with open("resource_packs/GVCBedrock/texts/flag.txt","w") as f:
    f.write(e_text)
with open("resource_packs/GVCBedrock/texts/flag_s.txt","w") as f:
    f.write(se_text)