titleraw @s[tag=!reload] actionbar {"rawtext":[{"text":"§3.30Cal§r "},{"score":{"name":"@s","objective":"svd"}},{"text":"/10"}]}
playanimation @s animation.item.first none 0 "!query.is_item_equipped"
hud @s[tag=scope] hide crosshair
execute if entity @s[tag=!reload,scores={svd=0},hasitem={item=zex:762m}] run scriptevent gvcv5:reload svd
hud @s[tag=!scope] reset crosshair
