titleraw @s[tag=!reload,tag=!down] actionbar {"rawtext":[{"text":"§e40mmGrenade§r "},{"score":{"name":"@s","objective":"m79"}},{"text":"/1"}]}
playanimation @s[tag=!down] animation.item.first none 0 "!query.is_item_equipped"
hud @s[tag=scope] hide crosshair
execute if entity @s[tag=autoReload,tag=!reload,tag=!down,scores={m79=0},hasitem={item=zex:40m}] run scriptevent gvcv5:reload m79
hud @s[tag=!scope] reset crosshair
