titleraw @s[tag=!reload,tag=!down] actionbar {"rawtext":[{"text":"§99mmHG§r "},{"score":{"name":"@s","objective":"mp7"}},{"text":"/40"}]}
playanimation @s animation.onehand.first none 0 "!query.is_item_equipped"
hud @s[tag=scope] hide crosshair
execute if entity @s[tag=!reload,tag=!down,scores={mp7=0},hasitem={item=zex:mm9}] run scriptevent gvcv5:reload mp7
hud @s[tag=!scope] reset crosshair
