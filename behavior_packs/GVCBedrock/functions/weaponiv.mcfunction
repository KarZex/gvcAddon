tag @s add weaponivattack

execute if entity @e[r=7,type=vehicle:ka50] run event entity @s[scores={weaponiv=..2}] fire:bomb

execute if entity @e[r=7,type=vehicle:ka50] run scoreboard players add @s[scores={weaponiv=..2}] weaponiv 1

execute if entity @e[r=7,type=vehicle:ka50] run scoreboard players set @s weaponiv_max 2
execute if entity @e[r=7,type=vehicle:ka50] run scoreboard players set @s weaponiv_cool 101
