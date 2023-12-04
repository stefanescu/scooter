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
    DeclareFunctions() {
        return [220 /* ModifierFunction.MODEL_CHANGE */,
            244 /* ModifierFunction.PRESERVE_PARTICLES_ON_MODEL_CHANGE */];
    }
    GetModifierModelChange() {
        return this.crow_model;
    }
    CheckState() {
        return {
            [26 /* ModifierState.FLYING */]: true,
            [1 /* ModifierState.DISARMED */]: true
        };
    }
    PreserveParticlesOnModelChanged() {
        return 1;
    }
    OnCreated(params) {
        if (!IsServer())
            return;
        this.StartIntervalThink(this.GetDuration() - 1);
    }
    OnIntervalThink() {
        if (!IsServer())
            return;
        this.GetParent().StartGesture(1514 /* GameActivity.DOTA_CAST_ABILITY_5 */);
        this.StartIntervalThink(-1); //stop think
    }
    OnRefresh(params) {
        if (!IsServer())
            return;
        this.SetDuration(3, true);
    }
}
