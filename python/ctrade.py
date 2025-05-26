import json
import csv
import shutil

csv_path = open("csv/gunData.csv","r")
csv_reader = csv.reader(csv_path) 

row_count = 0

trade_json = json.load(open("tool/sov1.json","r"))

#aasdasd
for row in csv_reader:

    if( row_count >= 1 ):
        #from CSV
        gun_id = row[1]
        gun_trade = int(row[22])
        trade = {
              "max_uses": 2000,
              "wants": [
                {
                  "item": "minecraft:emerald",
                  "quantity": gun_trade
                }
              ],
              "gives": [
                {
                  "item": "gun:{}".format(gun_id),
                  "quantity": 1
                }
              ]
        }
        print(gun_id)
        trade_json["tiers"][0]["groups"][0]["trades"].append(trade)
    
    row_count+= 1

with open("tool/trade.json","w") as f:
    json.dump(trade_json,f,indent=2)