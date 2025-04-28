titleraw @s[tag=!reload,tag=!down] actionbar {"rawtext":[{"text":"Åò99mmHGÅòr "},{"score":{"name":"@s","objective":"mp40"}},{"text":"/20"}]}
playanimation @s[tag=!down] animation.item.first none 0 "!query.is_item_equipped"
hud @s[tag=scope] hide crosshair
execute if entity @s[tag=autoReload,tag=!reload,tag=!down,scores={mp40=0},hasitem={item=zex:mm9}] run scriptevent gvcv5:reload mp40
hud @s[tag=!scope] reset crosshair
