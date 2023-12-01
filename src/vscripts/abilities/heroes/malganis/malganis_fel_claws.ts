import { BaseAbility, registerAbility } from "../../../lib/dota_ts_adapter";
import { modifier_fel_claws } from "../../../modifiers/malganis/modifier_fel_claws";
import { modifier_malganis_model_changer_buff } from "../../../modifiers/malganis/modifier_malganis_model_changer_buff";

@registerAbility()
export class malganis_fel_claws extends BaseAbility {
    particle?: ParticleID;
    caster = this.GetCaster();
 
    particle_darkness = "particles/units/heroes/hero_night_stalker/nightstalker_ulti.vpcf";
	particle_darkness_fx?: ParticleID;

    // particle_hit_left = "particles/units/heroes/hero_ursa/ursa_claw_left.vpcf";
    particle_hit_left = "particles/econ/items/ursa/ursa_swift_claw/ursa_swift_claw_left.vpcf";
	particle_hit_left_fx?: ParticleID;

    // particle_hit_right = "particles/units/heroes/hero_ursa/ursa_claw_right.vpcf";
    particle_hit_right = "particles/econ/items/ursa/ursa_swift_claw/ursa_swift_claw_right.vpcf";
	particle_hit_right_fx?: ParticleID;

    cast_sound = "Hero_NightStalker.Void";
    cast_anim = [
                GameActivity.DOTA_CAST_ABILITY_2, 
                GameActivity.DOTA_ATTACK,
                GameActivity.DOTA_CAST_ABILITY_1
                ];

    anim_playback_rate = 2;
    cast_point = 0.1;


    Precache(context: CScriptPrecacheContext) {
		PrecacheResource(PrecacheType.PARTICLE, this.particle_darkness, context);
		PrecacheResource(PrecacheType.PARTICLE, this.particle_hit_left, context);
		PrecacheResource(PrecacheType.PARTICLE, this.particle_hit_right, context);
	}

    OnAbilityPhaseStart() {
        // this.caster.StartGestureWithPlaybackRate(GameActivity.DOTA_ATTACK, 2);
        // this.caster.StartGestureWithPlaybackRate(GameActivity.DOTA_CAST_ABILITY_2, 2.5);
        return true;
    }

    OnAbilityPhaseInterrupted() {
        // this.caster.FadeGesture(GameActivity.DOTA_ATTACK);
    }

    GetCastAnimation(): GameActivity {
        //determine ability phase from number of modifier stacks
        let abilityPhase = this.caster.GetModifierStackCount(modifier_fel_claws.name,this.caster);
        print ("swipe ", abilityPhase);
 
        return this.cast_anim[abilityPhase];
        
    }

    GetPlaybackRateOverride(): number {
        return this.anim_playback_rate;
    }

    GetCastPoint(): number {
        return this.cast_point;
    }
    
    GetBehavior(): AbilityBehavior | Uint64 {
        return AbilityBehavior.NO_TARGET
        | AbilityBehavior.DONT_CANCEL_MOVEMENT
        | AbilityBehavior.ROOT_DISABLES 
        | AbilityBehavior.IGNORE_BACKSWING;
    }
    
    OnSpellStart(): void {

        const kv = { duration: 3 };
        
        //change model
        // if (this.caster.FindModifierByName(modifier_malganis_model_changer_buff.name))
        this.caster.AddNewModifier(this.caster, this, modifier_malganis_model_changer_buff.name, kv); 

        // we later count the stacks on this modifier to determine which ability phase we are in
        this.caster.AddNewModifier(this.caster, this, modifier_fel_claws.name, kv); 
        
        this.particle_hit_left_fx = ParticleManager.CreateParticle(this.particle_hit_left, ParticleAttachment.ABSORIGIN_FOLLOW, this.caster);
        ParticleManager.SetParticleControl(this.particle_hit_left_fx, 0, this.caster.GetAbsOrigin());

    }
    
}
