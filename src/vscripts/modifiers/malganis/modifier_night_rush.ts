import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";

@registerModifier()
export class modifier_night_rush extends BaseModifier {
    texture = "night_stalker_hunter_in_the_night";


    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.MOVESPEED_BONUS_PERCENTAGE, ModifierFunction.OVERRIDE_ANIMATION];
    }

    GetModifierMoveSpeedBonus_Percentage(): number {
        return 30;
    }

    GetOverrideAnimation(): GameActivity {
        return GameActivity.DOTA_NIGHTSTALKER_TRANSITION;
    }

    // CheckState(): Partial<Record<ModifierState, boolean>> {
    //     return {
    //         [ModifierState.FLYING]: true,
    //     };
    // }
    
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
    
    OnCreated(params: object): void {
        
        this.StartIntervalThink(0.25);
        
    }

    OnIntervalThink(): void {
         
        const units = FindUnitsInRadius(
            this.GetParent().GetTeamNumber(),
            this.GetParent().GetAbsOrigin(),
            undefined,
            170,
            UnitTargetTeam.ENEMY,
            UnitTargetType.BASIC | UnitTargetType.HERO | UnitTargetType.BUILDING | UnitTargetType.CREEP,
            UnitTargetFlags.NONE,
            0,
            false
            );
        
        const kv = {
            duration: 2
        };

        for (const unit of units) { 
            
            unit.AddNewModifier(this.GetParent(), this.GetAbility(), "modifier_elder_titan_echo_stomp", kv);
    
        }
    }

}

