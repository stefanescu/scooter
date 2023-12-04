import { BaseAbility, registerAbility } from "../../../lib/dota_ts_adapter";
@registerAbility()
export class guldan_fel_flame extends BaseAbility {
    particle;
    caster = this.GetCaster();
    cast_anim = 1510 /* GameActivity.DOTA_CAST_ABILITY_1 */;
    cast_sound = "Hero_Meepo.Earthbind.Cast";
    cast_point = 0.3;
    hitParticle = "particles/units/heroes/hero_lina/lina_spell_dragon_slave_impact.vpcf";
    damage = this.GetSpecialValueFor("damage");
    range = this.GetSpecialValueFor("range");
    speed = this.GetSpecialValueFor("speed");
    textureName = "lina_dragonslave";
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
        this.damage = this.GetSpecialValueFor("damage");
        this.range = this.GetSpecialValueFor("range");
        this.speed = this.GetSpecialValueFor("speed");
        EmitSoundOn("Hero_Lina.DragonSlave.Cast", this.caster);
        let vPos = this.GetCursorTarget()?.GetOrigin();
        if (!vPos)
            vPos = this.GetCursorPosition();
        const direction = (vPos - this.caster.GetAbsOrigin()).Normalized();
        direction.z = 0;
        const proj = {
            EffectName: "particles/units/heroes/hero_lina/lina_spell_dragon_slave.vpcf",
            Ability: this,
            vSpawnOrigin: this.GetCaster().GetOrigin(),
            fStartRadius: 50,
            fEndRadius: 100,
            vVelocity: (direction * this.speed),
            fDistance: this.range,
            Source: this.GetCaster(),
            iUnitTargetTeam: 2 /* UnitTargetTeam.ENEMY */,
            iUnitTargetType: 1 /* UnitTargetType.HERO */ + 18 /* UnitTargetType.BASIC */ + 4 /* UnitTargetType.BUILDING */,
        };
        ProjectileManager.CreateLinearProjectile(proj);
        EmitSoundOn("Hero_Lina.DragonSlave", this.GetCaster());
    }
    GetAbilityTextureName() {
        return this.textureName;
    }
    OnProjectileHit(target, location) {
        if (target && (!target.IsInvulnerable())) {
            let damage = {
                victim: target,
                attacker: this.caster,
                damage: this.damage,
                damage_type: 1 /* DamageTypes.PHYSICAL */,
                ability: this
            };
            ApplyDamage(damage);
            let vDirection = (location - this.caster.GetOrigin());
            vDirection.z = 0.0;
            vDirection = vDirection.Normalized();
            let nFXIndex = ParticleManager.CreateParticle(this.hitParticle, 1 /* ParticleAttachment.ABSORIGIN_FOLLOW */, target);
            ParticleManager.SetParticleControlForward(nFXIndex, 1, vDirection);
            ParticleManager.ReleaseParticleIndex(nFXIndex);
        }
        return false;
    }
}
