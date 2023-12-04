import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
@registerModifier()
export class modifier_decimate extends BaseModifier {
    DeclareFunctions() {
        return [18 /* ModifierFunction.MOVESPEED_BONUS_PERCENTAGE */];
    }
    GetModifierMoveSpeedBonus_Percentage() {
        return -30;
    }
    IsDebuff() {
        return true;
    }
    IsHidden() {
        return false;
    }
    IsPurgable() {
        return true;
    }
    GetTexture() {
        return "axe_counter_helix";
    }
}
