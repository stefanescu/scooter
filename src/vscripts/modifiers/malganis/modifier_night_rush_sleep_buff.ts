import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";

@registerModifier()
export class modifier_night_rush_sleep_buff extends BaseModifier {
    // gives flying, disarms malganis; checks for enemies and sleeps them
    modifier_sleep = "modifier_elder_titan_echo_stomp";
    texture = "night_stalker_hunter_in_the_night";
    sleep_sound = "Hero_Riki.SleepDart.Damage";

    // keep track of all slept units for this cast
    slept_units: Set<CDOTA_BaseNPC> = new Set<CDOTA_BaseNPC>(); 
        
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
        return [ModifierFunction.MOVESPEED_BONUS_PERCENTAGE, ModifierFunction.TRANSLATE_ACTIVITY_MODIFIERS];
    }

    GetModifierMoveSpeedBonus_Percentage(): number {
        return 50;
    }

    GetActivityTranslationModifiers(): string {
		return "hunter_night";
	}
 
    CheckState(): Partial<Record<ModifierState, boolean>> {
        return {
            [ModifierState.FLYING]: true,
            [ModifierState.DISARMED] : true
        };
    }

    GetTexture(): string {
        return this.texture;
    }
    
    OnCreated(): void {
        if (!IsServer()) return;
        
        this.StartIntervalThink(0.25);
    }

    OnRefresh(params: object): void {
        this.slept_units.clear();    
    }

    OnIntervalThink(): void {        
        const parent = this.GetParent();

        const enemies = FindUnitsInRadius(
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
        
        for (const enemy of enemies) { 
            if (this.slept_units.has(enemy)) continue; //skip, already slept this unit

            this.slept_units.add(enemy);

            const kv = { duration: 2 };
            enemy.AddNewModifier(parent, this.GetAbility(), this.modifier_sleep, kv);

            EmitSoundOn(this.sleep_sound, enemy);
        }
    }
}

