titleraw @s[tag=!reload,tag=!down] actionbar {"rawtext":[{"text":"Åò6.22CalÅòr "},{"score":{"name":"@s","objective":"g36"}},{"text":"/30"}]}
playanimation @s[tag=!down] animation.item.first none 0 "!query.is_item_equipped"
hud @s[tag=scope] hide crosshair
execute if entity @s[tag=autoReload,tag=!reload,tag=!down,scores={g36=0},hasitem={item=zex:556m}] run scriptevent gvcv5:reload g36
hud @s[tag=!scope] reset crosshair
