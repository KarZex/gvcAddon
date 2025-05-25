import json
import csv
import shutil

csv_path = open("csv/gunData.csv","r",encoding='utf-8')
csv_reader = csv.reader(csv_path) 

row_count = 0

text = ""

player_json = json.load(open("tool/player_pve.json","r"))
ca_json = json.load(open("tool/ca.json","r"))
pmc_json = json.load(open("tool/pmc.json","r"))

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
            "use_item": True,
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
            "use_item": True,
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
            "use_item": True,
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
            "use_item": True,
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
            "use_item": True,
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

    row_count += 1





with open("behavior_packs/GVCBedrock/subpacks/1/entities/player.json","w") as f:
    json.dump(player_json,f,indent=2)



with open("behavior_packs/GVCBedrock/subpacks/1/entities/mob/allied/ca.json","w") as f:
    json.dump(ca_json,f,indent=2)


with open("behavior_packs/GVCBedrock/subpacks/1/entities/mob/allied/pmc.json","w") as f:
    json.dump(pmc_json,f,indent=2)