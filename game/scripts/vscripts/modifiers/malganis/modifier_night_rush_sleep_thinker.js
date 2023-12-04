import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
@registerModifier()
export class modifier_night_rush_sleep_thinker extends BaseModifier {
    // gives flying, disarms malganis; checks for enemies and sleeps them
    modifier_sleep = "modifier_elder_titan_echo_stomp";
    texture = "night_stalker_hunter_in_the_night";
    sleep_sound = "Hero_Riki.SleepDart.Damage";
    // keep track of all slept units for this cast
    already_slept_units = new Set();
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
        return [18 /* ModifierFunction.MOVESPEED_BONUS_PERCENTAGE */, 228 /* ModifierFunction.TRANSLATE_ACTIVITY_MODIFIERS */];
    }
    GetModifierMoveSpeedBonus_Percentage() {
        return 50;
    }
    GetActivityTranslationModifiers() {
        return "hunter_night";
    }
    CheckState() {
        return {
            [26 /* ModifierState.FLYING */]: true,
            [1 /* ModifierState.DISARMED */]: true
        };
    }
    GetTexture() {
        return this.texture;
    }
    OnCreated() {
        if (!IsServer())
            return;
        this.StartIntervalThink(0.25);
    }
    OnRefresh(params) {
        if (!IsServer())
            return;
        this.already_slept_units.clear();
    }
    OnIntervalThink() {
        if (!IsServer())
            return;
        const parent = this.GetParent();
        const enemies = FindUnitsInRadius(parent.GetTeamNumber(), parent.GetAbsOrigin(), undefined, 170, 2 /* UnitTargetTeam.ENEMY */, 18 /* UnitTargetType.BASIC */ | 1 /* UnitTargetType.HERO */ | 4 /* UnitTargetType.BUILDING */ | 2 /* UnitTargetType.CREEP */, 0 /* UnitTargetFlags.NONE */, 0 /* FindOrder.ANY */, false);
        const kv = { duration: 2 };
        for (const enemy of enemies) {
            if (this.already_slept_units.has(enemy))
                continue; //skip, already slept unit during this cast
            this.already_slept_units.add(enemy);
            enemy.AddNewModifier(parent, this.GetAbility(), this.modifier_sleep, kv);
            EmitSoundOn(this.sleep_sound, enemy);
        }
    }
}
