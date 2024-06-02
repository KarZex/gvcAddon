import os
import json

# ディレクトリ内のすべてのJSONファイルに対して処理を行う
current_directory = os.getcwd()
for file_name in os.listdir(current_directory):
    if file_name.endswith('.json'):
        file_path = os.path.join(current_directory, file_name)

        gun_name = file_name.replace(".json","")
        # JSONファイルを読み込む
        with open(file_path, 'r') as file:
            data = json.load(file)
            print(gun_name)
            if "minecraft:geometry" in data:
                bones = data["minecraft:geometry"][0]["bones"]
                for i in range(len(bones)):
                    if  i < len(bones) and bones[i]["name"] == "xgun":
                        del data["minecraft:geometry"][0]["bones"][i]
                    if i < len(bones) and bones[i]["name"] == "ygun":
                        del data["minecraft:geometry"][0]["bones"][i]
                    if i < len(bones) and bones[i]["name"] == "zgun":
                        del data["minecraft:geometry"][0]["bones"][i]
                    if i < len(bones) and bones[i]["name"] == "gun":
                        data["minecraft:geometry"][0]["bones"][i]["parent"] = "gunArm"
            else:
                continue
        

            # 変更したデータをJSON形式に変換
            updated_json_data = json.dumps(data, indent=4)

            # 変更を保存（元のファイルを上書き）
            with open(file_path, 'w') as file:
                file.write(updated_json_data)

print("変更が完了しました。")