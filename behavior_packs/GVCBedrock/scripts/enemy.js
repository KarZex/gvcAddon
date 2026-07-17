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
		`an94`,
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

const gaShip1 = [
	"vehicle:rhib"
]

const gaShip2 = [
	"vehicle:rhib",
	"vehicle:cruiser"
]
const gaShip3 = [
	"vehicle:rhib",
	"vehicle:cruiser",
	"vehicle:rcb90",
	"vehicle:pr1204"
]
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
// 	const gas = world.getDimension(`minecraft:overworld`).getEntities({families:[`allied_soldier`]});
// 	for( const ga of gas ){
// 		print(ga.typeId)
// 		if( ga.target != undefined ){
// 			if( ga.target.getComponent(EntityComponentTypes.Riding).entityRidingOn != undefined ){
// 				ga.target = ga.target.getComponent(EntityComponentTypes.Riding).entityRidingOn;
// 				try { print(`${ga.target.typeId}`); } catch{}
// 			}
// 		}
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
	else if( e.id == "gvcv5:shipspawn" ){
		const lv = world.getDynamicProperty("gvcv5:progress");
		print(`${lv}`)
		const O = e.sourceEntity.location;
		if( lv > 1 && lv <= 3 ){
			const ga0 = e.sourceEntity.dimension.spawnEntity(`gvcv5:ga`, { x:O.x, y:62,z:O.z },{ spawnEvent:gaShip1[Math.floor(Math.random() * gaShip1.length )] });
			await system.waitTicks(2);
			for( let i = 0; i < 3; i++ ){
				const ship = ga0.getComponent(EntityComponentTypes.Riding).entityRidingOn
				const ga = e.sourceEntity.dimension.spawnEntity(`gvcv5:ga`, { x:O.x, y:62,z:O.z });
				ship.getComponent(EntityComponentTypes.Rideable).addRider(ga)
			}
		}
		else if( lv > 3 && lv <= 5 ){
			const ga0 = e.sourceEntity.dimension.spawnEntity(`gvcv5:ga`, { x:O.x, y:62,z:O.z },{ spawnEvent:gaShip2[Math.floor(Math.random() * gaShip2.length )] });
			await system.waitTicks(2);
			for( let i = 0; i < 3; i++ ){
				const ship = ga0.getComponent(EntityComponentTypes.Riding).entityRidingOn
				const ga = e.sourceEntity.dimension.spawnEntity(`gvcv5:ga`, { x:O.x, y:62,z:O.z });
				ship.getComponent(EntityComponentTypes.Rideable).addRider(ga)
			}
		}
		else if( lv > 5 ){
			const ga0 = e.sourceEntity.dimension.spawnEntity(`gvcv5:ga`, { x:O.x, y:62,z:O.z },{ spawnEvent:gaShip3[Math.floor(Math.random() * gaShip3.length )] });
			await system.waitTicks(2);
			for( let i = 0; i < 3; i++ ){
				const ship = ga0.getComponent(EntityComponentTypes.Riding).entityRidingOn
				const ga = e.sourceEntity.dimension.spawnEntity(`gvcv5:ga`, { x:O.x, y:62,z:O.z });
				ship.getComponent(EntityComponentTypes.Rideable).addRider(ga)
			}
		}

		e.sourceEntity.remove()
	}
} )

/*
system.runInterval( () => {
	const Heri = world.getDimension(`minecraft:overworld`).getEntities({ families:[ `heri` ] });
	const Air = world.getDimension(`minecraft:overworld`).getEntities({ families:[ `air` ] });
	const Ships = world.getDimension(`minecraft:overworld`).getEntities({ families:[ `ship` ] });
	for( const vehicle of Heri ){
		if( vehicle.getComponent(EntityComponentTypes.Rideable).getRiders() == 0 ){
			continue;
		}
		const player = vehicle.getComponent(EntityComponentTypes.Rideable).getRiders()[0];
		if( player.typeId == `minecraft:player` ){
			continue;
		}
		let abs_v = vehicle.getComponent(EntityComponentTypes.Movement).defaultValue;
		vehicle.clearVelocity();
		const targetEntity = player.target;
		if( targetEntity != undefined ){
			//print( `${player.typeId}` );
			const P_t = targetEntity.location;
			const P_v = vehicle.location;
			const target = {
				x: P_t.x - P_v.x,
				y: P_t.y - P_v.y,
				z: P_t.z - P_v.z
			}
			const distance = Math.sqrt(target.x*target.x + target.y*target.y + target.z*target.z);
			const E_target = {
				x: (P_t.x - P_v.x)/distance,
				y: (P_t.y - P_v.y)/distance,
				z: (P_t.z - P_v.z)/distance
			}
			const H = Math.sqrt(E_target.x*E_target.x + E_target.z*E_target.z);
			const rotate = {
				x: -Math.asin(E_target.y) * 180 / Math.PI,
				y: Math.atan2(E_target.z/H, E_target.x/H) * 180 / Math.PI
			}
			player.setRotation({x: rotate.x, y: rotate.y-90});
			if( distance > 24 ){
				let fly = 0.25;
				if( vehicle.isOnGround ){ fly = 10; }
				vehicle.applyImpulse({x:E_target.x*abs_v,y:E_target.y*abs_v+fly,z:E_target.z*abs_v});
			}
		}

	}
	for( const vehicle of Ships ){
		if( vehicle.getComponent(EntityComponentTypes.Rideable).getRiders() == 0 ){
			continue;
		}
		const player = vehicle.getComponent(EntityComponentTypes.Rideable).getRiders()[0];
		if( player.typeId == `minecraft:player` ){
			continue;
		}
		let abs_v = vehicle.getComponent(EntityComponentTypes.Movement).defaultValue;
		vehicle.clearVelocity();
		const targetEntity = player.target;
		if( targetEntity != undefined ){
			//print( `${player.typeId}` );
			const P_t = targetEntity.location;
			const P_v = vehicle.location;
			const target = {
				x: P_t.x - P_v.x,
				y: 0,
				z: P_t.z - P_v.z
			}
			const distance = Math.sqrt(target.x*target.x + target.z*target.z);
			const E_target = {
				x: (P_t.x - P_v.x)/distance,
				y: 0,
				z: (P_t.z - P_v.z)/distance
			}
				const H = Math.sqrt(E_target.x*E_target.x + E_target.z*E_target.z);
			const rotate = {
				x: 0,
				y: Math.atan2(E_target.z/H, E_target.x/H) * 180 / Math.PI
			}
			if( distance > 24 ){
				player.setRotation({x: rotate.x, y: rotate.y-90});
				vehicle.setRotation({x: rotate.x, y: rotate.y-90});
				vehicle.applyImpulse({x:E_target.x*abs_v,y:0,z:E_target.z*abs_v});
			}
			else{
				vehicle.setRotation({x: rotate.x, y: rotate.y});
				//rotate.y = setTruedeg(rotate.y);
				vehicle.applyImpulse({x:-E_target.z*abs_v,y:0,z:E_target.x*abs_v});
				
			}
		}

	}
	for( const airCraft of Air ){
		if( airCraft.getComponent(EntityComponentTypes.Rideable).getRiders() == 0 ){
			continue;
		}
		const player = airCraft.getComponent(EntityComponentTypes.Rideable).getRiders()[0];
		if( player.typeId == `minecraft:player` ){
			continue;
		}
		if( player.target == undefined ){
			//print( `${player.typeId}` );
			player.setDynamicProperty(`PreY`,undefined);
			let v = airCraft.getVelocity();
			let abs_v = airCraft.getComponent(EntityComponentTypes.Movement).defaultValue;
			let r = getVector3E(v);
			if( absVector3(v) < 0.01 ){
				v = airCraft.getViewDirection();
				r = v;
			}
			const turnRad = Number(vehicleData[`${airCraft.typeId.replace("vehicle:","")}`]["turn"]) * Math.PI / 180;
			if( airCraft.getDynamicProperty(`gvcww2:Origin`) == undefined ){
				airCraft.setDynamicProperty(`gvcww2:Origin`,airCraft.location);
			}
			let P_0 = airCraft.getDynamicProperty(`gvcww2:Origin`);
			const P = airCraft.location;
			if( player.target != undefined ){
				try{
					P_0 = player.getDynamicProperty(`targetlocation`)
				}catch{}
				
			}
			if(player.getDynamicProperty(`gvcww2:PreFlydirection`) == undefined ){
				player.setDynamicProperty(`gvcww2:PreFlydirection`,player.getViewDirection());
			}

			if( DistanceVector3(P_0,P) <= 36 ){
				let d = player.getViewDirection();
				const r = player.getDynamicProperty(`gvcww2:PreFlydirection`);
				d = turning2(d,r,Math.PI/36);
				const underBlocksRatio = getUnderBlocksTo(airCraft.dimension,P,24,`minecraft:air`);
				if( underBlocksRatio < 1 ){
					d.y = 1-underBlocksRatio;
				}
				//rotate.y = setTruedeg(rotate.y);
				abs_v = absVector3(d) * airCraft.getComponent(EntityComponentTypes.Movement).defaultValue;
				airCraft.clearVelocity();
				player.setDynamicProperty(`gvcww2:PreFlydirection`,d)
				airCraft.applyImpulse({x:d.x*abs_v,y:d.y*abs_v,z:d.z*abs_v});
			}
			else if( DistanceVector3(P_0,P) > 36 ){
				player.setDynamicProperty(`gvcww2:rotatey`,undefined)
				const r = player.getDynamicProperty(`gvcww2:PreFlydirection`);
				const P_target = Vector3Sub(P,P_0);
				const P_target_E = getVector3E(P_target);
				let d = turning2(P_target_E,r,Math.PI/36);
				const underBlocksRatio = getUnderBlocksTo(airCraft.dimension,P,24,`minecraft:air`);
				if( underBlocksRatio < 1 ){
					d.y = 1-underBlocksRatio;
				}
				//rotate.y = setTruedeg(rotate.y);
				abs_v = airCraft.getComponent(EntityComponentTypes.Movement).defaultValue / absVector3(d);
				player.lookAt(Vector3Add(player.location,d));
				airCraft.lookAt(Vector3Add(player.location,d));
				player.setDynamicProperty(`gvcww2:PreFlydirection`,d)
				airCraft.clearVelocity();
				airCraft.applyImpulse({x:d.x*abs_v,y:d.y*abs_v,z:d.z*abs_v});
			}

			//search target
			// const target1 = player.dimension.getEntities({ excludeGameModes:["Spectator","Creative"],type:`player`,families:getEnemies(player),closest:1,location:player.location,maxDistance:120 });
			// const target2 = player.dimension.getEntities({ excludeTypes:[`player`],families:getEnemies(player),closest:1,location:player.location,maxDistance:120 });
			// const target = target1.concat(target2)[0];
			// if( target != undefined ){
			// 	//print(`Find target! ${target.id}`)
			// 	player.applyDamage(1,{ cause:EntityDamageCause.entityAttack,damagingEntity:target });
			// 	player.setDynamicProperty(`targetId`,target.id);
			// 	player.setDynamicProperty(`targetlocation`,target.location)
			// }
			

		}
		else if( player.target != undefined ){
			airCraft.setDynamicProperty(`gvcww2:Origin`,player.target.location);
			let v = airCraft.getVelocity();
			let abs_v = airCraft.getComponent(EntityComponentTypes.Movement).defaultValue;
			let r = {
				x:v.x/abs_v,
				y:v.y/abs_v,
				z:v.z/abs_v
			}
			if( absVector3(v) < 0.01 ){
				v = player.getViewDirection();
				r = v;
			}
			const turnRad = Number(vehicleData[`${airCraft.typeId.replace("vehicle:","")}`]["turn"]) * Math.PI / 180;
			const P = airCraft.location;
			
			if(player.getDynamicProperty(`gvcww2:PreFlydirection`) == undefined ){
				player.setDynamicProperty(`gvcww2:PreFlydirection`,player.getViewDirection());
			}

			if( player.target != undefined ){
				const target = player.target;
				if( target != undefined ){
					player.setDynamicProperty(`targetlocation`,target.location)
					const P_0 = target.location;
					const P_target = Vector3Sub(P,P_0);
					const P_target_E = getVector3E(P_target);
					const H = Math.sqrt(P_0.x*P_0.x + P_0.z*P_0.z);
					
					if( DistanceVector3in2dim(P_0,P) <= 24 && !player.getDynamicProperty(`gvcww2:attackend`) ){
						const r = player.getDynamicProperty(`gvcww2:PreFlydirection`);
						const b = airCraft.getViewDirection();
						let d = turning2(P_target_E,r,turnRad);
						if( DistanceVector3in2dim(P_0,P) < 12 ){
							player.setDynamicProperty(`gvcww2:attackend`,true);
						}
						
						const underBlocksRatio = getUnderBlocksTo(airCraft.dimension,P,12,`minecraft:air`);
						if( underBlocksRatio < 1 ){
							d.y = 1-underBlocksRatio;
						}
						//rotate.y = setTruedeg(rotate.y);
						airCraft.clearVelocity();
						player.lookAt(P_0);
						airCraft.lookAt(P_0);
						player.setDynamicProperty(`gvcww2:PreFlydirection`,d)
						const abs_v_xz = airCraft.getComponent(EntityComponentTypes.Movement).defaultValue * 0.5 / absVector2(d);
						const abs_v_y = airCraft.getComponent(EntityComponentTypes.Movement).defaultValue * 0.5;
						airCraft.applyImpulse({x:d.x*abs_v_xz,y:d.y*abs_v_y,z:d.z*abs_v_xz});
					}
					else if( DistanceVector3in2dim(P_0,P) > 24 && !player.getDynamicProperty(`gvcww2:attackend`) ){
						const b = airCraft.getViewDirection();
						let thita;
						let d = turning2(P_target_E,r,turnRad/3);
						const underBlocksRatio = getUnderBlocksTo(airCraft.dimension,P,12,`minecraft:air`);
						if( underBlocksRatio < 1 ){
							d.y = 1-underBlocksRatio;
						}
						//rotate.y = setTruedeg(rotate.y);
						abs_v = airCraft.getComponent(EntityComponentTypes.Movement).defaultValue;
						player.lookAt(Vector3Add(player.location,d));
						airCraft.lookAt(Vector3Add(player.location,d));
						player.setDynamicProperty(`gvcww2:PreFlydirection`,d)
						airCraft.clearVelocity();
						airCraft.applyImpulse({x:d.x*abs_v,y:d.y*abs_v,z:d.z*abs_v});
					}
					else if( player.getDynamicProperty(`gvcww2:attackend`) ){
						const r = getVector2E(player.getDynamicProperty(`gvcww2:PreFlydirection`));
						let d = getVector2E(r);
						d = turning2(d,r,Math.PI/18);
						const underBlocksRatio = getUnderBlocksTo(airCraft.dimension,P,24,`minecraft:air`);
						if( underBlocksRatio < 1 ){
							d.y = 1-underBlocksRatio;
						}
						//rotate.y = setTruedeg(rotate.y);
						abs_v = absVector3(d) * airCraft.getComponent(EntityComponentTypes.Movement).defaultValue;
						airCraft.clearVelocity();
						player.lookAt(Vector3Add(player.location,d));
						airCraft.lookAt(Vector3Add(player.location,d));
						player.setDynamicProperty(`gvcww2:PreFlydirection`,d)
						airCraft.applyImpulse({x:d.x*abs_v,y:d.y*abs_v,z:d.z*abs_v});
						if( DistanceVector3in2dim(P_0,P) > 24 ){
							player.setDynamicProperty(`gvcww2:attackend`,false);
						}
					}
				}
			}

		}
	}
},1)
*/