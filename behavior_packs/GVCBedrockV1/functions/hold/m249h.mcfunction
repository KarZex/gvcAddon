titleraw @s[tag=!reload,tag=!down] actionbar {"rawtext":[{"text":"§3.30Cal§r "},{"score":{"name":"@s","objective":"m249"}},{"text":"/100"}]}
playanimation @s[tag=!down] animation.item.first none 0 "!query.is_item_equipped"
hud @s[tag=scope] hide crosshair
execute if entity @s[tag=autoReload,tag=!reload,tag=!down,scores={m249=0},hasitem={item=zex:762m}] run scriptevent gvcv5:reload m249
hud @s[tag=!scope] reset crosshair