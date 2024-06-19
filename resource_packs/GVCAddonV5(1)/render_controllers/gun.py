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
        if(gun_id != "ump9" and gun_id != "tt33" and gun_id != "scar"):
            print(gun_id)
            with open("first_person.json","r") as f:
                gun_entity = json.load(f)
                gun_entity["render_controllers"]["controller.render.player.first_person"]["part_visibility"][1]["rightArm"] = gun_entity["render_controllers"]["controller.render.player.first_person"]["part_visibility"][1]["rightArm"].replace("| query.get_equipped_item_name(0, 1) == 'tt33' |","| query.get_equipped_item_name(0, 1) == '{}' || query.get_equipped_item_name(0, 1) == 'tt33' |".format(gun_id))
                gun_entity["render_controllers"]["controller.render.player.first_person"]["part_visibility"][2]["rightSleeve"] = gun_entity["render_controllers"]["controller.render.player.first_person"]["part_visibility"][2]["rightSleeve"].replace("| query.get_equipped_item_name(0, 1) == 'tt33' |","| query.get_equipped_item_name(0, 1) == '{}' || query.get_equipped_item_name(0, 1) == 'tt33' |".format(gun_id))
                gun_entity["render_controllers"]["controller.render.player.first_person"]["part_visibility"][3]["leftArm"] = gun_entity["render_controllers"]["controller.render.player.first_person"]["part_visibility"][3]["leftArm"].replace("| query.get_equipped_item_name(0, 1) == 'tt33' |","| query.get_equipped_item_name(0, 1) == '{}' || query.get_equipped_item_name(0, 1) == 'tt33' |".format(gun_id))
                gun_entity["render_controllers"]["controller.render.player.first_person"]["part_visibility"][4]["leftSleeve"] = gun_entity["render_controllers"]["controller.render.player.first_person"]["part_visibility"][4]["leftSleeve"].replace("| query.get_equipped_item_name(0, 1) == 'tt33' |","| query.get_equipped_item_name(0, 1) == '{}' || query.get_equipped_item_name(0, 1) == 'tt33' |".format(gun_id))

        
        with open("first_person.json","w") as f:
            json.dump(gun_entity,f,indent=2)
            
    
    row_count += 1
