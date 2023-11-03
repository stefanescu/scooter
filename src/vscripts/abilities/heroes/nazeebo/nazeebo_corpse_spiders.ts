import { BaseAbility, registerAbility } from "../../../lib/dota_ts_adapter";
import { modifier_spiderling_expire } from "../../../modifiers/nazeebo/modifier_spiderling_expire"

@registerAbility()
export class nazeebo_corpse_spiders extends BaseAbility {
    particle?: ParticleID;
    caster = this.GetCaster();
    cast_anim = GameActivity.DOTA_CAST_ABILITY_1;
    cast_sound = "Hero_Lina.DragonSlave.Cast";
    cast_point = 0.3;

    projParticle = "particles/units/heroes/hero_meepo/meepo_earthbind_projectile_fx.vpcf";

    damage = this.GetSpecialValueFor("damage");
    range = this.GetSpecialValueFor("range");
    speed = this.GetSpecialValueFor("speed");
    duration = this.GetSpecialValueFor("duration");
    radius = this.GetSpecialValueFor("radius");

    textureName = "axe_culling_blade";

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

    GetAbilityTextureName(): string {
        return this.textureName;
    }

    GetAOERadius(): number {
        return this.radius;
    }

    OnAbilityUpgrade(upgradeAbility: object): void {
        this.damage = this.GetSpecialValueFor("damage");
        this.duration = this.GetSpecialValueFor("duration");
        this.range = this.GetSpecialValueFor("range");
        this.speed = this.GetSpecialValueFor("speed");
        this.radius = this.GetSpecialValueFor("radius");
    }

    OnSpellStart() {
		const vPos = this.GetCursorPosition()
	
        const vDirection = ((vPos - this.caster.GetAbsOrigin()) as Vector).Normalized();
        vDirection.z = 0;

        const vDistance = ((vPos - this.caster.GetAbsOrigin()) as Vector).Length();

        this.particle = ParticleManager.CreateParticle(
            this.projParticle,
            ParticleAttachment.CUSTOMORIGIN,
            this.caster,
        );

        ParticleManager.SetParticleControl(this.particle, 0, this.caster.GetAbsOrigin());
        ParticleManager.SetParticleControl(this.particle, 1, vPos);
        ParticleManager.SetParticleControl(this.particle, 2, Vector(this.speed, 0, 0));


        ProjectileManager.CreateLinearProjectile({
            Ability: this,
            EffectName: "",
            vSpawnOrigin: this.caster.GetAbsOrigin(),
            fDistance: vDistance,
            fStartRadius: this.radius,
            fEndRadius: this.radius,
            Source: this.caster,
            bHasFrontalCone: false,
            iUnitTargetTeam: UnitTargetTeam.NONE,
            iUnitTargetFlags: UnitTargetFlags.NONE,
            iUnitTargetType: UnitTargetType.NONE,
            vVelocity: (vDirection * this.speed) as Vector,
            bProvidesVision: true,
            iVisionRadius: this.radius,
            iVisionTeamNumber: this.caster.GetTeamNumber(),
        });

        // const proj = {
        //     EffectName:  "particles/units/heroes/hero_witchdoctor/witchdoctor_cask.vpcf",
        //     Ability: this,
        //     vSpawnOrigin : this.GetCaster().GetOrigin(), 
        //     fStartRadius : this.radius,
        //     fEndRadius : this.radius,
        //     vVelocity : ( direction * this.speed) as Vector,
        //     fDistance : this.range,
        //     Source : this.GetCaster(),
        //     iUnitTargetTeam: UnitTargetTeam.NONE,
        //     iUnitTargetFlags: UnitTargetFlags.NONE,
        //     iUnitTargetType : UnitTargetType.NONE,
        //     bProvidesVision: true,
        //     iVisionRadius: this.radius,
        //     iVisionTeamNumber: this.caster.GetTeamNumber()
        // };

        // ProjectileManager.CreateLinearProjectile ( proj);
        EmitSoundOn( "Hero_Lina.DragonSlave", this.GetCaster() );
    
    }


    OnProjectileHit(target: CDOTA_BaseNPC | undefined, location: Vector): boolean | void {
            
        for (let i = 0; i < 3; i++) {
            const spider = CreateUnitByName("npc_dota_broodmother_spiderling",
                    location,
                    true,
                    this.caster,
                    this.caster.GetOwner(),
                    this.caster.GetTeamNumber()
                    );
            if (spider != null) {
                spider.SetControllableByPlayer(this.caster.GetPlayerOwnerID(), false);
                spider.MoveToPositionAggressive(location);
                spider.SetOwner(this.caster);
                
                const kv = {
                    duration: this.duration
                };

                spider.AddNewModifier(this.caster, this, modifier_spiderling_expire.name , kv);
            }
        }

        ParticleManager.DestroyParticle(this.particle!, false);
        ParticleManager.ReleaseParticleIndex(this.particle!);
            

        return true; //destroy projectile?
    }
}