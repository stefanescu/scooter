import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";

// Base speed modifier -- Could be moved to a separate file
@registerModifier()
export class modifier_decimate extends BaseModifier {


    // Declare functions
    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.MOVESPEED_BONUS_PERCENTAGE];
    }

    GetModifierMoveSpeedBonus_Percentage(): number {
        return -30;
    }
}

