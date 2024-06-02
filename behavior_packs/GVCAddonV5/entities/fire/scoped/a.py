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
            if "minecraft:explode" in data["minecraft:entity"]["components"] and "fuseLength" in data["minecraft:entity"]["components"]["minecraft:explode"]:
                data["minecraft:entity"]["components"]["minecraft:explode"]["fuseLength"] = 5
            if "impact_damage" in data["minecraft:entity"]["components"]["minecraft:projectile"]["onHit"] and "damage" in data["minecraft:entity"]["components"]["minecraft:projectile"]["onHit"]["impact_damage"]:
                data["minecraft:entity"]["components"]["minecraft:projectile"]["onHit"]["impact_damage"]["damage"] = 0
            if "impact_damage" in data["minecraft:entity"]["components"]["minecraft:projectile"]["onHit"] and "knockback" in data["minecraft:entity"]["components"]["minecraft:projectile"]["onHit"]["impact_damage"]:
                data["minecraft:entity"]["components"]["minecraft:projectile"]["onHit"]["impact_damage"]["knockback"] = False
            if "particle_on_hit" in data["minecraft:entity"]["components"]["minecraft:projectile"]["onHit"]:
                del data["minecraft:entity"]["components"]["minecraft:projectile"]["onHit"]["particle_on_hit"]
            if "remove_on_hit" in data["minecraft:entity"]["components"]["minecraft:projectile"]["onHit"]:
                del data["minecraft:entity"]["components"]["minecraft:projectile"]["onHit"]["remove_on_hit"]
            data["minecraft:entity"]["components"]["minecraft:projectile"]["onHit"]["stick_in_ground"] = {}
            
            data["minecraft:entity"]["components"]["minecraft:projectile"]["anchor"] = 1
            if "offset" in data["minecraft:entity"]["components"]["minecraft:projectile"]:
                del data["minecraft:entity"]["components"]["minecraft:projectile"]["offset"]
            if "angleoffset" in data["minecraft:entity"]["components"]["minecraft:projectile"]:
                del data["minecraft:entity"]["components"]["minecraft:projectile"]["angleoffset"]


        # 変更したデータをJSON形式に変換
        updated_json_data = json.dumps(data, indent=2)

        # 変更を保存（元のファイルを上書き）
        with open(file_path, 'w') as file:
            file.write(updated_json_data)

print("変更が完了しました。")