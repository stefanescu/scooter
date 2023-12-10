import { BaseAbility, registerAbility } from "../../../lib/dota_ts_adapter";
import { modifier_fel_claws_counter } from "../../../modifiers/malganis/modifier_fel_claws_counter";
import { modifier_fel_claws_dash } from "../../../modifiers/malganis/modifier_fel_claws_dash";
import { modifier_malganis_model_changer_buff } from "../../../modifiers/malganis/modifier_malganis_model_changer_buff";

@registerAbility()
export class malganis_fel_claws extends BaseAbility {
    caster = this.GetCaster();
 
    particle_darkness = "particles/units/heroes/hero_night_stalker/nightstalker_ulti.vpcf";
	particle_darkness_fx?: ParticleID;

    // particle_hit_left = "particles/units/heroes/hero_ursa/ursa_claw_left.vpcf";
    particle_hit_left = "particles/econ/items/ursa/ursa_swift_claw/ursa_swift_claw_left.vpcf";
	particle_hit_left_fx?: ParticleID;

    // particle_hit_right = "particles/units/heroes/hero_ursa/ursa_claw_right.vpcf";
    particle_hit_right = "particles/econ/items/ursa/ursa_swift_claw/ursa_swift_claw_right.vpcf";
	particle_hit_right_fx?: ParticleID;

    texture = "night_stalker_crippling_fear"

    cast_sound = "Hero_NightStalker.Void";
    
    cast_anim = [
                GameActivity.DOTA_CAST_ABILITY_2, 
                GameActivity.DOTA_ATTACK,
                GameActivity.DOTA_CAST_ABILITY_1
                ];
    anim_playback_rate = [1, 1, 2]; 
    cast_point = 0.1;
    
    max_slash_count= 2;
    cd_between_slashes = 0.1;

    Precache(context: CScriptPrecacheContext) {
		PrecacheResource(PrecacheType.PARTICLE, this.particle_darkness, context);
		PrecacheResource(PrecacheType.PARTICLE, this.particle_hit_left, context);
		PrecacheResource(PrecacheType.PARTICLE, this.particle_hit_right, context);
	}

    GetCastAnimation(): GameActivity {
        //determine ability phase from number of modifier stacks
        return this.cast_anim[this.CheckSlashCount()];
    }

    GetPlaybackRateOverride(): number {
        return this.anim_playback_rate[this.CheckSlashCount()];
    }

    CheckSlashCount() {
        return this.caster.GetModifierStackCount(modifier_fel_claws_counter.name, this.caster);
    }
    
    IsFirstSlash() {
        return this.CheckSlashCount() == this.max_slash_count - 2;
    }

    IsSecondSlash() {
        return this.CheckSlashCount() == this.max_slash_count - 1;
    }

    IsThirdSlash() {
        return this.CheckSlashCount() >= this.max_slash_count;
    }

    GetCastPoint(): number {
        return this.cast_point;
    }
    
    GetCooldown(level: number): number {
        if (!IsServer()) return super.GetCooldown(level); // UI always shows original cd

        if (this.IsThirdSlash()) return super.GetCooldown(level); // after max slashes, original cd

        return this.cd_between_slashes; // cd is this.cdBetweenSLashes until we reach max slashes
    }

    GetManaCost(level: number): number {
        if (this.IsFirstSlash()) return super.GetManaCost(level); //only first slash costs mana
        
        return 0; // rest of slashes cost 0 mana
    }

    GetBehavior(): AbilityBehavior | Uint64 {
        return AbilityBehavior.AOE | AbilityBehavior.POINT
        | AbilityBehavior.DONT_CANCEL_MOVEMENT
        | AbilityBehavior.ROOT_DISABLES;
    }

    GetAbilityTextureName(): string {
        return this.texture;
    }
    
    OnSpellStart(): void {

        

        const radius = 200;

        const kv = { duration: 3 }; //temp
        //change model
        this.caster.AddNewModifier(this.caster, this, modifier_malganis_model_changer_buff.name, kv); 
        
        // add dash modifier
        this.caster.AddNewModifier(this.caster, this, modifier_fel_claws_dash.name, {duration:0.3}); 
        //find enemies in a circle, 
        const enemies = FindUnitsInRadius(
            this.caster.GetTeamNumber(),
            this.caster.GetAbsOrigin(),
            undefined,
            radius,
            UnitTargetTeam.ENEMY,
            UnitTargetType.BASIC | UnitTargetType.HERO | UnitTargetType.BUILDING | UnitTargetType.CREEP,
            UnitTargetFlags.NONE,
            FindOrder.ANY,
            false
            );

        const point = this.GetCursorPosition();
        const origin = this.caster.GetOrigin();
        const cast_dir = ((origin - point) as Vector).Normalized();
        const cast_angle = VectorAngles(cast_dir).y;
        const aoe_angle = 180 / 2;


        for (const enemy of enemies) {

            const enemy_direction = ((enemy.GetOrigin() -  origin) as Vector).Normalized();
            const enemy_angle = VectorToAngles(enemy_direction).y;
            const angle_diff = math.abs( AngleDiff(cast_angle, enemy_angle));

            //use angles to skip enemies outside cone AOE, facing forward
            if (this.IsOutsideAOERange(angle_diff, aoe_angle)) continue; 
            
            ApplyDamage({
                victim: enemy,
                attacker: this.caster,
                damage: 100,
                damage_type: DamageTypes.MAGICAL
            });

            // on 3rd slash, stun add modifier_lion_impale
            if (this.IsThirdSlash()) 
                enemy.AddNewModifier (this.caster, this, "modifier_lion_impale" , kv);

        }


        // we later count the stacks of this modifier to determine which ability phase (slash) we are in
        this.caster.AddNewModifier(this.caster, this, modifier_fel_claws_counter.name, kv); 
        
        this.PlayFx();

    }
    

    private IsOutsideAOERange(angle_diff: number, aoe_angle: number) {
        return angle_diff < aoe_angle;
    }

    private PlayFx() {
        let fxId;

        if (this.IsThirdSlash()) { print("c");
            fxId = ParticleManager.CreateParticle(this.particle_hit_left, ParticleAttachment.ABSORIGIN_FOLLOW, this.caster);
            ParticleManager.SetParticleControl(fxId, 0, this.caster.GetAbsOrigin());
            ParticleManager.ReleaseParticleIndex(fxId);

            fxId = ParticleManager.CreateParticle(this.particle_hit_right, ParticleAttachment.ABSORIGIN_FOLLOW, this.caster);
            ParticleManager.SetParticleControl(fxId, 0, this.caster.GetAbsOrigin());
            ParticleManager.ReleaseParticleIndex(fxId);

            return;
        }

        let fx;
        if (this.IsSecondSlash()) {
            fx = this.particle_hit_left;
            print("b");
        }
        else {
            fx = this.particle_hit_right;
            print("a");
        }
        fxId = ParticleManager.CreateParticle(fx, ParticleAttachment.ABSORIGIN_FOLLOW, this.caster);
        ParticleManager.SetParticleControl(fxId, 0, this.caster.GetAbsOrigin());
        ParticleManager.ReleaseParticleIndex(fxId);

    }
}
