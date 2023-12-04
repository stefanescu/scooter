import { BaseModifier, registerModifier } from "../lib/dota_ts_adapter";
// Base speed modifier -- Could be moved to a separate file
class ModifierSpeed extends BaseModifier {
    // Declare functions
    DeclareFunctions() {
        return [24 /* ModifierFunction.MOVESPEED_ABSOLUTE */];
    }
    GetModifierMoveSpeed_Absolute() {
        return 300;
    }
}
@registerModifier()
export class modifier_panic extends ModifierSpeed {
    // Set state
    CheckState() {
        return {
            [20 /* ModifierState.COMMAND_RESTRICTED */]: true,
        };
    }
    // Override speed given by Modifier_Speed
    GetModifierMoveSpeed_Absolute() {
        return 540;
    }
    // Run when modifier instance is created
    OnCreated() {
        if (IsServer()) {
            // Think every 0.3 seconds
            this.StartIntervalThink(0.3);
        }
    }
    // Called when intervalThink is triggered
    OnIntervalThink() {
        const parent = this.GetParent();
        parent.MoveToPosition((parent.GetAbsOrigin() + RandomVector(400)));
    }
}
