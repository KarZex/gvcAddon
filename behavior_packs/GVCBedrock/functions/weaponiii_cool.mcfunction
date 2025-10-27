execute if score @s weaponiii > @s weaponiii_max run scoreboard players set @s weaponiii_cool 100
execute if score @s weaponiii > @s weaponiii_max run scoreboard players set @s[scores={weaponiii_cool=51..}] weaponiii 0
scoreboard players remove @s[scores={weaponiii_cool=1..}] weaponiii_cool 1
scoreboard players remove @s[tag=!weaponiiiattack,scores={weaponiii=1..}] weaponiii 1
playsound reload.c @s[scores={weaponi_cool=20}]