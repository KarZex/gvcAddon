import { world, system, EquipmentSlot, EntityComponentTypes  } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { gunData } from "./guns";
import { craftData } from "./crafts";
import "./compornents";

function setArmorValue( itemName ){
	if( itemName.includes("leather") ){ return 0.05 }
	else if( itemName.includes("chainmail") ){ return 0.1 }
	else if( itemName.includes("iron") ){ return 0.15 }
	else if( itemName.includes("golden") ){ return 0.15 }
	else if( itemName.includes("diamond") ){ return 0.25 }
	else if( itemName.includes("plastic") ){ return 0.2 }
	else if( itemName.includes("ghilliesuit") ){ return 0.05 }
	else if( itemName.includes("trench") ){ return 0.15 }
	else if( itemName.includes("mghelmet") ){ return 0.15 }
	else if( itemName.includes("firemask") ){ return 0.05 }
	else if( itemName.includes("droneguided") ){ return 0.15 }
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
	const airbone = projectile.dimension.spawnEntity(`gvcv5:ca`,spawnPoint);
	airbone.triggerEvent(`minecraft:spawned_from_air`);
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

function airstrike1( location,team ){

}

async function airstrike(projectile,level,team){
	const dimension = projectile.dimension;
	projectile.dimension.spawnParticle(`zex:${team}_ring1`,projectile.location);
	let Radius = Math.random() * 5 * level;
	let Sigma = Math.random() * 2 * Math.PI;
	const location = { 
		x: projectile.location.x,
		y: 320,
		z: projectile.location.z
	}
	let spawnPointLocation = location;
	const num = Math.pow(5,level);
	for( let i = 0; i < num; i++ ){
		dimension.spawnEntity(`gvcv5:airstrike_${team}`,spawnPointLocation);
		Radius = Math.random() * 5 * level;
		Sigma = Math.random() * 2 * Math.PI;
		spawnPointLocation = { 
			x: location.x + Radius * Math.cos(Sigma),
			y: 320,
			z: location.z + Radius * Math.sin(Sigma)
		}
		await system.waitTicks((4-level)*(4-level));
		
	}
}



world.afterEvents.projectileHitEntity.subscribe( e => {
	if( e.projectile.typeId.includes("fire")){
		let vict = e.getEntityHit().entity;
		let def = 0;
		let gunName = e.projectile.typeId
		if( gunName.includes("fire:ads_") ){ gunName = gunName.replace("fire:ads_",""); }
		else if( gunName.includes("fire:") ){ gunName = gunName.replace("fire:",""); }
		let damageType = gunData[`${gunName}`]["damageType"];
		const equipmentComp = vict.getComponent(EntityComponentTypes.Equippable)
		if( equipmentComp ){
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
		if (def > 1){ def = 1 }
		let damage = gunData[`${gunName}`]["damage"] *  (1 - def);
		if ( vict.typeId == "minecraft:player" ){ 
			damage = damage * world.getDynamicProperty("gvcv5:playerDamage");
		}
		else{
			damage = damage * world.getDynamicProperty("gvcv5:mobDamage");
		}
        if( vict.getEffect("resistance") == undefined && vict.hasTag("antiBullet") == false ){
            vict.applyDamage(damage,{ cause: damageType,damagingEntity: e.source });
            vict.applyKnockback(0, 0, 0, 0);
        }
		else if( damageType != `override` ){
            vict.applyDamage(damage,{ cause: damageType,damagingEntity: e.source });
            vict.applyKnockback(0, 0, 0, 0);
		}
		e.projectile.triggerEvent("minecraft:explode");
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

system.afterEvents.scriptEventReceive.subscribe( e => {
	if( e.id == "zex:air"){
		const airCraft = e.sourceEntity;
		const player = airCraft.getComponent(EntityComponentTypes.Rideable).getRiders()[0];
		let v = airCraft.getVelocity();
		let abs_v = Math.sqrt(v.x*v.x + v.y*v.y + v.z*v.z);
		let r = {
			x:v.x/abs_v,
			y:v.y/abs_v,
			z:v.z/abs_v
		}

		if( abs_v > 2.0 ){
			abs_v = 2.0
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
			airCraft.applyImpulse({x:d.x*abs_v,y:d.y*abs_v,z:d.z*abs_v});
		}
		player.runCommand(`titleraw @s[tag=!reload,tag=!down] actionbar {"rawtext":[{"text":"Speed:${Math.round(abs_v*20*100)/100}m/s"}]}`)
	

	}

	else if( e.id == "zex:view"){
		const view = e.sourceEntity.getRotation();
		world.sendMessage(`x:${view.x} y:${view.y}`);
		
	}
	else if( e.id == "zex:scale"){
		const entity = e.sourceEntity;
		entity.getComponent("minecraft:scale").value = Number(e.message)
		
	}

	else if( e.id == "zex:start" ){
		e.sourceEntity.runCommand(`scoreboard players set S building 1`);
		e.sourceEntity.runCommand(`scoreboard players set M building 1`);
		e.sourceEntity.runCommand(`scoreboard players set L building 1`);
		e.sourceEntity.runCommand(`scoreboard players set A building 1`);
	}
	//ブロックを叩くことで、リロード
	else if (e.id === "gvcv5:reload"){
		let p = e.sourceEntity;
		const gunName = e.message;
		let maxGunAmmo = gunData[`${gunName}`]["maxGunAmmo"];
		let s = Number(world.scoreboard.getObjective(gunName).getScore(p));
		let d = Number(maxGunAmmo) - s;
		let reloadTime = gunData[`${gunName}`]["reloadTime"];
		let Ammo = gunData[`${gunName}`]["bullet"];
		let c = 0;
		if( d > 0 ){
			//インベントリから弾の個数を取得する
			for(let i = 0; i < 36; i++){
				let Haditem = p.getComponent("inventory").container.getItem(i);
				if( Haditem != undefined && Haditem.typeId === Ammo ){
					c += p.getComponent("inventory").container.getItem(i).amount;
				}
			}
			if( world.getDynamicProperty(`gvcv5:doBulletSpend`) == false ){
				p.addEffect("slowness", reloadTime,{ amplifier: 2 });
				p.addTag("reload")
				world.scoreboard.getObjective(gunName).setScore(p,Number(maxGunAmmo));
				world.scoreboard.getObjective("reloading").setScore(p,Number(reloadTime));
				p.runCommand("playsound reload.ak47 @s ~~~ ");
			}
			else if (c > 0){
				if( c > d ){
					world.scoreboard.getObjective(gunName).setScore(p,Number(maxGunAmmo));
					p.runCommand(`clear @s ${Ammo} 0 ${d}`);
				}
				else{
					s = s + c;
					world.scoreboard.getObjective(gunName).setScore(p,s);
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
			form.textField(`Player Damage`, `Current is ${world.getDynamicProperty(`gvcv5:playerDamage`)}`,`${world.getDynamicProperty(`gvcv5:playerDamage`)}`);
			form.textField(`Mob Damage`, `Current is ${world.getDynamicProperty(`gvcv5:mobDamage`)}`,`${world.getDynamicProperty(`gvcv5:mobDamage`)}`);
			form.toggle(`Bullet Spend`, world.getDynamicProperty(`gvcv5:doBulletSpend`));
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
				}
			} )
		}
		else if( e.message == `building`){
			const form = new ModalFormData();
			form.title(`Building Settings`);
			form.toggle(`Small Building Spawn`, Boolean( world.scoreboard.getObjective(`building`).getScore(`S`) == 1));
			form.toggle(`Medium Building Spawn`, Boolean( world.scoreboard.getObjective(`building`).getScore(`M`) == 1));
			form.toggle(`Large Building Spawn`, Boolean( world.scoreboard.getObjective(`building`).getScore(`L`) == 1));
			form.toggle(`Allies Building Spawn`, Boolean( world.scoreboard.getObjective(`building`).getScore(`A`) == 1));
			form.show(e.sourceEntity).then( result => {
				if ( !result.canceled ){
					if( world.scoreboard.getObjective(`building`).getScore(`S`) != Number(result.formValues[0]) ){
						world.scoreboard.getObjective(`building`).setScore(`S`,Number(result.formValues[0]));
						world.sendMessage(`Small Building Spawn is now ${result.formValues[0]}`);
					}
					if( world.scoreboard.getObjective(`building`).getScore(`M`) != Number(result.formValues[1]) ){
						world.scoreboard.getObjective(`building`).setScore(`M`,Number(result.formValues[1]));
						world.sendMessage(`Medium Building Spawn is now ${result.formValues[1]}`);
					}
					if( world.scoreboard.getObjective(`building`).getScore(`L`) != Number(result.formValues[2]) ){
						world.scoreboard.getObjective(`building`).setScore(`L`,Number(result.formValues[2]));
						world.sendMessage(`Large Building Spawn is now ${result.formValues[2]}`);
					}
					if( world.scoreboard.getObjective(`building`).getScore(`A`) != Number(result.formValues[3]) ){
						world.scoreboard.getObjective(`building`).setScore(`A`,Number(result.formValues[3]));
						world.sendMessage(`Allies Building Spawn is now ${result.formValues[3]}`);
					}
				}
			} )


		}
		else if( e.message == `mobSpawn`){
			const form = new ModalFormData();
			form.title(`mobSpawn Settings`);
			form.toggle(`Block Spawn`, world.getDynamicProperty(`gvcv5:doSpawnFromBlock`));
			form.toggle(`Beacon Spawn`, world.getDynamicProperty(`gvcv5:doSpawnFromBeacon`));
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

	}
},)