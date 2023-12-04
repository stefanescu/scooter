import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
@registerModifier()
export class modifier_malganis_model extends BaseModifier {
    // Modifier properties
    night_model = "models/heroes/nightstalker/nightstalker_night.vmdl";
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
    DeclareFunctions() {
        return [220 /* ModifierFunction.MODEL_CHANGE */, 244 /* ModifierFunction.PRESERVE_PARTICLES_ON_MODEL_CHANGE */];
    }
    GetModifierModelChange() {
        return this.night_model;
    }
    PreserveParticlesOnModelChanged() {
        return 1;
    }
    OnRefresh(params) {
        if (!IsServer())
            return;
        this.SetDuration(3, true);
    }
}
