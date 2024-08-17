import json
import os

def list_all_files(directory):
    file_list = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            file_list.append(os.path.join(root, file))
    return file_list

directory = './support'  # 読み込みたいディレクトリのパスに変更してください
all_files = list_all_files(directory)

for file in all_files:
    with open(file,"r") as f:
        file_json = json.load(f)
        try: 
            file_json["format_version"] = "1.21.10"
            texture = file_json["minecraft:item"]["components"]["minecraft:icon"]["texture"]
            file_json["minecraft:item"]["components"]["minecraft:icon"] = texture
        except:
            print("error {}".format(file))

        try: 
            del file_json["minecraft:item"]["components"]["minecraft:render_offsets"]
            del file_json["minecraft:item"]["components"]["minecraft:use_duration"]
        except:
            print("error2 {}".format(file))

        try: 
            del file_json["minecraft:item"]["components"]["minecraft:creative_category"]
        except:
            print("error3 {}".format(file))

        try: 
            del file_json["minecraft:item"]["components"]["minecraft:display_name"]
        except:
            print("error4 {}".format(file))

        
    with open(file,"w") as f:
        json.dump(file_json,f,indent=2)