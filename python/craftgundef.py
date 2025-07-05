import json
import csv
import ast

csv_path = open("csv/gunData.csv","r")
csv_reader = csv.reader(csv_path) 

row_count = 0

text = ""

gundata_json = json.load(open("tool/gundata.json","r"))
player_json = json.load(open("tool/player.json","r"))
BP_animation = json.load(open("tool/animation_controllers_guns.json","r"))
BP_animation_hold = json.load(open("tool/animation_controllers_hold.json","r"))
ga_json = json.load(open("tool/ga.json","r"))
ca_json = json.load(open("tool/ca.json","r"))
pmc_json = json.load(open("tool/pmc.json","r"))
item_json = json.load(open("resource_packs/GVCBedrock/textures/item_texture.json","r"))
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
        gun_damage_type = row[15]
        gun_fullauto = int(row[16])
        gun_break = int(row[19])
        gun_special = row[21]

        if(row[10] == "T"):
            gun_break_block = True
        else:
            gun_break_block = False

        if(row[12] == "T"):
            gun_onehand = True
        else:
            gun_onehand = False

        if(row[20] == "T"):
            gun_wallbreak = True
        else:
            gun_wallbreak = False


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
            ammo_name = "§b.Rocket§r"
        elif(gun_ammo == "zex:12m"):
            ammo_name = "§412Gauge§r"
        elif(gun_ammo == "zex:40m"):
            ammo_name = "§e40mmGrenade§r"

        Rare = ""
        if( row[23] == "2" ): Rare = "§a"
        if( row[23] == "3" ): Rare = "§b"
        if( row[23] == "4" ): Rare = "§d"
        if( row[23] == "5" ): Rare = "§6"
        if( row[23] == "6" ): Rare = "§c"
            
        text += "item.gun:{0}={2}{1}§r\n".format(gun_id,row[0],Rare)

        #Gundata fot JS
        gundata_json["{}".format(gun_id)] = { "damage": gun_damage,"speed": gun_power * 0.2, "maxGunAmmo": gun_maxammo, "reloadTime": gun_reload, "bullet": "{}".format(gun_ammo),"damageType": "{}".format(gun_damage_type) }

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
        BP_animation["animation_controllers"]["controller.animation.guns"]["states"]["default"]["transitions"].append({ "{}".format(gun_id): "query.is_item_name_any('slot.weapon.mainhand', 0, 'gun:{}') && query.is_using_item".format(gun_id) })
        BP_animation["animation_controllers"]["controller.animation.guns"]["states"]["default"]["transitions"].append({ "{}_reload".format(gun_id): "query.is_item_name_any('slot.weapon.mainhand', 0, 'gun:{}') && (variable.attack_time > 0.0)".format(gun_id) })
        
        BP_animation["animation_controllers"]["controller.animation.guns"]["states"]["{}_reload".format(gun_id)] = {
            "on_entry": [
                "/execute as @s[tag=!reload,tag=!down] run scriptevent gvcv5:reload {}".format(gun_id)
            ],
            "transitions": [
                {
                    "default": "(variable.attack_time <= 0.0)"
                }
            ]
        }
        if gun_special == "R":
            BP_animation["animation_controllers"]["controller.animation.guns"]["states"]["{}".format(gun_id)] = {
                "on_entry": [
                    "/playsound charge.rail @s[tag=!reload,tag=!down,scores={{{0}=1..}}] ~~~".format(gun_id),
                    "/tag @s[tag=!reload,tag=!down,scores={{{0}=1..}}] add railcharging".format(gun_id)
                ],
                "on_exit": [
                    "/tag @s remove railcharging",
                    "/stopsound @s charge.rail",
                    "variable.cooltime = 0;"
                ],
                "transitions": [
                    {
                        "no_use": "!query.is_using_item"
                    },
                    {
                        "{}ii".format(gun_id): "variable.cooltime = (variable.cooltime ?? 0);variable.cooltime = variable.cooltime < {} ? variable.cooltime + 1:0;return variable.cooltime == 0;".format(gun_interval - 1)
                    }
                ]
            }
            BP_animation["animation_controllers"]["controller.animation.guns"]["states"]["{}ii".format(gun_id)] = {
                "on_entry": [
                    "/scriptevent gvcv5:gunUse {}".format(gun_id)
                ],
                "transitions": [
                    {
                        "no_use": "!query.is_using_item"
                    }
                ]
            }

        elif gun_burst == 0:
            if gun_fullauto == 1:
                if gun_interval > 0:
                    BP_animation["animation_controllers"]["controller.animation.guns"]["states"]["{}".format(gun_id)] = {
                        "on_entry": [
                            "/scriptevent gvcv5:gunUse {}".format(gun_id)
                        ],
                        "transitions": [
                            {
                                "{}ii".format(gun_id): "variable.cooltime = (variable.cooltime ?? 0);variable.cooltime = variable.cooltime < {} ? variable.cooltime + 1:0;return ( (query.is_using_item) && variable.cooltime == 0);".format(gun_interval)
                            },
                            {
                                "no_use".format(gun_id): "(!query.is_using_item)"
                            }
                        ]
                    }
                    BP_animation["animation_controllers"]["controller.animation.guns"]["states"]["{}ii".format(gun_id)] = {
                        "on_entry": [
                            "/scriptevent gvcv5:gunUse {}".format(gun_id)
                        ],
                        "transitions": [
                            {
                                "{}".format(gun_id): "variable.cooltime = (variable.cooltime ?? 0);variable.cooltime = variable.cooltime < {} ? variable.cooltime + 1:0;return ( (query.is_using_item) && variable.cooltime == 0);".format(gun_interval)
                            },
                            {
                                "no_use".format(gun_id): "(!query.is_using_item)"
                            }
                        ]
                    }
                else:
                    BP_animation["animation_controllers"]["controller.animation.guns"]["states"]["{}".format(gun_id)] = {
                        "on_entry": [
                            "/scriptevent gvcv5:gunUse {}".format(gun_id)
                        ],
                        "transitions": [
                            {
                                "no_use": "!query.is_using_item"
                            },
                            {
                                "{}ii".format(gun_id): "query.is_item_name_any('slot.weapon.mainhand', 0, 'gun:{}') && query.is_using_item".format(gun_id)
                            }
                        ]
                    }
                    BP_animation["animation_controllers"]["controller.animation.guns"]["states"]["{}ii".format(gun_id)] = {
                        "on_entry": [
                            "/scriptevent gvcv5:gunUse {}".format(gun_id)
                        ],
                        "transitions": [
                            {
                                "no_use": "!query.is_using_item"
                            },
                            {
                                "{}".format(gun_id): "query.is_item_name_any('slot.weapon.mainhand', 0, 'gun:{}') && query.is_using_item".format(gun_id)
                            }
                        ]
                    }
            else:
                BP_animation["animation_controllers"]["controller.animation.guns"]["states"]["{}".format(gun_id)] = {
                    "on_entry": [
                        "/scriptevent gvcv5:gunUse {}".format(gun_id)
                    ],
                    "transitions": [
                        {
                            "{}_after".format(gun_id): "(!query.is_using_item)"
                        }
                    ]
                }
                BP_animation["animation_controllers"]["controller.animation.guns"]["states"]["{}_after".format(gun_id)] = {
                    "on_entry": [
                        "/scriptevent gvcv5:gunapply"
                    ],
                    "transitions": [
                        {
                            "default": "variable.cooltime = (variable.cooltime ?? 0);variable.cooltime = variable.cooltime < {} ? variable.cooltime + 1:0;return variable.cooltime == 0;".format(gun_interval - 1)
                        }
                    ]
                }

            
        else:
            for i in range(gun_burst - 1):
                count = ""
                if i > 0: count = str(i)
                BP_animation["animation_controllers"]["controller.animation.guns"]["states"]["{}{}".format(gun_id,count)] = {
                    "on_entry": [
                        "/scriptevent gvcv5:gunUse {}".format(gun_id)
                    ],
                    "transitions": [
                        {
                            "{}{}".format(gun_id,i+1): "variable.cooltime = (variable.cooltime ?? 0);variable.cooltime = variable.cooltime < {} ? variable.cooltime + 1:0;return variable.cooltime == 0;".format(gun_interval)
                        }
                    ]
                }
            BP_animation["animation_controllers"]["controller.animation.guns"]["states"]["{}{}".format(gun_id,gun_burst-1)] = {
                "on_entry": [
                    "/scriptevent gvcv5:gunUse {}".format(gun_id)
                ],
                "transitions": [
                    {
                        "default".format(gun_id): "variable.cooltime = (variable.cooltime ?? 0);variable.cooltime = variable.cooltime < {} ? variable.cooltime + 1:0;return variable.cooltime == 0;".format(gun_interval * 3 + 1)
                    },
                    {
                        "no_use".format(gun_id): "(!query.is_using_item)"
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
        if gun_special == "H":
            with open("tool/horming.json".format(gun_id),"r") as f:
                gun_entity = json.load(f)
                gun_entity["minecraft:entity"]["description"]["identifier"] = "fire:{}".format(gun_id)
                gun_entity["minecraft:entity"]["components"]["minecraft:projectile"]["power"] = gun_power * 0.2
                gun_entity["minecraft:entity"]["components"]["minecraft:projectile"]["uncertainty_base"] = gun_aim * 5
                gun_entity["minecraft:entity"]["components"]["minecraft:projectile"]["gravity"] = 0
                gun_entity["minecraft:entity"]["components"]["minecraft:movement"]["value"] = gun_power * 0.2
    
                if gun_sound != "": gun_entity["minecraft:entity"]["components"]["minecraft:type_family"]["family"].append(gun_sound)
                gun_entity["minecraft:entity"]["events"] = {}
                gun_entity["minecraft:entity"]["events"]["minecraft:explode"] = { "add": { "component_groups": ["minecraft:exploding"] } }
                gun_entity["minecraft:entity"]["component_groups"] = {}
                gun_entity["minecraft:entity"]["component_groups"]["minecraft:exploding"] = {  "minecraft:explode": { "fuse_length": 0,"destroy_affected_by_griefing":True, "fuse_lit": True, "power": gun_bomb, "breaks_blocks": gun_break_block } }

                if gun_bomb > 0:
                    gun_entity["minecraft:entity"]["components"]["minecraft:projectile"]["on_hit"]["definition_event"] = { "affectProjectile": True, "eventTrigger": { "event": "minecraft:explode", "target": "self" } }

                if gun_wallbreak:
                    del gun_entity["minecraft:entity"]["components"]["minecraft:projectile"]["on_hit"]["stick_in_ground"]
              
        else:
            with open("tool/fire.json".format(gun_id),"r") as f:
                gun_entity = json.load(f)
                gun_entity["minecraft:entity"]["description"]["identifier"] = "fire:{}".format(gun_id)
                gun_entity["minecraft:entity"]["components"]["minecraft:projectile"]["power"] = gun_power * 0.2
                gun_entity["minecraft:entity"]["components"]["minecraft:projectile"]["uncertainty_base"] = gun_aim * 5
                gun_entity["minecraft:entity"]["components"]["minecraft:projectile"]["gravity"] = 0
                if gun_sound != "": gun_entity["minecraft:entity"]["components"]["minecraft:type_family"]["family"].append(gun_sound)
                gun_entity["minecraft:entity"]["events"] = {}
                gun_entity["minecraft:entity"]["events"]["minecraft:explode"] = { "add": { "component_groups": ["minecraft:exploding"] } }
                gun_entity["minecraft:entity"]["component_groups"] = {}
                gun_entity["minecraft:entity"]["component_groups"]["minecraft:exploding"] = {  "minecraft:explode": { "fuse_length": 0,"destroy_affected_by_griefing":True, "fuse_lit": True, "power": gun_bomb, "breaks_blocks": gun_break_block } }

                if gun_bomb > 0:
                    gun_entity["minecraft:entity"]["components"]["minecraft:projectile"]["on_hit"]["definition_event"] = { "affectProjectile": True, "eventTrigger": { "event": "minecraft:explode", "target": "self" } }

                if gun_wallbreak:
                    del gun_entity["minecraft:entity"]["components"]["minecraft:projectile"]["on_hit"]["stick_in_ground"]
                   
        with open("behavior_packs/GVCBedrock/entities/fire/{}.json".format(gun_id),"w") as f:
            json.dump(gun_entity,f,indent=2)

        with open("behavior_packs/GVCBedrock/entities/fire/scoped/{}.json".format(gun_id),"w") as f:
            gun_entity["minecraft:entity"]["description"]["identifier"] = "fire:ads_{}".format(gun_id)
            if gun_bullet_num > 1: gun_entity["minecraft:entity"]["components"]["minecraft:projectile"]["uncertainty_base"] = gun_aim * 2
            else: gun_entity["minecraft:entity"]["components"]["minecraft:projectile"]["uncertainty_base"] = 0
            json.dump(gun_entity,f,indent=2)

        #function
        with open("behavior_packs/GVCBedrock/functions/hold/{}h.mcfunction".format(gun_id),"w",encoding="utf-8") as f:
            
            if gun_special == "R":
                f.write("scriptevent gvcv5:vgun {}\n".format(gun_id))
            
            elif gun_special == "H":
                f.write("scriptevent gvcv5:hgun {}\n".format(gun_id))
            
            else:
                f.write("scriptevent gvcv5:vgun {}\n".format(gun_id))
            
            if(gun_onehand): 
                f.write("playanimation @s animation.onehand.first none 0 \"!query.is_item_equipped\"\n")
            else: 
                f.write("playanimation @s[tag=!down] animation.item.first none 0 \"!query.is_item_equipped\"\n")

            f.write("hud @s[tag=scope] hide crosshair\n")
            f.write("hud @s[tag=!scope] reset crosshair\n")


        a_func += "scoreboard objectives add {} dummy\n".format(gun_id)
        a_func += "execute as @a[tag=!startedv5] run scoreboard players set @s {0} {1}\n".format(gun_id,gun_maxammo)


        #item
        with open("tool/item.json","r") as f:
            gun_item = json.load(f)
            gun_item["minecraft:item"]["description"]["identifier"] = "gun:{}".format(gun_id)
            gun_item["minecraft:item"]["components"]["minecraft:icon"] = "{}".format(gun_id)

            gun_item["minecraft:item"]["components"]["minecraft:enchantable"]["value"] = 5 * int(row[23])
            gun_item["minecraft:item"]["components"]["minecraft:durability"]["max_durability"] = gun_maxammo
        
        with open("behavior_packs/GVCBedrock/items/gun/{}.json".format(gun_id),"w") as f:
            json.dump(gun_item,f,indent=2)

        #crash recipe
        with open("tool/gunbreak.json","r") as f:
            gunbreak = json.load(f)
            gunbreak["minecraft:recipe_shapeless"]["description"]["identifier"] = "gvcv5:stonecutter_iron_ingot_from_{}".format(gun_id)
            gunbreak["minecraft:recipe_shapeless"]["ingredients"][0]["item"] = "gun:{}".format(gun_id)
            gunbreak["minecraft:recipe_shapeless"]["result"]["count"] = gun_break
        
        with open("behavior_packs/GVCBedrock/recipes/gun/{}.json".format(gun_id),"w") as f:
            json.dump(gunbreak,f,indent=2)

        #loot_table (for mob)
        with open("tool/loot.json","r") as f:
            loot_table = json.load(f)
            loot_table["pools"][0]["entries"][0]["name"] = "gun:{}".format(gun_id)
        
        with open("behavior_packs/GVCBedrock/loot_tables/gun/{}.json".format(gun_id),"w") as f:
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
            burst_shots = 1
        if gun_maxammo == 1: 
            attack_interval += gun_reload * 0.05 
            burst_shots = 1
        spawn_entity = {
            "minecraft:behavior.ranged_attack": {
                "priority": 3,
                "burst_shots": burst_shots,
                "burst_interval": burst_interval,
                "charge_charged_trigger": 0.0,
                "charge_shoot_trigger": 0.0,
                "attack_interval_min": attack_interval,
                "attack_interval_max": attack_interval,
                "attack_radius": 20.0
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

        PMC_weapon_change = {
            "use_item": False,
            "play_sounds": "enderchest.open",
            "interact_text": "action.gvc.item",
            "on_interact": {
              "filters": {
                "all_of": [
                  {
                    "test": "is_sneaking",
                    "subject": "other",
                    "value": True
                  },
                  {
                    "test": "has_equipment",
                    "subject": "other",
                    "domain": "hand",
                    "value": "gun:{}".format(gun_id)
                  }
                ]
              },
              "event": "{}".format(gun_id),
              "target": "self"
            }
          }


        ga_json["minecraft:entity"]["component_groups"]["{}".format(gun_id)] = spawn_entity
        ga_json["minecraft:entity"]["events"]["{}".format(gun_id)] = event
        ca_json["minecraft:entity"]["component_groups"]["{}".format(gun_id)] = spawn_entity
        ca_json["minecraft:entity"]["events"]["{}".format(gun_id)] = event
        pmc_json["minecraft:entity"]["component_groups"]["{}".format(gun_id)] = spawn_entity
        pmc_json["minecraft:entity"]["events"]["{}".format(gun_id)] = event
        pmc_json["minecraft:entity"]["components"]["minecraft:interact"]["interactions"].append(PMC_weapon_change)

        with open("resource_packs/GVCBedrock/entity/gun/ak12.json","r") as f:
            gun_entity = json.load(f)

        with open("resource_packs/GVCBedrock/entity/gun/{}.json".format(gun_id),"w") as f:
            gun_entity["minecraft:client_entity"]["description"]["identifier"] = "fire:{}".format(gun_id)
            json.dump(gun_entity,f,indent=2)

        with open("resource_packs/GVCBedrock/entity/gun/s/{}.json".format(gun_id),"w") as f:
            gun_entity["minecraft:client_entity"]["description"]["identifier"] = "fire:ads_{}".format(gun_id)
            json.dump(gun_entity,f,indent=2)

        with open("resource_packs/GVCBedrock/render_controllers/first_person.json","r") as f:
            gun_entity = json.load(f)
            if( not "| query.get_equipped_item_name(0, 1) == '{}' |".format(gun_id) in gun_entity["render_controllers"]["controller.render.player.first_person"]["part_visibility"][1]["rightArm"] ):
                gun_entity["render_controllers"]["controller.render.player.first_person"]["part_visibility"][1]["rightArm"] = gun_entity["render_controllers"]["controller.render.player.first_person"]["part_visibility"][1]["rightArm"].replace("| query.get_equipped_item_name(0, 1) == 'tt33' |","| query.get_equipped_item_name(0, 1) == '{}' || query.get_equipped_item_name(0, 1) == 'tt33' |".format(gun_id))
                gun_entity["render_controllers"]["controller.render.player.first_person"]["part_visibility"][2]["rightSleeve"] = gun_entity["render_controllers"]["controller.render.player.first_person"]["part_visibility"][2]["rightSleeve"].replace("| query.get_equipped_item_name(0, 1) == 'tt33' |","| query.get_equipped_item_name(0, 1) == '{}' || query.get_equipped_item_name(0, 1) == 'tt33' |".format(gun_id))
                gun_entity["render_controllers"]["controller.render.player.first_person"]["part_visibility"][3]["leftArm"] = gun_entity["render_controllers"]["controller.render.player.first_person"]["part_visibility"][3]["leftArm"].replace("| query.get_equipped_item_name(0, 1) == 'tt33' |","| query.get_equipped_item_name(0, 1) == '{}' || query.get_equipped_item_name(0, 1) == 'tt33' |".format(gun_id))
                gun_entity["render_controllers"]["controller.render.player.first_person"]["part_visibility"][4]["leftSleeve"] = gun_entity["render_controllers"]["controller.render.player.first_person"]["part_visibility"][4]["leftSleeve"].replace("| query.get_equipped_item_name(0, 1) == 'tt33' |","| query.get_equipped_item_name(0, 1) == '{}' || query.get_equipped_item_name(0, 1) == 'tt33' |".format(gun_id))

    
        with open("resource_packs/GVCBedrock/render_controllers/first_person.json","w") as f:
            json.dump(gun_entity,f,indent=2)

        item_json["texture_data"]["{}".format(gun_id)] = { "textures": "textures/items/gun/{}".format(gun_id) }

        print("created {0} with {1}".format(gun_id,gun_damage_type))
    row_count += 1


csv_path2 = open("csv/vehiclewData.csv","r")
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
        gun_damage_type = row[9]
        gun_offset = row[10]
        bombattack = "bomb"

        if(row[7] == "T"):
            gun_break_block = True
        else:
            gun_break_block = False
        #player
        if( "D" in gun_offset  ):
            spawn_entity = { 
                "minecraft:spawn_entity":{
                    "entities": [
                        {
                            "max_wait_time": 0,
                            "min_wait_time": 0,
                            "num_to_spawn": 1,
                            "single_use": True,
                            "spawn_entity": "fire:{}r".format(gun_id)
                        },
                        {
                            "max_wait_time": 0,
                            "min_wait_time": 0,
                            "num_to_spawn": 1,
                            "single_use": True,
                            "spawn_entity": "fire:{}l".format(gun_id)
                        }
                    ]
                }
            }

        elif( "M" in gun_offset and not "MM" in gun_offset  ):
            spawn_entity = { 
                "minecraft:spawn_entity":{
                    "entities": [
                        {
                            "max_wait_time": 0,
                            "min_wait_time": 0,
                            "num_to_spawn": 1,
                            "single_use": True,
                            "spawn_entity": "fire:{}ir".format(bombattack)
                        },
                        {
                            "max_wait_time": 0,
                            "min_wait_time": 0,
                            "num_to_spawn": 1,
                            "single_use": True,
                            "spawn_entity": "fire:{}iiir".format(bombattack)
                        },
                        {
                            "max_wait_time": 0,
                            "min_wait_time": 0,
                            "num_to_spawn": 1,
                            "single_use": True,
                            "spawn_entity": "fire:{}il".format(bombattack)
                        },
                        {
                            "max_wait_time": 0,
                            "min_wait_time": 0,
                            "num_to_spawn": 1,
                            "single_use": True,
                            "spawn_entity": "fire:{}iiil".format(bombattack)
                        }
                    ]
                }
            }

        elif( "MM" in gun_offset ):
            spawn_entity = { 
                "minecraft:spawn_entity":{
                    "entities": [
                        {
                            "max_wait_time": 0,
                            "min_wait_time": 0,
                            "num_to_spawn": 1,
                            "single_use": True,
                            "spawn_entity": "fire:{}ir".format(bombattack)
                        },
                        {
                            "max_wait_time": 0,
                            "min_wait_time": 0,
                            "num_to_spawn": 1,
                            "single_use": True,
                            "spawn_entity": "fire:{}iir".format(bombattack)
                        },
                        {
                            "max_wait_time": 0,
                            "min_wait_time": 0,
                            "num_to_spawn": 1,
                            "single_use": True,
                            "spawn_entity": "fire:{}iiir".format(bombattack)
                        },
                        {
                            "max_wait_time": 0,
                            "min_wait_time": 0,
                            "num_to_spawn": 1,
                            "single_use": True,
                            "spawn_entity": "fire:{}ivr".format(bombattack)
                        },
                        {
                            "max_wait_time": 0,
                            "min_wait_time": 0,
                            "num_to_spawn": 1,
                            "single_use": True,
                            "spawn_entity": "fire:{}il".format(bombattack)
                        },
                        {
                            "max_wait_time": 0,
                            "min_wait_time": 0,
                            "num_to_spawn": 1,
                            "single_use": True,
                            "spawn_entity": "fire:{}iil".format(bombattack)
                        },
                        {
                            "max_wait_time": 0,
                            "min_wait_time": 0,
                            "num_to_spawn": 1,
                            "single_use": True,
                            "spawn_entity": "fire:{}iiil".format(bombattack)
                        },
                        {
                            "max_wait_time": 0,
                            "min_wait_time": 0,
                            "num_to_spawn": 1,
                            "single_use": True,
                            "spawn_entity": "fire:{}ivl".format(bombattack)
                        }
                    ]
                }
            }
        
        else:
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
        if( "D" in gun_offset ):
            gundata_json["{}r".format(gun_id)] = { "damage": gun_damage,"damageType": "{}".format(gun_damage_type) }
            gundata_json["{}l".format(gun_id)] = { "damage": gun_damage,"damageType": "{}".format(gun_damage_type) }
        else:
            gundata_json["{}".format(gun_id)] = { "damage": gun_damage,"damageType": "{}".format(gun_damage_type) }

        #Bullet 
        if( "H" not in gun_offset ):
            with open("tool/fire.json".format(gun_id),"r") as f:
                gun_entity = json.load(f)
                gun_entity["minecraft:entity"]["description"]["identifier"] = "fire:{}".format(gun_id)
                gun_entity["minecraft:entity"]["components"]["minecraft:projectile"]["power"] = gun_power * 0.2
                gun_entity["minecraft:entity"]["components"]["minecraft:projectile"]["uncertainty_base"] = gun_aim * 5
                gun_entity["minecraft:entity"]["components"]["minecraft:projectile"]["gravity"] = 0
                if gun_sound != "": gun_entity["minecraft:entity"]["components"]["minecraft:type_family"]["family"].append(gun_sound)
                gun_entity["minecraft:entity"]["events"] = {}
                gun_entity["minecraft:entity"]["events"]["minecraft:explode"] = { "add": { "component_groups": ["minecraft:exploding"] } }
                gun_entity["minecraft:entity"]["component_groups"] = {}
                gun_entity["minecraft:entity"]["component_groups"]["minecraft:exploding"] = {  "minecraft:explode": { "fuse_length": 0,"destroy_affected_by_griefing":True,	 "fuse_lit": True, "power": gun_bomb, "breaks_blocks": gun_break_block } }


                if gun_bomb > 0:
                    gun_entity["minecraft:entity"]["components"]["minecraft:projectile"]["on_hit"]["definition_event"] = { "affectProjectile": True, "eventTrigger": { "event": "minecraft:explode", "target": "self" } }

            with open("behavior_packs/GVCBedrock/entities/fire/{}.json".format(gun_id),"w") as f:
                json.dump(gun_entity,f,indent=2)

        if( "H" not in gun_offset):
            if( gun_offset == "D" ):
                gun_entity["minecraft:entity"]["description"]["identifier"] = "fire:{}r".format(gun_id)
                gun_entity["minecraft:entity"]["components"]["minecraft:projectile"]["offset"] = [ 0.5,0,0 ]
                with open("behavior_packs/GVCBedrock/entities/fire/{}r.json".format(gun_id),"w") as f:
                    json.dump(gun_entity,f,indent=2)
                gun_entity["minecraft:entity"]["description"]["identifier"] = "fire:{}l".format(gun_id)
                gun_entity["minecraft:entity"]["components"]["minecraft:projectile"]["offset"] = [ -0.5,0,0 ]
                with open("behavior_packs/GVCBedrock/entities/fire/{}l.json".format(gun_id),"w") as f:
                    json.dump(gun_entity,f,indent=2)
            else:
                with open("behavior_packs/GVCBedrock/entities/fire/{}.json".format(gun_id),"w") as f:
                    json.dump(gun_entity,f,indent=2)
        #enemy and allieds
        attack_interval = gun_interval * 0.05

        if( "D" in gun_offset ):
            spawn_entity = {
                "minecraft:behavior.ranged_attack": {
                    "priority": 3,
                    "burst_shots": 1,
                    "burst_interval": 0,
                    "charge_charged_trigger": 0.0,
                    "charge_shoot_trigger": 0.0,
                    "attack_interval_min": attack_interval,
                    "attack_interval_max": attack_interval,
                    "attack_radius": 120.0
                },
                "minecraft:shooter": {
                    "def": "fire:{}l".format(gun_id)
                }
            }
        else:
            spawn_entity = {
                "minecraft:behavior.ranged_attack": {
                    "priority": 3,
                    "burst_shots": 1,
                    "burst_interval": 0,
                    "charge_charged_trigger": 0.0,
                    "charge_shoot_trigger": 0.0,
                    "attack_interval_min": attack_interval,
                    "attack_interval_max": attack_interval,
                    "attack_radius": 120.0
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
        pmc_json["minecraft:entity"]["component_groups"]["{}".format(gun_id)] = spawn_entity
        pmc_json["minecraft:entity"]["events"]["{}".format(gun_id)] = event
        if( "H" not in gun_offset ):
            with open("resource_packs/GVCBedrock/entity/gun/ak12.json","r") as f:
                gun_entity = json.load(f)

            if( gun_offset == "D" ):
                gun_entity["minecraft:client_entity"]["description"]["identifier"] = "fire:{}r".format(gun_id)
                with open("resource_packs/GVCBedrock/entity/gun/{}r.json".format(gun_id),"w") as f:
                    json.dump(gun_entity,f,indent=2)
                gun_entity["minecraft:client_entity"]["description"]["identifier"] = "fire:{}l".format(gun_id)
                with open("resource_packs/GVCBedrock/entity/gun/{}l.json".format(gun_id),"w") as f:
                    json.dump(gun_entity,f,indent=2)
            else:
                with open("resource_packs/GVCBedrock/entity/gun/{}.json".format(gun_id),"w") as f:
                    gun_entity["minecraft:client_entity"]["description"]["identifier"] = "fire:{}".format(gun_id)
                    json.dump(gun_entity,f,indent=2)


        print("created {}".format(gun_id))
    row_count += 1


csv_path3 = open("csv/vehicleData.csv","r")
csv_reader3 = csv.reader(csv_path3)
row_count = 0
for row in csv_reader3:
    if( row_count >= 1 ):
        #from CSV
        v_id = row[1]
        v_type = row[2]
        ga_json["minecraft:entity"]["events"]["vehicle:{}".format(v_id)] = { "queue_command": { "command": "ride @s summon_ride vehicle:{} no_ride_change summon_enemy".format(v_id) } }
        ca_json["minecraft:entity"]["events"]["vehicle:{}".format(v_id)] = { "queue_command": { "command": "ride @s summon_ride vehicle:{} no_ride_change summon_enemy".format(v_id) } }
        pmc_json["minecraft:entity"]["events"]["vehicle:{}".format(v_id)] = { "queue_command": { "command": "ride @s summon_ride vehicle:{} no_ride_change summon_enemy".format(v_id) } }
    
    row_count += 1



with open("behavior_packs/GVCBedrock/scripts/gun.json","w") as f:
    json.dump(gundata_json,f,indent=2)

with open("behavior_packs/GVCBedrock/entities/player.json","w") as f:
    json.dump(player_json,f,indent=2)

with open("behavior_packs/GVCBedrock/animation_controllers/guns.json","w") as f:
    json.dump(BP_animation,f,indent=2)

with open("behavior_packs/GVCBedrock/animation_controllers/hold.json","w") as f:
    json.dump(BP_animation_hold,f,indent=2)

with open("behavior_packs/GVCBedrock/entities/mob/allied/ca.json","w") as f:
    json.dump(ca_json,f,indent=2)

with open("behavior_packs/GVCBedrock/entities/mob/enemy/ga.json","w") as f:
    json.dump(ga_json,f,indent=2)

with open("behavior_packs/GVCBedrock/entities/mob/allied/pmc.json","w") as f:
    json.dump(pmc_json,f,indent=2)


with open("resource_packs/GVCBedrock/textures/item_texture.json","w") as f:
    json.dump(item_json,f,indent=2)


with open("behavior_packs/GVCBedrock/scripts/gun.json","r") as f:
    export = "import { EntityDamageCause } from \"@minecraft/server\";\nexport const gunData = " 
    export += f.read()
    export += ";"


with open("behavior_packs/GVCBedrock/scripts/guns.js","w") as f:
    f.write(export)


a_func += "tag @a[tag=!startedv5] add startedv5\n"
with open("behavior_packs/GVCBedrock/functions/gunstart.mcfunction","w") as f:
    f.write(a_func)

    
with open("resource_packs/GVCBedrock/texts/guns.txt","w") as f:
    f.write(text)