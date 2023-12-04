import { BaseAbility, registerAbility } from "../../../lib/dota_ts_adapter";
import { modifier_medivh_crow_model } from "../../../modifiers/medivh/modifier_medivh_crow_model";
@registerAbility()
export class medivh_arcane_rift extends BaseAbility {
    particle;
    caster = this.GetCaster();
    cast_anim = 1511 /* GameActivity.DOTA_CAST_ABILITY_2 */;
    cast_sound = "Hero_Meepo.Earthbind.Cast";
    cast_point = 0.2;
    damage = this.GetSpecialValueFor("damage");
    range = this.GetSpecialValueFor("range");
    speed = this.GetSpecialValueFor("speed");
    textureName = "magnus_shockwave";
    crow_model = "models/items/beastmaster/hawk/beast_heart_marauder_beast_heart_marauder_raven/beast_heart_marauder_beast_heart_marauder_raven.vmdl";
    hitFx = "particles/units/heroes/hero_lina/lina_spell_dragon_slave_impact.vpcf";
    projectileFx = "particles/units/heroes/hero_lina/lina_spell_dragon_slave.vpcf";
    Precache(context) {
        PrecacheModel(this.crow_model, context);
        PrecacheResource("particle" /* PrecacheType.PARTICLE */, this.projectileFx, context);
        PrecacheResource("particle" /* PrecacheType.PARTICLE */, this.hitFx, context);
    }
    GetCastAnimation() {
        return this.cast_anim;
    }
    GetCastPoint() {
        return this.cast_point;
    }
    GetAbilityTextureName() {
        return this.textureName;
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
            EffectName: this.projectileFx,
            Ability: this,
            vSpawnOrigin: this.caster.GetOrigin(),
            fStartRadius: 50,
            fEndRadius: 100,
            vVelocity: (direction * this.speed),
            fDistance: this.range,
            Source: this.caster,
            iUnitTargetTeam: 2 /* UnitTargetTeam.ENEMY */,
            iUnitTargetType: 1 /* UnitTargetType.HERO */ + 18 /* UnitTargetType.BASIC */ + 4 /* UnitTargetType.BUILDING */,
        };
        ProjectileManager.CreateLinearProjectile(proj);
        EmitSoundOn("Hero_Lina.DragonSlave", this.GetCaster());
        const kv = { duration: 5 };
        this.caster.AddNewModifier(this.caster, this, modifier_medivh_crow_model.name, kv); //move
    }
    OnProjectileHit(target, location) {
        if (target && (!target.IsInvulnerable())) {
            let damage = {
                victim: target,
                attacker: this.caster,
                damage: this.damage,
                damage_type: 2 /* DamageTypes.MAGICAL */,
                ability: this
            };
            ApplyDamage(damage);
            // let vDirection = (location - this.caster.GetOrigin()) as Vector;
            // vDirection.z = 0.0;
            // vDirection = vDirection.Normalized();
            // let nFXIndex = ParticleManager.CreateParticle( this.hitParticle, ParticleAttachment.ABSORIGIN_FOLLOW, target )
            // ParticleManager.SetParticleControlForward( nFXIndex, 1, vDirection )
            // ParticleManager.ReleaseParticleIndex( nFXIndex )
        }
        return false;
    }
}
