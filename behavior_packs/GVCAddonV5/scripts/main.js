import { world, system, EntityDamageCause, ItemComponentTypes  } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { gunData } from "./guns";

//ブロックを叩くことで、リロード
world.afterEvents.entityHitBlock.subscribe( e => {
	let p = e.damagingEntity;
	let g = p.getComponent("inventory").container.getItem(p.selectedSlot);
	if( p.typeId === "minecraft:player" && g.typeId.includes("gun") && p.getEffect("slowness") == undefined ){
		let gunName = g.typeId.replace("gun:","");
        let maxGunAmmo = gunData[`${gunName}`]["maxGunAmmo"];
		let d = Number(maxGunAmmo) - Number(world.scoreboard.getObjective(gunName).getScore(p)) ;
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
					d = d + c;
					world.scoreboard.getObjective(gunName).setScore(p,d);
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


world.afterEvents.projectileHitEntity.subscribe( e => {
	if( e.projectile.typeId.includes("fire")){
		let vict = e.getEntityHit().entity;
		let gunName = e.projectile.typeId
		if( gunName.includes("fire:s") ){ gunName = gunName.replace("fire:s",""); }
		else if( gunName.includes("fire:") ){ gunName = gunName.replace("fire:",""); }
		let damage = gunData[`${gunName}`]["damage"];
        if( vict.getEffect("resistance") == undefined && vict.hasTag("antiBullet") == false ){
            vict.applyDamage(damage,{ cause: EntityDamageCause.override,damagingEntity: e.source });
            vict.applyKnockback(0, 0, 0, 0);
        }
	}
})

