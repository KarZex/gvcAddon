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
            with open("first_person.json".format(gun_id),"r") as f:
                gun_entity = json.load(f)
                for i in range(len(gun_entity["render_controllers"]["controller.render.player.first_person"]["part_visibility"])):
                    gun_entity["render_controllers"]["controller.render.player.first_person"]["part_visibility"][i].replace("| query.get_equipped_item_name(0, 1) == 'tt33' |","| query.get_equipped_item_name(0, 1) == '{}' || query.get_equipped_item_name(0, 1) == 'tt33' |".format(gun_id))

        
        with open("first_person.json","w") as f:
            json.dump(gun_entity,f,indent=2)
            
    
    row_count += 1
