import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";

@registerModifier()
export class modifier_night_rush_sleep extends BaseModifier {
    
    sleepModifier = "modifier_elder_titan_echo_stomp";
    texture = "night_stalker_hunter_in_the_night";

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.MOVESPEED_BONUS_PERCENTAGE, ModifierFunction.TRANSLATE_ACTIVITY_MODIFIERS];
    }

    GetModifierMoveSpeedBonus_Percentage(): number {
        return 50;
    }

    GetActivityTranslationModifiers(): string {
		return "hunter_night";
	}
    // GetOverrideAnimation(): GameActivity {
    //     return GameActivity.DOTA_NIGHTSTALKER_TRANSITION;
    // }

    CheckState(): Partial<Record<ModifierState, boolean>> {
        return {
            [ModifierState.FLYING]: true,
        };
    }
    
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
    
    OnCreated(): void {
        if (!IsServer()) return;
        
        this.StartIntervalThink(0.25);
        
    }

    OnIntervalThink(): void {
         
        const parent = this.GetParent();

        const units = FindUnitsInRadius(
            parent.GetTeamNumber(),
            parent.GetAbsOrigin(),
            undefined,
            170,
            UnitTargetTeam.ENEMY,
            UnitTargetType.BASIC | UnitTargetType.HERO | UnitTargetType.BUILDING | UnitTargetType.CREEP,
            UnitTargetFlags.NONE,
            FindOrder.ANY,
            false
            );
        
        const kv = { duration: 2 };

        for (const unit of units) { 
            
            unit.AddNewModifier(parent, this.GetAbility(), this.sleepModifier, kv);
    
        }
    }

}

