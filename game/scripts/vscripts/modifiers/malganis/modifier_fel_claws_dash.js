import { BaseModifierMotionHorizontal, registerModifier } from "../../lib/dota_ts_adapter";
@registerModifier()
export class modifier_fel_claws_dash extends BaseModifierMotionHorizontal {
    // Modifier properties
    caster = this.GetCaster();
    ability = this.GetAbility();
    parent = this.GetParent();
    total_traveled = 0;
    travel_distance = 200;
    IsHidden() {
        return false;
    }
    IsDebuff() {
        return false;
    }
    IsPurgable() {
        return false;
    }
    OnCreated() {
        if (!IsServer())
            return;
        // Check if the parent is currently affected by motion controllers - do nothing if so
        if (this.parent.IsCurrentlyVerticalMotionControlled() || this.parent.IsCurrentlyHorizontalMotionControlled())
            this.Destroy();
        // Apply motion controller
        if (!this.ApplyHorizontalMotionController())
            return;
    }
    OnRefresh() {
        if (this.parent.IsCurrentlyVerticalMotionControlled()
            || this.parent.IsCurrentlyHorizontalMotionControlled())
            return;
    }
    UpdateHorizontalMotion(me, dt) {
        if (!IsServer())
            return;
        if (this.total_traveled >= this.travel_distance)
            return;
        const distance_per_frame = (this.travel_distance / this.GetDuration()) * dt;
        // const direction = this.parent.GetForwardVector();
        const heroToPoint = (this.caster.GetForwardVector() * 25);
        const caster_new_pos = (this.caster.GetAbsOrigin() + heroToPoint);
        // const cast_direction = ((this.parent.GetCursorPosition() - this.parent.GetOrigin()) as Vector).Normalized();
        // const caster_new_pos = (this.parent.GetAbsOrigin() + cast_direction * distance_per_frame) as Vector;
        this.parent.SetAbsOrigin(caster_new_pos);
    }
    DeclareFunctions() {
        return [
            228 /* ModifierFunction.TRANSLATE_ACTIVITY_MODIFIERS */,
            234 /* ModifierFunction.DISABLE_TURNING */,
        ];
    }
    GetModifierDisableTurning() {
        return 1;
    }
    GetActivityTranslationModifiers() {
        return "hunter_night";
    }
    OnDestroy() {
        if (!IsServer())
            return;
        // Find position
        FindClearSpaceForUnit(this.parent, this.parent.GetAbsOrigin(), true);
        // Resolve positions
        ResolveNPCPositions(this.parent.GetAbsOrigin(), this.parent.GetHullRadius());
    }
}
