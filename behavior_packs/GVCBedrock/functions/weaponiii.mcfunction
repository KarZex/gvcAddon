tag @s add weaponiiiattack

execute if entity @e[r=7,type=vehicle:ka50] run event entity @s[scores={weaponiii=..2}] fire:aamissile

execute if entity @e[r=7,type=vehicle:ka50] run scoreboard players add @s[scores={weaponiii=..2}] weaponiii 1

execute if entity @e[r=7,type=vehicle:ka50] run scoreboard players set @s weaponiii_max 2
execute if entity @e[r=7,type=vehicle:ka50] run scoreboard players set @s weaponiii_cool 101

execute if entity @e[r=7,type=vehicle:f16] run event entity @s[scores={weaponiii=..2}] fire:bomb

execute if entity @e[r=7,type=vehicle:f16] run scoreboard players add @s[scores={weaponiii=..2}] weaponiii 1

execute if entity @e[r=7,type=vehicle:f16] run scoreboard players set @s weaponiii_max 2
execute if entity @e[r=7,type=vehicle:f16] run scoreboard players set @s weaponiii_cool 101

execute if entity @e[r=7,type=vehicle:il2] run event entity @s[scores={weaponiii=..8}] fire:37mmrocket

execute if entity @e[r=7,type=vehicle:il2] run scoreboard players add @s[scores={weaponiii=..8}] weaponiii 1

execute if entity @e[r=7,type=vehicle:il2] run scoreboard players set @s weaponiii_max 8
execute if entity @e[r=7,type=vehicle:il2] run scoreboard players set @s weaponiii_cool 51

execute if entity @e[r=7,type=vehicle:st1_pmc] run event entity @s[scores={weaponiii=..60}] fire:20mmmcaird

execute if entity @e[r=7,type=vehicle:st1_pmc] run scoreboard players add @s[scores={weaponiii=..60}] weaponiii 1

execute if entity @e[r=7,type=vehicle:st1_pmc] run scoreboard players set @s weaponiii_max 60
