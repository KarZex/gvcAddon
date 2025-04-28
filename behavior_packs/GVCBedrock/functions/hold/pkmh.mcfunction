titleraw @s[tag=!reload,tag=!down] actionbar {"rawtext":[{"text":"Åò3.30CalÅòr "},{"score":{"name":"@s","objective":"pkm"}},{"text":"/100"}]}
playanimation @s[tag=!down] animation.item.first none 0 "!query.is_item_equipped"
hud @s[tag=scope] hide crosshair
execute if entity @s[tag=autoReload,tag=!reload,tag=!down,scores={pkm=0},hasitem={item=zex:762m}] run scriptevent gvcv5:reload pkm
hud @s[tag=!scope] reset crosshair
