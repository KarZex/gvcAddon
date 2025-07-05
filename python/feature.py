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
    if( row_count >= 1):
        endtext += "tile.gvcv5:structure_end_{0}.name={1}\n".format(row[2],row[0])
        with open("tool/structure_end.json","r") as f:
            structure_end_json = json.load(f)
            structure_end_json["minecraft:block"]["description"]["identifier"] = "gvcv5:structure_end_{}".format(row[2])
            

        with open("behavior_packs/GVCBedrock/blocks/endblock/{}_end.json".format(row[2]),"w") as f:
            json.dump(structure_end_json,f,indent=2)
        
    if( row_count >= 1 and row[4] != "" ):
        #from CSV
        structure_id = row[2]
        structure_loadx = int(row[4])
        structure_loadz = int(row[5])
        structure_loady = int(row[6])
        structure_chance = float(row[7])
        structure_flag_type = row[8].replace("nf","")
        structure_is_ship = row[9]
        text += "tile.gvcv5:building_{0}.name={1}\n".format(structure_id,row[0])
        with open("behavior_packs/GVCBedrock/functions/structure/{}.mcfunction".format(structure_id),"w") as f:
            f.write("execute if score {3} building matches 1 run tickingarea add ~~~ ~{0}~63~{1} {2} true\n".format(structure_loadx+16,structure_loadz+16,structure_id,structure_flag_type))
            f.write("execute if score {4} building matches 1 run structure load {3} ~~-{1}~\n".format(structure_loadx,structure_loady,structure_loadz,structure_id,structure_flag_type))
            if( structure_loadx > 64 ): f.write("execute if score {4} building matches 1 run structure load {3}_x64 ~64~-{1}~\n".format(structure_loadx,structure_loady,structure_loadz,structure_id,structure_flag_type))
            if( structure_loadz > 64 ): f.write("execute if score {4} building matches 1 run structure load {3}_z64 ~~-{1}~64\n".format(structure_loadx,structure_loady,structure_loadz,structure_id,structure_flag_type))
            if( structure_loadx > 64 and structure_loadz > 64 ): f.write("execute if score {4} building matches 1 run structure load {3}_x64z64 ~64~-{1}~64\n".format(structure_loadx,structure_loady,structure_loadz,structure_id,structure_flag_type))
            f.write("fill ~~~ ~~~ minecraft:air\n")
            
        with open("tool/feature.json","r") as f:
            feature_json = json.load(f)
            feature_json["minecraft:structure_template_feature"]["description"]["identifier"] = "gvcv5:{}".format(structure_id)
            feature_json["minecraft:structure_template_feature"]["structure_name"] = "mystructure:f_{}".format(structure_id)
            if structure_is_ship == "T": feature_json["minecraft:structure_template_feature"]["constraints"] = { "unburied":{} }
            else: feature_json["minecraft:structure_template_feature"]["constraints"] = { "grounded":{} }

        with open("behavior_packs/GVCBedrock/features/{}.json".format(structure_id),"w") as f:
            json.dump(feature_json,f,indent=2)
            
        for l in range(7):
            if l == 0: chance = structure_chance
            elif l == 1: continue
            elif l == 2: chance = structure_chance * 0.25
            elif l == 3: chance = structure_chance * 0.5
            elif l == 4: chance = structure_chance * 2
            elif l == 5: chance = structure_chance * 4
            elif l == 6: chance = structure_chance * 8
            with open("tool/feature_rule.json","r") as f:
                feature_rule_json = json.load(f)
                feature_rule_json["minecraft:feature_rules"]["description"]["identifier"] = "gvcv5:{}_rule".format(structure_id)
                feature_rule_json["minecraft:feature_rules"]["description"]["places_feature"] = "gvcv5:{}".format(structure_id)
                feature_rule_json["minecraft:feature_rules"]["distribution"]["scatter_chance"] = chance
                i = 11
                j = -1
                while not row[i] == "":
                    if not ";" in row[i]:
                        operator = row[i]
                        feature_rule_json["minecraft:feature_rules"]["conditions"]["minecraft:biome_filter"].append({ "{}_of".format(operator): [] })
                        j += 1
                    if ";" in row[i]:
                        op,biome = row[i].split(";")
                        if op == "F": op = "!="
                        else: op = "=="
                        biome_test = {  "test": "has_biome_tag", "operator": op, "value": biome }
                        feature_rule_json["minecraft:feature_rules"]["conditions"]["minecraft:biome_filter"][j]["{}_of".format(operator)].append(biome_test)
                        
                    i += 1

            

            with open("behavior_packs/GVCBedrock/subpacks/{1}/feature_rules/{0}_rule.json".format(structure_id,l),"w") as f:
                json.dump(feature_rule_json,f,indent=2)


        with open("tool/structure_block.json","r") as f:
            structure_block_json = json.load(f)
            structure_block_json["minecraft:block"]["description"]["identifier"] = "gvcv5:building_{}".format(structure_id)
            

        with open("behavior_packs/GVCBedrock/blocks/buildings/{}.json".format(structure_id),"w") as f:
            json.dump(structure_block_json,f,indent=2)
        
        if structure_flag_type != "S" and not "nf" in row[8]:

            e_text += "entity.gvcv5:flag_{0}_ca.name=§b{1}\n".format(structure_id,row[0].replace("ダンジョン","同盟軍拠点"))
            se_text += "item.spawn_egg.entity.gvcv5:flag_{0}_ca.name={1}\n".format(structure_id,row[0].replace("ダンジョン","同盟軍拠点"))
            e_text += "entity.gvcv5:flag_{0}_ga.name=§8{1}\n".format(structure_id,row[0].replace("ダンジョン","ゲリラ拠点"))
            se_text += "item.spawn_egg.entity.gvcv5:flag_{0}_ga.name={1}\n".format(structure_id,row[0].replace("ダンジョン","ゲリラ拠点"))
            with open("tool/vloot.json","r") as f:
                loot_table = json.load(f)
                loot_table["pools"][0]["entries"][0]["functions"][0]["id"] = "gvcv5:flag_{}_ca".format(structure_id)
            with open("behavior_packs/GVCBedrock/loot_tables/flag/flag_{}_ca.json".format(structure_id),"w") as f:
                json.dump(loot_table,f,indent=2)

            with open("tool/a1.json","r") as f:
                flag_json = json.load(f)
                flag_json["minecraft:entity"]["description"]["identifier"] = "gvcv5:flag_{}_ca".format(structure_id)
                flag_json["minecraft:entity"]["components"]["minecraft:interact"]["interactions"][1]["spawn_items"]["table"] = "loot_tables/flag/flag_{}_ca.json".format(structure_id)
                flag_json["minecraft:entity"]["events"]["become_CA"]["queue_command"]["command"][0] = "summon gvcv5:flag_{}_ca ~~1~".format(structure_id)
                flag_json["minecraft:entity"]["events"]["become_GA"]["queue_command"]["command"][0] = "summon gvcv5:flag_{}_ga ~~1~".format(structure_id)
                flag_json["minecraft:entity"]["components"]["minecraft:boss"]["name"] = "entity.gvcv5:flag_{0}_ca.name".format(structure_id)
                if structure_flag_type == "L":
                    flag_json["minecraft:entity"]["components"]["minecraft:health"]["value"] = 400
                    flag_json["minecraft:entity"]["components"]["minecraft:health"]["max"] = 400
                    flag_json["minecraft:entity"]["components"]["minecraft:damage_sensor"]["triggers"] = [ {  "cause": "all", "deals_damage": False } ]
                    flag_json["minecraft:entity"]["components"]["minecraft:type_family"]["family"] = [ "mob" ]

            with open("behavior_packs/GVCBedrock/entities/flag/{}_ca.json".format(structure_id),"w") as f:
                json.dump(flag_json,f,indent=2)

            with open("tool/a1_team.json","r") as f:
                flag_json = json.load(f)
                flag_json["minecraft:entity"]["description"]["identifier"] = "gvcv5:flag_{}_ca".format(structure_id)
                flag_json["minecraft:entity"]["components"]["minecraft:interact"]["interactions"][5]["spawn_items"]["table"] = "loot_tables/flag/flag_{}_ca.json".format(structure_id)
                flag_json["minecraft:entity"]["events"]["become_CA"]["queue_command"]["command"][0] = "summon gvcv5:flag_{}_ca ~~1~".format(structure_id)
                flag_json["minecraft:entity"]["events"]["become_GA"]["queue_command"]["command"][0] = "summon gvcv5:flag_{}_ga ~~1~".format(structure_id)
                flag_json["minecraft:entity"]["components"]["minecraft:boss"]["name"] = "entity.gvcv5:flag_{0}_ca.name".format(structure_id)
                if structure_flag_type == "L":
                    flag_json["minecraft:entity"]["components"]["minecraft:health"]["value"] = 400
                    flag_json["minecraft:entity"]["components"]["minecraft:health"]["max"] = 400
                    flag_json["minecraft:entity"]["components"]["minecraft:damage_sensor"]["triggers"] = [ {  "cause": "all", "deals_damage": False } ]
                    flag_json["minecraft:entity"]["components"]["minecraft:type_family"]["family"] = [ "mob" ]

            with open("behavior_packs/GVCBedrockTeam/entities/flag/{}_ca.json".format(structure_id),"w") as f:
                json.dump(flag_json,f,indent=2)







            with open("tool/a2.json","r",encoding="utf-8") as f:
                flag_json = json.load(f)
                flag_json["minecraft:entity"]["description"]["identifier"] = "gvcv5:flag_{}_ga".format(structure_id)
                if row[10] == "":
                    flag_json["minecraft:entity"]["events"]["become_CA"]["queue_command"]["command"][0] = "summon gvcv5:flag_{}_ca ~~1~".format(structure_id)
                else:
                    flag_json["minecraft:entity"]["events"]["become_CA"]["queue_command"]["command"] = ["summon gvcv5:flag_{}_ca ~~1~".format(structure_id),"{}".format(row[10])]
                flag_json["minecraft:entity"]["events"]["become_GA"]["queue_command"]["command"][0] = "summon gvcv5:flag_{}_ga ~~1~".format(structure_id)
                flag_json["minecraft:entity"]["components"]["minecraft:boss"]["name"] = "entity.gvcv5:flag_{0}_ga.name".format(structure_id)
                if structure_flag_type == "L":
                    flag_json["minecraft:entity"]["components"]["minecraft:health"]["value"] = 400
                    flag_json["minecraft:entity"]["components"]["minecraft:health"]["max"] = 400
                    flag_json["minecraft:entity"]["components"]["minecraft:type_family"]["family"] = [ "guerrilla","monster","mob","flag_large" ]
                

            with open("behavior_packs/GVCBedrock/entities/flag/{}_ga.json".format(structure_id),"w") as f:
                json.dump(flag_json,f,indent=2)


            with open("tool/a2_team.json","r",encoding="utf-8") as f:
                flag_json = json.load(f)
                flag_json["minecraft:entity"]["description"]["identifier"] = "gvcv5:flag_{}_ga".format(structure_id)
                if row[10] == "":
                    flag_json["minecraft:entity"]["events"]["become_CA"]["queue_command"]["command"][0] = "summon gvcv5:flag_{}_ca ~~1~".format(structure_id)
                else:
                    flag_json["minecraft:entity"]["events"]["become_CA"]["queue_command"]["command"] = ["summon gvcv5:flag_{}_ca ~~1~".format(structure_id),"{}".format(row[10])]
                    flag_json["minecraft:entity"]["events"]["become_R"]["queue_command"]["command"] = ["summon gvcv5:flag_red ~~5~","{}".format(row[10])]
                    flag_json["minecraft:entity"]["events"]["become_B"]["queue_command"]["command"] = ["summon gvcv5:flag_blue ~~5~","{}".format(row[10])]
                    flag_json["minecraft:entity"]["events"]["become_G"]["queue_command"]["command"] = ["summon gvcv5:flag_green ~~5~","{}".format(row[10])]
                    flag_json["minecraft:entity"]["events"]["become_Y"]["queue_command"]["command"] = ["summon gvcv5:flag_yellow ~~5~","{}".format(row[10])]

                flag_json["minecraft:entity"]["events"]["become_GA"]["queue_command"]["command"][0] = "summon gvcv5:flag_{}_ga ~~1~".format(structure_id)
                flag_json["minecraft:entity"]["components"]["minecraft:boss"]["name"] = "entity.gvcv5:flag_{0}_ga.name".format(structure_id)
                if structure_flag_type == "L":
                    flag_json["minecraft:entity"]["components"]["minecraft:health"]["value"] = 400
                    flag_json["minecraft:entity"]["components"]["minecraft:health"]["max"] = 400
                    flag_json["minecraft:entity"]["components"]["minecraft:type_family"]["family"] = [ "guerrilla","monster","mob","flag_large" ]
                

            with open("behavior_packs/GVCBedrockTeam/entities/flag/{}_ga.json".format(structure_id),"w") as f:
                json.dump(flag_json,f,indent=2)


            with open("behavior_packs/GVCBedrock/functions/flag/{}.mcfunction".format(structure_id),"w") as f:
                if(structure_flag_type == "L" or structure_flag_type == "M"): f.write("summon gvcv5:flag_{}_ga\n".format(structure_id))
                elif(structure_flag_type == "A"): f.write("summon gvcv5:flag_{}_ca\n".format(structure_id))
                f.write("fill ~~~ ~~~ air\n")
            
            #Resouce Pack
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