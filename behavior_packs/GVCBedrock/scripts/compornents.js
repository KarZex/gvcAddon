import { world, EquipmentSlot, system, EntityComponentTypes } from "@minecraft/server";
import { Vector3Add } from "./usefulFunction"


const gvcv5SpawnCommponent = {
	onPlace(e,p){
		const block = e.block;
		const params = p.params;
		const spawn = params.spawn_mob;
		const chestload = params.chest_load;
        const spawnLocation = block.location;
        if( world.gameRules.commandBlocksEnabled ){
            const aboveBlock = block.above();
            if( world.getDynamicProperty(`gvcv5:doSpawnFromBlock`) ){
                if( chestload ) {
                    if( aboveBlock.typeId == `minecraft:chest` ){
                        let spawner
                        try{
                            try{
                                const mainHand = aboveBlock.getComponent(`minecraft:inventory`).container.getSlot(0).getItem().typeId;
                                if( mainHand.includes(`gun:`) ){
                                    spawner =  block.dimension.spawnEntity(spawn,{ x:spawnLocation.x, y:spawnLocation.y, z:spawnLocation.z },{ spawnEvent:`${mainHand.replace(`gun:`,``)}`});
                                    spawner.teleport({ x:spawnLocation.x+0.5, y:spawnLocation.y, z:spawnLocation.z+0.5 });
                                    //world.sendMessage(`${mainHand}`)
                                }
                                else{
                                    spawner =  block.dimension.spawnEntity(spawn,{ x:spawnLocation.x, y:spawnLocation.y, z:spawnLocation.z },{ spawnEvent:`melee`});
                                    spawner.teleport({ x:spawnLocation.x+0.5, y:spawnLocation.y, z:spawnLocation.z+0.5 });
                                    spawner.runCommand(`replaceitem entity @s slot.weapon.mainhand 0 ${mainHand}`);
                                }
                            }catch{}
                            try{
                                const Offhand = aboveBlock.getComponent(`minecraft:inventory`).container.getSlot(1).getItem().typeId;
                                spawner.runCommand(`replaceitem entity @s slot.weapon.offhand 0 ${Offhand}`);
                            }
                            catch{}
                            try{
                                const armorHead = aboveBlock.getComponent(`minecraft:inventory`).container.getSlot(2).getItem().typeId;
                                spawner.runCommand(`replaceitem entity @s slot.armor.head 0 ${armorHead}`);
                            }
                            catch{}
                            try{
                                const armorChest = aboveBlock.getComponent(`minecraft:inventory`).container.getSlot(3).getItem().typeId;
                                spawner.runCommand(`replaceitem entity @s slot.armor.chest 0 ${armorChest}`);
                            }
                            catch{}
                            try{
                                const armorLegs = aboveBlock.getComponent(`minecraft:inventory`).container.getSlot(4).getItem().typeId;
                                spawner.runCommand(`replaceitem entity @s slot.armor.legs 0 ${armorLegs}`);
                            }
                            catch{}
                            try{
                                const armorFeet = aboveBlock.getComponent(`minecraft:inventory`).container.getSlot(5).getItem().typeId;
                                spawner.runCommand(`replaceitem entity @s slot.armor.feet 0 ${armorFeet}`);
                            }
                            catch{}
                            
                        }
                        catch{}
                        try{
                            aboveBlock.getComponent(`minecraft:inventory`).container.clearAll()
                        }catch{}
                        aboveBlock.dimension.setBlockType(aboveBlock.location,`minecraft:air`);
                    }
                    else{
                        const spawner =  block.dimension.spawnEntity(spawn,{ x:spawnLocation.x, y:spawnLocation.y, z:spawnLocation.z },{ spawnEvent:`minecraft:spawned_from_block`});
                        spawner.teleport({ x:spawnLocation.x+0.5, y:spawnLocation.y, z:spawnLocation.z+0.5 });
                    }
                    
                    //const spawner =  event.block.dimension.spawnEntity(spawn,{ x:spawnLocation.x, y:spawnLocation.y, z:spawnLocation.z },{ spawnEvent:`minecraft:spawned_from_block`});
                    //spawner.teleport({ x:spawnLocation.x+0.5, y:spawnLocation.y, z:spawnLocation.z+0.5 });
                    aboveBlock.dimension.setBlockType(aboveBlock.location,`minecraft:air`);
                }
                else{
                    block.dimension.spawnEntity(spawn,{ x:spawnLocation.x, y:spawnLocation.y, z:spawnLocation.z }).teleport({ x:spawnLocation.x+0.5, y:spawnLocation.y, z:spawnLocation.z+0.5 });
                }
            }
            block.dimension.setBlockType(block.location,`minecraft:air`);
        }

	}
}


const gvcv5EndBlockCommponent = {
	onPlace(e,p){
		const block = e.block;
		const params = p.params;
        const building = p.params.building;
        if( world.gameRules.commandBlocksEnabled ){
            block.dimension.runCommand(`tickingarea remove ${building}`);
            block.dimension.setBlockType(block.location,`minecraft:air`);

        }
	}
}

const gvcv5MER03kBlockCommponent = {
	onPlace(e,p){
		const block = e.block;
        if( world.gameRules.commandBlocksEnabled ){
            block.dimension.spawnEntity(`gvcv5:mer03k`,event.block.location);
            block.dimension.setBlockType(event.block.location,`minecraft:air`);
        }
	}
}

const gvcv5BuildingBlockCommponent = {
	async onPlace(e,p){
		const block = e.block;
		const params = p.params;
        const building = p.params.building;
        const size = p.params.size;
        if( world.gameRules.commandBlocksEnabled ){
            const buildingLocation = {
                x:block.location.x,
                y:block.location.y - size[1],
                z:block.location.z
            }
            print(`${world.tickingAreaManager.hasCapacity( {dimension:block.dimension,from:block.location,to:{ x:block.location.x+size[0],y:block.location.y,z:block.location.z+size[2] }} )}`)
            try{
                world.tickingAreaManager.removeTickingArea(`${building}`);
            }catch{}
            world.tickingAreaManager.createTickingArea(`${building}`,{ dimension:block.dimension,from:block.location,to:{ x:block.location.x+size[0],y:block.location.y,z:block.location.z+size[2] } });
            await system.waitTicks(5);
            world.structureManager.place(building,block.dimension,buildingLocation,{waterlogged:false})
            if( size[0] > 64 ){
                await system.waitTicks(5);
                world.structureManager.place(`${building}_x64`,block.dimension,Vector3Add(buildingLocation,{ x:64,y:0,z:0 }),{waterlogged:false})
            }
            if( size[2] > 64 ){
                await system.waitTicks(5);
                world.structureManager.place(`${building}_z64`,block.dimension,Vector3Add(buildingLocation,{ x:0,y:0,z:64 }),{waterlogged:false})
            }
            if( size[0] > 64 && size[2] > 64 ){
                await system.waitTicks(5);
                world.structureManager.place(`${building}_x64z64`,block.dimension,Vector3Add(buildingLocation,{ x:64,y:0,z:64 }),{waterlogged:false})
            }
            //await system.waitTicks(105);
            //world.tickingAreaManager.removeTickingArea(`${building}Generate`);
            //block.dimension.setBlockType(block.location,`minecraft:air`);
        }
	}
}


const gvcv5LootBlockCommponent = {
	onPlace(e,p){
		const block = e.block;
		const params = p.params;
        const type = p.params.type;
        if( world.gameRules.commandBlocksEnabled ){
            const buildingLocation = block.location;
            const face = block.permutation.getState('minecraft:cardinal_direction');
            if( face == `north` ){
                block.dimension.runCommand(`setblock ${buildingLocation.x} ${buildingLocation.y} ${buildingLocation.z} chest [\"minecraft:cardinal_direction\"=\"south\"]`);
            }
            else if( face == `south` ){
                block.dimension.runCommand(`setblock ${buildingLocation.x} ${buildingLocation.y} ${buildingLocation.z} chest [\"minecraft:cardinal_direction\"=\"north\"]`);
            }
            else if( face == `west` ){
                block.dimension.runCommand(`setblock ${buildingLocation.x} ${buildingLocation.y} ${buildingLocation.z} chest [\"minecraft:cardinal_direction\"=\"east\"]`);
            }
            else if( face == `east` ){
                block.dimension.runCommand(`setblock ${buildingLocation.x} ${buildingLocation.y} ${buildingLocation.z} chest [\"minecraft:cardinal_direction\"=\"west\"]`);
            }
            if( type != `l0` ){
                block.dimension.runCommand(`loot insert ${buildingLocation.x} ${buildingLocation.y} ${buildingLocation.z} loot ${type}`);
            }
        }
	}
}

const gvcv5SpawnerCommponent = {
	onRandomTick(e,p){
		const block = e.block;
		const params = p.params;
        const type = p.params.type;
        const spawnLocation = block.location;
        if( world.gameRules.commandBlocksEnabled ){
            block.dimension.spawnEntity(type,{ x:spawnLocation.x+1, y:spawnLocation.y, z:spawnLocation.z+1 }).triggerEvent(`minecraft:spawned_from_spawner`);
            block.dimension.spawnEntity(type,{ x:spawnLocation.x-1, y:spawnLocation.y, z:spawnLocation.z }).triggerEvent(`minecraft:spawned_from_spawner`);
            block.dimension.spawnEntity(type,{ x:spawnLocation.x+1, y:spawnLocation.y, z:spawnLocation.z-1 }).triggerEvent(`minecraft:spawned_from_spawner`);
        }
	},
	onStepOn(e,p){
		const block = e.block;
		const entity = e.entity;
        const IsFire = Boolean(entity.typeId.includes(`fire`));
        const spawnLocation = {
            x:block.location.x + 0.5,
            y:block.location.y,
            z:block.location.z + 0.5
        }
        if( world.gameRules.commandBlocksEnabled && IsFire ){
            block.dimension.spawnParticle(`minecraft:large_explosion`,spawnLocation);
            block.dimension.playSound(`random.explode`,spawnLocation,{ volume:16 });
            block.dimension.setBlockType(block.location,`minecraft:air`);
        }
	}
}

const gvcv5UseCommandCommponent = {
	onPlayerInteract(e,p){
		const player = e.player;
		const params = p.params;
        const type = p.params.type;
        player.runCommand(`${type}`);
	}
}

// function gvcv5Scaffold( event ) {
//     const L = event.block.location;
//     event.block.dimension.runCommand(`fill ${L.x-16} ${L.y-16} ${L.z-16} ${L.x+15} ${L.y+15} ${L.z+15} air replace gvcv5:gvcv5_scaffold`)
//     event.block.dimension.setBlockType(event.block.location,`minecraft:air`);
// }

const gvcv5BlockExpoCommponent = {
	onStepOn(e,p){
		const block = e.block;
		const entity = e.entity;
        const IsFire = Boolean(entity.typeId.includes(`fire`));
		const params = p.params;
        const range = p.params.range;
        const isGas = p.params.is_gas;
        const fire = p.params.fire;
        const breakBlock = p.params.break_block;
        if( world.gameRules.commandBlocksEnabled && IsFire ){
            const spawnLocation = {
                x:block.location.x + 0.5,
                y:block.location.y,
                z:block.location.z + 0.5
            }
            block.dimension.setBlockType(block.location,`minecraft:air`);
            if( isGas ){
                block.dimension.runCommand(`structure load poison ${spawnLocation.x} ${spawnLocation.y} ${spawnLocation.z}`);
            }
            else{
                world.getDimension(block.dimension.id).createExplosion(spawnLocation,range,{causesFire:fire,breaksBlocks:breakBlock})
            }
        }
	},
	onBreak(e,p){
		const block = e.block;
		const params = p.params;
        const range = p.params.range;
        const isGas = p.params.is_gas;
        const fire = p.params.fire;
        const breakBlock = p.params.break_block;
        if( world.gameRules.commandBlocksEnabled ){
            const spawnLocation = {
                x:block.location.x + 0.5,
                y:block.location.y,
                z:block.location.z + 0.5
            }
            block.dimension.setBlockType(block.location,`minecraft:air`);
            if( isGas ){
                block.dimension.runCommand(`structure load poison ${spawnLocation.x} ${spawnLocation.y} ${spawnLocation.z}`);
            }
            else{
                world.getDimension(block.dimension.id).createExplosion(spawnLocation,range,{causesFire:fire,breaksBlocks:breakBlock})
            }
        }
	}
}

const gvcv5MineCommponent = {
	onStepOn(e,p){
		const block = e.block;
		const entity = e.entity;
        const IsEntity = Boolean(entity.getComponent(EntityComponentTypes.TypeFamily).hasTypeFamily(`player`) || entity.getComponent(EntityComponentTypes.TypeFamily).hasTypeFamily(`mob`) );
        const Istank = Boolean(entity.getComponent(EntityComponentTypes.TypeFamily).hasTypeFamily(`vehicle`) );
		const params = p.params;
        const antiTank = p.params.anti_tank;
        const breakBlock = p.params.break_block;
        if( world.gameRules.commandBlocksEnabled ){
            const spawnLocation = {
                x:block.location.x + 0.5,
                y:block.location.y,
                z:block.location.z + 0.5
            }
            if( antiTank && Istank ){
                block.dimension.spawnEntity(`addon:minet`,spawnLocation);
                block.dimension.setBlockType(spawnLocation,`minecraft:air`);
            }
            else if( !antiTank && IsEntity ){
                block.dimension.spawnEntity(`addon:mineh`,spawnLocation);
                block.dimension.setBlockType(spawnLocation,`minecraft:air`);
            }
        }
	}
}


const gvcv5ItemCommandCommponent = {
	onUse(e,p){
		const block = e.block;
		const user = e.source;
        const type = p.params.type;
        user.runCommand(`function noteamphone`);
	}
}

function gvcv5Phone( event ){
    event.source.runCommand(`function noteamphone`);
}

function gvcv5UseFlag( event ){
    event.source.runCommand(`function flag`);
}
function gvcv5UseMtype( event ){
    event.source.runCommand(`function mtype`);
}


const gvcv5UseAidKitCommponent = {
	onConsume(e,p){
		const block = e.block;
		const user = e.source;
        user.addEffect("regeneration",14,{ amplifier: 4 })
	}
}

const gvcv5UseAidKitiiCommponent = {
	onConsume(e,p){
		const block = e.block;
		const user = e.source;
        user.addEffect("regeneration",14,{ amplifier: 12 })
	}
}

const gvcv5UseSelfRiseCommponent = {
	onConsume(e,p){
		const block = e.block;
		const user = e.source;
        user.addEffect("regeneration",14,{ amplifier: 12 });
        user.runCommand(`event entity @s gvcv5:remove_down_true`);
	}
}

async function setUp(){
    await system.waitTicks(100);
    if( world.getDynamicProperty("gvcv5:playerDamage") == undefined ){
        world.setDynamicProperty("gvcv5:playerDamage",0.5);
    }
    if( world.getDynamicProperty("gvcv5:mobDamage") == undefined ){
        world.setDynamicProperty("gvcv5:mobDamage",1);
    }
    if( world.getDynamicProperty("gvcv5:doBulletSpend") == undefined ){
        world.setDynamicProperty("gvcv5:doBulletSpend",true);
    }
    if( world.getDynamicProperty("gvcv5:playerDamageCool") == undefined ){
        world.setDynamicProperty("gvcv5:playerDamageCool",false);
    }
    if( world.getDynamicProperty("gvcv5:nodiein1hit") == undefined ){
        world.setDynamicProperty("gvcv5:nodiein1hit",false);
    }
    
    if( world.getDynamicProperty("gvcv5:buildingSpawnS") == undefined ){
        world.setDynamicProperty("gvcv5:buildingSpawnS",true);
    }
    if( world.getDynamicProperty("gvcv5:buildingSpawnM") == undefined ){
        world.setDynamicProperty("gvcv5:buildingSpawnM",true);
    }
    if( world.getDynamicProperty("gvcv5:buildingSpawnL") == undefined ){
        world.setDynamicProperty("gvcv5:buildingSpawnL",true);
    }
    if( world.getDynamicProperty("gvcv5:buildingSpawnA") == undefined ){
        world.setDynamicProperty("gvcv5:buildingSpawnA",true);
    }
    
    if( world.getDynamicProperty("gvcv5:doSpawnFromBeacon") == undefined ){
        world.setDynamicProperty("gvcv5:doSpawnFromBeacon",true);
    }
    if( world.getDynamicProperty("gvcv5:doSpawnFromBlock") == undefined ){
        world.setDynamicProperty("gvcv5:doSpawnFromBlock",true);
    }
    if( world.getDynamicProperty("gvcv5:worldLimit") == undefined ){
        world.setDynamicProperty("gvcv5:worldLimit",false);
    }
    if( world.getDynamicProperty(`gvcv5:worldLimitO`) == undefined ){
        world.setDynamicProperty(`gvcv5:worldLimitO`,2048);
    }
    if( world.getDynamicProperty(`gvcv5:worldLimitN`) == undefined ){
        world.setDynamicProperty(`gvcv5:worldLimitN`,2048);
    }
    if( world.getDynamicProperty(`gvcv5:worldLimitE`) == undefined ){
        world.setDynamicProperty(`gvcv5:worldLimitE`,512);
    }
    if( world.getDynamicProperty("gvcv5:airCraftWithItem") == undefined ){
        world.setDynamicProperty("gvcv5:airCraftWithItem",false);
    }
    await system.waitTicks(1);
    const buildingS = Number(world.getDynamicProperty(`gvcv5:buildingSpawnS`))
    const buildingM = Number(world.getDynamicProperty(`gvcv5:buildingSpawnM`))
    const buildingL = Number(world.getDynamicProperty(`gvcv5:buildingSpawnL`))
    const buildingA = Number(world.getDynamicProperty(`gvcv5:buildingSpawnA`))
    const Expdamage = Number(world.getDynamicProperty(`gvcv5:nodiein1hit`))
    world.scoreboard.getObjective(`building`).setScore(`P`, Expdamage);
    world.scoreboard.getObjective(`building`).setScore(`S`, buildingS);
    world.scoreboard.getObjective(`building`).setScore(`M`, buildingM);
    world.scoreboard.getObjective(`building`).setScore(`L`, buildingL);
    world.scoreboard.getObjective(`building`).setScore(`A`, buildingA);
}


system.beforeEvents.startup.subscribe( e => {
    e.blockComponentRegistry.registerCustomComponent(`gvcv5:spawn`,gvcv5SpawnCommponent);
    e.blockComponentRegistry.registerCustomComponent(`gvcv5:mer03kspawn`,gvcv5MER03kBlockCommponent);
    e.blockComponentRegistry.registerCustomComponent(`gvcv5:end_block`,gvcv5EndBlockCommponent);
    e.blockComponentRegistry.registerCustomComponent(`gvcv5:building`,gvcv5BuildingBlockCommponent);
    e.blockComponentRegistry.registerCustomComponent(`gvcv5:lootblock`,gvcv5LootBlockCommponent);
    //e.blockComponentRegistry.registerCustomComponent("gvcv5:scaffold",{onPlayerBreak: gvcv5Scaffold})
    e.blockComponentRegistry.registerCustomComponent(`gvcv5:spawner`,gvcv5SpawnerCommponent);
    e.blockComponentRegistry.registerCustomComponent(`gvcv5:crafter`,gvcv5UseCommandCommponent);
    e.blockComponentRegistry.registerCustomComponent(`gvcv5:expoevent`,gvcv5BlockExpoCommponent);
    e.blockComponentRegistry.registerCustomComponent(`gvcv5:mineevent`,gvcv5MineCommponent);
    //e.blockComponentRegistry.registerCustomComponent(`gvcv5:attach_table`,{onPlayerInteract: gvcv5Attachtable});
    //e.blockComponentRegistry.registerCustomComponent(`gvcv5:explosion`,{onBreak: gvcv5ExplosionEvent});
    e.itemComponentRegistry.registerCustomComponent(`gvcv5:phone`,gvcv5ItemCommandCommponent);
    //e.itemComponentRegistry.registerCustomComponent(`gvcv5:orderflag`,{onUse: gvcv5UseFlag});
    //e.itemComponentRegistry.registerCustomComponent(`gvcv5:mtype`,{onUse: gvcv5UseMtype});
    e.itemComponentRegistry.registerCustomComponent(`gvcv5:aid`,gvcv5UseAidKitCommponent);
    e.itemComponentRegistry.registerCustomComponent(`gvcv5:aid2`,gvcv5UseAidKitiiCommponent);
    e.itemComponentRegistry.registerCustomComponent(`gvcv5:selfkit`,gvcv5UseSelfRiseCommponent);
});

world.afterEvents.worldLoad.subscribe( async e => {
    await setUp();
    
} )