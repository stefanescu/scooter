import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { modifier_malganis_model } from "../../modifiers/malganis/modifier_malganis_model";
@registerModifier()
export class modifier_malganis_model_changer_buff extends BaseModifier {
    // Modifier properties
    caster = this.GetCaster();
    ability = this.GetAbility();
    parent = this.GetParent();
    duration = this.ability.GetSpecialValueFor("duration");
    particle_transition = "particles/units/heroes/hero_night_stalker/nightstalker_change.vpcf";
    particle_transition_fx;
    particle_buff = "particles/units/heroes/hero_night_stalker/nightstalker_night_buff.vpcf";
    particle_buff_fx;
    wings;
    legs;
    tail;
    IsHidden() {
        return false;
    }
    IsDebuff() {
        return false;
    }
    IsPurgable() {
        return false;
    }
    RemoveOnDeath() {
        return false;
    }
    OnCreated() {
        if (!IsServer())
            return;
        // Apply fx only if not already in alt model
        if (!this.caster.FindModifierByName(modifier_malganis_model.name))
            this.ApplyModelTransitionBuffParticle();
        // add modifier which changes model to night
        const kv = { duration: 3 };
        this.parent.AddNewModifier(this.caster, this.ability, modifier_malganis_model.name, kv);
        // Attach wearables
        if (!this.wings)
            this.wings = SpawnEntityFromTableSynchronous("prop_dynamic", { model: "models/heroes/nightstalker/nightstalker_wings_night.vmdl" });
        if (!this.legs)
            this.legs = SpawnEntityFromTableSynchronous("prop_dynamic", { model: "models/heroes/nightstalker/nightstalker_legarmor_night.vmdl" });
        if (!this.tail)
            this.tail = SpawnEntityFromTableSynchronous("prop_dynamic", { model: "models/heroes/nightstalker/nightstalker_tail_night.vmdl" });
        // Lock wearables to bone
        this.wings.FollowEntity(this.parent, true);
        this.legs.FollowEntity(this.parent, true);
        this.tail.FollowEntity(this.parent, true);
        if (!this.particle_buff_fx)
            this.particle_buff_fx = ParticleManager.CreateParticle(this.particle_buff, 3 /* ParticleAttachment.CUSTOMORIGIN_FOLLOW */, this.parent);
        ParticleManager.SetParticleControl(this.particle_buff_fx, 0, this.parent.GetAbsOrigin());
        ParticleManager.SetParticleControl(this.particle_buff_fx, 1, Vector(1, 0, 0));
        // this.parent.StartGesture(GameActivity.DOTA_CAST_ABILITY_3);//todo: proper E animation, right after model change? where exactly?
    }
    OnRefresh(params) {
        this.OnCreated();
    }
    OnDestroy() {
        if (!IsServer())
            return;
        // Apply transition buff
        this.ApplyModelTransitionBuffParticle();
        //Remove wearables, but don't destroy?
        this.wings?.RemoveSelf();
        this.legs?.RemoveSelf();
        this.tail?.RemoveSelf();
        // Destroy buff particle
        if (this.particle_buff_fx) {
            ParticleManager.DestroyParticle(this.particle_buff_fx, false);
            ParticleManager.ReleaseParticleIndex(this.particle_buff_fx);
        }
    }
    ApplyModelTransitionBuffParticle() {
        // Apply transition buff
        this.particle_transition_fx = ParticleManager.CreateParticle(this.particle_transition, 1 /* ParticleAttachment.ABSORIGIN_FOLLOW */, this.parent);
        ParticleManager.SetParticleControl(this.particle_transition_fx, 0, this.parent.GetAbsOrigin());
        ParticleManager.SetParticleControl(this.particle_transition_fx, 1, this.parent.GetAbsOrigin());
        ParticleManager.ReleaseParticleIndex(this.particle_transition_fx);
    }
}
