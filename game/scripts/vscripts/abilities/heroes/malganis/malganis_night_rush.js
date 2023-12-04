import { BaseAbility, registerAbility } from "../../../lib/dota_ts_adapter";
import { modifier_night_rush_sleep_thinker } from "../../../modifiers/malganis/modifier_night_rush_sleep_thinker";
import { modifier_malganis_model_changer_buff } from "../../../modifiers/malganis/modifier_malganis_model_changer_buff";
@registerAbility()
export class malganis_night_rush extends BaseAbility {
    particle;
    caster = this.GetCaster();
    particle_darkness = "particles/units/heroes/hero_night_stalker/nightstalker_ulti.vpcf";
    particle_darkness_fx;
    sleep_sound = "Hero_Riki.SleepDart.Damage"; //todo: this just doesn't work??
    cast_sound = "night_stalker_nstalk_laugh_04"; //todo:
    // cast_anim = GameActivity.DOTA_CAST_ABILITY_3_END;//todo:
    cast_anim = 1513 /* GameActivity.DOTA_CAST_ABILITY_4 */; //todo:
    cast_point = 0.75;
    // cast_point = 1.5;
    // OnAbilityPhaseStart(): boolean {
    //     this.caster.StartGesture(this.cast_anim);
    //     return true;
    // }
    Precache(context) {
        PrecacheResource("particle" /* PrecacheType.PARTICLE */, this.particle_darkness, context);
        PrecacheResource("soundfile" /* PrecacheType.SOUNDFILE */, this.sleep_sound, context);
    }
    GetCastAnimation() {
        return this.cast_anim;
    }
    GetPlaybackRateOverride() {
        return 0.3;
    }
    GetCastPoint() {
        return this.cast_point;
    }
    GetBehavior() {
        return 4 /* AbilityBehavior.NO_TARGET */
            | 8388608 /* AbilityBehavior.DONT_CANCEL_MOVEMENT */
            | 524288 /* AbilityBehavior.ROOT_DISABLES */;
    }
    OnSpellStart() {
        // Play cast sound
        EmitSoundOn(this.cast_sound, this.caster);
        // Add darkness particle
        this.particle_darkness_fx = ParticleManager.CreateParticle(this.particle_darkness, 1 /* ParticleAttachment.ABSORIGIN_FOLLOW */, this.caster);
        ParticleManager.SetParticleControl(this.particle_darkness_fx, 0, this.caster.GetAbsOrigin());
        ParticleManager.SetParticleControl(this.particle_darkness_fx, 1, this.caster.GetAbsOrigin());
        ParticleManager.ReleaseParticleIndex(this.particle_darkness_fx);
        const kv = { duration: 3 };
        //change model
        this.caster.AddNewModifier(this.caster, this, modifier_malganis_model_changer_buff.name, kv);
        this.caster.StartGesture(1512 /* GameActivity.DOTA_CAST_ABILITY_3 */); //start fly
        // this.caster.StartGesture(GameActivity.DOTA_CAST_ABILITY_3);
        // this.caster.AddNewModifier(this.caster, this, "modifier_night_stalker_darkness", kv); 
        // this.caster.AddNewModifier(this.caster, this, modifier_night_rush_dark_ascension.name, kv); 
        // this.caster.AddNewModifier(this.caster, this, "modifier_night_stalker_hunter_in_the_night", kv); 
        //add buff which sleeps units around caster
        this.caster.AddNewModifier(this.caster, this, modifier_night_rush_sleep_thinker.name, kv);
        // this.caster.AddNewModifier(this.caster, this, "modifier_night_stalker_darkness_transform", kv);
    }
}
