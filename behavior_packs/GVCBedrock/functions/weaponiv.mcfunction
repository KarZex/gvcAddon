tag @s add weaponivattack

execute if entity @e[r=7,type=vehicle:ka50] run event entity @s[scores={weaponiv=..1}] fire:flare

execute if entity @e[r=7,type=vehicle:ka50] run scoreboard players add @s[scores={weaponiv=..1}] weaponiv 1

execute if entity @e[r=7,type=vehicle:ka50] run scoreboard players set @s weaponiv_max 1
execute if entity @e[r=7,type=vehicle:ka50] run scoreboard players set @s weaponiv_cool 201

execute if entity @e[r=7,type=vehicle:f16] run event entity @s[scores={weaponiv=..1}] fire:flare

execute if entity @e[r=7,type=vehicle:f16] run scoreboard players add @s[scores={weaponiv=..1}] weaponiv 1

execute if entity @e[r=7,type=vehicle:f16] run scoreboard players set @s weaponiv_max 1
execute if entity @e[r=7,type=vehicle:f16] run scoreboard players set @s weaponiv_cool 201
