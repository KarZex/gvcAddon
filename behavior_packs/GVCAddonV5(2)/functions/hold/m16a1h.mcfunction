titleraw @s[tag=!reload,tag=!down] actionbar {"rawtext":[{"text":"§6.22Cal§r "},{"score":{"name":"@s","objective":"m16a1"}},{"text":"/30"}]}
playanimation @s[tag=!down] animation.item.first none 0 "!query.is_item_equipped"
hud @s[tag=scope] hide crosshair
execute if entity @s[tag=!reload,tag=!down,scores={m16a1=0},hasitem={item=zex:556m}] run scriptevent gvcv5:reload m16a1
hud @s[tag=!scope] reset crosshair
