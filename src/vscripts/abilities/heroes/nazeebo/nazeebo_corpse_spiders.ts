import { BaseAbility, registerAbility } from "../../../lib/dota_ts_adapter";
import { modifier_spiderling_expire } from "../../../modifiers/nazeebo/modifier_spiderling_expire"

@registerAbility()
export class nazeebo_corpse_spiders extends BaseAbility {
    particle?: ParticleID;
    caster = this.GetCaster();
    cast_anim = GameActivity.DOTA_CAST_ABILITY_1;
    cast_sound = "Hero_Lina.DragonSlave.Cast";
    cast_point = 0.3;

    proj_fx = "particles/units/heroes/hero_meepo/meepo_earthbind_projectile_fx.vpcf";

    range = this.GetSpecialValueFor("range");
    speed = this.GetSpecialValueFor("speed");
    spider_duration = this.GetSpecialValueFor("duration");
    radius = this.GetSpecialValueFor("radius");

    textureName = "broodmother_spawn_spiderlings";

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

    //todo: test if needed?
    OnAbilityUpgrade(upgradeAbility: object): void {
        this.spider_duration = this.GetSpecialValueFor("duration");
        this.range = this.GetSpecialValueFor("range");
        this.speed = this.GetSpecialValueFor("speed");
        this.radius = this.GetSpecialValueFor("radius");
    }

    OnSpellStart() {
		const cursorPos = this.GetCursorPosition()
        const casterPos = this.caster.GetAbsOrigin();

        const vDirection = ((cursorPos - casterPos) as Vector).Normalized();
        vDirection.z = 0;

        const vDistance = ((cursorPos - casterPos) as Vector).Length();
        const vVelocity = (vDirection * this.speed) as Vector;

        
        this.particle = ParticleManager.CreateParticle(
            this.proj_fx,
            ParticleAttachment.CUSTOMORIGIN,
            this.caster,
        );
        ParticleManager.SetParticleControl(this.particle, 0, casterPos); //startPos
        ParticleManager.SetParticleControl(this.particle, 1, cursorPos); //endPos
        ParticleManager.SetParticleControl(this.particle, 2, Vector(this.speed, 0, 0)); //speed

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
            vVelocity: vVelocity,
            bProvidesVision: true,
            iVisionRadius: this.radius,
            iVisionTeamNumber: this.caster.GetTeamNumber(),
        });
        EmitSoundOn( "Hero_Lina.DragonSlave", this.GetCaster() );

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
    
    }


    OnProjectileHit(target: CDOTA_BaseNPC | undefined, location: Vector): boolean | void {
        const owner = this.caster.GetOwner();
        const teamNumber = this.caster.GetTeamNumber();
        
        const nSpiders = 3 
        for (let i = 0; i < nSpiders; i++) {
            const spider = CreateUnitByName("npc_dota_broodmother_spiderling",
                    location,
                    true,
                    this.caster,
                    owner,
                    teamNumber);
            
            if (spider != null) {
                spider.SetOwner(this.caster);
                spider.SetControllableByPlayer(this.caster.GetPlayerOwnerID(), false);
                
                spider.AddNewModifier(this.caster, this, 
                    modifier_spiderling_expire.name, {duration: this.spider_duration});
                
                spider.MoveToPositionAggressive(location); //todo: make spiders only attack units in aoe   
            }
        }

        ParticleManager.DestroyParticle(this.particle!, false);
        ParticleManager.ReleaseParticleIndex(this.particle!);
            

        return true; //destroy projectile?
    }
}