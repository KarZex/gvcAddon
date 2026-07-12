tag @s add weaponivattack

execute if entity @e[r=7,type=vehicle:ah1z] run event entity @s[scores={weaponiv=..1}] fire:flare

execute if entity @e[r=7,type=vehicle:ah1z] run scoreboard players add @s[scores={weaponiv=..1}] weaponiv 1

execute if entity @e[r=7,type=vehicle:ah1z] run scoreboard players set @s weaponiv_max 1
execute if entity @e[r=7,type=vehicle:ah1z] run scoreboard players set @s weaponiv_cool 101

execute if entity @e[r=7,type=vehicle:ka50] run event entity @s[scores={weaponiv=..1}] fire:flare

execute if entity @e[r=7,type=vehicle:ka50] run scoreboard players add @s[scores={weaponiv=..1}] weaponiv 1

execute if entity @e[r=7,type=vehicle:ka50] run scoreboard players set @s weaponiv_max 1
execute if entity @e[r=7,type=vehicle:ka50] run scoreboard players set @s weaponiv_cool 101

execute if entity @e[r=7,type=vehicle:f16] run event entity @s[scores={weaponiv=..1}] fire:flare

execute if entity @e[r=7,type=vehicle:f16] run scoreboard players add @s[scores={weaponiv=..1}] weaponiv 1

execute if entity @e[r=7,type=vehicle:f16] run scoreboard players set @s weaponiv_max 1
execute if entity @e[r=7,type=vehicle:f16] run scoreboard players set @s weaponiv_cool 101

execute if entity @e[r=7,type=vehicle:rcb90] run event entity @s[scores={weaponiv=..4}] fire:aamissile

execute if entity @e[r=7,type=vehicle:rcb90] run scoreboard players add @s[scores={weaponiv=..4}] weaponiv 1

execute if entity @e[r=7,type=vehicle:rcb90] run scoreboard players set @s weaponiv_max 4
execute if entity @e[r=7,type=vehicle:rcb90] run scoreboard players set @s weaponiv_cool 21

execute if entity @e[r=7,type=vehicle:hamina] run event entity @s[scores={weaponiv=..8}] fire:aamissile

execute if entity @e[r=7,type=vehicle:hamina] run scoreboard players add @s[scores={weaponiv=..8}] weaponiv 1

execute if entity @e[r=7,type=vehicle:hamina] run scoreboard players set @s weaponiv_max 8
execute if entity @e[r=7,type=vehicle:hamina] run scoreboard players set @s weaponiv_cool 11
