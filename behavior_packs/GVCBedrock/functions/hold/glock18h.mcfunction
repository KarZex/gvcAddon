titleraw @s[tag=!reload,tag=!down] actionbar {"rawtext":[{"text":"Åò99mmHGÅòr "},{"score":{"name":"@s","objective":"glock18"}},{"text":"/20"}]}
playanimation @s animation.onehand.first none 0 "!query.is_item_equipped"
hud @s[tag=scope] hide crosshair
execute if entity @s[tag=autoReload,tag=!reload,tag=!down,scores={glock18=0},hasitem={item=zex:mm9}] run scriptevent gvcv5:reload glock18
hud @s[tag=!scope] reset crosshair
