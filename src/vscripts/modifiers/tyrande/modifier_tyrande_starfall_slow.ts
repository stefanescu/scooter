import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";

@registerModifier()
export class modifier_tyrande_starfall_slow extends BaseModifier {


    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.MOVESPEED_BONUS_PERCENTAGE];
    }

    
    GetModifierMoveSpeedBonus_Percentage(): number {
        return -20;
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
        return "mirana_starfall";
    }
    
}

