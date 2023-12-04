import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
@registerModifier()
export class modifier_spiderling_expire extends BaseModifier {
    IsDebuff() {
        return true;
    }
    IsHidden() {
        return true;
    }
    IsPurgable() {
        return false;
    }
    OnDestroy() {
        if (IsServer())
            this.GetParent().ForceKill(false);
    }
    DeclareFunctions() {
        return [230 /* ModifierFunction.LIFETIME_FRACTION */];
    }
    GetUnitLifetimeFraction() {
        return ((this.GetDieTime() - GameRules.GetGameTime()) / this.GetDuration());
    }
}
