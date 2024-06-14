import json
import csv
import shutil

csv_path = open("gunData.csv","r")
csv_reader = csv.reader(csv_path)

row_count = 0
#aasdasd
for row in csv_reader:

    if( row_count >= 1 ):
        gun_id = row[1]
        gun_damage = int(row[4])
        gun_interval = int(row[8])
        gun_bomb =  int(row[9])
        gun_power = float(row[5])
        gun_aim = float(row[6])
        gun_reload = int(row[7])
        gun_maxammo = int(row[2])
        gun_ammo = row[3]

        if(row[10] == "T"):
            gun_break_block = True
        else:
            gun_break_block = False

        if(row[12] == "T"):
            gun_onehand = True
        else:
            gun_onehand = False


        if(gun_ammo == "zex:556m"):
            ammo_name = "§6.22Cal§r"
        elif(gun_ammo == "zex:762m"):
            ammo_name = "§3.30Cal§r"
        elif(gun_ammo == "zex:mm9"):
            ammo_name = "§99mmHG§r"
        elif(gun_ammo == "zex:btm"):
            ammo_name = "§aBattery§r"
        elif(gun_ammo == "zex:1270m"):
            ammo_name = "§c.50Cal§r"

        with open("behavior_packs/GVCAddonV5/scripts/gun.json","r") as f:
            gundata = json.load(f)
            gundata["{}".format(gun_id)] = { "damage": gun_damage, "maxGunAmmo": gun_maxammo, "reloadTime": gun_reload, "bullet": "{}".format(gun_ammo) }

        with open("behavior_packs/GVCAddonV5/scripts/gun.json","w") as f:
            json.dump(gundata,f,indent=2)

        with open("behavior_packs/GVCAddonV5/entities/player.json","r") as f:
            player = json.load(f)
            spawn_entity = { 
                "minecraft:spawn_entity":{
                    "entities": [
                        {
                            "filters": [
                                {"test":"has_tag","operator":"!=","value":"scope"}
                            ],
                            "max_wait_time": 0,
                            "min_wait_time": 0,
                            "num_to_spawn": 1,
                            "single_use": True,
                            "spawn_entity": "fire:{}".format(gun_id)
                        },
                        {
                            "filters": [
                                {"test":"has_tag","operator":"==","value":"scope"}
                            ],
                            "max_wait_time": 0,
                            "min_wait_time": 0,
                            "num_to_spawn": 1,
                            "single_use": True,
                            "spawn_entity": "fire:ads_{}".format(gun_id)
                        }
                    ]
                }
            }
            event = {
                "add": {
                    "component_groups": [
                        "fire:{}".format(gun_id)
                    ]
                }
            }
            player["minecraft:entity"]["component_groups"]["fire:{}".format(gun_id)] = spawn_entity
            player["minecraft:entity"]["events"]["fire:{}".format(gun_id)] = event


        with open("behavior_packs/GVCAddonV5/entities/player.json","w") as f:
            json.dump(player,f,indent=2)

        with open("behavior_packs/GVCAddonV5/animation_controllers/guns.json","r") as f:
            gunshot = json.load(f)
            always = 0
            for i in range(len(gunshot["animation_controllers"]["controller.animation.guns"]["states"]["default"]["transitions"])):
                if "{}".format(gun_id) in gunshot["animation_controllers"]["controller.animation.guns"]["states"]["default"]["transitions"][i]:
                    gunshot["animation_controllers"]["controller.animation.guns"]["states"]["default"]["transitions"][i]["{}".format(gun_id)].replace("query.item_remaining_use_duration > 0.10","query.is_using_item")
                    always = 1

            if always == 0 :
                gunshot["animation_controllers"]["controller.animation.guns"]["states"]["default"]["transitions"].append({ "{}".format(gun_id): "query.get_equipped_item_name == 'k98' && query.is_using_item" })


            gunshot["animation_controllers"]["controller.animation.guns"]["states"]["{}".format(gun_id)] = { "on_entry": [ "/event entity @s[scores={{{0}=1..}}] fire:{0}".format(gun_id), "/playsound empty.a1 @s[tag=!reload,scores={{{0}=0}}] ~~~".format(gun_id),"/scoreboard players remove @s[tag=!reload,tag=!noammo,scores={{{0}=1..}}] {0} 1".format(gun_id)  ],"transitions": [  { "default": "!query.is_using_item" },{"{}ii".format(gun_id): "query.get_equipped_item_name == '{}' && query.is_using_item".format(gun_id) } ] }

            if gun_interval == 0:
                gunshot["animation_controllers"]["controller.animation.guns"]["states"]["{}ii".format(gun_id)] = {}
                gunshot["animation_controllers"]["controller.animation.guns"]["states"]["{}ii".format(gun_id)] = { "on_entry": [ "/event entity @s[tag=!reload,scores={{{0}=1..}}] fire:{0}".format(gun_id), "/playsound empty.a1 @s[scores={{{0}=0}}] ~~~".format(gun_id),"/scoreboard players remove @s[tag=!reload,tag=!noammo,scores={{{0}=1..}}] {0} 1".format(gun_id)  ],"transitions": [  { "default": "!query.is_using_item" },{"{}".format(gun_id): "query.get_equipped_item_name == '{}' && query.is_using_item".format(gun_id) } ] }
                gunshot["animation_controllers"]["controller.animation.guns"]["states"]["{}".format(gun_id)]["transitions"][0] = {"default":"!query.is_using_item"}
                if len(gunshot["animation_controllers"]["controller.animation.guns"]["states"]["{}".format(gun_id)]["transitions"]) > 1:
                    gunshot["animation_controllers"]["controller.animation.guns"]["states"]["{}".format(gun_id)]["transitions"][1] = { "{}ii".format(gun_id): "query.get_equipped_item_name == '{}' && query.is_using_item".format(gun_id) }
                else: 
                    gunshot["animation_controllers"]["controller.animation.guns"]["states"]["{}".format(gun_id)]["transitions"].append({ "{}ii".format(gun_id): "query.get_equipped_item_name == '{}' && query.is_using_item".format(gun_id) })

                
                if not "{}ii".format(gun_id) in gunshot["animation_controllers"]["controller.animation.guns"]["states"]:
                    gunshot["animation_controllers"]["controller.animation.guns"]["states"]["{}ii"] = { "on_entry": [ "/event entity @s[tag=!reload,scores={{{0}=1..}}] fire:{0}".format(gun_id), "/playsound empty.a1 @s[tag=!reload,scores={{{0}=0}}] ~~~".format(gun_id),"/scoreboard players remove @s[tag=!reload,tag=!noammo,scores={{{0}=1..}}] {0} 1".format(gun_id)  ],"transitions": [  { "default": "!query.is_using_item" },{"{}".format(gun_id): "query.get_equipped_item_name == '{}' && query.is_using_item".format(gun_id) } ] }

                else:
                    gunshot["animation_controllers"]["controller.animation.guns"]["states"]["{}ii".format(gun_id)]["transitions"][0] = {"default":"!query.is_using_item"}
                    if len(gunshot["animation_controllers"]["controller.animation.guns"]["states"]["{}ii".format(gun_id)]["transitions"]) > 1:
                        gunshot["animation_controllers"]["controller.animation.guns"]["states"]["{}ii".format(gun_id)]["transitions"][1] = { "{}".format(gun_id): "query.get_equipped_item_name == '{}' && query.is_using_item".format(gun_id) }
                    else: 
                        gunshot["animation_controllers"]["controller.animation.guns"]["states"]["{}ii".format(gun_id)]["transitions"].append({ "{}".format(gun_id): "query.get_equipped_item_name == '{}' && query.is_using_item".format(gun_id) })

            else:
                gunshot["animation_controllers"]["controller.animation.guns"]["states"]["{}".format(gun_id)]["transitions"] = [ {"default":"variable.cooltime = (variable.cooltime ?? 0);variable.cooltime = variable.cooltime < {} ? variable.cooltime + 1:0;return variable.cooltime == 0;".format(gun_interval - 1)} ]

        
        with open("behavior_packs/GVCAddonV5/animation_controllers/guns.json","w") as f:
            json.dump(gunshot,f,indent=2)


        with open("behavior_packs/GVCAddonV5/entities/fire/{}.json".format(gun_id),"r") as f:
            gun_entity = json.load(f)
            gun_entity["minecraft:entity"]["components"]["minecraft:projectile"]["power"] = gun_power * 0.2
            gun_entity["minecraft:entity"]["components"]["minecraft:projectile"]["uncertaintyBase"] = gun_aim * 10
            gun_entity["minecraft:entity"]["components"]["minecraft:projectile"]["gravity"] = 0
            if gun_bomb > 0:
                gun_entity["minecraft:entity"]["components"]["minecraft:projectile"]["onHit"]["definition_event"] = { "affectProjectile": True, "eventTrigger": { "event": "minecraft:explode", "target": "self" } }
                if not "events" in gun_entity["minecraft:entity"]: gun_entity["minecraft:entity"]["events"] = {}
                gun_entity["minecraft:entity"]["events"]["minecraft:explode"] = { "add": { "component_groups": ["minecraft:exploding"] } }
                if not "component_groups" in gun_entity["minecraft:entity"]: gun_entity["minecraft:entity"]["component_groups"] = {}
                gun_entity["minecraft:entity"]["component_groups"]["minecraft:exploding"] = {  "minecraft:explode": { "fuse_length": 0, "fuse_lit": True, "power": gun_bomb, "breaks_blocks": gun_break_block } }

        
        with open("behavior_packs/GVCAddonV5/entities/fire/{}.json".format(gun_id),"w") as f:
            json.dump(gun_entity,f,indent=2)

        with open("behavior_packs/GVCAddonV5/entities/fire/scoped/{}.json".format(gun_id),"r") as f:
            gun_entity = json.load(f)
            gun_entity["minecraft:entity"]["components"]["minecraft:projectile"]["power"] = gun_power * 0.2
            gun_entity["minecraft:entity"]["components"]["minecraft:projectile"]["gravity"] = 0
            if gun_bomb > 0:
                gun_entity["minecraft:entity"]["components"]["minecraft:projectile"]["onHit"]["definition_event"] = { "affectProjectile": True, "eventTrigger": { "event": "minecraft:explode", "target": "self" } }
                if not "events" in gun_entity["minecraft:entity"]: gun_entity["minecraft:entity"]["events"] = {}
                gun_entity["minecraft:entity"]["events"]["minecraft:explode"] = { "add": { "component_groups": ["minecraft:exploding"] } }
                if not "component_groups" in gun_entity["minecraft:entity"]: gun_entity["minecraft:entity"]["component_groups"] = {}
                gun_entity["minecraft:entity"]["component_groups"]["minecraft:exploding"] = {  "minecraft:explode": { "fuse_length": 0, "fuse_lit": True, "power": gun_bomb, "breaks_blocks": gun_break_block } }


        with open("behavior_packs/GVCAddonV5/entities/fire/scoped/{}.json".format(gun_id),"w") as f:
            json.dump(gun_entity,f,indent=2)

        with open("behavior_packs/GVCAddonV5/functions/hold/{}h.mcfunction".format(gun_id),"w") as f:
            f.write("titleraw @s[tag=!reload] actionbar {{\"rawtext\":[{{\"text\":\"{1} \"}},{{\"score\":{{\"name\":\"@s\",\"objective\":\"{0}\"}}}},{{\"text\":\"/{2}\"}}]}}\n".format(gun_id,ammo_name,gun_maxammo))
            if(gun_onehand): f.write("playanimation @s[tag=!scope] animation.onehand.first none 0 \"query.is_sneaking\"")
            else: f.write("playanimation @s[tag=!scope] animation.item.first none 0 \"query.is_sneaking\"")

        print(gun_id)
        with open("resource_packs/GVCAddonV5/render_controllers/first_person.json","r") as f:
            gun_entity = json.load(f)
            if( not "| query.get_equipped_item_name(0, 1) == '{}' |".format(gun_id) in gun_entity["render_controllers"]["controller.render.player.first_person"]["part_visibility"][1]["rightArm"] ):
                gun_entity["render_controllers"]["controller.render.player.first_person"]["part_visibility"][1]["rightArm"] = gun_entity["render_controllers"]["controller.render.player.first_person"]["part_visibility"][1]["rightArm"].replace("| query.get_equipped_item_name(0, 1) == 'tt33' |","| query.get_equipped_item_name(0, 1) == '{}' || query.get_equipped_item_name(0, 1) == 'tt33' |".format(gun_id))
                gun_entity["render_controllers"]["controller.render.player.first_person"]["part_visibility"][2]["rightSleeve"] = gun_entity["render_controllers"]["controller.render.player.first_person"]["part_visibility"][2]["rightSleeve"].replace("| query.get_equipped_item_name(0, 1) == 'tt33' |","| query.get_equipped_item_name(0, 1) == '{}' || query.get_equipped_item_name(0, 1) == 'tt33' |".format(gun_id))
                gun_entity["render_controllers"]["controller.render.player.first_person"]["part_visibility"][3]["leftArm"] = gun_entity["render_controllers"]["controller.render.player.first_person"]["part_visibility"][3]["leftArm"].replace("| query.get_equipped_item_name(0, 1) == 'tt33' |","| query.get_equipped_item_name(0, 1) == '{}' || query.get_equipped_item_name(0, 1) == 'tt33' |".format(gun_id))
                gun_entity["render_controllers"]["controller.render.player.first_person"]["part_visibility"][4]["leftSleeve"] = gun_entity["render_controllers"]["controller.render.player.first_person"]["part_visibility"][4]["leftSleeve"].replace("| query.get_equipped_item_name(0, 1) == 'tt33' |","| query.get_equipped_item_name(0, 1) == '{}' || query.get_equipped_item_name(0, 1) == 'tt33' |".format(gun_id))

    
        with open("resource_packs/GVCAddonV5/entity/gun/ak12.json","r") as f:
            gun_entity = json.load(f)

        with open("resource_packs/GVCAddonV5/entity/gun/{}.json".format(gun_id),"w") as f:
            gun_entity["minecraft:client_entity"]["description"]["identifier"] = "fire:{}".format(gun_id)
            json.dump(gun_entity,f,indent=2)

        with open("resource_packs/GVCAddonV5/entity/gun/s/{}.json".format(gun_id),"w") as f:
            gun_entity["minecraft:client_entity"]["description"]["identifier"] = "fire:ads_{}".format(gun_id)
            json.dump(gun_entity,f,indent=2)

        with open("resource_packs/GVCAddonV5/render_controllers/first_person.json","r") as f:
            gun_entity = json.load(f)
            if( not "| query.get_equipped_item_name(0, 1) == '{}' |".format(gun_id) in gun_entity["render_controllers"]["controller.render.player.first_person"]["part_visibility"][1]["rightArm"] ):
                gun_entity["render_controllers"]["controller.render.player.first_person"]["part_visibility"][1]["rightArm"] = gun_entity["render_controllers"]["controller.render.player.first_person"]["part_visibility"][1]["rightArm"].replace("| query.get_equipped_item_name(0, 1) == 'tt33' |","| query.get_equipped_item_name(0, 1) == '{}' || query.get_equipped_item_name(0, 1) == 'tt33' |".format(gun_id))
                gun_entity["render_controllers"]["controller.render.player.first_person"]["part_visibility"][2]["rightSleeve"] = gun_entity["render_controllers"]["controller.render.player.first_person"]["part_visibility"][2]["rightSleeve"].replace("| query.get_equipped_item_name(0, 1) == 'tt33' |","| query.get_equipped_item_name(0, 1) == '{}' || query.get_equipped_item_name(0, 1) == 'tt33' |".format(gun_id))
                gun_entity["render_controllers"]["controller.render.player.first_person"]["part_visibility"][3]["leftArm"] = gun_entity["render_controllers"]["controller.render.player.first_person"]["part_visibility"][3]["leftArm"].replace("| query.get_equipped_item_name(0, 1) == 'tt33' |","| query.get_equipped_item_name(0, 1) == '{}' || query.get_equipped_item_name(0, 1) == 'tt33' |".format(gun_id))
                gun_entity["render_controllers"]["controller.render.player.first_person"]["part_visibility"][4]["leftSleeve"] = gun_entity["render_controllers"]["controller.render.player.first_person"]["part_visibility"][4]["leftSleeve"].replace("| query.get_equipped_item_name(0, 1) == 'tt33' |","| query.get_equipped_item_name(0, 1) == '{}' || query.get_equipped_item_name(0, 1) == 'tt33' |".format(gun_id))

    
        with open("resource_packs/GVCAddonV5/render_controllers/first_person.json","w") as f:
            json.dump(gun_entity,f,indent=2)
            
    
    row_count += 1
