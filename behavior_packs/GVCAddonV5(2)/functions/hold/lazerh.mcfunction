titleraw @s[tag=!reload,tag=!down] actionbar {"rawtext":[{"text":"§aBattery§r "},{"score":{"name":"@s","objective":"lazer"}},{"text":"/100"}]}
playanimation @s[tag=!down] animation.item.first none 0 "!query.is_item_equipped"
hud @s[tag=scope] hide crosshair
execute if entity @s[tag=autoReload,tag=!reload,tag=!down,scores={lazer=0},hasitem={item=zex:btm}] run scriptevent gvcv5:reload lazer
hud @s[tag=!scope] reset crosshair
