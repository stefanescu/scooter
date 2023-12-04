import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
@registerModifier()
export class modifier_night_rush_dark_ascension extends BaseModifier {
    // Modifier properties
    caster = this.GetCaster();
    ability = this.GetAbility();
    parent = this.GetParent();
    texture = "night_stalker_darkness";
    IsDebuff() {
        return false;
    }
    IsHidden() {
        return false;
    }
    IsPurgable() {
        return false;
    }
    GetTexture() {
        return this.texture;
    }
    DeclareFunctions() {
        return [228 /* ModifierFunction.TRANSLATE_ACTIVITY_MODIFIERS */];
    }
    GetActivityTranslationModifiers() {
        return "hunter_night";
    }
    CheckState() {
        return {
            [26 /* ModifierState.FLYING */]: true,
        };
    }
}
