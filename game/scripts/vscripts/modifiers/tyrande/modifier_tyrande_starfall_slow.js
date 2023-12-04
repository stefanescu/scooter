import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
@registerModifier()
export class modifier_tyrande_starfall_slow extends BaseModifier {
    DeclareFunctions() {
        return [18 /* ModifierFunction.MOVESPEED_BONUS_PERCENTAGE */];
    }
    GetModifierMoveSpeedBonus_Percentage() {
        return -20;
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
        return "mirana_starfall";
    }
}
