import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";

@registerModifier()
export class modifier_medivh_crow_model extends BaseModifier {
	// Modifier properties
	crow_model = "models/items/beastmaster/hawk/beast_heart_marauder_beast_heart_marauder_raven/beast_heart_marauder_beast_heart_marauder_raven.vmdl";

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

    DeclareFunctions(): ModifierFunction[] {
		return [ModifierFunction.MODEL_CHANGE,
             ModifierFunction.PRESERVE_PARTICLES_ON_MODEL_CHANGE];
	}

	GetModifierModelChange() {
		return this.crow_model;
	}

    CheckState(): Partial<Record<ModifierState, boolean>> {
        return {
            [ModifierState.FLYING]: true,
            [ModifierState.DISARMED] : true
        };
    }

	PreserveParticlesOnModelChanged(): 0 | 1 {
		return 1;
	}

    OnCreated(params: object): void {
        if(!IsServer()) return;

        this.StartIntervalThink(this.GetDuration() - 1);
    }

    OnIntervalThink(): void {
        if(!IsServer()) return;

        this.GetParent().StartGesture(GameActivity.DOTA_CAST_ABILITY_5);
        
        this.StartIntervalThink(-1); //stop think
    }

	OnRefresh(params: object): void {
        if (!IsServer()) return;
        
        this.SetDuration(3, true);
    }

}