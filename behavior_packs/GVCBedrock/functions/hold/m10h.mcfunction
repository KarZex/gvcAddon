titleraw @s[tag=!reload,tag=!down] actionbar {"rawtext":[{"text":"��99mmHG��r "},{"score":{"name":"@s","objective":"m10"}},{"text":"/30"}]}
playanimation @s animation.onehand.first none 0 "!query.is_item_equipped"
hud @s[tag=scope] hide crosshair
execute if entity @s[tag=autoReload,tag=!reload,tag=!down,scores={m10=0},hasitem={item=zex:mm9}] run scriptevent gvcv5:reload m10
hud @s[tag=!scope] reset crosshair
