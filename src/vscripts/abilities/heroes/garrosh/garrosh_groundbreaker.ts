import { BaseAbility, registerAbility } from "../../../lib/dota_ts_adapter";

@registerAbility()
export class garrosh_groundbreaker extends BaseAbility {
    particle?: ParticleID;
    caster = this.GetCaster();
    cast_anim = GameActivity.DOTA_CAST_ABILITY_4;
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

    GetCastAnimation(): GameActivity {
        return this.cast_anim;
    }
    
    GetCastPoint(): number {
        return this.cast_point;
    }

    OnSpellStart() {
        const radius = this.GetSpecialValueFor("radius");

        const point = this.GetCursorPosition();
        const heroToPoint = (this.caster.GetForwardVector() * 400 ) as Vector;
        const smashPos = (this.caster.GetAbsOrigin() + heroToPoint) as Vector;
        
        const particle = ParticleManager.CreateParticle(
            this.hitParticle,
            ParticleAttachment.WORLDORIGIN,
            this.caster
        );

        ParticleManager.SetParticleControl(particle, 0, smashPos);
        ParticleManager.ReleaseParticleIndex;
        
        const enemies = FindUnitsInRadius(
            this.caster.GetTeamNumber(),
            smashPos,
            undefined,
            radius,
            UnitTargetTeam.ENEMY,
            UnitTargetType.BASIC | UnitTargetType.HERO | UnitTargetType.BUILDING | UnitTargetType.CREEP,
            UnitTargetFlags.NONE,
            FindOrder.ANY,
            false
            );

        for (const enemy of enemies) { 

            enemy.AddNewModifier (this.caster, this, BuiltInModifier.STUN , { duration: 2 });
            
            ApplyDamage({
                victim: enemy,
                attacker: this.caster,
                damage: 250,
                damage_type: DamageTypes.PHYSICAL
            });
    
        }

    }
}