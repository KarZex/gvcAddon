import { world, system, Entity,ItemComponentTypes,EntityComponentTypes,EquipmentSlot  } from "@minecraft/server";


//world.getEntity(`a`).getVelocity()

export function absVector3( V ){
    let abs_x = V.x * V.x;
    let abs_y = V.y * V.y;
    let abs_z = V.z * V.z;
    return Math.sqrt(abs_x + abs_y + abs_z)
}
export function absVector2( V ){
    let abs_x = V.x * V.x;
    let abs_z = V.z * V.z;
    return Math.sqrt(abs_x + abs_z)
}

export function DistanceVector3( V1,V2 ){
    let distance_x = (V2.x - V1.x) * (V2.x - V1.x);
    let distance_y = (V2.y - V1.y) * (V2.y - V1.y);
    let distance_z = (V2.z - V1.z) * (V2.z - V1.z);
    return Math.sqrt(distance_x + distance_y + distance_z);
}
export function DistanceVector3in2dim( V1,V2 ){
    let distance_x = (V2.x - V1.x) * (V2.x - V1.x);
    let distance_z = (V2.z - V1.z) * (V2.z - V1.z);
    return Math.sqrt(distance_x + distance_z);
}
export function Vector2Sub( V1,V2 ){
    let distance_x = (V2.x - V1.x);
    let distance_y = (V2.y - V1.y);
    let distance_z = (V2.z - V1.z);
    return {
        x:distance_x,
        y:distance_y,
        z:distance_z
    }
}
export function NrgativeVector2( V ){
    let distance_x = (V2.x + V1.x);
    let distance_y = (V2.y + V1.y);
    let distance_z = (V2.z + V1.z);
    return {
        x:V.x,
        y:V,
        z:V.z
    }
}
export function Vector3Add( V1,V2 ){
    let distance_x = (V2.x + V1.x);
    let distance_y = (V2.y + V1.y);
    let distance_z = (V2.z + V1.z);
    return {
        x:distance_x,
        y:distance_y,
        z:distance_z
    }
}
export function Vector3Sub( V1,V2 ){
    let distance_x = (V2.x - V1.x);
    let distance_y = (V2.y - V1.y);
    let distance_z = (V2.z - V1.z);
    return {
        x:distance_x,
        y:distance_y,
        z:distance_z
    }
}
export function getVector3E( V ){
    let distance = absVector3(V)
    return {
        x:V.x/distance,
        y:V.y/distance,
        z:V.z/distance
    }
}

export function getVector2E( V ){
    let distance = absVector2(V)
    return {
        x:V.x/distance,
        y:0,
        z:V.z/distance
    }
}

export function getEVelocity( V ){

}

export function isMoving(user){
    const v = user.getVelocity();
    return (absVector3(v) > 0.01)
}

export function getUnderBlocksTo(dimension,location,under,type){
    dimension.getBlock(location)
    for( let i = 0; i < under; i++ ){
        const Target = {
            x:location.x,
            y:location.y-i,
            z:location.z
        }
        if( dimension.getBlock(Target).typeId == type ){
            continue
        }
        else{
            return (i/under)
        }
    }

    return 1
}

export function setTruedeg( thita ){
    const target_sin = Math.sin(thita * Math.PI / 180);
    const target_cos = Math.cos(thita * Math.PI / 180);

    return Math.atan2(target_sin,target_cos) * 180 / Math.PI
}

export function turning( V_1,V_0,thita ){
    let d = V_1;
    if( Math.asin(d.x) > Math.asin(V_0.x) + thita ){
        d.x = V_0.x + Math.sin(thita);
    }
    if( Math.asin(d.x) < Math.asin(V_0.x) - thita ){
        d.x = V_0.x - Math.sin(thita);
    }
    if( Math.asin(d.y) > Math.asin(V_0.y) + thita ){
        d.y = V_0.y + Math.sin(thita);
    }
    if( Math.asin(d.y) < Math.asin(V_0.y) - thita ){
        d.y = V_0.y - Math.sin(thita);
    }
    if( Math.asin(d.z) > Math.asin(V_0.z) + thita ){
        d.z = V_0.z + Math.sin(thita);
    }
    if( Math.asin(d.z) < Math.asin(V_0.z) - thita ){
        d.z = V_0.z - Math.sin(thita);
    }
    return d;

}
export function turning2( V_1,V_0,thita ){
    let d = V_1;
    let rot_V_1 = Math.atan2(V_1.z,V_1.x);
    let rot_V_0 = Math.atan2(V_0.z,V_0.x);
    if( rot_V_0 + Math.PI < rot_V_1 ){
        rot_V_1 = rot_V_1 - Math.PI*2
    }
    if( rot_V_0 - Math.PI > rot_V_1 ){
        rot_V_1 = rot_V_1 + Math.PI*2
    }
    if( rot_V_0 + Math.PI > rot_V_1 && rot_V_1 > rot_V_0 + thita ){
        d.x = Math.cos(rot_V_0 + thita);
        d.z = Math.sin(rot_V_0 + thita);
    }
    if( rot_V_0 - Math.PI < rot_V_1 && rot_V_1 < rot_V_0 - thita ){
        d.x = Math.cos(rot_V_0 - thita);
        d.z = Math.sin(rot_V_0 - thita);
    }
    if( Math.asin(d.y) > Math.asin(V_0.y) + thita ){
        d.y = V_0.y + Math.sin(thita);
    }
    if( Math.asin(d.y) < Math.asin(V_0.y) - thita ){
        d.y = V_0.y - Math.sin(thita);
    }
    return d;

}
export function ifturning2( V_1,V_0,thita ){
    let d = V_1;
    let rot_V_1 = Math.atan2(V_1.z,V_1.x);
    let rot_V_0 = Math.atan2(V_0.z,V_0.x);
    if( rot_V_0 + Math.PI < rot_V_1 ){
        rot_V_1 = rot_V_1 - Math.PI*2
    }
    if( rot_V_0 - Math.PI > rot_V_1 ){
        rot_V_1 = rot_V_1 + Math.PI*2
    }
    if( rot_V_0 + Math.PI > rot_V_1 && rot_V_1 > rot_V_0 + thita ){
        return false
    }
    else if( rot_V_0 - Math.PI < rot_V_1 && rot_V_1 < rot_V_0 - thita ){
        return false
    }
    if( Math.asin(d.y) > Math.asin(V_0.y) + thita ){
        return false
    }
    else if( Math.asin(d.y) < Math.asin(V_0.y) - thita ){
        return false
    }
    return true;

}

export function isSpeedMoving(user){
    const v = user.getVelocity();
    return (absVector3(v) > 0.1)
}

export function roundTo(value, decimals) {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}


export function print( text ){
    world.sendMessage(`§a[debug]§r:${text}`)
}
export function setBladeDamage( damage,user ){
    let chance = 1;
    const bladeSlot = user.getComponent(EntityComponentTypes.Equippable).getEquipmentSlot(EquipmentSlot.Mainhand);
    const Tblade = user.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Mainhand);
    const bladeItemEnch = Tblade.getComponent(ItemComponentTypes.Enchantable);
    if( bladeItemEnch.hasEnchantment(`minecraft:unbreaking`) ){
        const level = bladeItemEnch.getEnchantment(`minecraft:unbreaking`).level;
        chance = level
    }
    const dmgCom = Tblade.getComponent(ItemComponentTypes.Durability);
    const Adamage = dmgCom.damage + damage;
    const MaxDamage = dmgCom.maxDurability;
    if( Math.random() < 1/chance ){
        if( Adamage < MaxDamage  ){
            Tblade.getComponent(ItemComponentTypes.Durability).damage = Adamage;
            Tblade.setDynamicProperty("currentDurability",Adamage);
            user.getComponent("minecraft:inventory").container.setItem(user.selectedSlotIndex, Tblade);
        }
        else {
            Tblade.getComponent(ItemComponentTypes.Durability).damage = MaxDamage;
            Tblade.setDynamicProperty("currentDurability",MaxDamage);
            user.getComponent("minecraft:inventory").container.setItem(user.selectedSlotIndex, Tblade);
            user.dimension.playSound(`random.break`,user.location);
        }
    }

}


export function playBladeSound(user,sound){
	if( sound == `item.trident.throw` ){
		user.dimension.playSound( sound,user.location,{ pitch:0.7, volume:3 });
	}
    else{
        user.dimension.playSound( sound,user.location,{ pitch:1, volume:3 });
    }
}