import { BaseAbility, registerAbility } from "../../../lib/dota_ts_adapter";
import { modifier_malganis_model_changer_buff } from "../../../modifiers/malganis/modifier_malganis_model_changer_buff";

@registerAbility()
export class malganis_dark_conversion extends BaseAbility {
    particle?: ParticleID;
    caster = this.GetCaster();
 
    particle_darkness = "particles/units/heroes/hero_night_stalker/nightstalker_ulti.vpcf";
	particle_darkness_fx?: ParticleID;

    cast_sound = "night_stalker_nstalk_laugh_04"; //todo:

    cast_anim = GameActivity.FLY;//todo:
    cast_point = 0.1;

  

    Precache(context: CScriptPrecacheContext) {
		PrecacheResource(PrecacheType.PARTICLE, this.particle_darkness, context);

	}

    GetCastAnimation(): GameActivity {
        return this.cast_anim;
    }

    // GetPlaybackRateOverride(): number {
    //     return 0.2;
    // }

    GetCastPoint(): number {
        return this.cast_point;
    }
    
    GetBehavior(): AbilityBehavior | Uint64 {
        return AbilityBehavior.NO_TARGET 
        | AbilityBehavior.IMMEDIATE 
        | AbilityBehavior.DONT_CANCEL_MOVEMENT;
    }
    
    OnSpellStart(): void {
        
        // Play cast sound
		// EmitSoundOn(this.cast_sound, this.caster);
        // Add darkness particle
		this.particle_darkness_fx = ParticleManager.CreateParticle(this.particle_darkness, ParticleAttachment.ABSORIGIN_FOLLOW, this.caster);
		ParticleManager.SetParticleControl(this.particle_darkness_fx, 0, this.caster.GetAbsOrigin());
		ParticleManager.SetParticleControl(this.particle_darkness_fx, 1, this.caster.GetAbsOrigin());
		ParticleManager.ReleaseParticleIndex(this.particle_darkness_fx);

        const kv = { duration: 3 };
        //change model
        this.caster.AddNewModifier(this.caster, this, modifier_malganis_model_changer_buff.name, kv); 
        //add armor buff
        // this.caster.AddNewModifier(this.caster, this, malganis_necrotic_embrace_buff.name, kv); 

        // this.caster.AddNewModifier(this.caster, this, modifier_.name, kv); 

        // this.caster.StartGestureWithFadeAndPlaybackRate(GameActivity.DOTA_CAST_ABILITY_2, 1, 1, 1);

    }
}
