import { world, EquipmentSlot } from "@minecraft/server";


function gvcv5UsePhone( event ){
    event.source.runCommand(`function noteamphone`);
}

function gvcv5UseTeamPhone( event ){
    const team = event.itemStack.typeId.replace(`zex:phone_`,``);
    event.source.runCommand(`scriptevent gvcv5:phone_locked ${team}`);
}

function gvcv5UseTPBlock( event ){
    const type = event.block.typeId.replace(`gvcv5:spawn_`,``);
    const player = event.player;
    const item = player.getComponent("equippable").getEquipmentSlot(EquipmentSlot.Mainhand);
    if( item.typeId.includes(`${type}`) ){
        player.runCommand(`scriptevent gvcv5:phone_set_tp_block ${type}`);
    }
}


world.beforeEvents.worldInitialize.subscribe( e => {
    e.blockComponentRegistry.registerCustomComponent(`gvcv5:tpblock`,{onPlayerInteract: gvcv5UseTPBlock});
    e.itemComponentRegistry.registerCustomComponent(`gvcv5:usephone`,{onUse: gvcv5UsePhone});
    e.itemComponentRegistry.registerCustomComponent(`gvcv5:teamphone`,{onUse: gvcv5UseTeamPhone});
} )