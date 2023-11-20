// copied from https://github.com/Shushishtok/dota-reimagined

import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "./dota_ts_adapter";

export const registerTalent = (name?: string, Modifier?: typeof BaseTalentModifier) => (ability: typeof BaseTalent) => {
	registerAbility(name)(ability);
    //TODO: write function registerAbility(name,ability);
    // I don't know if you can still use decorators like the functions we do here, but at the very least 
    // you should be able to make a separate, non decorator function that does what the decorator does,
    // and call that one instead.

	if (Modifier === undefined) {
		@registerModifier("modifier_" + ability.name)
		class TalentModifier extends BaseTalentModifier {}
		Modifier = TalentModifier;
	}

	ability.Modifier = Modifier;
};

export class BaseTalent extends BaseAbility {
	static Modifier: typeof BaseModifier;
	isTalentAbility: boolean = true;

	GetIntrinsicModifierName(): string {
		return (this.constructor as typeof BaseTalent).Modifier.name;
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