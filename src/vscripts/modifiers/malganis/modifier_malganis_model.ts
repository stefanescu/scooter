import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";

@registerModifier()
export class modifier_malganis_model extends BaseModifier {
	// Modifier properties
	night_model: string = "models/heroes/nightstalker/nightstalker_night.vmdl";

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

    DeclareFunctions(): ModifierFunction[] {
		return [ModifierFunction.MODEL_CHANGE, ModifierFunction.PRESERVE_PARTICLES_ON_MODEL_CHANGE];
	}

	GetModifierModelChange() {
		return this.night_model;
	}

	PreserveParticlesOnModelChanged(): 0 | 1 {
		return 1;
	}
}