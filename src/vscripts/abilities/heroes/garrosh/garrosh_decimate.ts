import { BaseAbility, registerAbility } from "../../../lib/dota_ts_adapter";
import { modifier_decimate } from "../../../modifiers/garrosh/modifier_decimate"

@registerAbility()
export class garrosh_decimate extends BaseAbility {
    particle?: ParticleID;
    caster = this.GetCaster();
    cast_anim = GameActivity.DOTA_CAST_ABILITY_3;
    cast_sound = "Hero_Axe.Counterhelix";
    cast_point = 0.2;


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
        return AbilityBehavior.NO_TARGET | AbilityBehavior.IGNORE_BACKSWING | AbilityBehavior.DONT_CANCEL_MOVEMENT;
    }

    OnSpellStart() {

        const radius = this.GetSpecialValueFor("radius");

        const enemies = FindUnitsInRadius(
            this.caster.GetTeamNumber(),
            this.caster.GetAbsOrigin(),
            undefined,
            radius,
            UnitTargetTeam.ENEMY,
            UnitTargetType.BASIC | UnitTargetType.HERO | UnitTargetType.BUILDING,
            UnitTargetFlags.NONE,
            0,
            false
            );


        for (const unit of enemies) { 

            unit.AddNewModifier (this.caster, this, modifier_decimate.name, { duration: 2 });
            
            ApplyDamage({
                victim: unit,
                attacker: this.caster,
                damage: 100,
                damage_type: DamageTypes.PHYSICAL
            })

        }
        
    }
}
