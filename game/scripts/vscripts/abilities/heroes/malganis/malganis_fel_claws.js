import { BaseAbility, registerAbility } from "../../../lib/dota_ts_adapter";
import { modifier_fel_claws_counter } from "../../../modifiers/malganis/modifier_fel_claws_counter";
import { modifier_fel_claws_dash } from "../../../modifiers/malganis/modifier_fel_claws_dash";
import { modifier_malganis_model_changer_buff } from "../../../modifiers/malganis/modifier_malganis_model_changer_buff";
@registerAbility()
export class malganis_fel_claws extends BaseAbility {
    caster = this.GetCaster();
    particle_darkness = "particles/units/heroes/hero_night_stalker/nightstalker_ulti.vpcf";
    particle_darkness_fx;
    // particle_hit_left = "particles/units/heroes/hero_ursa/ursa_claw_left.vpcf";
    particle_hit_left = "particles/econ/items/ursa/ursa_swift_claw/ursa_swift_claw_left.vpcf";
    particle_hit_left_fx;
    // particle_hit_right = "particles/units/heroes/hero_ursa/ursa_claw_right.vpcf";
    particle_hit_right = "particles/econ/items/ursa/ursa_swift_claw/ursa_swift_claw_right.vpcf";
    particle_hit_right_fx;
    cast_sound = "Hero_NightStalker.Void";
    cast_anim = [
        1511 /* GameActivity.DOTA_CAST_ABILITY_2 */,
        1503 /* GameActivity.DOTA_ATTACK */,
        1510 /* GameActivity.DOTA_CAST_ABILITY_1 */
    ];
    anim_playback_rate = [1, 1, 2];
    cast_point = 0.1;
    max_slash_count = 2;
    cd_between_slashes = 0.1;
    Precache(context) {
        PrecacheResource("particle" /* PrecacheType.PARTICLE */, this.particle_darkness, context);
        PrecacheResource("particle" /* PrecacheType.PARTICLE */, this.particle_hit_left, context);
        PrecacheResource("particle" /* PrecacheType.PARTICLE */, this.particle_hit_right, context);
    }
    OnAbilityPhaseStart() {
        // this.caster.StartGestureWithPlaybackRate(GameActivity.DOTA_ATTACK, 2);
        // this.caster.StartGestureWithPlaybackRate(GameActivity.DOTA_CAST_ABILITY_2, 2.5);
        return true;
    }
    OnAbilityPhaseInterrupted() {
        // this.caster.FadeGesture(GameActivity.DOTA_ATTACK);
    }
    GetCastAnimation() {
        //determine ability phase from number of modifier stacks
        return this.cast_anim[this.CheckSlashCount()];
    }
    GetPlaybackRateOverride() {
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
    GetCastPoint() {
        return this.cast_point;
    }
    GetCooldown(level) {
        if (!IsServer())
            return super.GetCooldown(level); // UI always shows original cd
        if (this.IsThirdSlash())
            return super.GetCooldown(level); // after max slashes, original cd
        return this.cd_between_slashes; // cd is this.cdBetweenSLashes until we reach max slashes
        // return super.GetCooldown(level); // after max slashes, original cd
    }
    GetManaCost(level) {
        if (this.IsFirstSlash())
            return super.GetManaCost(level); //only first slash costs mana
        return 0; // rest of slashes cost 0 mana
    }
    GetBehavior() {
        return 32 /* AbilityBehavior.AOE */ | 16 /* AbilityBehavior.POINT */
            | 8388608 /* AbilityBehavior.DONT_CANCEL_MOVEMENT */
            | 524288 /* AbilityBehavior.ROOT_DISABLES */;
    }
    OnSpellStart() {
        const radius = 200;
        const kv = { duration: 3 }; //temp
        //change model
        this.caster.AddNewModifier(this.caster, this, modifier_malganis_model_changer_buff.name, kv);
        // add dash modifier
        this.caster.AddNewModifier(this.caster, this, modifier_fel_claws_dash.name, { duration: 0.3 });
        //find enemies in a circle,
        const enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.caster.GetAbsOrigin(), undefined, radius, 2 /* UnitTargetTeam.ENEMY */, 18 /* UnitTargetType.BASIC */ | 1 /* UnitTargetType.HERO */ | 4 /* UnitTargetType.BUILDING */ | 2 /* UnitTargetType.CREEP */, 0 /* UnitTargetFlags.NONE */, 0 /* FindOrder.ANY */, false);
        const point = this.GetCursorPosition();
        const origin = this.caster.GetOrigin();
        const cast_dir = (origin - point).Normalized();
        const cast_angle = VectorAngles(cast_dir).y;
        const aoe_angle = 180 / 2;
        for (const enemy of enemies) {
            const enemy_direction = (enemy.GetOrigin() - origin).Normalized();
            const enemy_angle = VectorToAngles(enemy_direction).y;
            const angle_diff = math.abs(AngleDiff(cast_angle, enemy_angle));
            //use angles to skip enemies outside cone AOE, facing forward
            if (this.IsOutsideAOERange(angle_diff, aoe_angle))
                continue;
            ApplyDamage({
                victim: enemy,
                attacker: this.caster,
                damage: 100,
                damage_type: 2 /* DamageTypes.MAGICAL */
            });
            // on 3rd slash, stun add modifier_lion_impale
            if (this.IsThirdSlash())
                enemy.AddNewModifier(this.caster, this, "modifier_lion_impale", kv);
        }
        // we later count the stacks of this modifier to determine which ability phase (slash) we are in
        this.caster.AddNewModifier(this.caster, this, modifier_fel_claws_counter.name, kv);
        this.PlayFx();
    }
    IsOutsideAOERange(angle_diff, aoe_angle) {
        return angle_diff < aoe_angle;
    }
    PlayFx() {
        let fxId;
        if (this.IsThirdSlash()) {
            print("c");
            fxId = ParticleManager.CreateParticle(this.particle_hit_left, 1 /* ParticleAttachment.ABSORIGIN_FOLLOW */, this.caster);
            ParticleManager.SetParticleControl(fxId, 0, this.caster.GetAbsOrigin());
            ParticleManager.ReleaseParticleIndex(fxId);
            fxId = ParticleManager.CreateParticle(this.particle_hit_right, 1 /* ParticleAttachment.ABSORIGIN_FOLLOW */, this.caster);
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
        fxId = ParticleManager.CreateParticle(fx, 1 /* ParticleAttachment.ABSORIGIN_FOLLOW */, this.caster);
        ParticleManager.SetParticleControl(fxId, 0, this.caster.GetAbsOrigin());
        ParticleManager.ReleaseParticleIndex(fxId);
    }
}
