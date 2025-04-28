titleraw @s[tag=!reload,tag=!down] actionbar {"rawtext":[{"text":"Åò3.30CalÅòr "},{"score":{"name":"@s","objective":"tt33"}},{"text":"/8"}]}
playanimation @s animation.onehand.first none 0 "!query.is_item_equipped"
hud @s[tag=scope] hide crosshair
execute if entity @s[tag=autoReload,tag=!reload,tag=!down,scores={tt33=0},hasitem={item=zex:762m}] run scriptevent gvcv5:reload tt33
hud @s[tag=!scope] reset crosshair
