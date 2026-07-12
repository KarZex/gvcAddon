##Blue Boss Flag

effect @e[family=blueteam,r=60] regeneration 1 2 false
effect @e[family=blueteam,r=60] resistance 1 4 false

##kill another country's player
damage @a[family=redteam,r=60] 2 override
damage @a[family=greenteam,r=60] 2 override
damage @a[family=yellowteam,r=60] 2 override

kill @e[family=redteam,r=60,type=!player]
kill @e[family=greenteam,r=60,type=!player]
kill @e[family=yellowteam,r=60,type=!player]

kill @e[family=monster,r=60]


## Another country player cant mine or placing
scoreboard players set @a[r=60,family=!blueteam,tag=!working] antiMining 200


## warning
titleraw @a[r=60,family=!blueteam,tag=!working] title { "rawtext": [ { "translate": "script.gvcv5.blue_boss_warning" } ] }
