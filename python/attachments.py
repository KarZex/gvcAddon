import json
import csv
import os
import ast

teams = ["player","player_team","ca","ca_team","pmc","pmc_team","pmc_red","pmc_blue","pmc_green","pmc_yellow","ga"]
true_teams = [ "ENG", "SOV", "GER", "USA", "JAP" ]

attach_types = []
attachdata_json = {}
gun_attach_json = {}

attach_directory = "resource_packs/GVCBedrock/attachables/guns/"

item_json = json.load(open("resource_packs/GVCBedrock/textures/item_texture.json","r"))
csv_path = open("csv/attach.csv","r")
csv_reader = csv.reader(csv_path)
row_count = 0


def get_sights(gun_id):
    csv_path_w = open("csv/gunAttachments.csv","r")
    csv_reader_w = csv.reader(csv_path_w)

    for row in csv_reader_w:
        if row[1] == gun_id:
            print(row[2])
            return row[2]
    
    return "0"


with open("tool/attach_scopes.json","r") as f:
    scope_render = json.load(f)

for row in csv_reader:
    if( row_count >= 1 ):
        attach_id = row[1]
        attach_type = row[2]
        attach_number = int(row[3])
        attach_is_2d_scope = row[4]

        if( not attach_type in attach_types  ):
            attach_types.append(attach_type)
            attachdata_json["{}".format(attach_type)] = [ "none" ]

        attachdata_json["{}".format(attach_type)].append(attach_id)
        
        with open("tool/attach_item.json","r") as f:
            attach_json = json.load(f)
            attach_json["minecraft:item"]["description"]["identifier"] = "zex:{}".format(attach_id)
            attach_json["minecraft:item"]["components"]["minecraft:icon"] = "{}".format(attach_id)

        with open("behavior_packs/GVCBedrock/items/attachment/{0}.json".format(attach_id),"w") as f:
            json.dump(attach_json,f,indent=4)

        
        if attach_is_2d_scope != "":
            array_length = len(scope_render["render_controllers"]["controller.render.scope"]["arrays"]["textures"]["Array.base"])
            if( array_length-1 < attach_number ):
                for i in range( attach_number - array_length+1 ):
                    scope_render["render_controllers"]["controller.render.scope"]["arrays"]["textures"]["Array.base"].append("Texture.scope")

            scope_render["render_controllers"]["controller.render.scope"]["arrays"]["textures"]["Array.base"][attach_number] = "Texture.{}_scope".format(attach_id)




        for root, dirs, files in os.walk(attach_directory):
            for file in files:
                if file.endswith('.json'):
                    file_path = os.path.join(root, file)
                    with open(file_path, 'r', encoding='utf-8') as f:
                        try:
                            data = json.load(f)
                            gun_id = data["minecraft:attachable"]["description"]["identifier"]
                            data["minecraft:attachable"]["description"]["materials"]["default"] = "iron_golem"
                            data["minecraft:attachable"]["description"]["textures"]["enchanted"] = "textures/misc/enchanted_item_glint"
                            data["minecraft:attachable"]["description"]["materials"]["enchanted"] = "armor_enchanted"
                            data["minecraft:attachable"]["description"]["textures"]["none".format(attach_id)] = "textures/models/leemk4.png"
                            data["minecraft:attachable"]["description"]["geometry"]["none".format(attach_id)] = "geometry.sniperscope"
                            data["minecraft:attachable"]["description"]["textures"]["{}".format(attach_id)] = "textures/models/{}.png".format(attach_id)
                            data["minecraft:attachable"]["description"]["geometry"]["{}".format(attach_id)] = "geometry.{}".format(attach_id)
                            if attach_is_2d_scope != "":
                                data["minecraft:attachable"]["description"]["textures"]["{}_scope".format(attach_id)] = "textures/models/{}.png".format(attach_is_2d_scope)
                                data["minecraft:attachable"]["description"]["geometry"]["scope"] = "geometry.scope"

                            with open(file_path, 'w', encoding='utf-8') as f:
                                json.dump(data, f, ensure_ascii=False, indent=4)

                        except json.JSONDecodeError as e:
                            print(f"Error decoding JSON from {file_path}: {e}")
        
        item_json["texture_data"]["{}".format(attach_id)] = { "textures": "textures/items/attachment/{}".format(attach_id) }

        print("create {}".format(attach_id))
    

    row_count += 1

for team in teams:
    with open("tool/{0}.json".format(team),"r") as f:
        player_json = json.load(f)
        player_json["minecraft:entity"]["description"]["properties"] = {
            "zex:is_scoping":{
                "client_sync": True,
                "type": "bool",
                "default": False
            }
        }
        for attach_type in attach_types:
            player_json["minecraft:entity"]["description"]["properties"]["zex:{}".format(attach_type)] = {
            "client_sync": True,
            "type": "int",
            "range": [ 0,255 ],
            "default": 0
            }
    with open( "tool/{0}.json".format(team),"w" ) as f:
        json.dump(player_json,f,indent=4)

attachdata_json["attachTypes"] = attach_types

for root, dirs, files in os.walk(attach_directory):
    for file in files:
        if file.endswith('.json'):
            file_path = os.path.join(root, file)
            with open(file_path, 'r', encoding='utf-8') as f:
                try:
                    data = json.load(f)
                    gun_id = data["minecraft:attachable"]["description"]["identifier"].split(":")[1]
                    sights = get_sights(gun_id)
                    if( "[" in sights ):
                        data["minecraft:attachable"]["description"]["animations"]["ads_scope"] = "animation.mosin.ads"
                        data["minecraft:attachable"]["description"]["animations"]["ads_sight"] = "animation.sight.ads"
                        for ani in data["minecraft:attachable"]["description"]["scripts"]["animate"]:
                            if( "ads" in ani ):
                                ani["ads"] = "query.property('zex:sights') == 0 && !query.property('zex:is_scoping') && (v.main_hand && c.is_first_person) && query.is_sneaking"
                            if( "ads_scope" in ani ):
                                del ani["ads_scope"]
                            if( "ads_sight" in ani ):
                                del ani["ads_sight"]
                        
                        data["minecraft:attachable"]["description"]["scripts"]["animate"] = [item for item in data["minecraft:attachable"]["description"]["scripts"]["animate"] if item != {}]
                        
                        data["minecraft:attachable"]["description"]["scripts"]["animate"].append({
                            "ads_scope": "query.property('zex:is_scoping') && (v.main_hand && c.is_first_person) && query.is_sneaking"
                        })
                        data["minecraft:attachable"]["description"]["scripts"]["animate"].append({
                            "ads_sight": "query.property('zex:sights') != 0 && !query.property('zex:is_scoping') && (v.main_hand && c.is_first_person) && query.is_sneaking"
                        })

                        data["minecraft:attachable"]["description"]["render_controllers"] = [
                            {"controller.render.gun":"(!query.property('zex:is_scoping') || !c.is_first_person)"},
                            { "controller.render.scope": "query.property('zex:is_scoping') && c.is_first_person" }
                        ]
                        for attach_type in attach_types:
                            render = { "controller.render.{0}".format(attach_type):"query.property('zex:{0}') != 0 && ((!query.property('zex:is_scoping') || !c.is_first_person))".format(attach_type) }
                            data["minecraft:attachable"]["description"]["render_controllers"].append(render)

                        gun_attach_json["{}".format(gun_id)] = {
                            "sights": ast.literal_eval(sights)
                        }
                        

                    else:
                        print(sights)
                        if( sights != "" ):
                            sight_number = int(int(sights))
                        else:
                            sight_number = 0
                        if( sight_number > 0 ):
                            data["minecraft:attachable"]["description"]["animations"]["ads"] = "animation.mosin.ads"
                            data["minecraft:attachable"]["description"]["render_controllers"] = [
                                {"controller.render.armor":"!query.is_sneaking || !c.is_first_person"},
                                { "controller.render.scope": "query.is_sneaking && c.is_first_person" }
                            ]
                        else:   
                            data["minecraft:attachable"]["description"]["render_controllers"] = [
                                "controller.render.armor"
                            ]

                        data["minecraft:attachable"]["description"]["scripts"] = {
                            "pre_animation": [
                                "v.main_hand = c.item_slot == 'main_hand';"
                            ],
                            "animate": [
                                {
                                    "first": "(v.main_hand && c.is_first_person) && !query.is_sneaking"
                                },
                                {
                                    "ads": "(v.main_hand && c.is_first_person) && query.is_sneaking"
                                },
                                {
                                    "third": "v.main_hand && !c.is_first_person"
                                }
                            ]
                        }
                        try:
                            del data["minecraft:attachable"]["description"]["animations"]["ads_scope"]
                            del data["minecraft:attachable"]["description"]["animations"]["ads_sight"]
                        except:
                            print("Already not exist")
                            
                        gun_attach_json["{}".format(gun_id)] = {
                            "sights": sight_number
                        }



                    with open(file_path, 'w', encoding='utf-8') as f:
                        json.dump(data, f, ensure_ascii=False, indent=4)

                except json.JSONDecodeError as e:
                    print(f"Error decoding JSON from {file_path}: {e}")


with open("resource_packs/GVCBedrock/render_controllers/scope.render_controllers.json","w") as f:
    json.dump(scope_render,f,indent=4)

for attach_type in attach_types:
    render_controller = {
        "format_version": "1.8.0",
        "render_controllers": {
            "controller.render.{0}".format(attach_type): {
                    "geometry": "Array.item_geo[query.property('zex:{0}')]".format(attach_type),
                    "materials": [{"*":"material.default"}],
                    "textures": ["Array.item_texture[query.property('zex:{0}')]".format(attach_type)],
                    "arrays": {
                        "geometries": {
                            "Array.item_geo": []
                        },
                        "textures": {
                            "Array.item_texture": []
                        }
                    } 
            }
        }
    }
    for attach_number in range(len(attachdata_json["{}".format(attach_type)])):
        attach_id = attachdata_json["{}".format(attach_type)][attach_number]
        array_length = len(render_controller["render_controllers"]["controller.render.{0}".format(attach_type)]["arrays"]["geometries"]["Array.item_geo"])
        if( array_length-1 < attach_number ):
            for i in range( attach_number - array_length+1 ):
                render_controller["render_controllers"]["controller.render.{0}".format(attach_type)]["arrays"]["geometries"]["Array.item_geo"].append("Texture.default")
        
        render_controller["render_controllers"]["controller.render.{0}".format(attach_type)]["arrays"]["geometries"]["Array.item_geo"][attach_number] = "geometry.{}".format(attach_id)

        array_length = len(render_controller["render_controllers"]["controller.render.{0}".format(attach_type)]["arrays"]["textures"]["Array.item_texture"])
        if( array_length-1 < attach_number ):
            for i in range( attach_number - array_length+1 ):
                render_controller["render_controllers"]["controller.render.{0}".format(attach_type)]["arrays"]["textures"]["Array.item_texture"].append("Texture.default")
        
        render_controller["render_controllers"]["controller.render.{0}".format(attach_type)]["arrays"]["textures"]["Array.item_texture"][attach_number] = "texture.{}".format(attach_id)
    
    with open( "resource_packs/GVCBedrock/render_controllers/{0}.render_controllers.json".format(attach_type), "w" ) as f:
        json.dump(render_controller,f,indent=4)


with open("behavior_packs/GVCBedrock/scripts/attach.json","w") as f:
    json.dump(attachdata_json,f,indent=2)

with open("behavior_packs/GVCBedrock/scripts/gunAttach.json","w") as f:
    json.dump(gun_attach_json,f,indent=2)


with open("behavior_packs/GVCBedrock/scripts/gunAttach.json","r") as f:
    export = "import { EntityDamageCause } from \"@minecraft/server\";\nexport const gunAttach = " 
    export += f.read()
    export += ";"
with open("behavior_packs/GVCBedrock/scripts/gunAttach.js","w") as f:
    f.write(export)

with open("behavior_packs/GVCBedrock/scripts/attach.json","r") as f:
    export = "import { EntityDamageCause } from \"@minecraft/server\";\nexport const attachmentData = " 
    export += f.read()
    export += ";"

with open("behavior_packs/GVCBedrock/scripts/attach.js","w") as f:
    f.write(export)


with open("resource_packs/GVCBedrock/textures/item_texture.json","w") as f:
    json.dump(item_json,f,indent=2)