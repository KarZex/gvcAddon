import { world, system, EquipmentSlot, EntityComponentTypes,GameMode, EntityInitializationCause, ItemComponent, ItemComponentTypes, TicksPerSecond, EffectType, EffectTypes, EntityDamageCause, InputButton, ButtonState, LiquidType  } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { gunData } from "./guns";
import { vehicleData } from "./vehicle";
import { absVector2,getVector2E,getEntityName,absVector3,Vector2Sub,isMoving,DistanceVector3,getUnderBlocksTo,Vector3Sub,getVector3E,Vector3Add,turning,turning2,DistanceVector3in2dim} from "./usefulFunction"

async function launchMissile(boss) {
	for( let i = 0; i < 4; i++ ){
		const missile = world.getDimension(`minecraft:overworld`).spawnEntity(`fire:mamissile`,{x:boss.location.x,y:boss.location.y+4,z:boss.location.z});
		missile.getComponent(EntityComponentTypes.Projectile).owner = boss;
		const target = world.getDimension(`minecraft:overworld`).getPlayers({ maxDistance:64,closest:1,location:boss.location })[0];
		boss.setDynamicProperty(`gvcv5:missilelocation`,{x:target.location.x,y:target.location.y-16,z:target.location.z})
		missile.getComponent(EntityComponentTypes.Projectile).shoot(boss.getViewDirection());
		await system.waitTicks(2);
	}
}

system.runInterval( () => {
	const overTanks = world.getDimension(`minecraft:overworld`).getEntities({type:`gvcv5:mer08r`});
	for( const boss of overTanks ){
		launchMissile(boss);
	}
},100)