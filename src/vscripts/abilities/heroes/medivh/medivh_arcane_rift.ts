import { BaseAbility, registerAbility } from "../../../lib/dota_ts_adapter";
import { modifier_medivh_crow_model } from "../../../modifiers/medivh/modifier_medivh_crow_model";

@registerAbility()
export class medivh_arcane_rift extends BaseAbility {
    particle?: ParticleID;
    caster = this.GetCaster();
    cast_anim = GameActivity.DOTA_CAST_ABILITY_2;
    cast_sound = "Hero_Meepo.Earthbind.Cast";
    cast_point = 0.2;

	crow_model = "models/items/beastmaster/hawk/beast_heart_marauder_beast_heart_marauder_raven/beast_heart_marauder_beast_heart_marauder_raven.vmdl";

    hitParticle = "particles/units/heroes/hero_lina/lina_spell_dragon_slave_impact.vpcf";

    damage = this.GetSpecialValueFor("damage");
    range = this.GetSpecialValueFor("range");
    speed = this.GetSpecialValueFor("speed");
    textureName = "magnus_shockwave"

    Precache(context: CScriptPrecacheContext) {
        PrecacheModel(this.crow_model,context);
    }

    GetCastAnimation(): GameActivity {
        return this.cast_anim;
    }
    
    GetCastPoint(): number {
        return this.cast_point;
    }
    
    GetAbilityTextureName(): string {
        return this.textureName;
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
            fStartRadius : 50,
            fEndRadius : 100,
            vVelocity : ( direction * this.speed) as Vector,
            fDistance : this.range,
            Source : this.GetCaster(),
            iUnitTargetTeam: UnitTargetTeam.ENEMY,
            iUnitTargetType : UnitTargetType.HERO + UnitTargetType.BASIC + UnitTargetType.BUILDING,
        };

        ProjectileManager.CreateLinearProjectile ( proj);
        EmitSoundOn( "Hero_Lina.DragonSlave", this.GetCaster() );
    
        const kv = { duration: 5 };
        this.caster.AddNewModifier(this.caster, this, modifier_medivh_crow_model.name, kv);
    }


    OnProjectileHit(target: CDOTA_BaseNPC | undefined, location: Vector): boolean | void {
        if (target && (!target.IsInvulnerable())) {
            let damage = {
                        victim: target,
                        attacker: this.caster,
                        damage: this.damage,
                        damage_type: DamageTypes.MAGICAL,
                        ability: this
                    };
		    
            ApplyDamage( damage );
            
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