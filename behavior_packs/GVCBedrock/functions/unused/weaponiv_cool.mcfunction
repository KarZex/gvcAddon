execute if score @s weaponiv > @s weaponiv_max run scoreboard players set @s weaponiv_cool 100
execute if score @s weaponiv > @s weaponiv_max run scoreboard players set @s[scores={weaponiv_cool=51..}] weaponiv 0
scoreboard players remove @s[scores={weaponiv_cool=1..}] weaponiv_cool 1
scoreboard players remove @s[tag=!weaponivattack,scores={weaponiv=1..}] weaponiv 1
playsound reload.c @s[scores={weaponi_cool=20}]