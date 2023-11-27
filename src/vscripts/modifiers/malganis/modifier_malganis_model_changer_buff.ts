import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { modifier_malganis_model } from "../../modifiers/malganis/modifier_malganis_model";

@registerModifier()
export class modifier_malganis_model_changer_buff extends BaseModifier {
	// Modifier properties
    caster: CDOTA_BaseNPC = this.GetCaster()!;
	ability: CDOTABaseAbility = this.GetAbility()!;
	parent: CDOTA_BaseNPC = this.GetParent();

    particle_transition = "particles/units/heroes/hero_night_stalker/nightstalker_change.vpcf";
	particle_transition_fx?: ParticleID;
    particle_buff = "particles/units/heroes/hero_night_stalker/nightstalker_night_buff.vpcf";
	particle_buff_fx?: ParticleID;

	wings?: CBaseEntity;
	legs?: CBaseEntity;
	tail?: CBaseEntity;

	IsHidden() {
		return true;
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
   
    OnCreated(): void {
		if (!IsServer()) return;

        // Change model to night
        const kv = { duration: 3 };

		this.parent.AddNewModifier(this.caster, this.ability, modifier_malganis_model.name, kv); //todo :fix warning?

        // Attach wearables
        this.wings = SpawnEntityFromTableSynchronous("prop_dynamic", { model: "models/heroes/nightstalker/nightstalker_wings_night.vmdl" });
        this.legs = SpawnEntityFromTableSynchronous("prop_dynamic", { model: "models/heroes/nightstalker/nightstalker_legarmor_night.vmdl" });
        this.tail = SpawnEntityFromTableSynchronous("prop_dynamic", { model: "models/heroes/nightstalker/nightstalker_tail_night.vmdl" });

        // Lock wearables to bone
        this.wings.FollowEntity(this.parent, true);
        this.legs.FollowEntity(this.parent, true);
        this.tail.FollowEntity(this.parent, true);

        this.ApplyTransitionBuffParticle();

        this.particle_buff_fx = ParticleManager.CreateParticle(this.particle_buff, ParticleAttachment.CUSTOMORIGIN_FOLLOW, this.parent);
		ParticleManager.SetParticleControl(this.particle_buff_fx, 0, this.parent.GetAbsOrigin());
		ParticleManager.SetParticleControl(this.particle_buff_fx, 1, Vector(1, 0, 0));
    }

    OnDestroy(): void {
        if (!IsServer()) return;

        // Apply transition buff
        this.ApplyTransitionBuffParticle();

        // Destroy buff particle
        if (this.particle_buff_fx) {
            ParticleManager.DestroyParticle(this.particle_buff_fx, false);
            ParticleManager.ReleaseParticleIndex(this.particle_buff_fx);
        }
    }

    ApplyTransitionBuffParticle(): void {
		// Apply transition buff
		this.particle_transition_fx = ParticleManager.CreateParticle(this.particle_transition, ParticleAttachment.ABSORIGIN_FOLLOW, this.parent);
		ParticleManager.SetParticleControl(this.particle_transition_fx, 0, this.parent.GetAbsOrigin());
		ParticleManager.SetParticleControl(this.particle_transition_fx, 1, this.parent.GetAbsOrigin());
		ParticleManager.ReleaseParticleIndex(this.particle_transition_fx);
	}
}