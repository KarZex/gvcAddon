
import {DefinitionModifier,system,world, MolangVariableMap} from "@minecraft/server";

function Between(range) {
        return Math.cos(Math.random() * 180) * range;
  };



function spawnParticle(options){
	let { id, variables, target } = options;
	let molang = new MolangVariableMap();
	for(let variable in variables){
		molang[variables[variable].type](variable,variables[variable].values);
	};
	target.dimension.spawnParticle(id,target.location,molang);
};


system.beforeEvents.watchdogTerminate.subscribe(e=>e.cancel = true);

world.afterEvents.entityHealthChanged.subscribe(({entity,newValue,oldValue})=>{
	try{
	if(!entity.isValid){return;};
	if(!entity.spawnIndicator){
		return;
	};
	entity.spawnIndicator=undefined;
	if(entity.typeId=="add:health_indicator"){return};
	const {location,dimension}=entity;
	if(newValue<oldValue){
	    let damage =Math.round(newValue - oldValue);
        spawnParticle({
		id: "add:damage_heart_emitter",
		variables: {
			"variable.damage_amount": { type: "setVector3", values: {x:-damage,y:-damage,z:-damage} }
		},
		target: { dimension,location  }
    });
    let amount= dimension.spawnEntity("add:health_indicator", {x:location.x+Between(1),y:location.y+Between(0.1), z:location.z+(0.1)});
    amount.prevLocation = amount.location;
    amount.nameTag=`§c${damage}`; return;};
	let added =Math.round(newValue-oldValue);
	let amount= dimension.spawnEntity("add:health_indicator", {x:location.x+Between(1),y:location.y+Between(0.1), z:location.z+(0.1)});
    amount.nameTag=`§a+${added}`;
    amount.prevLocation = amount.location;
    }catch(error){};
});



world.afterEvents.projectileHitEntity.subscribe((e)=>{
	const {source}=e;
	const entity= e.getEntityHit()?.entity;
	
	if((source?.typeId!="minecraft:player")||!entity){
		return;
	};
	entity.spawnIndicator=true;
	(source.tempId) ? [system.clearRun(source.tempId),source.tempId=undefined] : undefined;
	let {nameTag,id,typeId} = entity;
	nameTag = (nameTag)||("entity." + entity.typeId.replace("minecraft:","") + ".name");
	let h = entity?.getComponent("minecraft:health"); 
	source.onScreenDisplay.setTitle(`display1currentHealth${Math.floor(h?.currentValue)}totalHealth${Math.floor(h?.defaultValue??h?.maxValue)}${nameTag}`,{
		subtitle: id,
		stayDuration: 220,
        fadeInDuration: 2,
        fadeOutDuration: 4
    });
    source.tempId = system.runTimeout(()=>{try{source.onScreenDisplay.updateSubtitle("-1");}catch(error){}},60);
});

world.afterEvents.entityHitEntity.subscribe(({hitEntity,damagingEntity})=>{
	if(damagingEntity?.typeId!="minecraft:player"){
        return; 
    };
    hitEntity.spawnIndicator=true;
    (damagingEntity.tempId) ? [system.clearRun(damagingEntity.tempId),damagingEntity.tempId=undefined] : undefined;
	let {nameTag,id,typeId} = hitEntity;
	nameTag = (nameTag)||("entity." + hitEntity.typeId.replace("minecraft:","") + ".name");
	let h = hitEntity?.getComponent("minecraft:health"); 
	damagingEntity.onScreenDisplay.setTitle(`display1currentHealth${Math.floor(h?.currentValue)}totalHealth${Math.floor(h?.defaultValue??h?.maxValue)}${nameTag}`,{
		subtitle: id,
		stayDuration: 220,
        fadeInDuration: 2,
        fadeOutDuration: 4
    });
    damagingEntity.tempId = system.runTimeout(()=>{try{damagingEntity.onScreenDisplay.updateSubtitle("-1");}catch(error){}},60);
});




world.beforeEvents.dataDrivenEntityTriggerEvent.subscribe((e)=>{
	try{
	if(!e.entity.isValid){return;};
	if(e.entity.typeId!="add:health_indicator"){return};
	if(e.id!="minecraft:on_ground"){return};
	let m = new DefinitionModifier(); m.setComponentGroupsToRemove(["minecraft:on_spawn"]);
	e.setModifiers([m]);
	let [pX,pY,pZ]= Object.values(e.entity.prevLocation);
	let {x,y,z}=e.entity.location;
	(!e.entity.prevB) ? e.entity.prevB={x: Between(0.5),y:0.5+(Math.abs(pY-y)*0.1),z: Between (0.5)} : undefined;
	system.runTimeout(()=>{try{e.entity.applyImpulse(e.entity.prevB); e.entity.triggerEvent("minecraft:entity_spawned");}catch(error){}},0);
	}catch(error){};
});