import "./team";
import "./teamCompornents";
import { world, system, EquipmentSlot, EntityComponentTypes,GameMode, EntityInitializationCause, ItemComponent, ItemComponentTypes, TicksPerSecond, EffectType, EffectTypes, EntityDamageCause  } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { gunData } from "./guns";
import { gunAttach } from "./gunAttach"
import { craftData } from "./crafts";
import { raidData } from "./raid";
import { absVector3,getVector3E,isMoving,turning2 } from "./usefulFunction"
import "./compornents";
import "./vehicleMain";
import { attachmentData } from "./attach";
/*
world.afterEvents.entityHurt.subscribe( e => {
	print(`value:${e.damage} at:${e.hurtEntity.typeId} by:${e.damageSource.damagingEntity.typeId} type:${e.damageSource.cause}`)
} )
*/


export const tankImmuneEntities = [
    `armor_stand`,
    `area_effect_cloud`,
    `item`,
    `xp_orb`
]

const headshotTypes = [
	//2m height entities like player(humanoid)
	`minecraft:player`,
	`minecraft:zombie`,
	`minecraft:skeleton`,
	`minecraft:creeper`,
	`minecraft:piglin`,
	`minecraft:vindicator`,
	`minecraft:evoker`,
	`minecraft:witch`,
	`minecraft:pillager`,
	`minecraft:zombified_piglin`,
	`minecraft:husk`,
	`minecraft:stray`,
	`minecraft:drowned`,
	`minecraft:zombie_villager`,
	`minecraft:wither_skeleton`,
	`minecraft:villager_v2`,
	`minecraft:wandering_trader`,
	`minecraft:blaze`,
	`minecraft:breeze`,
	`gvcv5:ga`,
	`gvcv5:gb1`,
	`gvcv5:gb2`,
	`gvcv5:gb3`,
	`gvcv5:gb4`,
	`gvcv5:gb5`,
	`gvcv5:gb6`,
	`gvcv5:gc1`,
	`gvcv5:gc2`,
	`gvcv5:gc3`,
	`gvcv5:gc4`,
	`gvcv5:gc5`,
	`gvcv5:ca`,
	`gvcv5:pmc`,
	`gvcv5:pmc_red`,
	`gvcv5:pmc_blue`,
	`gvcv5:pmc_green`,
	`gvcv5:pmc_yellow`
]

function getGunProjectlie( id ){
	let gunName = id;
	if( gunName.includes("fire:adsh_") ){ gunName = gunName.replace("fire:adsh_",""); }
	else if( gunName.includes("fire:ads_") ){ gunName = gunName.replace("fire:ads_",""); }
	else if( gunName.includes("fire:") ){ gunName = gunName.replace("fire:",""); }
	return gunName
}

function getrecoilResistance( id ){
	if( id == 1 ){
		return -0.5;
	}
	else if( id == 2 ){
		return -1;
	}
	else if( id == 3 ){
		return -1.5;
	}
	else if( id == 4 ){
		return -2;
	}
	else{
		return 0
	}
}

function getRemvereloadTime( id ){
	if( id == 1 ){
		return -5;
	}
	else if( id == 2 ){
		return -10;
	}
	else if( id == 3 ){
		return -15;
	}
	else if( id == 4 ){
		return -20;
	}
	else{
		return 0
	}
}

function recoil( player,recoil ){
	player.runCommand(`camerashake add @s ${recoil/10} 0.05 rotational`);
	//const V = player.getRotation();
	//const D = player.getVelocity();
	//player.teleport(player.location,{ rotation:{x:V.x-recoil,y:V.y  } });
	//player.applyImpulse(D);
}

world.afterEvents.playerSpawn.subscribe( e => {
	const player = e.player;
	player.setDynamicProperty(`gvcv5:gunUsed`,0)
} )

function printDamage(player,damage,victim){
	if( player.getDynamicProperty(`gvcv5:hitEntityId`) != victim.id ){
		player.setDynamicProperty(`gvcv5:hitEntityId`,victim.id);
		player.setDynamicProperty(`gvcv5:hitdamage`, 0 );
		//print(`${victim.id}`);
	}
	const hitDamage = player.getDynamicProperty(`gvcv5:hitdamage`);
	if( hitDamage == undefined ){ player.setDynamicProperty(`gvcv5:hitdamage`, 0 ); }
	player.setDynamicProperty(`gvcv5:hitdamage`, hitDamage + damage);
	//print(`${player.getDynamicProperty(`gvcv5:hitdamage`)}`);
	world.scoreboard.getObjective(`printDamage`).setScore(player,40);
	
}

function print(text){
	world.sendMessage(`§a[System]§r: ${text}`);
}
function getInventoryItem(player,typeId){
	let c = 0
	for(let j = 0; j < 36; j++){
		let Haditem = player.getComponent("inventory").container.getItem(j);
		if( Haditem != undefined && Haditem.typeId == typeId ){
			c += player.getComponent("inventory").container.getItem(j).amount;
		}
	}
	return c;
}
async function RaidSpawner(flag,type,wave) {
	const R = 64;
	const thita = Math.PI * 2 * Math.random();
	const L = flag.location;
	const baseLocation = { 
		x:L.x + R * Math.cos(thita),
		y:L.y,
		z:L.z + R * Math.sin(thita)
	}
	await flag.runCommand(`tickingarea remove raidSpawner`);
	await flag.runCommand(`tickingarea add circle ${Math.floor(baseLocation.x)} ${Math.floor(baseLocation.y)} ${Math.floor(baseLocation.z)} 1 raidSpawner false`);
	await system.waitTicks(2);
	const d = flag.dimension;
	const raid = raidData[`${type}`][`${wave}`];
	for( let c of raid ){
		for( let i = 0; i < c["counts"]; i++ ){
			let type = c["type"];
			let gun = c["gun"];
			let armor = c["armor"];
			let isBoss = c["isBoss"];
			let Ench = c["Ench"];
			const Radius = 8 * Math.random();
			const thita_i = Math.PI * 2 * Math.random();
			const summonLocation = { 
				x:baseLocation.x + Radius * Math.cos(thita_i),
				y:baseLocation.y + 10,
				z:baseLocation.z + Radius * Math.sin(thita_i)
			}
			const cont = d.spawnEntity(type,summonLocation);
			cont.triggerEvent(`gvcv5:entity_spawned_raid`);
			cont.addTag(`raid`);
			if( gun != undefined ){
				cont.triggerEvent(gun);
			}
			if( armor != undefined ){
				cont.addTag(armor);
				cont.runCommand(`function armor/${armor}`);
			}
			if( isBoss != undefined ){
				if( isBoss ){
					cont.addEffect("health_boost",9999999,{ amplifier: 10 } );
					cont.addEffect("instant_health",1,{ amplifier: 255 } );
					cont.nameTag = `Raid Boss`
				}
			}
			if( Ench != undefined ){
				for( let e of Ench ){
					let Id = e["id"];
					let Lv = e["lv"];
					cont.setDynamicProperty(`Ench_${Id}`,Lv);
					cont.runCommand(`enchant @s ${Id} ${Lv}`);
				}
			}
		}
	}
	await system.waitTicks(2);
	flag.runCommand(`tickingarea remove raidSpawner`);
}
function setArmorValue( itemName ){
	if( itemName.includes("leather") ){ return 0.05 }
	else if( itemName.includes("chainmail") ){ return 0.1 }
	else if( itemName.includes("iron") ){ return 0.15 }
	else if( itemName.includes("golden") ){ return 0.15 }
	else if( itemName.includes("diamond") ){ return 0.225 }
	else if( itemName.includes("plastic") ){ return 0.2 }
	else if( itemName.includes("ghilliesuit") ){ return 0.05 }
	else if( itemName.includes("trench") ){ return 0.15 }
	else if( itemName.includes("mghelmet") ){ return 0.15 }
	else if( itemName.includes("firemask") ){ return 0.05 }
	else if( itemName.includes("droneguided") ){ return 0.15 }
	else if( itemName.includes("copper") ){ return 0.25 }
	else if( itemName.includes("netherite") ){ return 0.25 }
	else { return 0 }
}
function summonAirbone(projectile,location,Radius,Height,Sigma,team ){
	const rad = Sigma * Math.PI / 180;
	const spawnPoint = { 
		x: location.x + Radius * -Math.sin(rad),
		y: location.y + Height,
		z: location.z + Radius * Math.cos(rad) 
	};
	const airbone = projectile.dimension.spawnEntity(`gvcv5:ca`,spawnPoint,{ spawnEvent:`minecraft:spawned_from_air`});
	airbone.teleport( airbone.location, {rotation: projectile.getRotation() } )
	if( team != `noteam` ){
		airbone.triggerEvent(`gvcv5:become_${team}team`);
	}
	return airbone
}
function airbone1( projectile,team ){
	const owner = projectile.getComponent(`projectile`).owner;
	const location = projectile.location;
	const S = owner.getRotation().y;
	projectile.teleport( projectile.location, {rotation: owner.getRotation() } )
	for( let i = -3; i < 4; i++ ){
		summonAirbone( projectile,location,i*5,10*i+60,S,team);
	}
}
function airbone2( projectile,team ){
	const owner = projectile.getComponent(`projectile`).owner;
	const S = owner.getRotation().y;
	const rad = S * Math.PI / 180;
	const location = projectile.location;
	const location1 = { 
		x: projectile.location.x + 5 * -Math.sin(rad+Math.PI/2),
		y: projectile.location.y,
		z: projectile.location.z + 5 * Math.cos(rad+Math.PI/2) 
	};
	const location2 = { 
		x: projectile.location.x + 5 * -Math.sin(rad-Math.PI/2),
		y: projectile.location.y,
		z: projectile.location.z + 5 * Math.cos(rad-Math.PI/2) 
	};
	projectile.teleport( projectile.location, {rotation: owner.getRotation() } )
	for( let i = -3; i < 4; i++ ){
		summonAirbone( projectile,location1,i*5,10*i+60,S,team);
		summonAirbone( projectile,location2,i*5,10*i+60,S,team);
	}
	const ride = summonAirbone( projectile,location,0,60,S,team);
	ride.runCommand(`ride @s summon_ride vehicle:fv101 reassign_rides minecraft:spawned_from_air`);
}
function airbone3( projectile,team ){
	const owner = projectile.getComponent(`minecraft:projectile`).owner;
	const S = owner.getRotation().y;
	const rad = S * Math.PI / 180;
	const location = projectile.location;
	const location1 = { 
		x: projectile.location.x + 5 * -Math.sin(rad+Math.PI/2),
		y: projectile.location.y,
		z: projectile.location.z + 5 * Math.cos(rad+Math.PI/2) 
	};
	const location2 = { 
		x: projectile.location.x + 5 * -Math.sin(rad-Math.PI/2),
		y: projectile.location.y,
		z: projectile.location.z + 5 * Math.cos(rad-Math.PI/2) 
	};
	projectile.teleport( projectile.location, {rotation: owner.getRotation() } )
	for( let i = -4; i < 5; i++ ){
		summonAirbone( projectile,location1,i*5,10*i+80,S,team);
		summonAirbone( projectile,location,i*5,10*i+80,S,team);
		summonAirbone( projectile,location2,i*5,10*i+80,S,team);
	}
	const ride = summonAirbone( projectile,location,0,80,S,team);
	ride.runCommand(`ride @s summon_ride vehicle:fv101 reassign_rides minecraft:spawned_from_air`);
	const ride1 = summonAirbone( projectile,location1,-12.5,60,S,team);
	ride1.runCommand(`ride @s summon_ride vehicle:fv101 reassign_rides minecraft:spawned_from_air`);
	const ride2 = summonAirbone( projectile,location2,12.5,100,S,team);
	ride2.runCommand(`ride @s summon_ride vehicle:fv101 reassign_rides minecraft:spawned_from_air`);
}
function missile( projectile,level,team ){
	projectile.dimension.spawnParticle(`zex:${team}_ring1`,projectile.location);
	const location = { 
		x: projectile.location.x,
		y: 320,
		z: projectile.location.z
	};
	const missile = projectile.dimension.spawnEntity(`gvcv5:drop${level}_${team}`,location);
}

async function airstrike(projectile,level,team){
	const dimension = projectile.dimension;
	projectile.dimension.spawnParticle(`zex:${team}_ring1`,projectile.location);
	let Radius = Math.random() * 4 * level * level;
	let Sigma = Math.random() * 2 * Math.PI;
	const location = { 
		x: projectile.location.x,
		y: 320,
		z: projectile.location.z
	}
	let spawnPointLocation = location;
	const num = Math.pow(5,level);
	for( let i = 0; i < num; i++ ){
		for( let j = 0; j < level; j++ ){
			dimension.spawnEntity(`gvcv5:airstrike_${team}`,spawnPointLocation);
			Radius = Math.random() * 4  * level * level;
			Sigma = Math.random() * 2 * Math.PI;
			spawnPointLocation = { 
				x: location.x + Radius * Math.cos(Sigma),
				y: 320,
				z: location.z + Radius * Math.sin(Sigma)
			}
		}
		await system.waitTicks((4-level)*(4-level));
		
	}
}

function haunebBeam(projectile,level,team){
	const dimension = projectile.dimension;
	projectile.dimension.spawnParticle(`zex:${team}_ring1`,projectile.location);
	const location = { 
		x: projectile.location.x,
		y: projectile.location.y + 24,
		z: projectile.location.z
	}
	let spawnPointLocation = location;
	const hauneb = dimension.spawnEntity(`gvcv5:hauneb_allied`,spawnPointLocation);
	if( team != `noteam` ){
		for( let i = 0; i < 5; i++ ){
			hauneb.runCommand(`ride @s summon_rider gvcv5:pmc_${team} hauneb_main aaa`);
		}
	}
	else{
		for( let i = 0; i < 5; i++ ){
			hauneb.runCommand(`ride @s summon_rider gvcv5:pmc hauneb_main aaa`);
		}
	}
	
}

world.afterEvents.entitySpawn.subscribe( async e => {
	if( e.entity.typeId.includes("fire")  ){
		const projectile = e.entity;
		try {
			const player = projectile.getComponent(EntityComponentTypes.Projectile).owner;
			//print(`${player.getDynamicProperty(`lastFire`)}`)
			if( player.typeId != `minecraft:player` && player.getEffect(`blindness`) != undefined ){
				projectile.remove();
			}
			else{
				if( player.getProperty(`zex:burrel`) == 1 && !player.hasTag(`isRiding`) && !player.hasTag(`ride`) && !player.getDynamicProperty(`lastFire`) ){
					player.setDynamicProperty(`lastFire`,true)
					projectile.dimension.playSound(`fire.supu`,projectile.location,{ volume:0.5 });	
					await system.waitTicks(1);
					player.setDynamicProperty(`lastFire`,false);
				}
				else if( !player.getDynamicProperty(`lastFire`)){
					player.setDynamicProperty(`lastFire`,true)
					const gunName = getGunProjectlie(projectile.typeId);
					projectile.dimension.playSound(`fire.${gunData[`${gunName}`][`sound`]}`,projectile.location,{ volume:128 });	
					await system.waitTicks(1);
					player.setDynamicProperty(`lastFire`,false);
				}
				else if( player.getDynamicProperty(`lastFire`)){
					await system.waitTicks(1);
					player.setDynamicProperty(`lastFire`,false);
				}
				if( player.typeId == `minecraft:player` && !player.hasTag("isRiding") && !player.hasTag(`ride`) ){
					const gun = player.getComponent(EntityComponentTypes.Equippable).getEquipmentSlot(EquipmentSlot.Mainhand);
					const ench = gun.getItem().getComponent(ItemComponentTypes.Enchantable);
					if( ench.hasEnchantment(`minecraft:flame`) || player.getProperty(`zex:bullet`) == 6 && !player.hasTag("isRiding") ){
						projectile.setOnFire(10,true);
					}
				}
				else {
					if( (player.getDynamicProperty(`Ench_flame`) != undefined || player.getProperty(`zex:bullet`) == 6)  && !player.hasTag(`isRiding`) ){
						projectile.setOnFire(10,true);
					}
				}

				if( player.typeId != `minecraft:player` && player.hasTag(`ride`) ){
					const ride = player.dimension.getEntities({location:player.location,families:[ `air` ],maxDistance:4,closest:1})[0];
					if( ride != undefined ){
						const V = projectile.getVelocity()
						let vx = turning2( getVector3E(V),getVector3E(ride.getViewDirection()),Math.PI/12 )
						//print(`a`)
						projectile.applyImpulse(vx);

					}
					else{
						//print(`b`)
					}
				}
			}
		}
		catch{}

	}
} )

world.afterEvents.projectileHitEntity.subscribe( e => {
	if( e.projectile.typeId.includes("fire")){
		let vict = e.getEntityHit().entity;
		let def = 0;
		const gunName = getGunProjectlie(e.projectile.typeId);
		const owner = e.source;

		//print(`e:${e.projectile.typeId}`)
		//print(`o:${getGunProjectlie(e.projectile.typeId)}`)
		let damageType = gunData[`${gunName}`][`damageType`];
		let damageIgnoreDef = gunData[`${gunName}`][`damageIgnoreDef`];
		const equipmentComp = vict.getComponent(EntityComponentTypes.Equippable)

		if(  owner.getProperty(`zex:bullet`) == 2  ){
			damageType = EntityDamageCause.entityExplosion;
			damageIgnoreDef = 2;
		}
		if(  owner.getProperty(`zex:bullet`) == 5  ){
			damageType = EntityDamageCause.entityExplosion;
			damageIgnoreDef = 2;
		}
		if(  owner.getProperty(`zex:bullet`) == 6  ){
			damageType = EntityDamageCause.selfDestruct;
			damageIgnoreDef = 3;
		}

		if( equipmentComp && vict.typeId == "minecraft:player" ){
			const slots = [ EquipmentSlot.Head,EquipmentSlot.Chest,EquipmentSlot.Legs,EquipmentSlot.Feet ];
			for( const slot of slots ){
				if( equipmentComp.getEquipment(slot) != undefined ){ 
					def = def + setArmorValue(equipmentComp.getEquipmentSlot(slot).typeId)
				}
			}
		}
		
		else if( vict.getProperty(`zex:anti_bullet`) != undefined ){
			def += vict.getProperty(`zex:anti_bullet`);
			//print(`${vict.getProperty(`zex:anti_bullet`)}`)
		}
		//print(`${vict.getProperty(`zex:anti_bullet`)}`)
		//print(`${vict.getProperty(`zex:bullet_resistance`)}`);
		//if( vict.getComponent(EntityComponentTypes.TypeFamily).hasTypeFamily(`pmc`) ){
		//	def += 0.8;
		//}
		if( vict.getEffect("resistance") != undefined ){
			def = def + (1 + vict.getEffect("resistance").amplifier) * 0.5;
		}
		if( vict.getProperty(`zex:tank`) > damageIgnoreDef ){
			def = 999;
		}
		//if (def > 1){ def = 1 }

		//headshot (1.5 times)
		if( e.location.y - vict.location.y > 1.5 && headshotTypes.includes(vict.typeId) ){
			def = def - 0.5;//armor ignore

			if( e.source.typeId == "minecraft:player" ){
				e.dimension.playSound(`note.bell`,e.source.location,{ volume:1, pitch:2 });
			}
			if(  vict.typeId == "minecraft:player" ){
				def = def + (1.8*setArmorValue(equipmentComp.getEquipmentSlot(EquipmentSlot.Head).typeId)); //head armor effect
			}
			e.source.setDynamicProperty(`gvcv5:headshot`,1);
			e.source.runCommand(`title @s subtitle §4HEADSHOT§r`);
		}
		//feet shot (0.75 times)
		else if( e.location.y - vict.location.y < 0.75 && headshotTypes.includes(vict.typeId) ){
			def = def + 0.25;//armor effect 25% more on feet shot
			e.source.setDynamicProperty(`gvcv5:headshot`,0);
		}
		//Body
		else{
			e.source.setDynamicProperty(`gvcv5:headshot`,0);
		}
		
		if (def > 1){ def = 1 }

		//get Damage
		let damage = gunData[`${gunName}`][`damage`];

		//Ench
		if( owner.typeId == `minecraft:player` && !owner.hasTag("isRiding") ){
			const gun = owner.getComponent(EntityComponentTypes.Equippable).getEquipmentSlot(EquipmentSlot.Mainhand);
			const ench = gun.getItem().getComponent(ItemComponentTypes.Enchantable);
			if( ench.hasEnchantment(`minecraft:power`) ){
				const level = ench.getEnchantment(`minecraft:power`).level;
				damage = damage * 0.25 * (level + 5);
			}
		}
		
		//Damage Ratio
		if ( vict.typeId == "minecraft:player" ){ 
			damage = damage * world.getDynamicProperty("gvcv5:playerDamage");
		}
		else{
			damage = damage * world.getDynamicProperty("gvcv5:mobDamage");
		}
		if( owner.typeId != `minecraft:player` && owner.getEffect(`blindness`) != undefined ){
			damage = 0;
		}

		//final damage
		//print(`${owner.getProperty(`zex:bullet`)}`)
		if( owner.getProperty(`zex:bullet`) == 1 && !owner.hasTag("isRiding") ){
			damage = 2 * damage * (1 - def) * (1 - def);
		}
		else if( owner.getProperty(`zex:bullet`) == 3 && !owner.hasTag("isRiding") ){
			damage = 0;
			vict.addEffect("slowness", 200,{ amplifier: 10 });
			vict.addEffect("blindness", 200,{ amplifier: 1 });
			vict.addEffect("weakness", 200,{ amplifier: 255 });
		}
		else{
			damage = damage * (1 - def);
		}
		//if( damage <= 0 ){ damage = 0.001; }
		//print(`def:${def} damage:${damage}`);

		if( e.source.typeId == "minecraft:player" ){ printDamage(e.source,damage,vict); }
		if( world.getDynamicProperty("gvcv5:nodiein1hit") && vict.typeId == "minecraft:player" && damage > 20 ){
			vict.applyDamage(10,{ cause: EntityDamageCause.entityAttack,damagingEntity: e.source });
		}
		if( damageType == `override` && world.getDynamicProperty("gvcv5:playerDamageCool") && vict.typeId == "minecraft:player" ){
			vict.applyDamage(damage,{ cause: EntityDamageCause.entityAttack,damagingEntity: e.source });
		}
		else{
			vict.applyDamage(damage,{ cause: damageType,damagingEntity: e.source });
		}
		vict.applyKnockback({x:0,z:0},0);
		
		if( damageType == EntityDamageCause.entityExplosion || damageIgnoreDef >= 1 ){
			e.source.dimension.spawnEntity(e.projectile.typeId,vict.location,{ spawnEvent:`minecraft:explode` });
		}
			
		

		try{
			e.projectile.teleport(vict.location);
			e.projectile.triggerEvent("minecraft:explode");
			e.projectile.remove();
		}
		catch( error ){
		}

	}
})

world.afterEvents.projectileHitBlock.subscribe( e => {
	const projectile = e.projectile;
	if( projectile.typeId.includes(`gre`)){
		if( projectile.getComponent(`projectile`).owner != undefined ){
			const player = projectile.getComponent(`projectile`).owner
			let team
			if( player.hasTag(`red`) ){ team = `red`; }
			else if( player.hasTag(`blue`) ){ team = `blue`; }
			else if( player.hasTag(`green`) ){ team = `green`; }
			else if( player.hasTag(`yellow`) ){ team = `yellow`; }
			else { team = `noteam`; }
			if( projectile.typeId == `gre:airborne1` ){ airbone1( projectile,team ); }
			else if( projectile.typeId == `gre:airborne2` ){ airbone2( projectile,team ); }
			else if( projectile.typeId == `gre:airborne3` ){ airbone3( projectile,team ); }
			else if( projectile.typeId == `gre:missile1` ){ missile( projectile,1,team ); }
			else if( projectile.typeId == `gre:missile2` ){ missile( projectile,2,team ); }
			else if( projectile.typeId == `gre:missile3` ){ missile( projectile,3,team ); }
			else if( projectile.typeId == `gre:airstrike1` ){ airstrike( projectile,1,team ); }
			else if( projectile.typeId == `gre:airstrike2` ){ airstrike( projectile,2,team ); }
			else if( projectile.typeId == `gre:airstrike3` ){ airstrike( projectile,3,team ); }
			else if( projectile.typeId == `gre:hauneb_beam` ){ haunebBeam( projectile,3,team ); }
		}
	}
})

system.runInterval( () => {
	world.getDimension(`minecraft:overworld`).runCommand(`execute as @a[tag=MissileAlert] run function missileAlert`);
},20)

system.afterEvents.scriptEventReceive.subscribe( async  e => {
	if( e.id == "zex:aamissile"){
		const missile = e.sourceEntity;
		const player = missile.getComponent("projectile").owner;
		const intFamily = player.getComponent(`minecraft:type_family`).getTypeFamilies();
		const excludeList = [ "player","playerp","mod","mob" ];
		const allies = intFamily.filter(char => !excludeList.includes(char));
		let team = `noteam`;
		if( player.hasTag(`red`) ){ team = `red`; }
		else if( player.hasTag(`blue`) ){ team = `blue`; }
		else if( player.hasTag(`green`) ){ team = `green`; }
		else if( player.hasTag(`yellow`) ){ team = `yellow`; }

		const target = missile.dimension.getEntities( { 
			tags:[ `air` ],
			excludeNames:[ `${player.nameTag}` ],
			excludeTags:[ `${team}` ],
			excludeFamilies:allies,
			location:missile.location,
			maxDistance:128,
			closest: 1
		 } );

		if( target.length > 0 ){
			const P0 = missile.location;
			const Pi = target[0].location;
			target[0].runCommand(`tag @s add MissileAlert`);
			target[0].runCommand(`playsound sound.alert1 @s`);


			const ri = Math.sqrt( (Pi.x - P0.x) * (Pi.x - P0.x) + ( Pi.y - P0.y ) * ( Pi.y - P0.y ) + ( Pi.z - P0.z ) * ( Pi.z - P0.z ) );
			const dx = (Pi.x - P0.x) / ri;
			const dy = (Pi.y - P0.y) / ri;
			const dz = (Pi.z - P0.z) / ri;
			const v = missile.getVelocity();
			const abs_v = 2.5;
			missile.clearVelocity();
			missile.applyImpulse( { 
				x: dx * abs_v,
				y: dy * abs_v,
				z: dz * abs_v
			 } )
		}
		else{
			const V_m = missile.getVelocity();
			const V_ma = Math.sqrt(V_m.x*V_m.x + V_m.y*V_m.y + V_m.z*V_m.z);
			const V = player.getViewDirection();
			missile.clearVelocity();
			missile.applyImpulse( { 
				x: V.x * 2.5,
				y: V.y * 2.5,
				z: V.z * 2.5
			} )

		}
	}
	else if( e.id == "zex:horming"){
		const missile = e.sourceEntity;
		const gunName = getGunProjectlie(missile.typeId);
		const maxSpeed = gunData[`${gunName}`]["speed"];
		if( missile.isValid ){
			if( missile.getDynamicProperty(`age`) == undefined ){
				missile.setDynamicProperty(`age`,0);
			}
			else if( missile.getDynamicProperty(`age`) <= 20 ){
				missile.setDynamicProperty(`age`,1+missile.getDynamicProperty(`age`));
			}
			const age = missile.getDynamicProperty(`age`);
			const entity = missile.getComponent("projectile").owner;
			let target = [];
			let team = `noteam`;
			if( entity.hasTag(`red`) ){ team = `red`; }
			else if( entity.hasTag(`blue`) ){ team = `blue`; }
			else if( entity.hasTag(`green`) ){ team = `green`; }
			else if( entity.hasTag(`yellow`) ){ team = `yellow`; }
			if( entity.typeId == "minecraft:player" ){
				target = missile.dimension.getEntities( { 
					tags:[ `Tof${entity.nameTag}` ]
				} );
			}
			else{
				world.sendMessage(`${entity.target.typeId}`)
				if( entity.target != undefined ){ 
					target.push(entity.target); 
				}
			}

			if( target.length > 0 ){
				const P0 = missile.location;
				const Pi = target[0].location;
				target[0].runCommand(`tag @s add MissileAlert`);
				target[0].runCommand(`playsound sound.alert1 @s`);
				const ri = Math.sqrt( (Pi.x - P0.x) * (Pi.x - P0.x) + ( Pi.y - P0.y ) * ( Pi.y - P0.y ) + ( Pi.z - P0.z ) * ( Pi.z - P0.z ) );
				const dx = (Pi.x - P0.x) / ri;
				const dy = (Pi.y - P0.y) / ri;
				const dz = (Pi.z - P0.z) / ri;
				const v = missile.getVelocity();
				const abs_v = maxSpeed;
				missile.clearVelocity();
				missile.applyImpulse( { 
					x: dx * abs_v,
					y: dy * abs_v + ( 20 - age ) * 0.05,
					z: dz * abs_v
				} )
			}
			else{
				const V_m = missile.getVelocity();
				const V_ma = Math.sqrt(V_m.x*V_m.x + V_m.y*V_m.y + V_m.z*V_m.z);
				const V = entity.getViewDirection();
				missile.clearVelocity();
				missile.applyImpulse( { 
					x: V.x * maxSpeed * 0.5,
					y: V.y * maxSpeed * 0.5,
					z: V.z * maxSpeed * 0.5
				} )

			}
		}
	}
	else if( e.id == "zex:view"){
		const view = e.sourceEntity.getRotation();
		world.sendMessage(`x:${view.x} y:${view.y}`);
		
	}
	else if (e.id === "gvcv5:raid"){
		const type = e.message.split(` `)[0];
		const wave = e.message.split(` `)[1];
		const flag = e.sourceEntity;
		RaidSpawner(flag,type,wave);
	}

	else if( e.id == "zex:start" ){
		const buildingS = Number(world.getDynamicProperty(`gvcv5:buildingSpawnS`))
		const buildingM = Number(world.getDynamicProperty(`gvcv5:buildingSpawnM`))
		const buildingL = Number(world.getDynamicProperty(`gvcv5:buildingSpawnL`))
		const buildingA = Number(world.getDynamicProperty(`gvcv5:buildingSpawnA`))
		e.sourceEntity.runCommand(`scoreboard players set S building ${buildingS}`);
		e.sourceEntity.runCommand(`scoreboard players set M building ${buildingM}`);
		e.sourceEntity.runCommand(`scoreboard players set L building ${buildingL}`);
		e.sourceEntity.runCommand(`scoreboard players set A building ${buildingA}`);
	}
	else if (e.id === "gvcv5:gunUse"){
		//tag=!reload,tag=!down
		const player = e.sourceEntity;
		const gunName = e.message;
		const gun = player.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Mainhand);
		const dmgCom = gun.getComponent(ItemComponentTypes.Durability);
		const damage = dmgCom.damage;
		const maxAmmo = dmgCom.maxDurability;
		let usedGun = player.getDynamicProperty(`gvcv5:gunUsed`);
		const ench = gun.getComponent(ItemComponentTypes.Enchantable);
		if( usedGun == undefined ){
			usedGun = 0;
		}
		if( damage + usedGun < maxAmmo && !player.hasTag(`reload`) && !player.hasTag(`down`) ){
			
			if( ench.hasEnchantment(`minecraft:unbreaking`) ){
				const level = ench.getEnchantment(`minecraft:unbreaking`).level;
				if( Math.random() < 1/level ){
					player.setDynamicProperty(`gvcv5:gunUsed`,usedGun+1);
				}
			}
			else{
				player.setDynamicProperty(`gvcv5:gunUsed`,usedGun+1);
			}
			
			const recoilValue = gunData[`${gunName}`][`recoil`] + getrecoilResistance(player.getProperty(`zex:grip`));
			if( recoilValue > 0 ){
				recoil(player,recoilValue);
			}
			if( player.getProperty(`zex:bullet`) == 4 ){
				player.triggerEvent(`fire:${gunName}_srag`);
			}
			else if( player.getProperty(`zex:bullet`) == 5 ){
				player.triggerEvent(`fire:${gunName}_frag`);
			}
			else if( player.getProperty(`zex:bullet`) == 6 ){
				player.triggerEvent(`fire:${gunName}_db`);
			}
			else{
				player.triggerEvent(`fire:${gunName}`);
			}
			try{
				if( player.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Offhand).typeId == `gun:${gunName}` ){
					await system.waitTicks(2);
					player.triggerEvent(`fire:${gunName}_l`);
				}
			}catch{}
		}
	}
	else if (e.id === "gvcv5:pistolUse"){
		//tag=!reload,tag=!down
		const player = e.sourceEntity;
		const gunName = e.message;
		const gun = player.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Mainhand);
		const dmgCom = gun.getComponent(ItemComponentTypes.Durability);
		const damage = dmgCom.damage;
		const maxAmmo = dmgCom.maxDurability;
		let usedGun = player.getDynamicProperty(`gvcv5:gunUsed`);
		const ench = gun.getComponent(ItemComponentTypes.Enchantable);
		if( usedGun == undefined ){
			usedGun = 0;
		}
		if( damage + usedGun < maxAmmo && !player.hasTag(`pistolreload`)&& !player.hasTag(`down`) ){
			
			if( ench.hasEnchantment(`minecraft:unbreaking`) ){
				const level = ench.getEnchantment(`minecraft:unbreaking`).level;
				if( Math.random() < 1/level ){
					player.setDynamicProperty(`gvcv5:gunUsed`,usedGun+1);
				}
			}
			else{
				player.setDynamicProperty(`gvcv5:gunUsed`,usedGun+1);
			}
			player.triggerEvent(`fire:${gunName}`);
			try{
				if( player.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Offhand).typeId == `gun:${gunName}` ){
					await system.waitTicks(2);
					player.triggerEvent(`fire:${gunName}`);
				}
			}catch{}
		}
	}
	else if (e.id === "gvcv5:gunapply"){
		//tag=!reload,tag=!down
		const player = e.sourceEntity;
		const gunName = e.message;
		if( player.getDynamicProperty(`gvcv5:gunUsed`) == undefined ){
			player.setDynamicProperty(`gvcv5:gunUsed`,0);
		}
		const gunUsed = player.getDynamicProperty(`gvcv5:gunUsed`);
		const gun = player.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Mainhand);
		const dmgCom = gun.getComponent(ItemComponentTypes.Durability);
		const damage = dmgCom.damage;
		const maxAmmo = dmgCom.maxDurability;
		const newDamage = damage + gunUsed;
		if( newDamage < maxAmmo ){
			gun.getComponent(ItemComponentTypes.Durability).damage = newDamage;
			player.getComponent("minecraft:inventory").container.setItem(player.selectedSlotIndex, gun);
			player.setDynamicProperty(`gvcv5:gunUsed`,0);
		}
		else{
			gun.getComponent(ItemComponentTypes.Durability).damage = maxAmmo;
			player.getComponent("minecraft:inventory").container.setItem(player.selectedSlotIndex, gun);
			player.setDynamicProperty(`gvcv5:gunUsed`,newDamage - maxAmmo);
		}
		try{
			if( player.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Offhand).typeId == gun.typeId ){
				let gunOff = player.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Offhand);
				gunOff.getComponent(ItemComponentTypes.Durability).damage = gun.getComponent(ItemComponentTypes.Durability).damage;
				await system.waitTicks(2);
				player.getComponent(EntityComponentTypes.Equippable).getEquipmentSlot(EquipmentSlot.Offhand).setItem(gunOff);
			}
		}catch{}
	}
	else if (e.id === "zex:chkattack"){
		const player = e.sourceEntity;

		const gunId = player.getComponent(EntityComponentTypes.Equippable).getEquipmentSlot(EquipmentSlot.Mainhand).typeId;
		const gunName = gunId.split(`:`)[1];
		const gunSlot = player.getComponent(EntityComponentTypes.Equippable).getEquipmentSlot(EquipmentSlot.Mainhand);
		//print(`${gunName},${gunId}`);
		if( gunId.split(`:`)[0] != `gun` ){
			player.setProperty(`zex:sights`,0);
			player.setProperty(`zex:burrel`,0);
			player.setProperty(`zex:light`,0);
			player.setProperty(`zex:grip`,0);
			player.setProperty(`zex:bullet`,0);
			return;
		}

		if( gunSlot.getDynamicProperty("zex:sights") != undefined ){
			const scope = gunSlot.getDynamicProperty("zex:sights");
			player.setProperty(`zex:sights`,scope);
		}
		else if( gunAttach[`${gunName}`][`sights`] != undefined && !Array.isArray(gunAttach[`${gunName}`][`sights`]) && gunAttach[`${gunName}`][`sights`] != 0  ){
			player.setProperty(`zex:sights`,gunAttach[`${gunName}`][`sights`]);
		}
		else{
			player.setProperty(`zex:sights`,0);
		}
		if( gunSlot.getDynamicProperty("zex:burrel") != undefined ){
			const scope = gunSlot.getDynamicProperty("zex:burrel");
			player.setProperty(`zex:burrel`,scope);
		}
		else if( gunAttach[`${gunName}`][`burrel`] != undefined && !Array.isArray(gunAttach[`${gunName}`][`burrel`]) && gunAttach[`${gunName}`][`burrel`] != 0  ){
			player.setProperty(`zex:burrel`,gunAttach[`${gunName}`][`burrel`]);
		}
		else{
			player.setProperty(`zex:burrel`,0);
		}
		if( gunSlot.getDynamicProperty("zex:light") != undefined ){
			const scope = gunSlot.getDynamicProperty("zex:light");
			player.setProperty(`zex:light`,scope);
		}
		else if( gunAttach[`${gunName}`][`light`] != undefined && !Array.isArray(gunAttach[`${gunName}`][`light`]) && gunAttach[`${gunName}`][`light`] != 0  ){
			player.setProperty(`zex:light`,gunAttach[`${gunName}`][`light`]);
		}
		else{
			player.setProperty(`zex:light`,0);
		}
		if( gunSlot.getDynamicProperty("zex:grip") != undefined ){
			const scope = gunSlot.getDynamicProperty("zex:grip");
			player.setProperty(`zex:grip`,scope);
		}
		else if( gunAttach[`${gunName}`][`grip`] != undefined && !Array.isArray(gunAttach[`${gunName}`][`grip`]) && gunAttach[`${gunName}`][`grip`] != 0  ){
			player.setProperty(`zex:grip`,gunAttach[`${gunName}`][`grip`]);
		}
		else{
			player.setProperty(`zex:grip`,0);
		}
		if( gunSlot.getDynamicProperty("zex:bullet") != undefined ){
			const scope = gunSlot.getDynamicProperty("zex:bullet");
			player.setProperty(`zex:bullet`,scope);
		}
		else if( gunAttach[`${gunName}`][`bullet`] != undefined && !Array.isArray(gunAttach[`${gunName}`][`bullet`]) && gunAttach[`${gunName}`][`bullet`] != 0  ){
			player.setProperty(`zex:bullet`,gunAttach[`${gunName}`][`bullet`]);
		}
		else{
			player.setProperty(`zex:bullet`,0);
		}
	}
	else if (e.id === "gvcv5:vgun"){
		let player = e.sourceEntity;
		const gunName = e.message;
		const Ammo = gunData[`${gunName}`]["bullet"];
		const slow = gunData[`${gunName}`]["slowness"];
		const gunSlot = player.getComponent(EntityComponentTypes.Equippable).getEquipmentSlot(EquipmentSlot.Mainhand);
		let gun = player.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Mainhand);
		const dmgCom = gun.getComponent(ItemComponentTypes.Durability);
		let damage = dmgCom.damage;
		let maxAmmo = dmgCom.maxDurability;
		let usedGun = player.getDynamicProperty(`gvcv5:gunUsed`);
		//print(`${(usingGun)}`)

		try{
			if( player.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Offhand).typeId == gun.typeId ){
				let gunOff = player.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Offhand);
				const dmgComOff = gunOff.getComponent(ItemComponentTypes.Durability);
				damage = damage + dmgComOff.damage;
				maxAmmo = maxAmmo * 2;
			}
		}catch{}

		if( usedGun == undefined ){
			usedGun = 0;
		}
		if( slow > 0 ){
			player.addEffect("slowness", 5,{ amplifier: slow });
		}
		if( !player.hasTag(`reload`) && !player.hasTag(`down`) && !player.hasTag(`isRiding`) ){
			player.runCommand(`titleraw @s actionbar {\"rawtext\":[{\"translate\":\"script.gvcv5:${Ammo}.name\"},{\"text\":\" ${maxAmmo-usedGun-damage}/${maxAmmo} ${getInventoryItem(player, Ammo)}\"}]}`)
		}
		if( damage >= maxAmmo && gunData[`${gunName}`]["fireOnReload"] == true ){
			player.runCommand(`execute if entity @s[tag=autoReload,tag=!reload,tag=!down,hasitem={item=${Ammo}}] run scriptevent gvcv5:reload ${gunName}`);
			player.addTag(`pistolreload`);
		}
		else if( damage >= maxAmmo ){
			player.runCommand(`execute if entity @s[tag=autoReload,tag=!reload,tag=!down,hasitem={item=${Ammo}}] run scriptevent gvcv5:reload ${gunName}`);
		}
		
		

	}
	else if (e.id === "gvcv5:hgun"){
		//tag=!reload,tag=!down
		//titleraw @s[tag=!reload,tag=!down] actionbar {{\"rawtext\":[{{\"text\":\"{1} \"}},{{\"score\":{{\"name\":\"@s\",\"objective\":\"{0}\"}}}},{{\"text\":\"/{2}\"}}]}}
		//f.write("execute if entity @s[tag=autoReload,tag=!reload,tag=!down,scores={{{0}=0}},hasitem={{item={1}}}] run scriptevent gvcv5:reload {0}\n".format(gun_id,gun_ammo))
		const player = e.sourceEntity;
		const gunName = e.message;
		const Ammo = gunData[`${gunName}`]["bullet"];
		let gun = player.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Mainhand);
		const dmgCom = gun.getComponent(ItemComponentTypes.Durability);
		const damage = dmgCom.damage;
		const maxAmmo = dmgCom.maxDurability;
		let usedGun = player.getDynamicProperty(`gvcv5:gunUsed`);
		
		if( usedGun == undefined ){
			usedGun = 0;
		}
		if( player.isSneaking && !player.hasTag(`reload`) && !player.hasTag(`down`) && !player.hasTag(`isRiding`) ){
			const Targetv = player.getEntitiesFromViewDirection( {families:[ `vehicle` ],ignoreBlockCollision:false} );
			const Targetm = player.getEntitiesFromViewDirection( {families:[ `mob` ],ignoreBlockCollision:false} );
			const Targetp = player.getEntitiesFromViewDirection( {families:[ `player` ],ignoreBlockCollision:false} );
			const Target = Targetm.concat(Targetp).concat(Targetv)
			if( Target[0] != undefined ){
				const name = player.nameTag;
				player.runCommand(`tag @e remove "Tof${name}"`);
				Target[0].entity.addTag(`Tof${name}`);
				if( Target[0].entity.nameTag == undefined || Target[0].entity.nameTag == `` ){
					player.runCommand(`titleraw @s actionbar {\"rawtext\":[{\"text\":\"§eFind target:\"},{\"translate\":\"entity.${Target[0].entity.typeId.replace(`minecraft:`,``)}.name\"}]}`);
				}
				else{
					player.runCommand(`titleraw @s actionbar {\"rawtext\":[{\"text\":\"§eFind target:${Target[0].entity.nameTag}\"}]}`);
				}
			}
			else{
				player.runCommand(`titleraw @s actionbar {\"rawtext\":[{\"text\":\"§cNo Target\"}]}`);
			}
		}
		else if( !player.hasTag(`reload`) && !player.hasTag(`down`) && !player.hasTag(`isRiding`) ){
			player.runCommand(`titleraw @s actionbar {\"rawtext\":[{\"translate\":\"script.gvcv5:${Ammo}.name\"},{\"text\":\" ${maxAmmo-usedGun-damage}/${maxAmmo} ${getInventoryItem(player, Ammo)}\"}]}`)
		}
		if( damage >= maxAmmo ){
			player.runCommand(`execute if entity @s[tag=autoReload,tag=!reload,tag=!down,hasitem={item=${Ammo}}] run scriptevent gvcv5:reload ${gunName}`);
		}
	}
	else if (e.id === "gvcv5:reload"){
		const p = e.sourceEntity;
		const gunName = e.message;
		let gun = p.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Mainhand);
		const dmgCom = gun.getComponent(ItemComponentTypes.Durability)
		const damage = dmgCom.damage;
		const isOffhand = ( p.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Offhand) != undefined );
		const reloadTime = gunData[`${gunName}`]["reloadTime"] + getRemvereloadTime(p.getProperty(`zex:grip`));
		const Ammo = gunData[`${gunName}`]["bullet"];
		const ench = gun.getComponent(ItemComponentTypes.Enchantable);
		let c = 0;
		if( damage > 0 ){
			for(let i = 0; i < 36; i++){
				let Haditem = p.getComponent("inventory").container.getItem(i);
				if( Haditem != undefined && Haditem.typeId === Ammo ){
					c += p.getComponent("inventory").container.getItem(i).amount;
				}
			}
			if( isOffhand &&p.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Offhand).typeId == gun.typeId ){
				c = Math.floor(c/2);
			}
			if( world.getDynamicProperty(`gvcv5:doBulletSpend`) == false ){
				p.addEffect("slowness", reloadTime,{ amplifier: 2 });
				p.addTag("reload")
				gun.getComponent(ItemComponentTypes.Durability).damage = 0;
				p.getComponent(EntityComponentTypes.Equippable).setEquipment(EquipmentSlot.Mainhand,gun);
				if( isOffhand && p.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Offhand).typeId == gun.typeId ){
					let gunOff = p.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Offhand);
					gunOff.getComponent(ItemComponentTypes.Durability).damage = 0
					p.getComponent(EntityComponentTypes.Equippable).getEquipmentSlot(EquipmentSlot.Offhand).setItem(gunOff);
				}
				world.scoreboard.getObjective("reloading").setScore(p,Number(reloadTime));
				p.runCommand("playsound reload.ak47 @s ~~~ ");
			}
			else if( ench.hasEnchantment(`minecraft:infinity`) ){
				p.addEffect("slowness", reloadTime,{ amplifier: 2 });
				p.addTag("reload")
				gun.getComponent(ItemComponentTypes.Durability).damage = 0;
				p.getComponent(EntityComponentTypes.Equippable).setEquipment(EquipmentSlot.Mainhand,gun);
				if( isOffhand && p.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Offhand).typeId == gun.typeId ){
					let gunOff = p.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Offhand);
					gunOff.getComponent(ItemComponentTypes.Durability).damage = 0
					p.getComponent(EntityComponentTypes.Equippable).getEquipmentSlot(EquipmentSlot.Offhand).setItem(gunOff);
				}
				world.scoreboard.getObjective("reloading").setScore(p,Number(reloadTime));
				p.runCommand("playsound reload.ak47 @s ~~~ ");
			}
			else if (c > 0){
				if( c > damage ){
					gun.getComponent(ItemComponentTypes.Durability).damage = 0;
					p.getComponent(EntityComponentTypes.Equippable).setEquipment(EquipmentSlot.Mainhand,gun);

					if( isOffhand && p.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Offhand).typeId == gun.typeId ){
						p.runCommand(`clear @s ${Ammo} 0 ${damage*2}`);
					}
					else{
						p.runCommand(`clear @s ${Ammo} 0 ${damage}`);
					}
						
				}
				else{
					gun.getComponent(ItemComponentTypes.Durability).damage = damage - c;
					p.getComponent(EntityComponentTypes.Equippable).setEquipment(EquipmentSlot.Mainhand,gun);
					p.runCommand(`clear @s ${Ammo} 0 9999`);
				}
				//print(`${isOffhand}`)
				if( isOffhand && p.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Offhand).typeId == gun.typeId ){
					let gunOff = p.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Offhand);
					gunOff.getComponent(ItemComponentTypes.Durability).damage = gun.getComponent(ItemComponentTypes.Durability).damage;
					p.getComponent(EntityComponentTypes.Equippable).getEquipmentSlot(EquipmentSlot.Offhand).setItem(gunOff);
				}

				p.addEffect("slowness", reloadTime,{ amplifier: 2 });
				p.addTag("reload")
				world.scoreboard.getObjective("reloading").setScore(p,Number(reloadTime));
				p.runCommand("playsound reload.ak47 @s ~~~ ");
			}
		}
	}
	else if( e.id == "gvcv5:craft" ){
		const craftType = e.message;
		const player = e.sourceEntity;
		const form = new ActionFormData();
		form.title(`tile.gvcv5:${craftType}.name`);
		const sells = craftData[`${craftType}`][`sell`];
		const buys = craftData[`${craftType}`][`buy`];
		let itemRawText = []
		let sellItemCounts = []
		for( let i = 0; i < sells.length; i++ ){
			let c = 0
			for(let j = 0; j < 36; j++){
				let Haditem = player.getComponent("inventory").container.getItem(j);
				if( Haditem != undefined && Haditem.typeId == sells[i] ){
					c += player.getComponent("inventory").container.getItem(j).amount;
				}
			}
			itemRawText.push({ translate: `script.gvcv5.${sells[i]}.name` });
			itemRawText.push({ text: `:${c}\n` });
			sellItemCounts.push(c);
		}
		form.body({ rawtext: itemRawText});
		for(let i = 0; i < buys.length; i++){
			let buyData = [{ text:`§l`},{ translate: `item.${buys[i]["give"]}`},{ text:`x${buys[i]["count"]}§r\nneed:`}];
			for( let j = 0; j < sells.length; j++ ){
				if( buys[i]["cost"][j] > 0 ){
					buyData.push({ translate: `script.gvcv5.${sells[j]}.name` });
					buyData.push({ text: `x${buys[i]["cost"][j]}` });
				}
			}
			form.button({ rawtext: buyData},buys[i]["texture"]);
		}
		form.show(player).then( result => {
			if ( !result.canceled ){
				if( sellItemCounts.every( (value, index) => value >= buys[result.selection]["cost"][index] ) ){
					for( let i = 0; i < sells.length; i++ ){
						player.runCommand(`clear @s ${sells[i]} 0 ${buys[result.selection]["cost"][i]}`);
					}
					player.runCommand(`give @s ${buys[result.selection]["give"]} ${buys[result.selection]["count"]}`);
				}
				else{
					player.sendMessage({ translate: `script.gvcv5.no_ma.name`});
				}
				player.runCommand(`scriptevent gvcv5:craft ${craftType}`);
			}
		} )
		
	}
	else if( e.id == "gvcv5:attach_table" ){
		const player = e.sourceEntity;
		const gun = player.getComponent(EntityComponentTypes.Equippable).getEquipmentSlot(EquipmentSlot.Mainhand);
		if( gun.typeId.includes(`gun:`) ){
			const gunId = gun.typeId.split(`:`)[1];
			let attachTypes2 = []
			const attachTypes = attachmentData[`attachTypes`];
			const Iform = new ActionFormData();
			Iform.title(`script.gvcv5.attachment_table.name`);
			Iform.body(`script.gvcv5.attachment_table.body.name`);
			for( const attachType of attachTypes ){
				if(Array.isArray(gunAttach[`${gunId}`][`${attachType}`])){
					Iform.button(`${attachType}`,`textures/items/attachment/${attachmentData[`${attachType}`][gun.getDynamicProperty(`zex:${attachType}`)]}`);
				}
				else{
					Iform.button(`${attachType}`,`textures/items/attachment/not`);
				}
				attachTypes2.push(attachType)
			}
			Iform.show(player).then( r => {
				if ( !r.canceled ){
					const attachType = attachTypes2[r.selection];
					if( Array.isArray(gunAttach[`${gunId}`][`${attachType}`]) ){
						let phoneArray = [  ]
						let phoneArray2 = [  ]
						const form = new ActionFormData();
						form.title(`script.gvcv5.${attachType}.name`);
						//form.body(`script.gvcv5.${attachType}.body.name`);
						form.button(`script.gvcv5.remove_attach.name`);
						phoneArray2.push(0);
						for( let i of gunAttach[`${gunId}`][`${attachType}`] ){
							if( getInventoryItem(player,`zex:${attachmentData[`${attachType}`][i]}`) > 0 && gun.getDynamicProperty(`zex:${attachType}`) != i ){
								form.button(`item.zex:${attachmentData[`${attachType}`][i]}`,`textures/items/attachment/${attachmentData[`${attachType}`][i]}`);
								phoneArray.push(attachmentData[`${attachType}`][i])
								phoneArray2.push(i);
							}
						}
						form.show(player).then( result => {
							if ( !result.canceled ){
								if( result.selection != 0 ){
									//print(`${phoneArray2[result.selection]}`)
									player.runCommand(`clear @s zex:${phoneArray[result.selection-1]} 0 1` )
								}
								if( gun.getDynamicProperty(`zex:${attachType}`) != undefined && gun.getDynamicProperty(`zex:${attachType}`) != 0 ){
									player.runCommand(`give @s zex:${attachmentData[`${attachType}`][gun.getDynamicProperty(`zex:${attachType}`)]}`)
								}
								gun.setDynamicProperty(`zex:${attachType}`,phoneArray2[result.selection]);
								player.runCommand(`scriptevent gvcv5:attach_table` )
							}
						})
					}
					else{
						player.sendMessage({translate:`script.gvcv5.cant_attach.name`});
						player.runCommand(`scriptevent gvcv5:attach_table` );
					}
				}
			})

		}
		else{
			player.sendMessage({ translate:`script.gvcv5.hold_gun.name`});
		}
		
	}
	else if( e.id == "gvcv5:phone" && !e.sourceEntity.hasTag(`down`) ){
		const user = e.sourceEntity;
		const team = e.message;
		const phone = user.getComponent("equippable").getEquipmentSlot(EquipmentSlot.Mainhand);
		const form = new ActionFormData();
		form.title(`script.gvcv5.phone_noteam.name`);
		form.button(`script.gvcv5.howToGun.name`);
		form.button(`script.gvcv5.howToVechile.name`);
		form.button(`script.gvcv5.phone_back.name`);
		form.show(user).then( r => {
			if (!r.canceled) {
				if( r.selection == 0 ){
					const form = new ActionFormData();
					form.title(`script.gvcv5.howToGun.name`);
					let itemRawText = []
					itemRawText.push({ translate: `script.gvcv5.howToGunDesc0.name` });
					itemRawText.push({ text: `\n` });
					itemRawText.push({ translate: `script.gvcv5.howToGunDesc1.name` });
					itemRawText.push({ text: `\n` });
					itemRawText.push({ translate: `script.gvcv5.howToGunDesc2.name` });
					itemRawText.push({ text: `\n` });
					itemRawText.push({ translate: `script.gvcv5.howToGunDesc3.name` });
					itemRawText.push({ text: `\n` });
					form.body({ rawtext: itemRawText});
					form.button(`script.gvcv5.autoReloadOn.name`);
					form.button(`script.gvcv5.autoReloadOff.name`);
					form.button(`script.gvcv5.phone_back.name`);
					form.show(user).then( result => {
						if ( !result.canceled ){
							if( result.selection == 0 ){
								user.addTag(`autoReload`)
								user.sendMessage({ translate: `script.gvcv5.autoReloadOn.name` });
							}
							if( result.selection == 1 ){
								user.removeTag(`autoReload`)
								user.sendMessage({ translate: `script.gvcv5.autoReloadOff.name` });
							}
							user.runCommand(`scriptevent gvcv5:phone`);
						}
					} )
				}
				else if( r.selection == 1 ){
					const form = new ActionFormData();
					form.title(`script.gvcv5.howToVechile.name`);
					let itemRawText = []
					itemRawText.push({ translate: `script.gvcv5.howToVechileDesc0.name` });
					itemRawText.push({ text: `\n\n` });
					itemRawText.push({ translate: `script.gvcv5.howToVechileDesc1.name` });
					itemRawText.push({ text: `\n\n` });
					itemRawText.push({ translate: `script.gvcv5.howToVechileDesc2.name` });
					itemRawText.push({ text: `\n\n` });
					itemRawText.push({ translate: `script.gvcv5.howToVechileDesc3.name` });
					itemRawText.push({ text: `\n\n` });
					form.body({ rawtext: itemRawText});
					form.button(`script.gvcv5.phone_back.name`);
					form.show(user).then( result => {
						if ( !result.canceled ){
							user.runCommand(`scriptevent gvcv5:phone`);
						}
					} )
				}
				else if( r.selection == 2 ){
					user.runCommand(`scriptevent gvcv5:phone`);
				}
			}
		},)
	}
	else if( e.id == "gvcv5:printDamage" && !e.sourceEntity.hasTag(`no_print`) ){
		const user = e.sourceEntity;
		if( world.scoreboard.getObjective(`printDamage`).getScore(user) > 0 ){
			if( user.getDynamicProperty(`gvcww2:headshot`) == 1 ){
				user.runCommand(`title @s subtitle §4HEADSHOT§r`);
			}
			else{
				user.runCommand(`title @s subtitle ""`);
			}
			user.runCommand(`titleraw @s title {"rawtext":[{"text":"\n\n\n\n\n${Math.floor(user.getDynamicProperty(`gvcv5:hitdamage`)*100)/100}"}]}`);
		}
		else{
			user.setDynamicProperty(`gvcv5:hitdamage`,0);
			user.runCommand(`title @s clear`);
		}
	}
	else if( e.id == `gvcv5:admin` ){
		if( e.message== `guns` ){
			const form = new ModalFormData();
			form.title(`Admin Settings`);
			form.textField(`Player Damage`,`${world.getDynamicProperty(`gvcv5:playerDamage`)}`, {defaultValue: `${world.getDynamicProperty(`gvcv5:playerDamage`)}`,tooltip:`Current is ${world.getDynamicProperty(`gvcv5:playerDamage`)}`});
			form.textField(`Mob Damage`,`${world.getDynamicProperty(`gvcv5:mobDamage`)}`, {defaultValue: `${world.getDynamicProperty(`gvcv5:mobDamage`)}`,tooltip:`Current is ${world.getDynamicProperty(`gvcv5:mobDamage`)}`});
			form.toggle(`Bullet Spend`, {defaultValue: world.getDynamicProperty(`gvcv5:doBulletSpend`),tooltip:`Bullet Spend`});
			form.toggle(`Player damage cool time`, {defaultValue: world.getDynamicProperty(`gvcv5:playerDamageCool`),tooltip:`Player damage cool time`});
			form.toggle(`no die in 1 hit`, {defaultValue: world.getDynamicProperty(`gvcv5:nodiein1hit`),tooltip:`Player no die in 1 hit`});
			form.show(e.sourceEntity).then( result => {
				if ( !result.canceled ){
					if( world.getDynamicProperty(`gvcv5:playerDamage`) != Number(result.formValues[0]) ){
						world.setDynamicProperty(`gvcv5:playerDamage`,Number(result.formValues[0]));
						world.sendMessage(`Player Damage rate is now ${result.formValues[0]}`);
					}
					if( world.getDynamicProperty(`gvcv5:mobDamage`) != Number(result.formValues[1]) ){
						world.setDynamicProperty(`gvcv5:mobDamage`,Number(result.formValues[1]));
						world.sendMessage(`Mob Damage rate is now ${result.formValues[1]}`);
					}
					if( world.getDynamicProperty(`gvcv5:doBulletSpend`) != Boolean(result.formValues[2]) ){
						world.setDynamicProperty(`gvcv5:doBulletSpend`,Boolean(result.formValues[2]));
						world.sendMessage(`Bullet Spend is now ${result.formValues[2]}`);
					}
					if( world.getDynamicProperty(`gvcv5:playerDamageCool`) != Boolean(result.formValues[3]) ){
						world.setDynamicProperty(`gvcv5:playerDamageCool`,Boolean(result.formValues[3]));
						world.sendMessage(`Player damage cool is now ${result.formValues[3]}`);
					}
					if( world.getDynamicProperty(`gvcv5:nodiein1hit`) != Boolean(result.formValues[4]) ){
						world.setDynamicProperty(`gvcv5:nodiein1hit`,Boolean(result.formValues[4]));
						world.sendMessage(`no die in 1 hit is now ${result.formValues[4]}`);
						world.scoreboard.getObjective(`building`).setScore(`P`,Number(result.formValues[4]));
					}
				}
			} )
		}
		else if( e.message == `building`){
			const form = new ModalFormData();
			form.title(`Building Settings`);
			form.toggle(`Small Building Spawn`, {defaultValue: world.getDynamicProperty(`gvcv5:buildingSpawnS`),tooltip:`Small Building Spawn`});
			form.toggle(`Medium Building Spawn`, {defaultValue: world.getDynamicProperty(`gvcv5:buildingSpawnM`),tooltip:`Medium Building Spawn`});
			form.toggle(`Large Building Spawn`, {defaultValue: world.getDynamicProperty(`gvcv5:buildingSpawnL`),tooltip:`Large Building Spawn`});
			form.toggle(`Allies Building Spawn`, {defaultValue: world.getDynamicProperty(`gvcv5:buildingSpawnA`),tooltip:`Allies Building Spawn`});
			form.show(e.sourceEntity).then( result => {
				if ( !result.canceled ){
					if( world.getDynamicProperty(`gvcv5:buildingSpawnS`) != Boolean(result.formValues[0]) ){
						world.setDynamicProperty(`gvcv5:buildingSpawnS`,Boolean(result.formValues[0]));
						world.scoreboard.getObjective(`building`).setScore(`S`,Number(result.formValues[0]));
						world.sendMessage(`Small Building Spawn is now ${result.formValues[0]}`);
					}
					if( world.getDynamicProperty(`gvcv5:buildingSpawnM`) != Boolean(result.formValues[1]) ){
						world.setDynamicProperty(`gvcv5:buildingSpawnM`,Boolean(result.formValues[1]));
						world.scoreboard.getObjective(`building`).setScore(`M`,Number(result.formValues[1]));
						world.sendMessage(`Medium Building Spawn is now ${result.formValues[1]}`);
					}
					if( world.getDynamicProperty(`gvcv5:buildingSpawnL`) != Boolean(result.formValues[2]) ){
						world.setDynamicProperty(`gvcv5:buildingSpawnL`,Boolean(result.formValues[2]));
						world.scoreboard.getObjective(`building`).setScore(`L`,Number(result.formValues[2]));
						world.sendMessage(`Large Building Spawn is now ${result.formValues[2]}`);
					}
					if( world.getDynamicProperty(`gvcv5:buildingSpawnA`) != Boolean(result.formValues[3]) ){
						world.setDynamicProperty(`gvcv5:buildingSpawnA`,Boolean(result.formValues[3]));
						world.scoreboard.getObjective(`building`).setScore(`A`,Number(result.formValues[3]));
						world.sendMessage(`Allies Building Spawn is now ${result.formValues[3]}`);
					}
				}
			} )


		}
		else if( e.message == `mobSpawn`){
			const form = new ModalFormData();
			form.title(`mobSpawn Settings`);
			form.toggle(`Block Spawn`, {defaultValue: world.getDynamicProperty(`gvcv5:doSpawnFromBlock`),tooltip:`Block Spawn`});
			form.toggle(`Beacon Spawn`, {defaultValue: world.getDynamicProperty(`gvcv5:doSpawnFromBeacon`),tooltip:`Beacon Spawn`});
			form.show(e.sourceEntity).then( result => {
				if ( !result.canceled ){
					if( world.getDynamicProperty(`gvcv5:doSpawnFromBlock`) != Boolean(result.formValues[0]) ){
						world.setDynamicProperty(`gvcv5:doSpawnFromBlock`,Boolean(result.formValues[0]));
						world.sendMessage(`Block Spawn is now ${result.formValues[0]}`);
					}
					if( world.getDynamicProperty(`gvcv5:doSpawnFromBeacon`) != Boolean(result.formValues[1]) ){
						world.setDynamicProperty(`gvcv5:doSpawnFromBeacon`,Boolean(result.formValues[1]));
						world.sendMessage(`Beacon Spawn is now ${result.formValues[1]}`);
					}
				}
			} )


		}
		else if( e.message == `gameRule`){
			const form = new ModalFormData();
			form.title(`gameRule Settings`);
			form.toggle(`Enable WorldLimit`, {defaultValue: world.getDynamicProperty(`gvcv5:worldLimit`),tooltip:`Enable WorldLimit`});
			form.textField(`World Limit O`,`${world.getDynamicProperty(`gvcv5:worldLimitO`)}`, {defaultValue: `${world.getDynamicProperty(`gvcv5:worldLimitO`)}`,tooltip:`Current is ${world.getDynamicProperty(`gvcv5:worldLimitO`)}`});
			form.textField(`World Limit N`,`${world.getDynamicProperty(`gvcv5:worldLimitN`)}`, {defaultValue: `${world.getDynamicProperty(`gvcv5:worldLimitN`)}`,tooltip:`Current is ${world.getDynamicProperty(`gvcv5:worldLimitN`)}`});
			form.textField(`World Limit E`,`${world.getDynamicProperty(`gvcv5:worldLimitE`)}`, {defaultValue: `${world.getDynamicProperty(`gvcv5:worldLimitE`)}`,tooltip:`Current is ${world.getDynamicProperty(`gvcv5:worldLimitE`)}`});
			form.toggle(`Disable AirCraft With Item`, {defaultValue: world.getDynamicProperty(`gvcv5:airCraftWithItem`),tooltip:`Disable AirCraft With Item`});
			form.show(e.sourceEntity).then( result => {
				if ( !result.canceled ){
					if( world.getDynamicProperty(`gvcv5:worldLimit`) != Boolean(result.formValues[0]) ){
						world.setDynamicProperty(`gvcv5:worldLimit`,Boolean(result.formValues[0]));
						world.sendMessage(`World Limit is now ${result.formValues[0]}`);
					}
					if( world.getDynamicProperty(`gvcv5:worldLimitO`) != Number(result.formValues[1]) ){
						world.setDynamicProperty(`gvcv5:worldLimitO`,Number(result.formValues[1]));
						world.sendMessage(`World Limit O is now ${result.formValues[1]}`);
					}
					if( world.getDynamicProperty(`gvcv5:worldLimitN`) != Number(result.formValues[2]) ){
						world.setDynamicProperty(`gvcv5:worldLimitN`,Number(result.formValues[2]));
						world.sendMessage(`World Limit N is now ${result.formValues[2]}`);
					}
					if( world.getDynamicProperty(`gvcv5:worldLimitE`) != Number(result.formValues[3]) ){
						world.setDynamicProperty(`gvcv5:worldLimitE`,Number(result.formValues[3]));
						world.sendMessage(`World Limit E is now ${result.formValues[3]}`);
					}
					if( world.getDynamicProperty(`gvcv5:airCraftWithItem`) != Boolean(result.formValues[0]) ){
						world.setDynamicProperty(`gvcv5:airCraftWithItem`,Boolean(result.formValues[0]));
						world.sendMessage(`Disable AirCraft With Item is now ${result.formValues[0]}`);
					}
				}
			} )


		}

	}
},)