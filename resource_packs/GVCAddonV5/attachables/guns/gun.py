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

        with open("ump9.json".format(gun_id),"r") as f:
            gun_entity = json.load(f)
            gun_entity["minecraft:attachable"]["description"]["identifier"] = "gun:{}".format(gun_id)
            gun_entity["minecraft:attachable"]["description"]["geometry"]["default"] = "geometry.{}".format(gun_id)


        
        with open("{}.json".format(gun_id),"w") as f:
            json.dump(gun_entity,f,indent=2)
            
    
    row_count += 1
