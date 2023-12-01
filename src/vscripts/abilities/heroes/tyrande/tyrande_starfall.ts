import { BaseAbility, registerAbility } from "../../../lib/dota_ts_adapter";
import { modifier_tyrande_starfall_area } from "../../../modifiers/tyrande/modifier_tyrande_starfall_area";

@registerAbility()
export class tyrande_starfall extends BaseAbility {
    // Garrosh spins, slowing and damaging all enemy units and buildings
    
    //Properties
    particle?: ParticleID;
    caster = this.GetCaster();
    cast_anim = GameActivity.DOTA_CAST_ABILITY_1;
    cast_sound = "Hero_Axe.Counterhelix";
    cast_point = 0.2;
    hit_fx = "particles/econ/items/mirana/mirana_starstorm_bow/mirana_starstorm_starfall_attack.vpcf";

    GetCastAnimation(): GameActivity {
        return this.cast_anim;
    }
    
    GetCastPoint(): number {
        return this.cast_point;
    }

    GetBehavior(): AbilityBehavior | Uint64 {
        return AbilityBehavior.AOE | AbilityBehavior.IGNORE_BACKSWING;
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

        const heroToPoint = (this.caster.GetForwardVector() * 400 ) as Vector;
        const starfallPos = (this.caster.GetAbsOrigin() + heroToPoint) as Vector;

        const kv = { duration: 2 };
        CreateModifierThinker(this.caster, this, modifier_tyrande_starfall_area.name, kv, starfallPos, this.caster.GetTeam(), false);
        
        const enemies = FindUnitsInRadius(
            this.caster.GetTeamNumber(),
            starfallPos,
            undefined,
            radius,
            UnitTargetTeam.ENEMY,
            UnitTargetType.BASIC | UnitTargetType.HERO | UnitTargetType.BUILDING | UnitTargetType.CREEP,
            UnitTargetFlags.NONE,
            FindOrder.ANY,
            false
            );

        for (const enemy of enemies) { 
            const particle = ParticleManager.CreateParticle(
                this.hit_fx,
                ParticleAttachment.CUSTOMORIGIN,
                this.caster
            );
            ParticleManager.SetParticleControl(particle, 0, enemy.GetAbsOrigin());

            ApplyDamage({
                victim: enemy,
                attacker: this.caster,
                damage: 200,
                damage_type: DamageTypes.MAGICAL
            });

    
        }
    }
}
