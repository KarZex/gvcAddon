titleraw @s[tag=!reload] actionbar {"rawtext":[{"text":"§3.30Cal§r "},{"score":{"name":"@s","objective":"tt33"}},{"text":"/6"}]}
playanimation @s animation.onehand.first none 0 "!query.is_item_equipped"
hud @s[tag=scope] hide crosshair
execute if entity @s[tag=!reload,scores={tt33=0},hasitem={item=zex:762m}] run scriptevent gvcv5:reload tt33
hud @s[tag=!scope] reset crosshair
