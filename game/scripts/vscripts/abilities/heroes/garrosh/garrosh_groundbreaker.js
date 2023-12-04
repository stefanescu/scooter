import { BaseAbility, registerAbility } from "../../../lib/dota_ts_adapter";
@registerAbility()
export class garrosh_groundbreaker extends BaseAbility {
    particle;
    caster = this.GetCaster();
    cast_anim = 1513 /* GameActivity.DOTA_CAST_ABILITY_4 */;
    cast_sound = "Hero_Meepo.Earthbind.Cast";
    cast_point = 0.4;
    hitParticle = "particles/units/heroes/hero_pangolier/pangolier_tailthump.vpcf";
    OnAbilityPhaseStart() {
        if (IsServer()) {
            this.caster.EmitSound(this.cast_sound);
        }
        return true;
    }
    OnAbilityPhaseInterrupted() {
        this.caster.StopSound(this.cast_sound);
    }
    GetCastAnimation() {
        return this.cast_anim;
    }
    GetCastPoint() {
        return this.cast_point;
    }
    OnSpellStart() {
        const radius = this.GetSpecialValueFor("radius");
        const point = this.GetCursorPosition();
        const heroToPoint = (this.caster.GetForwardVector() * 400);
        const smashPos = (this.caster.GetAbsOrigin() + heroToPoint);
        const particle = ParticleManager.CreateParticle(this.hitParticle, 8 /* ParticleAttachment.WORLDORIGIN */, this.caster);
        ParticleManager.SetParticleControl(particle, 0, smashPos);
        ParticleManager.ReleaseParticleIndex;
        const enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), smashPos, undefined, radius, 2 /* UnitTargetTeam.ENEMY */, 18 /* UnitTargetType.BASIC */ | 1 /* UnitTargetType.HERO */ | 4 /* UnitTargetType.BUILDING */ | 2 /* UnitTargetType.CREEP */, 0 /* UnitTargetFlags.NONE */, 0 /* FindOrder.ANY */, false);
        for (const enemy of enemies) {
            enemy.AddNewModifier(this.caster, this, "modifier_stunned" /* BuiltInModifier.STUN */, { duration: 2 });
            ApplyDamage({
                victim: enemy,
                attacker: this.caster,
                damage: 250,
                damage_type: 1 /* DamageTypes.PHYSICAL */
            });
        }
    }
}
