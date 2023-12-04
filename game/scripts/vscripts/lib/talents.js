// copied from https://github.com/Shushishtok/dota-reimagined
import { BaseAbility, BaseModifier, registerModifier } from "./dota_ts_adapter";
export const registerTalent = (name, Modifier) => (ability) => {
    // registerAbility(name)(ability);
    //TODO: write function registerAbility(name,ability);
    // Shush: I don't know if you can still use decorators like the functions we do here, but at the very least 
    // you should be able to make a separate, non decorator function that does what the decorator does,
    // and call that one instead.
    if (Modifier === undefined) {
        @registerModifier("modifier_" + ability.name)
        class TalentModifier extends BaseTalentModifier {
        }
        Modifier = TalentModifier;
    }
    ability.Modifier = Modifier;
};
export class BaseTalent extends BaseAbility {
    static Modifier;
    isTalentAbility = true;
    GetIntrinsicModifierName() {
        return this.constructor.Modifier.name;
    }
}
export class BaseTalentModifier extends BaseModifier {
    IsHidden() {
        return true;
    }
    IsDebuff() {
        return false;
    }
    IsPurgable() {
        return false;
    }
    RemoveOnDeath() {
        return false;
    }
    IsPermanent() {
        return true;
    }
}
