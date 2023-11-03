import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";

@registerModifier()
export class modifier_spiderling_expire extends BaseModifier {

    IsDebuff(): boolean {
        return true;
    }
    
    IsHidden(): boolean {
        return true;
    }

    IsPurgeException(): boolean {
        return false;
    }

    IsPurgable(): boolean {
        return true;
    }

    OnDestroy(): void {
        if (IsServer())
            this.GetParent().ForceKill(false);
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.LIFETIME_FRACTION];
    }

    GetUnitLifetimeFraction(): number {
        return ( ( this.GetDieTime() - GameRules.GetGameTime() ) / this.GetDuration() );
    }
    
    GetTexture(): string {
        return "axe_counter_helix";
    }
    
}

