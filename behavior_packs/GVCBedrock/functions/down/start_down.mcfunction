#start_down.mcfunction

effect @s instant_health 1 255 true
effect @s resistance 4 255 true
#effect @s wither 99999 1 true
playsound sound.player.down @s
tag @s add down
inputpermission set @s jump disabled
inputpermission set @s mount disabled
scoreboard players set @s antiMining 999999