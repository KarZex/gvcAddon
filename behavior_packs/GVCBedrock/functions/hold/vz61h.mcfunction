titleraw @s[tag=!reload,tag=!down] actionbar {"rawtext":[{"text":"Åò99mmHGÅòr "},{"score":{"name":"@s","objective":"vz61"}},{"text":"/20"}]}
playanimation @s animation.onehand.first none 0 "!query.is_item_equipped"
hud @s[tag=scope] hide crosshair
execute if entity @s[tag=autoReload,tag=!reload,tag=!down,scores={vz61=0},hasitem={item=zex:mm9}] run scriptevent gvcv5:reload vz61
hud @s[tag=!scope] reset crosshair
