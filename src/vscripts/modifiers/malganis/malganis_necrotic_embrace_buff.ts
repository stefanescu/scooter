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

    DeclareFunctions(): ModifierFunction[] {
        return [
            ModifierFunction.TRANSLATE_ACTIVITY_MODIFIERS,
             ModifierFunction.INCOMING_DAMAGE_PERCENTAGE];
    }

    GetModifierIncomingDamage_Percentage(event: ModifierAttackEvent): number {
        return 25;
    }

    GetActivityTranslationModifiers(): string {
		return "hunter_night";
	}

    GetTexture(): string {
        return this.texture;
    }
}

