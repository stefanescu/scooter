import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { modifier_malganis_model } from "./modifier_malganis_model";

@registerModifier()
export class modifier_fel_claws_counter extends BaseModifier {
	// Modifier properties
    caster: CDOTA_BaseNPC = this.GetCaster()!;
	ability: CDOTABaseAbility = this.GetAbility()!;
	parent: CDOTA_BaseNPC = this.GetParent();
	
	maxStacks = 2;

  

	IsHidden() {
		return false;
	}
	IsDebuff() {
		return false;
	}
	IsPurgable() {
		return false;
	}

	OnCreated() {
        if (!IsServer()) return;
        
		this.IncrementStackCount();
    }

	OnRefresh(){
		if (!IsServer()) return;

		if (this.GetStackCount() >= this.maxStacks){
			this.parent.RemoveAllModifiersOfName(this.GetName());
			return;
		}

		this.IncrementStackCount();
	}
	
	OnDestroy(): void {
		this.DecrementStackCount();
	}

}