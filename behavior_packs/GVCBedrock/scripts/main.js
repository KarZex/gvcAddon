import { world, system, EquipmentSlot, EntityComponentTypes,GameMode, EntityInitializationCause, ItemComponent, ItemComponentTypes, TicksPerSecond, EffectType, EffectTypes, EntityDamageCause  } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { gunData } from "./guns";
import { craftData } from "./crafts";
import { raidData } from "./raid";
import "./compornents";
/*
world.afterEvents.entityHurt.subscribe( e => {
	print(`value:${e.damage} at:${e.hurtEntity.typeId} by:${e.damageSource.damagingEntity.typeId} type:${e.damageSource.cause}`)
} )
*/
world.afterEvents.playerSpawn.subscribe( e => {
	const player = e.player;
	player.setDynamicProperty(`gvcv5:gunUsed`,0)
} )

function print(text){
	world.sendMessage(`§a[System]§r: ${text}`);
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

function airCraftlader( player ){
	const V = player.getViewDirection();
	const P0 = player.location;
	const d0 = Math.atan2(V.z, V.x);
	let team = `noteam`;
	let print = [ 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ];
	if( player.hasTag(`red`) ){ team = `red`; }
	else if( player.hasTag(`blue`) ){ team = `blue`; }
	else if( player.hasTag(`green`) ){ team = `green`; }
	else if( player.hasTag(`yellow`) ){ team = `yellow`; }
	const allPlayers = world.getAllPlayers();
	for( let i of allPlayers ){
		const Pi = i.location;
		if( i.hasTag(`${team}`) || i.nameTag == player.nameTag || (!i.hasTag(`air`) && !i.hasTag(`heri`) )){
			continue;
		}
		const ri = Math.sqrt( (Pi.x - P0.x) * (Pi.x - P0.x) + (Pi.z - P0.z) * (Pi.z - P0.z) );
		const adi = Math.atan2((Pi.z - P0.z)/ri, (Pi.x - P0.x)/ri);
		const di = Math.atan2((Pi.z - P0.z)/ri, (Pi.x - P0.x)/ri) - d0;
		for( let j = 0; j < 21; j++ ){
			if( - Math.PI/2 + j * Math.PI / 21 <= di && di < - Math.PI/2 + (j + 1) * Math.PI / 21 ){
				if( 1024 <= ri && ri < 2048  && print[j] < 1 ){
					print[j] = 1;
				}
				else if( (512 <= ri && ri < 1024) && print[j] < 2 ){
					print[j] = 2;
				}
				else if( (256 <= ri && ri < 512) && print[j] < 3 ){
					print[j] = 3;
				}
				else if( (64 <= ri && ri < 256) && print[j] < 4 ){
					print[j] = 4;
				}
				else if( (ri < 64) && print[j] < 5 ){
					print[j] = 5;
				}

			}
		}

	}
	for( let j = 0; j < 21; j++ ){
		if( print[j] == 0 ){
			print[j] = `§7`;
		}
		else if( print[j] == 1 ){
			print[j] = `§f`;
		}
		else if( print[j] == 2 ){
			print[j] = `§e`;
		}
		else if( print[j] == 3 ){
			print[j] = `§g`;
		}
		else if( print[j] == 4 ){
			print[j] = `§6`;
		}
		else if( print[j] == 5 ){
			print[j] = `§4`;
		}
	}
	return `{"text":"${print[0]}|${print[1]}|${print[2]}|${print[3]}|${print[4]}|${print[5]}|${print[6]}|${print[7]}|${print[8]}|${print[9]}| ${print[10]}${Math.floor(-180*d0/Math.PI)} ${print[11]}|${print[12]}|${print[13]}|${print[14]}|${print[15]}|${print[16]}|${print[17]}|${print[18]}|${print[19]}|${print[20]}|\n"}`;
}

function subWeapon( player,vehicle ){
	const subWeaponName = `{"translate":"gvcv5.${vehicle.typeId.replace("vehicle:","")}.subWeapon.name"}`;
	const subWeaponScore = world.scoreboard.getObjective(`subWeapon`).getScore(player);
	const subWeaponScoreMax = world.scoreboard.getObjective(`maxsubcool`).getScore(player);
	const subWeaponCool = world.scoreboard.getObjective(`scool`).getScore(player);
	let subWeaponData = `{"text":": ${subWeaponScore}/${subWeaponScoreMax}\n"}`;
	if( subWeaponCool <= 20 ){
		subWeaponData = `{"text":": ${subWeaponScore}/${subWeaponScoreMax}\n"}`;
	}
	else if( subWeaponCool > 20 ){
		subWeaponData = `{"text":": §cCOOL ${subWeaponCool}§r\n"}`;
	}
	return `${subWeaponName},${subWeaponData}`;
}
function mainWeapon0( player,vehicle ){
	const mtype = world.scoreboard.getObjective(`mtype`).getScore(player);
	let mainTypeData = ``;
	if( mtype == 0){
		mainTypeData = `{"text":"§e"},`;
	}
	const mainWeaponName = `{"translate":"gvcv5.${vehicle.typeId.replace("vehicle:","")}.mainWeapon.name"}`;
	const mainWeaponScore = world.scoreboard.getObjective(`mcool`).getScore(player);
	let mainWeaponData = `{"text":": ${mainWeaponScore}§r\n"}`;
	if( mainWeaponScore <= 0 ){
		mainWeaponData = `{"text":": READY§r\n"}`;
	}
	return `${mainTypeData}${mainWeaponName},${mainWeaponData}`;
}

function mainWeapon1( player,vehicle ){
	const mtype = world.scoreboard.getObjective(`mtype`).getScore(player);
	let mainTypeData = ``;
	if( mtype == 1){
		mainTypeData = `{"text":"§e"},`;
	}
	const mainWeaponName = `{"translate":"gvcv5.${vehicle.typeId.replace("vehicle:","")}.mainWeaponi.name"}`;
	const mainWeaponScore = world.scoreboard.getObjective(`mcooli`).getScore(player);
	let mainWeaponData = `{"text":": ${mainWeaponScore}§r\n"}`;
	if( mainWeaponScore <= 0 ){
		mainWeaponData = `{"text":": READY§r\n"}`;
	}
	return `${mainTypeData}${mainWeaponName},${mainWeaponData}`;
}
function mainWeapon2( player,vehicle ){
	const mtype = world.scoreboard.getObjective(`mtype`).getScore(player);
	let mainTypeData = ``;
	if( mtype == 2){
		mainTypeData = `{"text":"§e"},`;
	}
	const mainWeaponName = `{"translate":"gvcv5.${vehicle.typeId.replace("vehicle:","")}.mainWeaponii.name"}`;
	const mainWeaponScore = world.scoreboard.getObjective(`mcoolii`).getScore(player);
	let mainWeaponData = `{"text":": ${mainWeaponScore}§r\n"}`;
	if( mainWeaponScore <= 0 ){
		mainWeaponData = `{"text":": READY§r\n"}`;
	}
	return `${mainTypeData}${mainWeaponName},${mainWeaponData}`;
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

world.afterEvents.entitySpawn.subscribe( e => {
	if( e.entity.typeId.includes("fire")  ){
		const projectile = e.entity;
		let gunName = projectile.typeId
		if( gunName.includes("fire:ads_") ){ gunName = gunName.replace("fire:ads_",""); }
		else if( gunName.includes("fire:") ){ gunName = gunName.replace("fire:",""); }
		let damageType = gunData[`${gunName}`]["damageType"];
		const dmg = gunData[`${gunName}`]["damage"];
		projectile.setDynamicProperty(`damageType`,damageType);
		projectile.setDynamicProperty(`damage`,dmg);
		
		const player = projectile.getComponent(EntityComponentTypes.Projectile).owner;
		if( player.typeId == `minecraft:player` && !player.hasTag("isRiding") ){
			const gun = player.getComponent(EntityComponentTypes.Equippable).getEquipmentSlot(EquipmentSlot.Mainhand);
			const ench = gun.getItem().getComponent(ItemComponentTypes.Enchantable);
			if( ench.hasEnchantment(`minecraft:flame`) ){
				projectile.setOnFire(10,true);
			}
			if( ench.hasEnchantment(`minecraft:power`) ){
				const level = ench.getEnchantment(`minecraft:power`).level;
				projectile.setDynamicProperty(`damage`,dmg * 0.25 * (level + 5) );
			}
		}
		else {
			if( player.getDynamicProperty(`Ench_flame`) != undefined ){
				projectile.setOnFire(10,true);
			}
			if( player.getDynamicProperty(`Ench_power`) != undefined ){
				projectile.setDynamicProperty(`damage`,dmg * 0.25 * (player.getDynamicProperty(`Ench_power`) + 5) );
			}
		}
	}
} )

world.afterEvents.projectileHitEntity.subscribe( e => {
	if( e.projectile.typeId.includes("fire")){
		let vict = e.getEntityHit().entity;
		let def = 0;
		let gunName = e.projectile.typeId
		if( gunName.includes("fire:ads_") ){ gunName = gunName.replace("fire:ads_",""); }
		else if( gunName.includes("fire:") ){ gunName = gunName.replace("fire:",""); }
		let damageType;
		try{
			damageType = e.projectile.getDynamicProperty(`damageType`);
		}
		catch( error ){
			damageType = "override"
		}
		const equipmentComp = vict.getComponent(EntityComponentTypes.Equippable)
		if( equipmentComp && vict.typeId == "minecraft:player" ){
			if( equipmentComp.getEquipment(EquipmentSlot.Head) != undefined ){ 
				def = def + setArmorValue(equipmentComp.getEquipmentSlot(EquipmentSlot.Head).typeId) 
			}
			if( equipmentComp.getEquipment(EquipmentSlot.Chest) != undefined  ){ 
				def = def + setArmorValue(equipmentComp.getEquipmentSlot(EquipmentSlot.Chest).typeId) 
			}
			if( equipmentComp.getEquipment(EquipmentSlot.Legs) != undefined  ){
				 def = def + setArmorValue(equipmentComp.getEquipmentSlot(EquipmentSlot.Legs).typeId) 
				}
			if( equipmentComp.getEquipment(EquipmentSlot.Feet) != undefined  ){
				 def = def + setArmorValue(equipmentComp.getEquipmentSlot(EquipmentSlot.Feet).typeId) 
			}
		}
		else if( vict.hasTag(`iron`)){
			def = 0.6;
		}
		else if( vict.hasTag(`plastic`)){
			def = 0.8;
		}
		else if( vict.hasTag(`diamond`)){
			def = 0.9;
		}
		else if( vict.hasTag(`netherite`)){
			def = 1;
		}
		if (def > 1){ def = 1 }
		let damage
		try{
			damage = e.projectile.getDynamicProperty(`damage`);
		}
		catch( error ){
			damage = gunData[`${gunName}`][`damage`];
		}
		if ( vict.typeId == "minecraft:player" ){ 
			damage = damage * world.getDynamicProperty("gvcv5:playerDamage");
		}
		else{
			damage = damage * world.getDynamicProperty("gvcv5:mobDamage");
		}
        if( damageType == `override` && vict.getEffect("resistance") == undefined && vict.hasTag("antiBullet") == false ){
			damage = damage * (1 - def);
			if( world.getDynamicProperty("gvcv5:nodiein1hit") && vict.typeId == "minecraft:player" && damage > 20 ){
				vict.applyDamage(10,{ cause: EntityDamageCause.entityAttack,damagingEntity: e.source });
			}
			else if( world.getDynamicProperty("gvcv5:playerDamageCool") && vict.typeId == "minecraft:player" ){
				vict.applyDamage(damage,{ cause: EntityDamageCause.entityAttack,damagingEntity: e.source });
			}
			else{
				vict.applyDamage(damage,{ cause: damageType,damagingEntity: e.source });
			}
            vict.applyKnockback({x:0,z:0},0);
        }
		else if( damageType != `override` ){
			damage = damage * (1 - (def/2));
			if( world.getDynamicProperty("gvcv5:nodiein1hit") && vict.typeId == "minecraft:player" ){
				if(damage > 20 ){ vict.applyDamage(10,{ cause: EntityDamageCause.entityAttack,damagingEntity: e.source }); }
				else{ vict.applyDamage(damage/2,{ cause: EntityDamageCause.entityAttack,damagingEntity: e.source }); }
			}
			else{
				vict.applyDamage(damage,{ cause: damageType,damagingEntity: e.source });
			}
            vict.applyKnockback({x:0,z:0},0);
		}
		try{
			e.projectile.triggerEvent("minecraft:explode");
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
		}
	}
})

system.runInterval( () => {
	world.getDimension(`minecraft:overworld`).runCommand(`execute as @a[tag=MissileAlert] run function missileAlert`);
},20)

system.afterEvents.scriptEventReceive.subscribe( e => {
	if( e.id == "zex:air"){
		const airCraft = e.sourceEntity;
		const maxSpeed = airCraft.getComponent(EntityComponentTypes.Movement).defaultValue;
		const player = airCraft.getComponent(EntityComponentTypes.Rideable).getRiders()[0];
		let v = airCraft.getVelocity();
		let abs_v = Math.sqrt(v.x*v.x + v.y*v.y + v.z*v.z);
		let r = {
			x:v.x/abs_v,
			y:v.y/abs_v,
			z:v.z/abs_v
		}
		if( abs_v > maxSpeed ){
			abs_v = maxSpeed
		}

		if( abs_v < 0.5 ){
			abs_v = 0
		}
		else{
			let d = player.getViewDirection();
			airCraft.clearVelocity();
			if( Math.asin(d.x) > Math.asin(r.x) + Math.PI/20 ){
				d.x = r.x + Math.sin(Math.PI/20);
			}
			if( Math.asin(d.x) < Math.asin(r.x) - Math.PI/20 ){
				d.x = r.x - Math.sin(Math.PI/20);
			}
			if( Math.asin(d.y) > Math.asin(r.y) + Math.PI/20 ){
				d.y = r.y + Math.sin(Math.PI/20);
			}
			if( Math.asin(d.y) < Math.asin(r.y) - Math.PI/20 ){
				d.y = r.y - Math.sin(Math.PI/20);
			}
			if( Math.asin(d.z) > Math.asin(r.z) + Math.PI/20 ){
				d.z = r.z + Math.sin(Math.PI/20);
			}
			if( Math.asin(d.z) < Math.asin(r.z) - Math.PI/20 ){
				d.z = r.z - Math.sin(Math.PI/20);
			}
			if( world.getDynamicProperty(`gvcv5:worldLimit`) && airCraft.dimension.id == `minecraft:overworld` ){
				
				if( airCraft.location.x > world.getDynamicProperty(`gvcv5:worldLimitO`)/2 && d.x > 0 ){
					d.x = 0;
				}
				if( airCraft.location.x < -world.getDynamicProperty(`gvcv5:worldLimitO`)/2 && d.x < 0 ){
					d.x = 0;
				}
				if( airCraft.location.y > 320 && d.y > 0 ){
					d.y = 0;
				}
				if( airCraft.location.y < -64 && d.y < 0 ){
					d.y = 0;
				}
				if( airCraft.location.z > world.getDynamicProperty(`gvcv5:worldLimitO`)/2 && d.z > 0 ){
					d.z = 0;
				}
				if( airCraft.location.z < -world.getDynamicProperty(`gvcv5:worldLimitO`)/2 && d.z < 0 ){
					d.z = 0;
				}

			}
			else if( world.getDynamicProperty(`gvcv5:worldLimit`) && airCraft.dimension.id == `minecraft:nether` ){
				if( airCraft.location.x > world.getDynamicProperty(`gvcv5:worldLimitN`)/2 && d.x > 0 ){
					d.x = 0;
				}
				if( airCraft.location.x < -world.getDynamicProperty(`gvcv5:worldLimitN`)/2 && d.x < 0 ){
					d.x = 0;
				}
				if( airCraft.location.y > 128 && d.y > 0 ){
					d.y = 0;
				}
				if( airCraft.location.y < 0 && d.y < 0 ){
					d.y = 0;
				}
				if( airCraft.location.z > world.getDynamicProperty(`gvcv5:worldLimitN`)/2 && d.z > 0 ){
					d.z = 0;
				}
				if( airCraft.location.z < -world.getDynamicProperty(`gvcv5:worldLimitN`)/2 && d.z < 0 ){
					d.z = 0;
				}

			}
			airCraft.applyImpulse({x:d.x*abs_v,y:d.y*abs_v,z:d.z*abs_v});
		}
		player.runCommand(`titleraw @s[tag=!reload,tag=!down] actionbar {"rawtext":[${airCraftlader(player)},{"text":"§f§rzex.gvc.v${Math.round(abs_v*20*100)/100}m/s\n"},${subWeapon(player,airCraft)},${mainWeapon0(player,airCraft)},${mainWeapon1(player,airCraft)},${mainWeapon2(player,airCraft)}]}`);
	

	}
	else if( e.id == "zex:playerRotation" ){
		let player = e.sourceEntity;
		let rotation = e.message.split(" ");
		world.sendMessage(`§aX:${rotation[0]} Y:${rotation[1]}`);
		player.setRotation({x: Number(rotation[0]), y: Number(rotation[1])});
		//player.teleport( player.location, {rotation: {x: Number(rotation[0]), y: Number(rotation[1])} } );
	}
	else if( e.id == "zex:vtext"){
		let vehicle = e.sourceEntity;
		const player = vehicle.getComponent(EntityComponentTypes.Rideable).getRiders()[0];
		if( player.typeId == "minecraft:player" ){
			let v = vehicle.getVelocity();
			let abs_v = Math.sqrt(v.x*v.x + v.y*v.y + v.z*v.z);
			player.runCommand(`titleraw @s[tag=!reload,tag=!down] actionbar {"rawtext":[{"text":"§f§rzex.gvc.v${Math.round(abs_v*20*100)/100}m/s\n"},${subWeapon(player,vehicle)},${mainWeapon0(player,vehicle)},${mainWeapon1(player,vehicle)},${mainWeapon2(player,vehicle)}]}`);
		}
		else if( player.hasTag(`raid`) && vehicle.hasTag(`is_enemy`) ){
			vehicle.remove();
		}
		else if( player.hasTag(`cantriding`) && vehicle.hasTag(`is_enemy`) ){
			vehicle.remove();
			player.removeTag(`cantriding`);
		}
	}
	else if( e.id == "zex:vheri"){
		let vehicle = e.sourceEntity;
		const player = vehicle.getComponent(EntityComponentTypes.Rideable).getRiders()[0];
		if( player.typeId == "minecraft:player" ){
			let v = vehicle.getVelocity();
			let abs_v = Math.sqrt(v.x*v.x + v.y*v.y + v.z*v.z);
			player.runCommand(`titleraw @s[tag=!reload,tag=!down] actionbar {"rawtext":[{"text":"§f§rzex.gvc.v${Math.round(abs_v*20*100)/100}m/s\n"},${subWeapon(player,vehicle)},${mainWeapon0(player,vehicle)},${mainWeapon1(player,vehicle)},${mainWeapon2(player,vehicle)}]}`);
		}
		else if( player.hasTag(`raid`) && vehicle.hasTag(`is_enemy`) ){
			vehicle.remove();
		}
		else if( player.hasTag(`cantriding`) && vehicle.hasTag(`is_enemy`) ){
			vehicle.remove();
			player.removeTag(`cantriding`);
		}
		else if( player.target != undefined ){
			let abs_v = vehicle.getComponent(EntityComponentTypes.Movement).defaultValue;
			vehicle.clearVelocity();
			const P_t = player.target.location;
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
			if( distance > 16 ){
				let fly = 0.25;
				if( vehicle.isOnGround ){ fly = 10; }
				vehicle.applyImpulse({x:E_target.x*abs_v,y:E_target.y*abs_v+fly,z:E_target.z*abs_v});
			}

		}
		else if( player.target == undefined ){
			vehicle.clearVelocity();
			let fly = 0;
			if( vehicle.isOnGround ){ fly = 10; }
			vehicle.applyImpulse({x:0,y:fly,z:0});
		}
	}
	else if( e.id == "zex:test" ){
		const player = e.sourceEntity;
		const a = Infinity;
		player.setDynamicProperty(`gvcv5:gunUsed`,0);
	}
	else if( e.id == "zex:aamissile"){
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
			maxDistance:32,
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
			const abs_v = 2;
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
			if( V_ma < 0.5 ){
				const V = player.getViewDirection();
				missile.clearVelocity();
				missile.applyImpulse( { 
					x: V.x * 2,
					y: V.y * 2,
					z: V.z * 2
				} )
			}
			else{
				missile.applyImpulse( { 
					x: V_m.x,
					y: V_m.y,
					z: V_m.z
				} )
			}

		}
	}
	else if( e.id == "zex:horming"){
		const missile = e.sourceEntity;
		let gunName = missile.typeId
		if( gunName.includes("fire:ads_") ){ gunName = gunName.replace("fire:ads_",""); }
		else if( gunName.includes("fire:") ){ gunName = gunName.replace("fire:",""); }
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

	else if( e.id == "zex:chkride"){
		if( world.getDynamicProperty(`gvcv5:airCraftWithItem`) ){
			const airCraft = e.sourceEntity;
			const p = airCraft.getComponent(EntityComponentTypes.Rideable).getRiders()[0];
			let noItem = true;
			for(let i = 0; i < 36; i++){
				let Haditem = p.getComponent("inventory").container.getItem(i);
				if( Haditem != undefined && Haditem.typeId != "minecraft:air" ){
					airCraft.runCommand(`ride @s evict_riders`);
					noItem = false;
					p.sendMessage(`§cYou can't ride this vehicle with items!`);
					p.runCommand(`clear @s minecraft:barrier`);
					break;
				}
			}
			if( noItem ){
				for(let i = 0; i < 36; i++){
					p.runCommand(`replaceitem entity @s slot.inventory ${i} gun:no 1 0 {"item_lock": { "mode": "lock_in_slot" } }`);
				}
				p.addTag(`onAir`);
				p.runCommand(`give @s gun:mgg 1 0 {"item_lock": { "mode": "lock_in_slot" } }`);
				p.runCommand(`give @s gun:tank 1 0 {"item_lock": { "mode": "lock_in_slot" } }`);
				p.runCommand(`give @s gun:camera 1 0 {"item_lock": { "mode": "lock_in_slot" } }`);
				p.runCommand(`give @s zex:mtype 1 0 {"item_lock": { "mode": "lock_in_slot" } }`);
				p.runCommand(`give @s spyglass 1 0 {"item_lock": { "mode": "lock_in_slot" } }`);
				p.runCommand(`give @s gun:no 4 0 {"item_lock": { "mode": "lock_in_slot" } }`);
			}
		}
	}
	else if( e.id == "zex:view"){
		const view = e.sourceEntity.getRotation();
		world.sendMessage(`x:${view.x} y:${view.y}`);
		
	}
	else if( e.id == "zex:scale"){
		let entity = e.sourceEntity;
		entity.getComponent("minecraft:scale").value = Number(e.message)
		
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
			player.triggerEvent(`fire:${gunName}`);
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
	}
	else if (e.id === "gvcv5:vgun"){
		//tag=!reload,tag=!down
		//titleraw @s[tag=!reload,tag=!down] actionbar {{\"rawtext\":[{{\"text\":\"{1} \"}},{{\"score\":{{\"name\":\"@s\",\"objective\":\"{0}\"}}}},{{\"text\":\"/{2}\"}}]}}
		//f.write("execute if entity @s[tag=autoReload,tag=!reload,tag=!down,scores={{{0}=0}},hasitem={{item={1}}}] run scriptevent gvcv5:reload {0}\n".format(gun_id,gun_ammo))
		let player = e.sourceEntity;
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
		if( !player.hasTag(`reload`) && !player.hasTag(`down`) ){
			player.runCommand(`titleraw @s actionbar {\"rawtext\":[{\"translate\":\"script.gvcv5:${Ammo}.name\"},{\"text\":\" ${maxAmmo-usedGun-damage}/${maxAmmo}\"}]}`)
		}
		if( damage >= maxAmmo ){
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
		if( player.isSneaking && !player.hasTag(`reload`) && !player.hasTag(`down`) ){
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
		else if( !player.hasTag(`reload`) && !player.hasTag(`down`) ){
			player.runCommand(`titleraw @s actionbar {\"rawtext\":[{\"translate\":\"script.gvcv5:${Ammo}.name\"},{\"text\":\" ${maxAmmo-usedGun-damage}/${maxAmmo}\"}]}`)
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
		const reloadTime = gunData[`${gunName}`]["reloadTime"];
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
			if( world.getDynamicProperty(`gvcv5:doBulletSpend`) == false ){
				p.addEffect("slowness", reloadTime,{ amplifier: 2 });
				p.addTag("reload")
				gun.getComponent(ItemComponentTypes.Durability).damage = 0;
				p.getComponent(EntityComponentTypes.Equippable).setEquipment(EquipmentSlot.Mainhand,gun);
				world.scoreboard.getObjective("reloading").setScore(p,Number(reloadTime));
				p.runCommand("playsound reload.ak47 @s ~~~ ");
			}
			if( ench.hasEnchantment(`minecraft:infinity`) ){
				p.addEffect("slowness", reloadTime,{ amplifier: 2 });
				p.addTag("reload")
				gun.getComponent(ItemComponentTypes.Durability).damage = 0;
				p.getComponent(EntityComponentTypes.Equippable).setEquipment(EquipmentSlot.Mainhand,gun);
				world.scoreboard.getObjective("reloading").setScore(p,Number(reloadTime));
				p.runCommand("playsound reload.ak47 @s ~~~ ");
			}
			else if (c > 0){
				if( c > damage ){
					gun.getComponent(ItemComponentTypes.Durability).damage = 0;
					p.getComponent(EntityComponentTypes.Equippable).setEquipment(EquipmentSlot.Mainhand,gun);
					p.runCommand(`clear @s ${Ammo} 0 ${damage}`);
				}
				else{
					gun.getComponent(ItemComponentTypes.Durability).damage = damage - c;
					p.getComponent(EntityComponentTypes.Equippable).setEquipment(EquipmentSlot.Mainhand,gun);
					p.runCommand(`clear @s ${Ammo} 0 ${c}`);
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