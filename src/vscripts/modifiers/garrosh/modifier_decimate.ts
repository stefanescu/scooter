import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";

@registerModifier()
export class modifier_decimate extends BaseModifier {


    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.MOVESPEED_BONUS_PERCENTAGE];
    }

    
    GetModifierMoveSpeedBonus_Percentage_Unique(): number {
        return 30;
    }

    IsDebuff(): boolean {
        return true;
    }
    
    IsHidden(): boolean {
        return false;
    }

    IsPurgable(): boolean {
        return true;
    }

    GetTexture(): string {
        return "axe_counter_helix";
    }
    
}

