import { BaseAbility, registerAbility } from "../../../lib/dota_ts_adapter";
import { malganis_necrotic_embrace_buff } from "../../../modifiers/malganis/malganis_necrotic_embrace_buff";
import { modifier_malganis_model_changer_buff } from "../../../modifiers/malganis/modifier_malganis_model_changer_buff";
@registerAbility()
export class malganis_necrotic_embrace extends BaseAbility {
    particle;
    caster = this.GetCaster();
    particle_darkness = "particles/units/heroes/hero_night_stalker/nightstalker_ulti.vpcf";
    particle_darkness_fx;
    cast_sound = "night_stalker_nstalk_laugh_04"; //todo:
    cast_anim = 25 /* GameActivity.FLY */; //todo:
    cast_point = 0.1;
    Precache(context) {
        PrecacheResource("particle" /* PrecacheType.PARTICLE */, this.particle_darkness, context);
    }
    GetCastAnimation() {
        return this.cast_anim;
    }
    // GetPlaybackRateOverride(): number {
    //     return 0.2;
    // }
    GetCastPoint() {
        return this.cast_point;
    }
    GetBehavior() {
        return 4 /* AbilityBehavior.NO_TARGET */
            | 2048 /* AbilityBehavior.IMMEDIATE */
            | 8388608 /* AbilityBehavior.DONT_CANCEL_MOVEMENT */;
    }
    OnSpellStart() {
        // Play cast sound
        // EmitSoundOn(this.cast_sound, this.caster);
        // Add darkness particle
        this.particle_darkness_fx = ParticleManager.CreateParticle(this.particle_darkness, 1 /* ParticleAttachment.ABSORIGIN_FOLLOW */, this.caster);
        ParticleManager.SetParticleControl(this.particle_darkness_fx, 0, this.caster.GetAbsOrigin());
        ParticleManager.SetParticleControl(this.particle_darkness_fx, 1, this.caster.GetAbsOrigin());
        ParticleManager.ReleaseParticleIndex(this.particle_darkness_fx);
        const kv = { duration: 3 };
        //change model
        this.caster.AddNewModifier(this.caster, this, modifier_malganis_model_changer_buff.name, kv);
        //add armor buff
        this.caster.AddNewModifier(this.caster, this, malganis_necrotic_embrace_buff.name, kv);
        // this.caster.AddNewModifier(this.caster, this, modifier_.name, kv); 
        // this.caster.StartGestureWithFadeAndPlaybackRate(GameActivity.DOTA_CAST_ABILITY_2, 1, 1, 1);
        let i = 0;
        if (i == 0) {
            this.caster.StartGestureWithFadeAndPlaybackRate(1565 /* GameActivity.DOTA_NIGHTSTALKER_TRANSITION */, 1, 1, 1);
            this.caster.StartGestureWithFadeAndPlaybackRate(1565 /* GameActivity.DOTA_NIGHTSTALKER_TRANSITION */, 1, 1, 1);
            i = 1;
            print(1);
        }
        else {
            this.caster.StartGestureWithFadeAndPlaybackRate(1565 /* GameActivity.DOTA_NIGHTSTALKER_TRANSITION */, 0.1, 0.1, 1);
            this.caster.StartGestureWithFadeAndPlaybackRate(1565 /* GameActivity.DOTA_NIGHTSTALKER_TRANSITION */, 0.1, 0.1, 1);
            i = 0;
            print(2);
        }
        const radius = 200;
        const enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.caster.GetAbsOrigin(), undefined, radius, 2 /* UnitTargetTeam.ENEMY */, 18 /* UnitTargetType.BASIC */ | 1 /* UnitTargetType.HERO */ | 4 /* UnitTargetType.BUILDING */ | 2 /* UnitTargetType.CREEP */, 0 /* UnitTargetFlags.NONE */, 0 /* FindOrder.ANY */, false);
        for (const enemy of enemies) {
            ApplyDamage({
                victim: enemy,
                attacker: this.caster,
                damage: 100,
                damage_type: 2 /* DamageTypes.MAGICAL */
            });
        }
    }
}
