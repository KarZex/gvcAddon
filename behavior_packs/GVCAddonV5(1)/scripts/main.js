import { world, system, EntityDamageCause, EquipmentSlot, Block  } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { gunData } from "./guns";

//ブロックを叩くことで、リロード
world.afterEvents.entityHitBlock.subscribe( e => {
	let p = e.damagingEntity;
	let g = p.getComponent("equippable").getEquipmentSlot(EquipmentSlot.Mainhand).getItem();
	if( p.typeId === "minecraft:player" && g.typeId.includes("gun") && p.getEffect("slowness") == undefined ){
		let gunName = g.typeId.replace("gun:","");
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
				p.addEffect("slowness", reloadTime);
				p.addTag("reload")
				world.scoreboard.getObjective("reloading").setScore(p,Number(reloadTime));
				p.runCommand("playsound gun.reload @s ~~~ ");
			}
		}
	}
})

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
		let gunName = e.projectile.typeId
		if( gunName.includes("fire:ads_") ){ gunName = gunName.replace("fire:ads_",""); }
		else if( gunName.includes("fire:") ){ gunName = gunName.replace("fire:",""); }
		let damage = gunData[`${gunName}`]["damage"];
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
},)