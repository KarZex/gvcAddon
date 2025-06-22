import json
import csv
import shutil

csv_path = open("csv/gunData.csv","r")
csv_reader = csv.reader(csv_path) 

row_count = 0

text = ""

player_json = json.load(open("tool/player_team.json","r"))
ca_json = json.load(open("tool/ca_team.json","r"))
pmc_json = json.load(open("tool/pmc_team.json","r"))
pmc_red_json = json.load(open("tool/pmc_red.json","r"))
pmc_blue_json = json.load(open("tool/pmc_blue.json","r"))
pmc_green_json = json.load(open("tool/pmc_green.json","r"))
pmc_yellow_json = json.load(open("tool/pmc_yellow.json","r"))

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
        
        PMC_weapon_change_red = {
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
                    "test": "is_family",
                    "subject": "other",
                    "value": "redteam"
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
        
        PMC_weapon_change_blue = {
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
                    "test": "is_family",
                    "subject": "other",
                    "value": "blueteam"
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
        
        PMC_weapon_change_green = {
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
                    "test": "is_family",
                    "subject": "other",
                    "value": "greenteam"
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
        
        PMC_weapon_change_yellow = {
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
                    "test": "is_family",
                    "subject": "other",
                    "value": "yellowteam"
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


        ca_json["minecraft:entity"]["component_groups"]["{}".format(gun_id)] = spawn_entity
        ca_json["minecraft:entity"]["events"]["{}".format(gun_id)] = event
        pmc_json["minecraft:entity"]["component_groups"]["{}".format(gun_id)] = spawn_entity
        pmc_json["minecraft:entity"]["events"]["{}".format(gun_id)] = event
        pmc_json["minecraft:entity"]["components"]["minecraft:interact"]["interactions"].append(PMC_weapon_change)
        pmc_red_json["minecraft:entity"]["components"]["minecraft:interact"]["interactions"].append(PMC_weapon_change_red)
        pmc_red_json["minecraft:entity"]["component_groups"]["{}".format(gun_id)] = spawn_entity
        pmc_red_json["minecraft:entity"]["events"]["{}".format(gun_id)] = event
        pmc_blue_json["minecraft:entity"]["components"]["minecraft:interact"]["interactions"].append(PMC_weapon_change_blue)
        pmc_blue_json["minecraft:entity"]["component_groups"]["{}".format(gun_id)] = spawn_entity
        pmc_blue_json["minecraft:entity"]["events"]["{}".format(gun_id)] = event
        pmc_green_json["minecraft:entity"]["components"]["minecraft:interact"]["interactions"].append(PMC_weapon_change_green)
        pmc_green_json["minecraft:entity"]["component_groups"]["{}".format(gun_id)] = spawn_entity
        pmc_green_json["minecraft:entity"]["events"]["{}".format(gun_id)] = event
        pmc_yellow_json["minecraft:entity"]["components"]["minecraft:interact"]["interactions"].append(PMC_weapon_change_yellow)
        pmc_yellow_json["minecraft:entity"]["component_groups"]["{}".format(gun_id)] = spawn_entity
        pmc_yellow_json["minecraft:entity"]["events"]["{}".format(gun_id)] = event

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

        if(row[7] == "T"):
            gun_break_block = True
        else:
            gun_break_block = False
        #player
        if(  gun_offset == "D"  ):
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
        
        #enemy and allieds
        attack_interval = gun_interval * 0.05

        spawn_entity = {
            "minecraft:behavior.ranged_attack": {
                "priority": 3,
                "burst_shots": 1,
                "burst_interval": 0,
                "charge_charged_trigger": 0.0,
                "charge_shoot_trigger": 0.0,
                "attack_interval_min": attack_interval,
                "attack_interval_max": attack_interval,
                "attack_radius": 20.0
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
        ca_json["minecraft:entity"]["component_groups"]["{}".format(gun_id)] = spawn_entity
        ca_json["minecraft:entity"]["events"]["{}".format(gun_id)] = event
        pmc_json["minecraft:entity"]["component_groups"]["{}".format(gun_id)] = spawn_entity
        pmc_json["minecraft:entity"]["events"]["{}".format(gun_id)] = event
        pmc_red_json["minecraft:entity"]["component_groups"]["{}".format(gun_id)] = spawn_entity
        pmc_red_json["minecraft:entity"]["events"]["{}".format(gun_id)] = event
        pmc_blue_json["minecraft:entity"]["component_groups"]["{}".format(gun_id)] = spawn_entity
        pmc_blue_json["minecraft:entity"]["events"]["{}".format(gun_id)] = event
        pmc_green_json["minecraft:entity"]["component_groups"]["{}".format(gun_id)] = spawn_entity
        pmc_green_json["minecraft:entity"]["events"]["{}".format(gun_id)] = event
        pmc_yellow_json["minecraft:entity"]["component_groups"]["{}".format(gun_id)] = spawn_entity
        pmc_yellow_json["minecraft:entity"]["events"]["{}".format(gun_id)] = event

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
        ca_json["minecraft:entity"]["events"]["vehicle:{}".format(v_id)] = { "queue_command": { "command": "ride @s summon_ride vehicle:{} no_ride_change summon_enemy".format(v_id) } }
        pmc_json["minecraft:entity"]["events"]["vehicle:{}".format(v_id)] = { "queue_command": { "command": "ride @s summon_ride vehicle:{} no_ride_change summon_enemy".format(v_id) } }
    
    row_count += 1


with open("behavior_packs/GVCBedrockTeam/entities/player.json","w") as f:
    json.dump(player_json,f,indent=2)


with open("behavior_packs/GVCBedrockTeam/entities/mob/allied/ca.json","w") as f:
    json.dump(ca_json,f,indent=2)


with open("behavior_packs/GVCBedrockTeam/entities/mob/allied/pmc.json","w") as f:
    json.dump(pmc_json,f,indent=2)

with open("behavior_packs/GVCBedrockTeam/entities/mob/allied/pmc_red.json","w") as f:
    json.dump(pmc_red_json,f,indent=2)
with open("behavior_packs/GVCBedrockTeam/entities/mob/allied/pmc_blue.json","w") as f:
    json.dump(pmc_blue_json,f,indent=2)
with open("behavior_packs/GVCBedrockTeam/entities/mob/allied/pmc_green.json","w") as f:
    json.dump(pmc_green_json,f,indent=2)
with open("behavior_packs/GVCBedrockTeam/entities/mob/allied/pmc_yellow.json","w") as f:
    json.dump(pmc_yellow_json,f,indent=2)
