import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { modifier_malganis_model } from "../../modifiers/malganis/modifier_malganis_model";

@registerModifier()
export class modifier_fel_claws extends BaseModifier {
	// Modifier properties
    caster: CDOTA_BaseNPC = this.GetCaster()!;
	ability: CDOTABaseAbility = this.GetAbility()!;
	parent: CDOTA_BaseNPC = this.GetParent();


	IsHidden() {
		return false;
	}
	IsDebuff() {
		return false;
	}
	IsPurgable() {
		return false;
	}


}