import json
import csv
import ast

csv_path = open("csv/gunData.csv","r")
csv_reader = csv.reader(csv_path) 

row_count = 0

text = ""

gunshopdata_json = {
    "a": {
        "type": "rifle",
        "cost": 1000
    }
}

#aasdasd
for row in csv_reader:

    if( row_count >= 1 ):
        #from CSV
        gun_id = row[1]
        print(gun_id)
        #Gundata fot JS

        if row[26] != "":

            gunshopdata_json["{}".format(gun_id)] = { 
                "type": row[25],
                "cost": int(row[26])
            }
    row_count += 1


with open("behavior_packs/GVCBedrock/scripts/gunpvp.json","w") as f:
    json.dump(gunshopdata_json,f,indent=2)

with open("behavior_packs/GVCBedrock/scripts/gunpvp.json","r") as f:
    export = "import { EntityDamageCause } from \"@minecraft/server\";\nexport const gunData = " 
    export += f.read()
    export += ";"


with open("behavior_packs/GVCBedrock/scripts/gunpvp.js","w") as f:
    f.write(export)