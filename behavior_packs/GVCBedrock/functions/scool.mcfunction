execute if score @s subWeapon > @s maxsubcool run scoreboard players set @s scool 100
execute if score @s subWeapon > @s maxsubcool run scoreboard players set @s[scores={scool=51..}] subWeapon 0
scoreboard players remove @s[scores={scool=1..}] scool 1
scoreboard players remove @s[tag=!subattack,scores={subWeapon=1..}] subWeapon 1