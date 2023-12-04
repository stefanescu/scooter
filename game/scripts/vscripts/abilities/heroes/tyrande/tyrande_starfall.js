import { BaseAbility, registerAbility } from "../../../lib/dota_ts_adapter";
import { modifier_tyrande_starfall_area } from "../../../modifiers/tyrande/modifier_tyrande_starfall_area";
@registerAbility()
export class tyrande_starfall extends BaseAbility {
    // Garrosh spins, slowing and damaging all enemy units and buildings
    //Properties
    particle;
    caster = this.GetCaster();
    cast_anim = 1510 /* GameActivity.DOTA_CAST_ABILITY_1 */;
    cast_sound = "Hero_Axe.Counterhelix";
    cast_point = 0.2;
    hit_fx = "particles/econ/items/mirana/mirana_starstorm_bow/mirana_starstorm_starfall_attack.vpcf";
    GetCastAnimation() {
        return this.cast_anim;
    }
    GetCastPoint() {
        return this.cast_point;
    }
    GetBehavior() {
        return 32 /* AbilityBehavior.AOE */ | 134217728 /* AbilityBehavior.IGNORE_BACKSWING */;
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
    OnSpellStart() {
        // how big aoe?
        const radius = this.GetSpecialValueFor("radius");
        const spellPos = this.GetCursorPosition();
        const heroToPoint = (this.caster.GetForwardVector() * 400);
        const starfallPos = (this.caster.GetAbsOrigin() + heroToPoint);
        const kv = { duration: 2 };
        CreateModifierThinker(this.caster, this, modifier_tyrande_starfall_area.name, kv, starfallPos, this.caster.GetTeam(), false);
        const enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), starfallPos, undefined, radius, 2 /* UnitTargetTeam.ENEMY */, 18 /* UnitTargetType.BASIC */ | 1 /* UnitTargetType.HERO */ | 4 /* UnitTargetType.BUILDING */ | 2 /* UnitTargetType.CREEP */, 0 /* UnitTargetFlags.NONE */, 0 /* FindOrder.ANY */, false);
        for (const enemy of enemies) {
            const particle = ParticleManager.CreateParticle(this.hit_fx, 2 /* ParticleAttachment.CUSTOMORIGIN */, this.caster);
            ParticleManager.SetParticleControl(particle, 0, enemy.GetAbsOrigin());
            ApplyDamage({
                victim: enemy,
                attacker: this.caster,
                damage: 200,
                damage_type: 2 /* DamageTypes.MAGICAL */
            });
        }
    }
}
