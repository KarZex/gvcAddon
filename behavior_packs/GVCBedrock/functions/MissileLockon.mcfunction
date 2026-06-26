title @s title §6Missile Lockon
title @s times 0 1 0
playsound sound.alert1 @s
tag @s remove MissileLockon

replaceitem entity @s slot.inventory 0 minecraft:barrier 1 0 {"can_place_on": { "blocks": [  ] },"item_lock": { "mode": "lock_in_slot" } }