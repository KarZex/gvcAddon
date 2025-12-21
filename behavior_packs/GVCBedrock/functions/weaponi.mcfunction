tag @s add weaponiattack

execute if entity @e[r=7,type=vehicle:aifv] run event entity @s[scores={weaponi=..10}] fire:25mmmc

execute if entity @e[r=7,type=vehicle:aifv] run scoreboard players add @s[scores={weaponi=..10}] weaponi 1

execute if entity @e[r=7,type=vehicle:aifv] run scoreboard players set @s weaponi_max 10
execute if entity @e[r=7,type=vehicle:aifv] run scoreboard players set @s weaponi_cool 10

execute if entity @e[r=7,type=vehicle:lav25] run event entity @s[scores={weaponi=..10}] fire:25mmmc

execute if entity @e[r=7,type=vehicle:lav25] run scoreboard players add @s[scores={weaponi=..10}] weaponi 1

execute if entity @e[r=7,type=vehicle:lav25] run scoreboard players set @s weaponi_max 10
execute if entity @e[r=7,type=vehicle:lav25] run scoreboard players set @s weaponi_cool 10

execute if entity @e[r=7,type=vehicle:lav25aa] run event entity @s[scores={weaponi=..30}] fire:20mmmcair

execute if entity @e[r=7,type=vehicle:lav25aa] run scoreboard players add @s[scores={weaponi=..30}] weaponi 1

execute if entity @e[r=7,type=vehicle:lav25aa] run scoreboard players set @s weaponi_max 30

execute if entity @e[r=7,type=vehicle:m113] run event entity @s[scores={weaponi=..30}] fire:hmg

execute if entity @e[r=7,type=vehicle:m113] run scoreboard players add @s[scores={weaponi=..30}] weaponi 1

execute if entity @e[r=7,type=vehicle:m113] run scoreboard players set @s weaponi_max 30
execute if entity @e[r=7,type=vehicle:m113] run scoreboard players set @s weaponi_cool 3

execute if entity @e[r=7,type=vehicle:m113aa] run event entity @s[scores={weaponi=..30}] fire:20mmmcair

execute if entity @e[r=7,type=vehicle:m113aa] run scoreboard players add @s[scores={weaponi=..30}] weaponi 1

execute if entity @e[r=7,type=vehicle:m113aa] run scoreboard players set @s weaponi_max 30

execute if entity @e[r=7,type=vehicle:m1126] run event entity @s[scores={weaponi=..30}] fire:hmg

execute if entity @e[r=7,type=vehicle:m1126] run scoreboard players add @s[scores={weaponi=..30}] weaponi 1

execute if entity @e[r=7,type=vehicle:m1126] run scoreboard players set @s weaponi_max 30
execute if entity @e[r=7,type=vehicle:m1126] run scoreboard players set @s weaponi_cool 3

execute if entity @e[r=7,type=vehicle:m1128] run event entity @s[scores={weaponi=..1}] fire:105mmap

execute if entity @e[r=7,type=vehicle:m1128] run scoreboard players add @s[scores={weaponi=..1}] weaponi 1

execute if entity @e[r=7,type=vehicle:m1128] run scoreboard players set @s weaponi_max 1
execute if entity @e[r=7,type=vehicle:m1128] run scoreboard players set @s weaponi_cool 51

execute if entity @e[r=7,type=vehicle:btr60] run event entity @s[scores={weaponi=..30}] fire:14.5mmhmg

execute if entity @e[r=7,type=vehicle:btr60] run scoreboard players add @s[scores={weaponi=..30}] weaponi 1

execute if entity @e[r=7,type=vehicle:btr60] run scoreboard players set @s weaponi_max 30
execute if entity @e[r=7,type=vehicle:btr60] run scoreboard players set @s weaponi_cool 3

execute if entity @e[r=7,type=vehicle:bmp3] run event entity @s[scores={weaponi=..1}] fire:100mm

execute if entity @e[r=7,type=vehicle:bmp3] run scoreboard players add @s[scores={weaponi=..1}] weaponi 1

execute if entity @e[r=7,type=vehicle:bmp3] run scoreboard players set @s weaponi_max 1
execute if entity @e[r=7,type=vehicle:bmp3] run scoreboard players set @s weaponi_cool 31

execute if entity @e[r=7,type=vehicle:panzer] run event entity @s[scores={weaponi=..1}] fire:76mm

execute if entity @e[r=7,type=vehicle:panzer] run scoreboard players add @s[scores={weaponi=..1}] weaponi 1

execute if entity @e[r=7,type=vehicle:panzer] run scoreboard players set @s weaponi_max 1
execute if entity @e[r=7,type=vehicle:panzer] run scoreboard players set @s weaponi_cool 61

execute if entity @e[r=7,type=vehicle:kv2] run event entity @s[scores={weaponi=..1}] fire:152mm

execute if entity @e[r=7,type=vehicle:kv2] run scoreboard players add @s[scores={weaponi=..1}] weaponi 1

execute if entity @e[r=7,type=vehicle:kv2] run scoreboard players set @s weaponi_max 1
execute if entity @e[r=7,type=vehicle:kv2] run scoreboard players set @s weaponi_cool 161

execute if entity @e[r=7,type=vehicle:m1_abrams] run event entity @s[scores={weaponi=..1}] fire:120mmheat

execute if entity @e[r=7,type=vehicle:m1_abrams] run scoreboard players add @s[scores={weaponi=..1}] weaponi 1

execute if entity @e[r=7,type=vehicle:m1_abrams] run scoreboard players set @s weaponi_max 1
execute if entity @e[r=7,type=vehicle:m1_abrams] run scoreboard players set @s weaponi_cool 61

execute if entity @e[r=7,type=vehicle:m1a2] run event entity @s[scores={weaponi=..1}] fire:120mmapfsds

execute if entity @e[r=7,type=vehicle:m1a2] run scoreboard players add @s[scores={weaponi=..1}] weaponi 1

execute if entity @e[r=7,type=vehicle:m1a2] run scoreboard players set @s weaponi_max 1
execute if entity @e[r=7,type=vehicle:m1a2] run scoreboard players set @s weaponi_cool 61

execute if entity @e[r=7,type=vehicle:m41] run event entity @s[scores={weaponi=..1}] fire:85mm

execute if entity @e[r=7,type=vehicle:m41] run scoreboard players add @s[scores={weaponi=..1}] weaponi 1

execute if entity @e[r=7,type=vehicle:m41] run scoreboard players set @s weaponi_max 1
execute if entity @e[r=7,type=vehicle:m41] run scoreboard players set @s weaponi_cool 31

execute if entity @e[r=7,type=vehicle:fv101] run event entity @s[scores={weaponi=..1}] fire:76mm

execute if entity @e[r=7,type=vehicle:fv101] run scoreboard players add @s[scores={weaponi=..1}] weaponi 1

execute if entity @e[r=7,type=vehicle:fv101] run scoreboard players set @s weaponi_max 1
execute if entity @e[r=7,type=vehicle:fv101] run scoreboard players set @s weaponi_cool 31

execute if entity @e[r=7,type=vehicle:m60a1] run event entity @s[scores={weaponi=..1}] fire:105mmhe

execute if entity @e[r=7,type=vehicle:m60a1] run scoreboard players add @s[scores={weaponi=..1}] weaponi 1

execute if entity @e[r=7,type=vehicle:m60a1] run scoreboard players set @s weaponi_max 1
execute if entity @e[r=7,type=vehicle:m60a1] run scoreboard players set @s weaponi_cool 61

execute if entity @e[r=7,type=vehicle:pt76] run event entity @s[scores={weaponi=..1}] fire:76mm

execute if entity @e[r=7,type=vehicle:pt76] run scoreboard players add @s[scores={weaponi=..1}] weaponi 1

execute if entity @e[r=7,type=vehicle:pt76] run scoreboard players set @s weaponi_max 1
execute if entity @e[r=7,type=vehicle:pt76] run scoreboard players set @s weaponi_cool 31

execute if entity @e[r=7,type=vehicle:t34] run event entity @s[scores={weaponi=..1}] fire:85mm

execute if entity @e[r=7,type=vehicle:t34] run scoreboard players add @s[scores={weaponi=..1}] weaponi 1

execute if entity @e[r=7,type=vehicle:t34] run scoreboard players set @s weaponi_max 1
execute if entity @e[r=7,type=vehicle:t34] run scoreboard players set @s weaponi_cool 51

execute if entity @e[r=7,type=vehicle:t55] run event entity @s[scores={weaponi=..1}] fire:100mm

execute if entity @e[r=7,type=vehicle:t55] run scoreboard players add @s[scores={weaponi=..1}] weaponi 1

execute if entity @e[r=7,type=vehicle:t55] run scoreboard players set @s weaponi_max 1
execute if entity @e[r=7,type=vehicle:t55] run scoreboard players set @s weaponi_cool 71

execute if entity @e[r=7,type=vehicle:t72] run event entity @s[scores={weaponi=..1}] fire:125mmheat

execute if entity @e[r=7,type=vehicle:t72] run scoreboard players add @s[scores={weaponi=..1}] weaponi 1

execute if entity @e[r=7,type=vehicle:t72] run scoreboard players set @s weaponi_max 1
execute if entity @e[r=7,type=vehicle:t72] run scoreboard players set @s weaponi_cool 91

execute if entity @e[r=7,type=vehicle:r22] run event entity @s[scores={weaponi=..30}] fire:7.62mmmgs

execute if entity @e[r=7,type=vehicle:r22] run scoreboard players add @s[scores={weaponi=..30}] weaponi 1

execute if entity @e[r=7,type=vehicle:r22] run scoreboard players set @s weaponi_max 30
execute if entity @e[r=7,type=vehicle:r22] run scoreboard players set @s weaponi_cool 2

execute if entity @e[r=7,type=vehicle:ah1s] run event entity @s[scores={weaponi=..30}] fire:20mmmcheri

execute if entity @e[r=7,type=vehicle:ah1s] run scoreboard players add @s[scores={weaponi=..30}] weaponi 1

execute if entity @e[r=7,type=vehicle:ah1s] run scoreboard players set @s weaponi_max 30

execute if entity @e[r=7,type=vehicle:ah6] run event entity @s[scores={weaponi=..30}] fire:7.62mmmg

execute if entity @e[r=7,type=vehicle:ah6] run scoreboard players add @s[scores={weaponi=..30}] weaponi 1

execute if entity @e[r=7,type=vehicle:ah6] run scoreboard players set @s weaponi_max 30

execute if entity @e[r=7,type=vehicle:g_heri] run event entity @s[scores={weaponi=..30}] fire:vmg

execute if entity @e[r=7,type=vehicle:g_heri] run scoreboard players add @s[scores={weaponi=..30}] weaponi 1

execute if entity @e[r=7,type=vehicle:g_heri] run scoreboard players set @s weaponi_max 30
execute if entity @e[r=7,type=vehicle:g_heri] run scoreboard players set @s weaponi_cool 2

execute if entity @e[r=7,type=vehicle:ka50] run event entity @s[scores={weaponi=..30}] fire:30mmmc

execute if entity @e[r=7,type=vehicle:ka50] run scoreboard players add @s[scores={weaponi=..30}] weaponi 1

execute if entity @e[r=7,type=vehicle:ka50] run scoreboard players set @s weaponi_max 30
execute if entity @e[r=7,type=vehicle:ka50] run scoreboard players set @s weaponi_cool 3

execute if entity @e[r=7,type=vehicle:ka60] run event entity @s[scores={weaponi=..30}] fire:vmg

execute if entity @e[r=7,type=vehicle:ka60] run scoreboard players add @s[scores={weaponi=..30}] weaponi 1

execute if entity @e[r=7,type=vehicle:ka60] run scoreboard players set @s weaponi_max 30
execute if entity @e[r=7,type=vehicle:ka60] run scoreboard players set @s weaponi_cool 2

execute if entity @e[r=7,type=vehicle:mi24d] run event entity @s[scores={weaponi=..30}] fire:12.7mmmg

execute if entity @e[r=7,type=vehicle:mi24d] run scoreboard players add @s[scores={weaponi=..30}] weaponi 1

execute if entity @e[r=7,type=vehicle:mi24d] run scoreboard players set @s weaponi_max 30
execute if entity @e[r=7,type=vehicle:mi24d] run scoreboard players set @s weaponi_cool 2

execute if entity @e[r=7,type=vehicle:20mmaa] run event entity @s[scores={weaponi=..30}] fire:20mmmc

execute if entity @e[r=7,type=vehicle:20mmaa] run scoreboard players add @s[scores={weaponi=..30}] weaponi 1

execute if entity @e[r=7,type=vehicle:20mmaa] run scoreboard players set @s weaponi_max 30
execute if entity @e[r=7,type=vehicle:20mmaa] run scoreboard players set @s weaponi_cool 5

execute if entity @e[r=7,type=vehicle:flak18] run event entity @s[scores={weaponi=..1}] fire:125mm

execute if entity @e[r=7,type=vehicle:flak18] run scoreboard players add @s[scores={weaponi=..1}] weaponi 1

execute if entity @e[r=7,type=vehicle:flak18] run scoreboard players set @s weaponi_max 1
execute if entity @e[r=7,type=vehicle:flak18] run scoreboard players set @s weaponi_cool 61

execute if entity @e[r=7,type=vehicle:pak40] run event entity @s[scores={weaponi=..1}] fire:105mm

execute if entity @e[r=7,type=vehicle:pak40] run scoreboard players add @s[scores={weaponi=..1}] weaponi 1

execute if entity @e[r=7,type=vehicle:pak40] run scoreboard players set @s weaponi_max 1
execute if entity @e[r=7,type=vehicle:pak40] run scoreboard players set @s weaponi_cool 51

execute if entity @e[r=7,type=vehicle:zu23] run event entity @s[scores={weaponi=..30}] fire:23mmmc

execute if entity @e[r=7,type=vehicle:zu23] run scoreboard players add @s[scores={weaponi=..30}] weaponi 1

execute if entity @e[r=7,type=vehicle:zu23] run scoreboard players set @s weaponi_max 30
execute if entity @e[r=7,type=vehicle:zu23] run scoreboard players set @s weaponi_cool 3

execute if entity @e[r=7,type=vehicle:vads] run event entity @s[scores={weaponi=..30}] fire:20mmmcair

execute if entity @e[r=7,type=vehicle:vads] run scoreboard players add @s[scores={weaponi=..30}] weaponi 1

execute if entity @e[r=7,type=vehicle:vads] run scoreboard players set @s weaponi_max 30

execute if entity @e[r=7,type=vehicle:dp28set] run event entity @s[scores={weaponi=..30}] fire:7.62mmmg

execute if entity @e[r=7,type=vehicle:dp28set] run scoreboard players add @s[scores={weaponi=..30}] weaponi 1

execute if entity @e[r=7,type=vehicle:dp28set] run scoreboard players set @s weaponi_max 30
execute if entity @e[r=7,type=vehicle:dp28set] run scoreboard players set @s weaponi_cool 2

execute if entity @e[r=7,type=vehicle:m60set] run event entity @s[scores={weaponi=..30}] fire:7.62mmmg

execute if entity @e[r=7,type=vehicle:m60set] run scoreboard players add @s[scores={weaponi=..30}] weaponi 1

execute if entity @e[r=7,type=vehicle:m60set] run scoreboard players set @s weaponi_max 30
execute if entity @e[r=7,type=vehicle:m60set] run scoreboard players set @s weaponi_cool 2

execute if entity @e[r=7,type=vehicle:pkmset] run event entity @s[scores={weaponi=..30}] fire:7.62mmmg

execute if entity @e[r=7,type=vehicle:pkmset] run scoreboard players add @s[scores={weaponi=..30}] weaponi 1

execute if entity @e[r=7,type=vehicle:pkmset] run scoreboard players set @s weaponi_max 30
execute if entity @e[r=7,type=vehicle:pkmset] run scoreboard players set @s weaponi_cool 2

execute if entity @e[r=7,type=vehicle:mig17] run event entity @s[scores={weaponi=..30}] fire:23mmmcair

execute if entity @e[r=7,type=vehicle:mig17] run scoreboard players add @s[scores={weaponi=..30}] weaponi 1

execute if entity @e[r=7,type=vehicle:mig17] run scoreboard players set @s weaponi_max 30

execute if entity @e[r=7,type=vehicle:su27] run event entity @s[scores={weaponi=..60}] fire:20mmmcaird

execute if entity @e[r=7,type=vehicle:su27] run scoreboard players add @s[scores={weaponi=..60}] weaponi 1

execute if entity @e[r=7,type=vehicle:su27] run scoreboard players set @s weaponi_max 60

execute if entity @e[r=7,type=vehicle:f16] run event entity @s[scores={weaponi=..60}] fire:20mmmcair

execute if entity @e[r=7,type=vehicle:f16] run scoreboard players add @s[scores={weaponi=..60}] weaponi 1

execute if entity @e[r=7,type=vehicle:f16] run scoreboard players set @s weaponi_max 60

execute if entity @e[r=7,type=vehicle:su25] run event entity @s[scores={weaponi=..60}] fire:30mmmcair

execute if entity @e[r=7,type=vehicle:su25] run scoreboard players add @s[scores={weaponi=..60}] weaponi 1

execute if entity @e[r=7,type=vehicle:su25] run scoreboard players set @s weaponi_max 60

execute if entity @e[r=7,type=vehicle:f117] run event entity @s[scores={weaponi=..2}] fire:bombii

execute if entity @e[r=7,type=vehicle:f117] run scoreboard players add @s[scores={weaponi=..2}] weaponi 1

execute if entity @e[r=7,type=vehicle:f117] run scoreboard players set @s weaponi_max 2
execute if entity @e[r=7,type=vehicle:f117] run scoreboard players set @s weaponi_cool 101

execute if entity @e[r=7,type=vehicle:yak9] run event entity @s[scores={weaponi=..30}] fire:20mmmcaird

execute if entity @e[r=7,type=vehicle:yak9] run scoreboard players add @s[scores={weaponi=..30}] weaponi 1

execute if entity @e[r=7,type=vehicle:yak9] run scoreboard players set @s weaponi_max 30
execute if entity @e[r=7,type=vehicle:yak9] run scoreboard players set @s weaponi_cool 2

execute if entity @e[r=7,type=vehicle:il2] run event entity @s[scores={weaponi=..30}] fire:20mmmcaird

execute if entity @e[r=7,type=vehicle:il2] run scoreboard players add @s[scores={weaponi=..30}] weaponi 1

execute if entity @e[r=7,type=vehicle:il2] run scoreboard players set @s weaponi_max 30
execute if entity @e[r=7,type=vehicle:il2] run scoreboard players set @s weaponi_cool 2

execute if entity @e[r=7,type=vehicle:st1_pmc] run event entity @s[scores={weaponi=..1}] fire:152mm

execute if entity @e[r=7,type=vehicle:st1_pmc] run scoreboard players add @s[scores={weaponi=..1}] weaponi 1

execute if entity @e[r=7,type=vehicle:st1_pmc] run scoreboard players set @s weaponi_max 1
execute if entity @e[r=7,type=vehicle:st1_pmc] run scoreboard players set @s weaponi_cool 161
