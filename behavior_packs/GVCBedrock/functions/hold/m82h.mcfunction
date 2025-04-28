titleraw @s[tag=!reload,tag=!down] actionbar {"rawtext":[{"text":"Åòc.50CalÅòr "},{"score":{"name":"@s","objective":"m82"}},{"text":"/10"}]}
playanimation @s[tag=!down] animation.item.first none 0 "!query.is_item_equipped"
hud @s[tag=scope] hide crosshair
execute if entity @s[tag=autoReload,tag=!reload,tag=!down,scores={m82=0},hasitem={item=zex:1270m}] run scriptevent gvcv5:reload m82
hud @s[tag=!scope] reset crosshair
