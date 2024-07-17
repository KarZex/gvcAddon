titleraw @s[tag=!reload,tag=!down] actionbar {"rawtext":[{"text":"§3.30Cal§r "},{"score":{"name":"@s","objective":"m110"}},{"text":"/20"}]}
playanimation @s[tag=!down] animation.item.first none 0 "!query.is_item_equipped"
hud @s[tag=scope] hide crosshair
execute if entity @s[tag=!reload,tag=!down,scores={m110=0},hasitem={item=zex:762m}] run scriptevent gvcv5:reload m110
hud @s[tag=!scope] reset crosshair
