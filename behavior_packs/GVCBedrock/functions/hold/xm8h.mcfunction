titleraw @s[tag=!reload,tag=!down] actionbar {"rawtext":[{"text":"Åòe40mmGrenadeÅòr "},{"score":{"name":"@s","objective":"xm8"}},{"text":"/8"}]}
playanimation @s[tag=!down] animation.item.first none 0 "!query.is_item_equipped"
hud @s[tag=scope] hide crosshair
execute if entity @s[tag=autoReload,tag=!reload,tag=!down,scores={xm8=0},hasitem={item=zex:40m}] run scriptevent gvcv5:reload xm8
hud @s[tag=!scope] reset crosshair
