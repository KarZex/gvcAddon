titleraw @s[tag=!reload,tag=!down] actionbar {"rawtext":[{"text":"Åò3.30CalÅòr "},{"score":{"name":"@s","objective":"mg42"}},{"text":"/75"}]}
playanimation @s[tag=!down] animation.item.first none 0 "!query.is_item_equipped"
hud @s[tag=scope] hide crosshair
execute if entity @s[tag=autoReload,tag=!reload,tag=!down,scores={mg42=0},hasitem={item=zex:762m}] run scriptevent gvcv5:reload mg42
hud @s[tag=!scope] reset crosshair
