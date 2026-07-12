import { world, system, EquipmentSlot, EntityComponentTypes,GameMode, EntityInitializationCause, ItemComponent, ItemComponentTypes, TicksPerSecond, EffectType, EffectTypes, EntityDamageCause, InputButton, ButtonState, LiquidType  } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { gunData } from "./guns";
import { vehicleData } from "./vehicle";
import { absVector2,getVector2E,getEntityName,absVector3,Vector2Sub,isMoving,DistanceVector3,getUnderBlocksTo,Vector3Sub,getVector3E,Vector3Add,turning,turning2,DistanceVector3in2dim} from "./usefulFunction"

//allied soldier
const caGuns = [
	[
		`m14`,
		`m16a1`,
		`mp5`,
		`m72`,
		`m60`
	],
	[
		`vehicle:m113`,
		`vehicle:m60a1`,
		//`vehicle:ah1s`,
		//`vehicle:ah6`
	]
]

//Guerrilla soldier
const gaGunsLv0 = [
	[
		`mp40`,
		`m1911`
	]
]

const gaGunsLv1 = [
	[
		`mp40`,
		`m1911`,
		`ak47`,
		`uzi`
	],
	[
		`vehicle:zex_cluiser`
	]
]
const gaGunsLv2 = [
	[
		`mp40`,
		`m1911`,
		`ak47`,
		`uzi`
	],
	[
		`vehicle:zex_cluiser`
	]
]

const gaGunsLv3 = [
	[
		`mp40`,
		`m1911`,
		`ak47`,
		`uzi`,
		`dp28`,
		`rpg`,
		`p90`,
	],
	[
		`vehicle:zex_cluiser`,
		`vehicle:btr60`,
		//`vehicle:r22`
	]
]

const gaGunsLv4 = [
	[
		`mp40`,
		`m1911`,
		`an94`,
		`uzi`,
		`dp28`,
		`rpg`,
		`p90`,
		`svd`,
		`mosin`
	],
	[
		`vehicle:zex_cluiser`,
		`vehicle:btr60`,
		`vehicle:t34`,
		//`vehicle:g_heri`,
		//`vehicle:r22`
	]
]

const gaGunsLv5 = [
	[
		`mp40`,
		`m1911`,
		`an94`,
		`uzi`,
		`dp28`,
		`rpg`,
		`p90`,
		`svd`,
		`mosin`
	],
	[
		`vehicle:zex_cluiser`,
		`vehicle:btr60`,
		`vehicle:t34`,
		//`vehicle:g_heri`,
		//`vehicle:mi24d`
	]
]
const gaGunsLv6 = [
	[	
		`mp40`,
		`m1911`,
		`an94`,
		`uzi`,
		`dp28`,
		`rpg`,
		`p90`,
		`svd`,
		`mosin`
	],
	[
		`vehicle:zex_cluiser`,
		`vehicle:btr60`,
		`vehicle:bmp3`,
		//`vehicle:g_heri`,
		//`vehicle:mi24d`,
		`vehicle:t55`
	]
]

//Red team soldier 
const caRedGuns = [
	[
		`qbz95`,
		`g3a3`,
		`pkm`,
		`rpg`,
		`svd`,
		`vz61`
	],
	[
		`vehicle:t72`,
		`vehicle:bmp3`,
		//`vehicle:mi24d`
	]
]

//Blue team soldier 
const caBlueGuns = [
	[
		`m16a4`,
		`m4a1`,
		`m249`,
		`m72`,
		`m110`,
		`m10`
	],
	[
		`vehicle:m1_abrams`,
		`vehicle:lav25`,
		//`vehicle:ah1s`
	]
]

//Green team soldier 
const caGreenGuns = [
	[
		`ak12`,
		`an94`,
		`pkm`,
		`rpg`,
		`svd`,
		`vz61`
	],
	[
		`vehicle:t72`,
		`vehicle:bmp3`,
		//`vehicle:mi24d`
	]
]

//Yellow team soldier
const caYellowGuns = [
	[
		`g36`,
		`g3a3`,
		`m249`,
		`m72`,
		`m110`,
		`mp5`
	],
	[
		`vehicle:m1_abrams`,
		`vehicle:lav25`,
		//`vehicle:ah1s`
	]
]

const MOBGUNS = {
	"ca":caGuns,
	"ga0":gaGunsLv0,
	"ga1":gaGunsLv1,
	"ga2":gaGunsLv2,
	"ga3":gaGunsLv3,
	"ga4":gaGunsLv4,
	"ga5":gaGunsLv5,
	"ga6":gaGunsLv6,
	"ca_red":caRedGuns,
	"ca_blue":caBlueGuns,
	"ca_green":caGreenGuns,
	"ca_yellow":caYellowGuns

}

// async function launchMissile(boss) {
// 	for( let i = 0; i < 4; i++ ){
// 		const missile = world.getDimension(`minecraft:overworld`).spawnEntity(`fire:mamissile`,{x:boss.location.x,y:boss.location.y+4,z:boss.location.z});
// 		missile.getComponent(EntityComponentTypes.Projectile).owner = boss;
// 		const target = world.getDimension(`minecraft:overworld`).getPlayers({ maxDistance:64,closest:1,location:boss.location })[0];
// 		boss.setDynamicProperty(`gvcv5:missilelocation`,{x:target.location.x,y:target.location.y-16,z:target.location.z})
// 		missile.getComponent(EntityComponentTypes.Projectile).shoot(boss.getViewDirection());
// 		await system.waitTicks(2);
// 	}
// }

// system.runInterval( () => {
// 	const overTanks = world.getDimension(`minecraft:overworld`).getEntities({type:`gvcv5:mer08r`});
// 	for( const boss of overTanks ){
// 		launchMissile(boss);
// 	}
// },100)

system.afterEvents.scriptEventReceive.subscribe( async e => {
	if( e.id == "gvcv5:enemy_spawn" ){
		let type = e.message.split(` `)[0];
		let vehicle = e.message.split(` `)[1];
		let weapons;
		try{
			if( type.includes(`ga`) ){
				type = `${type}${world.getDynamicProperty("gvcv5:progress")}`;
			}
			if( Math.random() < 0.05 && MOBGUNS[`${type}`].length > 1 && vehicle == `true` ){
				weapons = MOBGUNS[`${type}`][1];
			}
			else{
				weapons = MOBGUNS[`${type}`][0];
			}
			await system.waitTicks(2);
			e.sourceEntity.triggerEvent(`${weapons[ Math.floor(Math.random() * weapons.length ) ]}`)

		}catch{}
	}
} )