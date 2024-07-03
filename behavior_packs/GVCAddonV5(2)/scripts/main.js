import { world, system, EntityDamageCause, EquipmentSlot, Block, Entity, EntityComponentTypes  } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { gunData } from "./guns";
import { craftData } from "./crafts";

function setArmorValue( itemName ){
	if( itemName.includes("leather") ){ return 0.05 }
	else if( itemName.includes("chainmail") ){ return 0.125 }
	else if( itemName.includes("iron") ){ return 0.15 }
	else if( itemName.includes("golden") ){ return 0.15 }
	else if( itemName.includes("diamond") ){ return 0.225 }
	else if( itemName.includes("plastic") ){ return 0.2 }
	else if( itemName.includes("ghilliesuit") ){ return 0.05 }
	else if( itemName.includes("trench") ){ return 0.15 }
	else if( itemName.includes("mghelmet") ){ return 0.15 }
	else if( itemName.includes("firemask") ){ return 0.05 }
	else if( itemName.includes("droneguided") ){ return 0.15 }
	else if( itemName.includes("netherite") ){ return 0.25 }
	else { return 0 }
}

world.afterEvents.projectileHitBlock.subscribe( e => {
	if ( e.getBlockHit().block.typeId != undefined && e.getBlockHit().block.typeId == `gvcv5:beacon`){
		e.dimension.playSound("random.explode",e.location);
		let loc = e.getBlockHit().block.location;
		e.dimension.spawnParticle("minecraft:huge_explosion_emitter",e.location);
		e.dimension.runCommand(`setblock ${loc.x} ${loc.y} ${loc.z} air`);
		
	}
})

world.afterEvents.projectileHitEntity.subscribe( e => {
	if( e.projectile.typeId.includes("fire")){
		let vict = e.getEntityHit().entity;
		let def = 0;
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
		let gunName = e.projectile.typeId
		if( gunName.includes("fire:ads_") ){ gunName = gunName.replace("fire:ads_",""); }
		else if( gunName.includes("fire:") ){ gunName = gunName.replace("fire:",""); }
		
		if (def > 1){ def = 1 }
		let damage = gunData[`${gunName}`]["damage"] *  (1 - def);
        if( vict.getEffect("resistance") == undefined && vict.hasTag("antiBullet") == false ){
            vict.applyDamage(damage,{ cause: EntityDamageCause.override,damagingEntity: e.source });
            vict.applyKnockback(0, 0, 0, 0);
        }
		e.projectile.triggerEvent("minecraft:explode");
	}
})

system.afterEvents.scriptEventReceive.subscribe( e => {
	if (e.id === "zex:recoil"){
		let pos = e.sourceEntity.getRotation();
		pos.x = pos.x - Number(e.message)
		e.sourceEntity.setRotation(pos)
		e.sourceEntity.sendMessage(`${e.message}`)
		e.sourceEntity.sendMessage(`x:${pos.x} y:${pos.y}`)
		e.sourceEntity.setRotation({x:0, y:0})
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
			if (c > 0){
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
				p.runCommand("playsound gun.reload @s ~~~ ");
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
					buyData.push({ translate: `script.gvcv5.${sells[j]}.name` });// `script.gvcv5.${sells[j]}.namex${buys[i]["cost"][j]} `
					buyData.push({ text: `x${buys[i]["cost"][j]}` });// `script.gvcv5.${sells[j]}.namex${buys[i]["cost"][j]} `
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
					player.sendMessage("§cNo material!");
				}
				player.runCommand(`scriptevent gvcv5:craft ${craftType}`);
			}
		} )
		
	}
},)