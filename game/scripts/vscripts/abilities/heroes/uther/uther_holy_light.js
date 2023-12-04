import { BaseAbility, registerAbility } from "../../../lib/dota_ts_adapter";
@registerAbility()
export class uther_q extends BaseAbility {
    particle;
    GetCooldown() {
        let cooldown = this.GetSpecialValueFor("cooldown");
        if (IsServer()) {
            const talent = this.GetCaster().FindAbilityByName("special_bonus_unique_meepo_3");
            if (talent) {
                cooldown -= talent.GetSpecialValueFor("value");
            }
        }
        return cooldown;
    }
    OnAbilityPhaseStart() {
        if (IsServer()) {
            this.GetCaster().EmitSound("Hero_Meepo.Earthbind.Cast");
        }
        return true;
    }
    OnAbilityPhaseInterrupted() {
        this.GetCaster().StopSound("Hero_Meepo.Earthbind.Cast");
    }
    OnSpellStart() {
        const caster = this.GetCaster();
        const point = this.GetCursorPosition();
        const projectileSpeed = this.GetSpecialValueFor("speed");
        const direction = (point - caster.GetAbsOrigin()).Normalized();
        direction.z = 0;
        const distance = (point - caster.GetAbsOrigin()).Length();
        const radius = this.GetSpecialValueFor("radius");
        this.particle = ParticleManager.CreateParticle("particles/units/heroes/hero_meepo/meepo_earthbind_projectile_fx.vpcf", 2 /* ParticleAttachment.CUSTOMORIGIN */, caster);
        ParticleManager.SetParticleControl(this.particle, 0, caster.GetAbsOrigin());
        ParticleManager.SetParticleControl(this.particle, 1, point);
        ParticleManager.SetParticleControl(this.particle, 2, Vector(projectileSpeed, 0, 0));
        ProjectileManager.CreateLinearProjectile({
            Ability: this,
            EffectName: "",
            vSpawnOrigin: caster.GetAbsOrigin(),
            fDistance: distance,
            fStartRadius: radius,
            fEndRadius: radius,
            Source: caster,
            bHasFrontalCone: false,
            iUnitTargetTeam: 0 /* UnitTargetTeam.NONE */,
            iUnitTargetFlags: 0 /* UnitTargetFlags.NONE */,
            iUnitTargetType: 0 /* UnitTargetType.NONE */,
            vVelocity: (direction * projectileSpeed),
            bProvidesVision: true,
            iVisionRadius: radius,
            iVisionTeamNumber: caster.GetTeamNumber(),
        });
    }
    OnProjectileHit(_target, location) {
        const caster = this.GetCaster();
        const duration = this.GetSpecialValueFor("duration");
        const radius = this.GetSpecialValueFor("radius");
        const units = FindUnitsInRadius(caster.GetTeamNumber(), location, undefined, radius, 2 /* UnitTargetTeam.ENEMY */, 18 /* UnitTargetType.BASIC */ | 1 /* UnitTargetType.HERO */, 0 /* UnitTargetFlags.NONE */, 0, false);
        for (const unit of units) {
            unit.AddNewModifier(caster, this, "modifier_meepo_earthbind", { duration });
            unit.EmitSound("Hero_Meepo.Earthbind.Target");
        }
        ParticleManager.DestroyParticle(this.particle, false);
        ParticleManager.ReleaseParticleIndex(this.particle);
        return true;
    }
}
