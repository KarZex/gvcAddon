scoreboard players add @s[scores={mtype=..2}] mtype 1
scoreboard players set @s[scores={mtype=3..}] mtype 0
tellraw @s { "rawtext": [ { "text": "Main Weapon:" }, { "score": {"name": "@s", "objective": "mtype" } } ] }