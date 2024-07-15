titleraw @s[tag=!reload] actionbar {"rawtext":[{"text":"§b.Rocket§r "},{"score":{"name":"@s","objective":"rpg"}},{"text":"/1"}]}
playanimation @s animation.item.first none 0 "!query.is_item_equipped"
hud @s[tag=scope] hide crosshair
execute if entity @s[tag=!reload,scores={rpg=0},hasitem={item=zex:rocketm}] run scriptevent gvcv5:reload rpg
hud @s[tag=!scope] reset crosshair
