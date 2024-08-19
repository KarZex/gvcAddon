titleraw @s[tag=!reload,tag=!down] actionbar {"rawtext":[{"text":"§b.Rocket§r "},{"score":{"name":"@s","objective":"m202"}},{"text":"/4"}]}
playanimation @s[tag=!down] animation.item.first none 0 "!query.is_item_equipped"
hud @s[tag=scope] hide crosshair
execute if entity @s[tag=autoReload,tag=!reload,tag=!down,scores={m202=0},hasitem={item=zex:rocketm}] run scriptevent gvcv5:reload m202
hud @s[tag=!scope] reset crosshair
