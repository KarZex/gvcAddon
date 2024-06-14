import os
import json

# ディレクトリ内のすべてのJSONファイルに対して処理を行う
current_directory = os.getcwd()
for file_name in os.listdir(current_directory):
    if file_name.endswith('.json'):
        file_path = os.path.join(current_directory, file_name)

        # JSONファイルを読み込む
        with open(file_path, 'r') as file:
            data = json.load(file)
            print(file_path)
            gun_name = data["minecraft:entity"]["description"]["identifier"]
            data["minecraft:entity"]["description"]["identifier"] = gun_name.replace("fire:s","fire:ads_")

        # 変更したデータをJSON形式に変換
        updated_json_data = json.dumps(data, indent=2)

        # 変更を保存（元のファイルを上書き）
        with open(file_path, 'w') as file:
            file.write(updated_json_data)

print("変更が完了しました。")