import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
@registerModifier()
export class modifier_fel_claws_counter extends BaseModifier {
    // Modifier properties
    caster = this.GetCaster();
    ability = this.GetAbility();
    parent = this.GetParent();
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
        if (!IsServer())
            return;
        this.IncrementStackCount();
    }
    OnRefresh() {
        if (!IsServer())
            return;
        if (this.GetStackCount() >= this.maxStacks) {
            this.parent.RemoveAllModifiersOfName(this.GetName());
            return;
        }
        this.IncrementStackCount();
    }
    OnDestroy() {
        this.DecrementStackCount();
    }
}
