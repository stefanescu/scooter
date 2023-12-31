import { BaseAbility, registerAbility } from "../../../lib/dota_ts_adapter";
import { modifier_night_rush_sleep_thinker } from "../../../modifiers/malganis/modifier_night_rush_sleep_thinker"
import { modifier_malganis_model_changer_buff } from "../../../modifiers/malganis/modifier_malganis_model_changer_buff";

@registerAbility()
export class malganis_night_rush extends BaseAbility {
    particle?: ParticleID;
    caster = this.GetCaster();
 
    particle_darkness = "particles/units/heroes/hero_night_stalker/nightstalker_ulti.vpcf";
	particle_darkness_fx?: ParticleID;

    texture = "night_stalker_hunter_in_the_night";

    sleep_sound = "Hero_Riki.SleepDart.Damage";//todo: this just doesn't work??
    cast_sound = "night_stalker_nstalk_laugh_04"; //todo:

    // cast_anim = GameActivity.DOTA_CAST_ABILITY_3_END;//todo:
    cast_anim = GameActivity.DOTA_CAST_ABILITY_4;//todo:
    cast_point = 0.75;
    // cast_point = 1.5;

    // OnAbilityPhaseStart(): boolean {
    //     this.caster.StartGesture(this.cast_anim);
    //     return true;
    // }

    Precache(context: CScriptPrecacheContext) {
		PrecacheResource(PrecacheType.PARTICLE, this.particle_darkness, context);
        PrecacheResource(PrecacheType.SOUNDFILE,this.sleep_sound, context);
	}

    GetCastAnimation(): GameActivity {
        return this.cast_anim;
    }

    GetPlaybackRateOverride(): number {
        return 0.3;
    }

    GetCastPoint(): number {
        return this.cast_point;
    }
    
    GetBehavior(): AbilityBehavior | Uint64 {
        return AbilityBehavior.NO_TARGET
        | AbilityBehavior.DONT_CANCEL_MOVEMENT
        | AbilityBehavior.ROOT_DISABLES;
    }

    GetAbilityTextureName(): string {
        return this.texture;
    }
    
    OnSpellStart(): void {
        
        // Play cast sound
		EmitSoundOn(this.cast_sound, this.caster);
        // Add darkness particle
		this.particle_darkness_fx = ParticleManager.CreateParticle(this.particle_darkness, ParticleAttachment.ABSORIGIN_FOLLOW, this.caster);
		ParticleManager.SetParticleControl(this.particle_darkness_fx, 0, this.caster.GetAbsOrigin());
		ParticleManager.SetParticleControl(this.particle_darkness_fx, 1, this.caster.GetAbsOrigin());
		ParticleManager.ReleaseParticleIndex(this.particle_darkness_fx);

        const kv = { duration: 3 };
        //change model
        this.caster.AddNewModifier(this.caster, this, modifier_malganis_model_changer_buff.name, kv); 

        this.caster.StartGesture(GameActivity.DOTA_CAST_ABILITY_3); //start fly

        // this.caster.StartGesture(GameActivity.DOTA_CAST_ABILITY_3);
        // this.caster.AddNewModifier(this.caster, this, "modifier_night_stalker_darkness", kv); 
        // this.caster.AddNewModifier(this.caster, this, modifier_night_rush_dark_ascension.name, kv); 

       
        
        // this.caster.AddNewModifier(this.caster, this, "modifier_night_stalker_hunter_in_the_night", kv); 
        //add buff which sleeps units around caster
        this.caster.AddNewModifier(this.caster, this, modifier_night_rush_sleep_thinker.name, kv); 
        
        // this.caster.AddNewModifier(this.caster, this, "modifier_night_stalker_darkness_transform", kv);
    }

    // GetChannelAnimation(): GameActivity {
    //     return GameActivity.DOTA_NIGHTSTALKER_TRANSITION;
    // }
    
    // GetChannelTime(): number {
    //     return 1;
    // }
    
}
