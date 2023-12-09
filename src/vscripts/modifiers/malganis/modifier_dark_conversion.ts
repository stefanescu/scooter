import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";

@registerModifier()
export class modifier_dark_conversion extends BaseModifier {
    texture = "night_stalker_hunter_in_the_night";

    IsDebuff() {
        return false;
    }
    
    IsHidden() {
        return false;
    }

    IsPurgable() {
        return false;
    }

    DeclareFunctions(): ModifierFunction[] {
        return [
            ModifierFunction.TRANSLATE_ACTIVITY_MODIFIERS,
             ];
    }

    GetActivityTranslationModifiers(): string {
		return "hunter_night";
	}

    GetTexture(): string {
        return this.texture;
    }
}

