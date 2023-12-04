import { BaseAbility, registerAbility } from "../../../lib/dota_ts_adapter";
import { modifier_decimate } from "../../../modifiers/garrosh/modifier_decimate";
@registerAbility()
export class garrosh_decimate extends BaseAbility {
    // Garrosh spins, slowing and damaging all enemy units and buildings
    //Properties
    particle;
    caster = this.GetCaster();
    cast_anim = 1512 /* GameActivity.DOTA_CAST_ABILITY_3 */;
    cast_sound = "Hero_Axe.Counterhelix";
    cast_point = 0.2;
    GetCastAnimation() {
        return this.cast_anim;
    }
    GetCastPoint() {
        return this.cast_point;
    }
    GetBehavior() {
        return 4 /* AbilityBehavior.NO_TARGET */ | 134217728 /* AbilityBehavior.IGNORE_BACKSWING */
            | 8388608 /* AbilityBehavior.DONT_CANCEL_MOVEMENT */;
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
        //get list of enemies in aoe
        const enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.caster.GetAbsOrigin(), undefined, radius, 2 /* UnitTargetTeam.ENEMY */, 18 /* UnitTargetType.BASIC */ | 1 /* UnitTargetType.HERO */ | 4 /* UnitTargetType.BUILDING */, 0 /* UnitTargetFlags.NONE */, 0 /* FindOrder.ANY */, false);
        for (const unit of enemies) {
            //add debuff, which slows
            unit.AddNewModifier(this.caster, this, modifier_decimate.name, { duration: 2 });
            ApplyDamage({
                victim: unit,
                attacker: this.caster,
                damage: 100,
                damage_type: 1 /* DamageTypes.PHYSICAL */
            });
        }
    }
}
