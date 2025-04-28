titleraw @s[scores={DeathTime=1..}] actionbar {"rawtext":[{"text":"Spawn:"},{"score":{"name":"@s","objective":"DeathTime"}}]}
scoreboard players remove @s[scores={DeathTime=1..}] DeathTime 1
execute as @s[tag=onDeath,scores={DeathTime=..0}] run scriptevent zex:spawnpoint
tag @s[tag=onDeath,scores={DeathTime=..0}] remove onDeath