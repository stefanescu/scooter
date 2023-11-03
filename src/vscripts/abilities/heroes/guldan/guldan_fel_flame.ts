import { BaseAbility, registerAbility } from "../../../lib/dota_ts_adapter";

@registerAbility()
export class guldan_fel_flame extends BaseAbility {
    particle?: ParticleID;
    caster = this.GetCaster();
    cast_anim = GameActivity.DOTA_CAST_ABILITY_4;
    cast_sound = "Hero_Meepo.Earthbind.Cast";
    cast_point = 0.4;
    hitParticle = "particles/units/heroes/hero_pangolier/pangolier_tailthump.vpcf";
    damage = this.GetSpecialValueFor("damage");
    range = this.GetSpecialValueFor("range");
    speed = this.GetSpecialValueFor("speed");

    

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
        this.damage = this.GetSpecialValueFor("damage");
        this.range = this.GetSpecialValueFor("range");
        this.speed = this.GetSpecialValueFor("speed");

        EmitSoundOn( "Hero_Lina.DragonSlave.Cast", this.caster );

        let vPos = this.GetCursorTarget()?.GetOrigin();
        if (!vPos)
		    vPos = this.GetCursorPosition()
	
        const direction = ((vPos - this.caster.GetAbsOrigin()) as Vector).Normalized();
        direction.z = 0;

        const proj = {
            EffectName:  "particles/units/heroes/hero_lina/lina_spell_dragon_slave.vpcf",
            Ability: this,
            vSpawnOrigin : this.GetCaster().GetOrigin(), 
            fStartRadius : 20,
            fEndRadius : 80,
            vVelocity : ( direction * this.speed) as Vector,
            fDistance : this.range,
            Source : this.GetCaster(),
            iUnitTargetTeam: UnitTargetTeam.ENEMY,
            iUnitTargetType : UnitTargetType.HERO + UnitTargetType.BASIC + UnitTargetType.BUILDING,
        };

        ProjectileManager.CreateLinearProjectile ( proj);
        EmitSoundOn( "Hero_Lina.DragonSlave", this.GetCaster() );
        // const radius = this.GetSpecialValueFor("radius");

        // const heroToPoint = (this.caster.GetForwardVector() * 400 ) as Vector;

        // const smashPos = (this.caster.GetAbsOrigin() + heroToPoint) as Vector;
        
        // const particle = ParticleManager.CreateParticle(
        //     this.hitParticle,
        //     ParticleAttachment.WORLDORIGIN,
        //     this.caster
        // );

        // ParticleManager.SetParticleControl(particle, 0, smashPos);
        // ParticleManager.ReleaseParticleIndex
        
        // const units = FindUnitsInRadius(
        //     this.caster.GetTeamNumber(),
        //     smashPos,
        //     undefined,
        //     radius,
        //     UnitTargetTeam.ENEMY,
        //     UnitTargetType.BASIC | UnitTargetType.HERO | UnitTargetType.BUILDING | UnitTargetType.CREEP,
        //     UnitTargetFlags.NONE,
        //     0,
        //     false
        //     );

        // for (const unit of units) { 

        //     unit.AddNewModifier (this.caster, this, BuiltInModifier.STUN , { duration: 2 });
            
        //     ApplyDamage({
        //         victim: unit,
        //         attacker: this.caster,
        //         damage: 250,
        //         damage_type: DamageTypes.PHYSICAL
        //     })
    
        // }

    
    }

    OnProjectileHit(target: CDOTA_BaseNPC | undefined, location: Vector): boolean | void {
        if (target && (!target.IsInvulnerable())) {
            let damage = {
                        victim: target,
                        attacker: this.caster,
                        damage: 250,
                        damage_type: DamageTypes.PHYSICAL,
                        ability: this
                    };
		    
            ApplyDamage( damage );
            
            let vDirection = (location - this.caster.GetOrigin()) as Vector;
            vDirection.z = 0.0;
            vDirection = vDirection.Normalized();

            let nFXIndex = ParticleManager.CreateParticle( "particles/units/heroes/hero_lina/lina_spell_dragon_slave_impact.vpcf", ParticleAttachment.ABSORIGIN_FOLLOW, target )
		    ParticleManager.SetParticleControlForward( nFXIndex, 1, vDirection )
		    ParticleManager.ReleaseParticleIndex( nFXIndex )
               
        }
        return false;
    }
}