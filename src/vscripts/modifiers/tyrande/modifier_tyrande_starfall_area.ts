import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";

@registerModifier()
export class modifier_tyrande_starfall_area extends BaseModifier {

    radius = this.GetAbility()?.GetSpecialValueFor("radius");

    OnCreated(params: object) {
        if (!IsServer()) return;

        this.StartIntervalThink(0);
    }

    OnIntervalThink() {//todo: how to get modifier Position?
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

    IsDebuff(): boolean {
        return true;
    }
    
    IsHidden(): boolean {
        return false;
    }

    IsPurgable(): boolean {
        return true;
    }

    GetTexture(): string {
        return "mirana_starfall";
    }
    
}

