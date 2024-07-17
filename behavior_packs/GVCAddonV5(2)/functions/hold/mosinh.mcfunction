titleraw @s[tag=!reload,tag=!down] actionbar {"rawtext":[{"text":"§3.30Cal§r "},{"score":{"name":"@s","objective":"mosin"}},{"text":"/5"}]}
playanimation @s[tag=!down] animation.item.first none 0 "!query.is_item_equipped"
hud @s[tag=scope] hide crosshair
execute if entity @s[tag=!reload,tag=!down,scores={mosin=0},hasitem={item=zex:762m}] run scriptevent gvcv5:reload mosin
hud @s[tag=!scope] reset crosshair
