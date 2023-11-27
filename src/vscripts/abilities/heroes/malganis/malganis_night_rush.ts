import { BaseAbility, registerAbility } from "../../../lib/dota_ts_adapter";
import { modifier_night_rush_sleep } from "../../../modifiers/malganis/modifier_night_rush_sleep"
import { modifier_night_rush_dark_ascension } from "../../../modifiers/malganis/modifier_night_rush_dark_ascension";
import { modifier_malganis_model_changer_buff } from "../../../modifiers/malganis/modifier_malganis_model_changer_buff";

@registerAbility()
export class malganis_night_rush extends BaseAbility {
    particle?: ParticleID;
    caster = this.GetCaster();
    // cast_anim = GameActivity.DOTA_ATTACK;
    cast_anim = GameActivity.DOTA_CAST_ABILITY_4_END;
    cast_sound = "Hero_NightStalker.Darkness";
    particle_darkness: string = "particles/units/heroes/hero_night_stalker/nightstalker_ulti.vpcf";
	particle_darkness_fx?: ParticleID;

    cast_point = 0.4;

    Precache(context: CScriptPrecacheContext) {
		PrecacheResource(PrecacheType.PARTICLE, this.particle_darkness, context);
	}

    OnAbilityPhaseStart() {
        if (IsServer()) {
            this.caster.EmitSound(this.cast_sound);
        }
        
        return true;
    }

    OnAbilityPhaseInterrupted() {
        this.caster.StopSound(this.cast_sound);
    }

    GetCastAnimation(): GameActivity {
        return this.cast_anim;
    }

    GetCastPoint(): number {
        return this.cast_point;
    }
    
    GetBehavior(): AbilityBehavior | Uint64 {
        return AbilityBehavior.IMMEDIATE | AbilityBehavior.NO_TARGET
        | AbilityBehavior.DONT_CANCEL_MOVEMENT
        | AbilityBehavior.ROOT_DISABLES
       ;
    }
    
    OnSpellStart(): void {
        // Play cast sound
		EmitSoundOn(this.cast_sound, this.caster);
        // Add darkness particle
		this.particle_darkness_fx = ParticleManager.CreateParticle(this.particle_darkness, ParticleAttachment.ABSORIGIN_FOLLOW, this.caster);
		ParticleManager.SetParticleControl(this.particle_darkness_fx, 0, this.caster.GetAbsOrigin());
		ParticleManager.SetParticleControl(this.particle_darkness_fx, 1, this.caster.GetAbsOrigin());
		// ParticleManager.ReleaseParticleIndex(this.particle_darkness_fx);

        const kv = {
            duration: 3
        };

        //change model
        this.caster.AddNewModifier(this.caster, this, modifier_malganis_model_changer_buff.name, kv); 

        // this.caster.AddNewModifier(this.caster, this, "modifier_night_stalker_darkness", kv); 
        // this.caster.AddNewModifier(this.caster, this, modifier_night_rush_dark_ascension.name, kv); 

       
        
        // this.caster.AddNewModifier(this.caster, this, "modifier_night_stalker_hunter_in_the_night", kv); 
        this.caster.AddNewModifier(this.caster, this, modifier_night_rush_sleep.name, kv); 
        
        // this.caster.AddNewModifier(this.caster, this, "modifier_night_stalker_darkness_transform", kv);
        // this.caster.StartGesture(GameActivity.FLY);
    }

    // GetChannelAnimation(): GameActivity {
    //     return GameActivity.DOTA_NIGHTSTALKER_TRANSITION;
    // }
    
    // GetChannelTime(): number {
    //     return 1;
    // }
    
}
