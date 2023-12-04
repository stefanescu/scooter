import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
@registerModifier()
export class modifier_tyrande_starfall_area extends BaseModifier {
    radius = this.GetAbility()?.GetSpecialValueFor("radius");
    OnCreated(params) {
        if (!IsServer())
            return;
        this.StartIntervalThink(0);
    }
    OnIntervalThink() {
        // const enemies = FindUnitsInRadius(
        //     this.caster.GetTeamNumber(),
        //     this.,
        //     undefined,
        //     radius,
        //     UnitTargetTeam.ENEMY,
        //     UnitTargetType.BASIC | UnitTargetType.HERO | UnitTargetType.BUILDING | UnitTargetType.CREEP,
        //     UnitTargetFlags.NONE,
        //     FindOrder.ANY,
        //     false
        //     );
    }
    IsDebuff() {
        return true;
    }
    IsHidden() {
        return false;
    }
    IsPurgable() {
        return true;
    }
    GetTexture() {
        return "mirana_starfall";
    }
}
