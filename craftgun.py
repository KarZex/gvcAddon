import json
import csv
import shutil

csv_path = open("gunData.csv","r")
csv_reader = csv.reader(csv_path)

row_count = 0

gundata_json = json.load(open("tool/gundata.json","r"))
player_json = json.load(open("tool/player.json","r"))
BP_animation = json.load(open("tool/animation_controllers_guns.json","r"))
BP_animation_hold = json.load(open("tool/animation_controllers_hold.json","r"))
ga_json = json.load(open("tool/ga.json","r"))
ca_json = json.load(open("tool/ca.json","r"))
item_json = json.load(open("resource_packs/GVCAddonV5(1)/textures/item_texture.json","r"))
func = open("tool/gunstart.mcfunction","r")
a_func = func.read()

#aasdasd
for row in csv_reader:

    if( row_count >= 1 ):
        #from CSV
        gun_id = row[1]
        gun_damage = int(row[4])
        gun_interval = int(row[8])
        gun_bomb =  int(row[9])
        gun_power = float(row[5])
        gun_aim = float(row[6])
        gun_reload = int(row[7])
        gun_maxammo = int(row[2])
        gun_ammo = row[3]
        gun_burst = int(row[11])
        gun_sound = row[13]
        gun_bullet_num = int(row[14])

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
        elif(gun_ammo == "zex:rocketm"):
            ammo_name = "§e.Rocket§r"
        elif(gun_ammo == "zex:12m"):
            ammo_name = "§412Gauge§r"

        #Gundata fot JS
        gundata_json["{}".format(gun_id)] = { "damage": gun_damage, "maxGunAmmo": gun_maxammo, "reloadTime": gun_reload, "bullet": "{}".format(gun_ammo) }

        #player
        spawn_entity = { 
            "minecraft:spawn_entity":{
                "entities": [
                    {
                        "filters": [
                            {"test":"has_tag","operator":"!=","value":"scope"}
                        ],
                        "max_wait_time": 0,
                        "min_wait_time": 0,
                        "num_to_spawn": gun_bullet_num,
                        "single_use": True,
                        "spawn_entity": "fire:{}".format(gun_id)
                    },
                    {
                        "filters": [
                            {"test":"has_tag","operator":"==","value":"scope"}
                        ],
                        "max_wait_time": 0,
                        "min_wait_time": 0,
                        "num_to_spawn": gun_bullet_num,
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
        player_json["minecraft:entity"]["component_groups"]["fire:{}".format(gun_id)] = spawn_entity
        player_json["minecraft:entity"]["events"]["fire:{}".format(gun_id)] = event

        #animation controllers data
        BP_animation["animation_controllers"]["controller.animation.guns"]["states"]["default"]["transitions"].append({ "{}".format(gun_id): "query.get_equipped_item_name == '{}' && query.is_using_item".format(gun_id) })

        if gun_burst == 0:
            if gun_interval > 0:
                BP_animation["animation_controllers"]["controller.animation.guns"]["states"]["{}".format(gun_id)] = {
                    "on_entry": [
                        "/event entity @s[tag=!reload,scores={{{0}=1..}}] fire:{0}".format(gun_id),
                        "/playsound empty.a1 @s[tag=!reload,scores={{{0}=0}}] ~~~".format(gun_id),
                        "/scoreboard players remove @s[tag=!reload,tag=!noreload,scores={{{0}=1..}}] {0} 1".format(gun_id)
                    ],
                    "transitions": [
                        {
                            "default": "variable.cooltime = (variable.cooltime ?? 0);variable.cooltime = variable.cooltime < {} ? variable.cooltime + 1:0;return variable.cooltime == 0;".format(gun_interval - 1)
                        }
                    ]
                }

            else:
                BP_animation["animation_controllers"]["controller.animation.guns"]["states"]["{}".format(gun_id)] = {
                    "on_entry": [
                        "/event entity @s[tag=!reload,scores={{{0}=1..}}] fire:{0}".format(gun_id),
                        "/playsound empty.a1 @s[tag=!reload,scores={{{0}=0}}] ~~~".format(gun_id),
                        "/scoreboard players remove @s[tag=!reload,tag=!noreload,scores={{{0}=1..}}] {0} 1".format(gun_id)
                    ],
                    "transitions": [
                        {
                            "default": "!query.is_using_item"
                        },
                        {
                            "{}ii".format(gun_id): "query.get_equipped_item_name == '{}' && query.is_using_item".format(gun_id)
                        }
                    ]
                }
                BP_animation["animation_controllers"]["controller.animation.guns"]["states"]["{}ii".format(gun_id)] = {
                    "on_entry": [
                        "/event entity @s[tag=!reload,scores={{{0}=1..}}] fire:{0}".format(gun_id),
                        "/playsound empty.a1 @s[tag=!reload,scores={{{0}=0}}] ~~~".format(gun_id),
                        "/scoreboard players remove @s[tag=!reload,tag=!noreload,scores={{{0}=1..}}] {0} 1".format(gun_id)
                    ],
                    "transitions": [
                        {
                            "default": "!query.is_using_item"
                        },
                        {
                            "{}".format(gun_id): "query.get_equipped_item_name == '{}' && query.is_using_item".format(gun_id)
                        }
                    ]
                }
            
        else:
            for i in range(gun_burst - 1):
                count = ""
                if i > 0: count = str(i)
                BP_animation["animation_controllers"]["controller.animation.guns"]["states"]["{}{}".format(gun_id,count)] = {
                    "on_entry": [
                        "/event entity @s[tag=!reload,scores={{{0}=1..}}] fire:{0}".format(gun_id),
                        "/playsound empty.a1 @s[tag=!reload,scores={{{0}=0}}] ~~~".format(gun_id),
                        "/scoreboard players remove @s[tag=!reload,tag=!noreload,scores={{{0}=1..}}] {0} 1".format(gun_id)
                    ],
                    "transitions": [
                        {
                            "{}{}".format(gun_id,i+1): "variable.cooltime = (variable.cooltime ?? 0);variable.cooltime = variable.cooltime < {} ? variable.cooltime + 1:0;return variable.cooltime == 0;".format(gun_interval)
                        }
                    ]
                }
            BP_animation["animation_controllers"]["controller.animation.guns"]["states"]["{}{}".format(gun_id,gun_burst-1)] = {
                "on_entry": [
                    "/event entity @s[tag=!reload,scores={{{0}=1..}}] fire:{0}".format(gun_id),
                    "/playsound empty.a1 @s[tag=!reload,scores={{{0}=0}}] ~~~".format(gun_id),
                    "/scoreboard players remove @s[tag=!reload,tag=!noreload,scores={{{0}=1..}}] {0} 1".format(gun_id)
                ],
                "transitions": [
                    {
                        "default".format(gun_id): "variable.cooltime = (variable.cooltime ?? 0);variable.cooltime = variable.cooltime < {} ? variable.cooltime + 1:0;return variable.cooltime == 0;".format(gun_interval * 3 + 1)
                    }
                ]
            }

        #hold Animation 
        BP_animation_hold["animation_controllers"]["controller.animation.hold"]["states"]["default"]["transitions"].append( { "{}".format(gun_id): "query.get_equipped_item_name == '{}'".format(gun_id) } )
        BP_animation_hold["animation_controllers"]["controller.animation.hold"]["states"]["{}".format(gun_id)] = {
          "on_entry": [            
            "/function hold/{}h".format(gun_id)
          ],
          "transitions": [ { "default": "(1.0)"}]
        }
        #Bullet 
        with open("tool/fire.json".format(gun_id),"r") as f:
            gun_entity = json.load(f)
            gun_entity["minecraft:entity"]["description"]["identifier"] = "fire:{}".format(gun_id)
            gun_entity["minecraft:entity"]["components"]["minecraft:projectile"]["power"] = gun_power * 0.2
            gun_entity["minecraft:entity"]["components"]["minecraft:projectile"]["uncertaintyBase"] = gun_aim * 5
            gun_entity["minecraft:entity"]["components"]["minecraft:projectile"]["gravity"] = 0
            if gun_sound != "": gun_entity["minecraft:entity"]["components"]["minecraft:type_family"]["family"].append(gun_sound)
            gun_entity["minecraft:entity"]["events"] = {}
            gun_entity["minecraft:entity"]["events"]["minecraft:explode"] = { "add": { "component_groups": ["minecraft:exploding"] } }
            gun_entity["minecraft:entity"]["component_groups"] = {}
            gun_entity["minecraft:entity"]["component_groups"]["minecraft:exploding"] = {  "minecraft:explode": { "fuse_length": 0, "fuse_lit": True, "power": gun_bomb, "breaks_blocks": gun_break_block } }

            if gun_bomb > 0:
                gun_entity["minecraft:entity"]["components"]["minecraft:projectile"]["onHit"]["definition_event"] = { "affectProjectile": True, "eventTrigger": { "event": "minecraft:explode", "target": "self" } }
                
        with open("behavior_packs/GVCAddonV5(1)/entities/fire/{}.json".format(gun_id),"w") as f:
            json.dump(gun_entity,f,indent=2)

        with open("behavior_packs/GVCAddonV5(1)/entities/fire/scoped/{}.json".format(gun_id),"w") as f:
            gun_entity["minecraft:entity"]["description"]["identifier"] = "fire:ads_{}".format(gun_id)
            if gun_bullet_num > 1: gun_entity["minecraft:entity"]["components"]["minecraft:projectile"]["uncertaintyBase"] = gun_aim * 2
            else: gun_entity["minecraft:entity"]["components"]["minecraft:projectile"]["uncertaintyBase"] = 0
            json.dump(gun_entity,f,indent=2)

        #function
        with open("behavior_packs/GVCAddonV5(1)/functions/hold/{}h.mcfunction".format(gun_id),"w") as f:
            f.write("titleraw @s[tag=!reload] actionbar {{\"rawtext\":[{{\"text\":\"{1} \"}},{{\"score\":{{\"name\":\"@s\",\"objective\":\"{0}\"}}}},{{\"text\":\"/{2}\"}}]}}\n".format(gun_id,ammo_name,gun_maxammo))
            if(gun_onehand): f.write("playanimation @s[tag=!scope] animation.onehand.first none 0 \"query.is_sneaking\"\n")
            else: f.write("playanimation @s[tag=!scope] animation.item.first none 0 \"query.is_sneaking\"\n")
            f.write("hud @s[tag=scope] hide crosshair\n")
            f.write("hud @s[tag=!scope] reset crosshair\n")


        a_func += "scoreboard objectives add {} dummy\n".format(gun_id)
        a_func += "execute as @a[tag=!startedv4] run scoreboard players set @s {} 0\n".format(gun_id)


        #item
        with open("tool/item.json","r") as f:
            gun_item = json.load(f)
            gun_item["minecraft:item"]["description"]["identifier"] = "gun:{}".format(gun_id)
            gun_item["minecraft:item"]["components"]["minecraft:icon"] = { "texture": "{}".format(gun_id) }
        
        with open("behavior_packs/GVCAddonV5(1)/items/gun/{}.json".format(gun_id),"w") as f:
            json.dump(gun_item,f,indent=2)

        #loot_table (for mob)
        with open("tool/loot.json","r") as f:
            loot_table = json.load(f)
            loot_table["pools"][0]["entries"][0]["name"] = "gun:{}".format(gun_id)
        
        with open("behavior_packs/GVCAddonV5(1)/loot_tables/gun/{}.json".format(gun_id),"w") as f:
            json.dump(loot_table,f,indent=2)

        #enemy and allieds
        attack_interval = 3.0
        burst_shots = 10
        if gun_burst > 1:
            burst_shots = gun_burst
            attack_interval = 0.5 + gun_interval * 0.05 

        
        burst_interval = 0.05 + gun_interval * 0.05
        if gun_bullet_num > 1: 
            burst_interval = 0
            burst_shots = gun_bullet_num
        spawn_entity = {
            "minecraft:behavior.ranged_attack": {
                "priority": 3,
                "burst_shots": burst_shots,
                "burst_interval": burst_interval,
                "charge_charged_trigger": 0.0,
                "charge_shoot_trigger": 0.0,
                "attack_interval_min": attack_interval,
                "attack_interval_max": attack_interval + 1,
                "attack_radius": 24.0
            },
            "minecraft:shooter": {
                "def": "fire:{}".format(gun_id)
            },
            "minecraft:equipment": {
                "table": "loot_tables/gun/{}.json".format(gun_id)
            }
        }
        event = {
            "add": {
                "component_groups": [
                    "{}".format(gun_id)
                ]
            }
        }
        ga_json["minecraft:entity"]["component_groups"]["{}".format(gun_id)] = spawn_entity
        ga_json["minecraft:entity"]["events"]["{}".format(gun_id)] = event
        ca_json["minecraft:entity"]["component_groups"]["{}".format(gun_id)] = spawn_entity
        ca_json["minecraft:entity"]["events"]["{}".format(gun_id)] = event

        with open("resource_packs/GVCAddonV5(1)/entity/gun/ak12.json","r") as f:
            gun_entity = json.load(f)

        with open("resource_packs/GVCAddonV5(1)/entity/gun/{}.json".format(gun_id),"w") as f:
            gun_entity["minecraft:client_entity"]["description"]["identifier"] = "fire:{}".format(gun_id)
            json.dump(gun_entity,f,indent=2)

        with open("resource_packs/GVCAddonV5(1)/entity/gun/s/{}.json".format(gun_id),"w") as f:
            gun_entity["minecraft:client_entity"]["description"]["identifier"] = "fire:ads_{}".format(gun_id)
            json.dump(gun_entity,f,indent=2)

        with open("resource_packs/GVCAddonV5(1)/render_controllers/first_person.json","r") as f:
            gun_entity = json.load(f)
            if( not "| query.get_equipped_item_name(0, 1) == '{}' |".format(gun_id) in gun_entity["render_controllers"]["controller.render.player.first_person"]["part_visibility"][1]["rightArm"] ):
                gun_entity["render_controllers"]["controller.render.player.first_person"]["part_visibility"][1]["rightArm"] = gun_entity["render_controllers"]["controller.render.player.first_person"]["part_visibility"][1]["rightArm"].replace("| query.get_equipped_item_name(0, 1) == 'tt33' |","| query.get_equipped_item_name(0, 1) == '{}' || query.get_equipped_item_name(0, 1) == 'tt33' |".format(gun_id))
                gun_entity["render_controllers"]["controller.render.player.first_person"]["part_visibility"][2]["rightSleeve"] = gun_entity["render_controllers"]["controller.render.player.first_person"]["part_visibility"][2]["rightSleeve"].replace("| query.get_equipped_item_name(0, 1) == 'tt33' |","| query.get_equipped_item_name(0, 1) == '{}' || query.get_equipped_item_name(0, 1) == 'tt33' |".format(gun_id))
                gun_entity["render_controllers"]["controller.render.player.first_person"]["part_visibility"][3]["leftArm"] = gun_entity["render_controllers"]["controller.render.player.first_person"]["part_visibility"][3]["leftArm"].replace("| query.get_equipped_item_name(0, 1) == 'tt33' |","| query.get_equipped_item_name(0, 1) == '{}' || query.get_equipped_item_name(0, 1) == 'tt33' |".format(gun_id))
                gun_entity["render_controllers"]["controller.render.player.first_person"]["part_visibility"][4]["leftSleeve"] = gun_entity["render_controllers"]["controller.render.player.first_person"]["part_visibility"][4]["leftSleeve"].replace("| query.get_equipped_item_name(0, 1) == 'tt33' |","| query.get_equipped_item_name(0, 1) == '{}' || query.get_equipped_item_name(0, 1) == 'tt33' |".format(gun_id))

    
        with open("resource_packs/GVCAddonV5(1)/render_controllers/first_person.json","w") as f:
            json.dump(gun_entity,f,indent=2)

        item_json["texture_data"]["{}".format(gun_id)] = { "textures": "textures/gun/{}".format(gun_id) }

        print("created {}".format(gun_id))
    row_count += 1


csv_path2 = open("vehiclewData.csv","r")
csv_reader2 = csv.reader(csv_path2)
row_count = 0
#aasdasd
for row in csv_reader2:

    if( row_count >= 1 ):
        #from CSV
        gun_id = row[1]
        gun_damage = int(row[2])
        gun_power = float(row[3])
        gun_aim = float(row[4])
        gun_interval = int(row[5])
        gun_bomb =  int(row[6])
        gun_sound = row[8]

        if(row[7] == "T"):
            gun_break_block = True
        else:
            gun_break_block = False
        #player
        spawn_entity = { 
            "minecraft:spawn_entity":{
                "entities": [
                    {
                        "max_wait_time": 0,
                        "min_wait_time": 0,
                        "num_to_spawn": 1,
                        "single_use": True,
                        "spawn_entity": "fire:{}".format(gun_id)
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
        player_json["minecraft:entity"]["component_groups"]["fire:{}".format(gun_id)] = spawn_entity
        player_json["minecraft:entity"]["events"]["fire:{}".format(gun_id)] = event
        
        #Gundata fot JS
        gundata_json["{}".format(gun_id)] = { "damage": gun_damage }

        #Bullet 
        with open("tool/fire.json".format(gun_id),"r") as f:
            gun_entity = json.load(f)
            gun_entity["minecraft:entity"]["description"]["identifier"] = "fire:{}".format(gun_id)
            gun_entity["minecraft:entity"]["components"]["minecraft:projectile"]["power"] = gun_power * 0.2
            gun_entity["minecraft:entity"]["components"]["minecraft:projectile"]["uncertaintyBase"] = gun_aim * 5
            gun_entity["minecraft:entity"]["components"]["minecraft:projectile"]["gravity"] = 0
            if gun_sound != "": gun_entity["minecraft:entity"]["components"]["minecraft:type_family"]["family"].append(gun_sound)
            gun_entity["minecraft:entity"]["events"] = {}
            gun_entity["minecraft:entity"]["events"]["minecraft:explode"] = { "add": { "component_groups": ["minecraft:exploding"] } }
            gun_entity["minecraft:entity"]["component_groups"] = {}
            gun_entity["minecraft:entity"]["component_groups"]["minecraft:exploding"] = {  "minecraft:explode": { "fuse_length": 0, "fuse_lit": True, "power": gun_bomb, "breaks_blocks": gun_break_block } }

            if gun_bomb > 0:
                gun_entity["minecraft:entity"]["components"]["minecraft:projectile"]["onHit"]["definition_event"] = { "affectProjectile": True, "eventTrigger": { "event": "minecraft:explode", "target": "self" } }

        with open("behavior_packs/GVCAddonV5(1)/entities/fire/{}.json".format(gun_id),"w") as f:
            json.dump(gun_entity,f,indent=2)

        #enemy and allieds
        attack_interval = gun_interval * 0.05

        spawn_entity = {
            "minecraft:behavior.ranged_attack": {
                "priority": 3,
                "burst_shots": 1,
                "burst_interval": 1,
                "charge_charged_trigger": 0.0,
                "charge_shoot_trigger": 0.0,
                "attack_interval_min": attack_interval,
                "attack_interval_max": attack_interval + 1,
                "attack_radius": 24.0
            },
            "minecraft:shooter": {
                "def": "fire:{}".format(gun_id)
            }
        }
        event = {
            "add": {
                "component_groups": [
                    "{}".format(gun_id)
                ]
            }
        }
        ga_json["minecraft:entity"]["component_groups"]["{}".format(gun_id)] = spawn_entity
        ga_json["minecraft:entity"]["events"]["{}".format(gun_id)] = event
        ca_json["minecraft:entity"]["component_groups"]["{}".format(gun_id)] = spawn_entity
        ca_json["minecraft:entity"]["events"]["{}".format(gun_id)] = event

        with open("resource_packs/GVCAddonV5(1)/entity/gun/ak12.json","r") as f:
            gun_entity = json.load(f)

        with open("resource_packs/GVCAddonV5(1)/entity/gun/{}.json".format(gun_id),"w") as f:
            gun_entity["minecraft:client_entity"]["description"]["identifier"] = "fire:{}".format(gun_id)
            json.dump(gun_entity,f,indent=2)

        print("created {}".format(gun_id))
    row_count += 1

with open("behavior_packs/GVCAddonV5(1)/scripts/gun.json","w") as f:
    json.dump(gundata_json,f,indent=2)

with open("behavior_packs/GVCAddonV5(1)/entities/player.json","w") as f:
    json.dump(player_json,f,indent=2)

with open("behavior_packs/GVCAddonV5(1)/animation_controllers/guns.json","w") as f:
    json.dump(BP_animation,f,indent=2)

with open("behavior_packs/GVCAddonV5(1)/animation_controllers/hold.json","w") as f:
    json.dump(BP_animation_hold,f,indent=2)

with open("behavior_packs/GVCAddonV5(1)/entities/mob/allied/ca.json","w") as f:
    json.dump(ca_json,f,indent=2)

with open("behavior_packs/GVCAddonV5(1)/entities/mob/enemy/ga.json","w") as f:
    json.dump(ga_json,f,indent=2)

with open("resource_packs/GVCAddonV5(1)/textures/item_texture.json","w") as f:
    json.dump(item_json,f,indent=2)


with open("behavior_packs/GVCAddonV5(1)/scripts/gun.json","r") as f:
    export = "export const gunData = " 
    export += f.read()
    export += ";"


with open("behavior_packs/GVCAddonV5(1)/scripts/guns.js","w") as f:
    f.write(export)


a_func += "tag @a[tag=!startedv4] add startedv4\n"
with open("behavior_packs/GVCAddonV5(1)/functions/gunstart.mcfunction","w") as f:
    f.write(a_func)