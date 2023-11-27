import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";

@registerModifier()
export class modifier_night_rush_dark_ascension extends BaseModifier {
    // Modifier properties
	caster: CDOTA_BaseNPC = this.GetCaster()!;
	ability: CDOTABaseAbility = this.GetAbility()!;
	parent: CDOTA_BaseNPC = this.GetParent();
    
    texture = "night_stalker_darkness";

    
    IsDebuff(): boolean {
        return false;
    }
    
    IsHidden(): boolean {
        return false;
    }

    IsPurgable(): boolean {
        return false;
    }
    GetTexture(): string {
        return this.texture;
    }

    DeclareFunctions(): ModifierFunction[] {
		return [ModifierFunction.TRANSLATE_ACTIVITY_MODIFIERS];
	}

    GetActivityTranslationModifiers(): string {
		return "hunter_night";
	}

    CheckState(): Partial<Record<ModifierState, boolean>> {
        return {
            [ModifierState.FLYING]: true,
        };
    }

    




}

