import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
@registerModifier()
export class malganis_necrotic_embrace_buff extends BaseModifier {
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
    DeclareFunctions() {
        return [
            228 /* ModifierFunction.TRANSLATE_ACTIVITY_MODIFIERS */,
            59 /* ModifierFunction.INCOMING_DAMAGE_PERCENTAGE */
        ];
    }
    GetModifierIncomingDamage_Percentage(event) {
        return -25;
    }
    GetActivityTranslationModifiers() {
        return "hunter_night";
    }
    GetTexture() {
        return this.texture;
    }
}
