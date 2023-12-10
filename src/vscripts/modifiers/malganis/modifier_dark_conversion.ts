import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";

@registerModifier()
export class modifier_dark_conversion extends BaseModifier {
    //damage or heal based on hp difference
    texture = "night_stalker_hunter_in_the_night";
    hp_difference_percent = 0;

    n_ticks = 6;
    conversion_rate = 0;
    damage_or_heal_per_tick = 0;

    caster = this.GetCaster()!;
    parent = this.GetParent()!;

    
    IsHealing() {
        return (this.parent == this.caster); // damage if parent != caster
    }

    IsDebuff() {
        return !this.IsHealing();
    }
    
    IsHidden() {
        return false;
    }

    IsPurgable() {
        return false;
    }

    DeclareFunctions(): ModifierFunction[] {
        return [
            ModifierFunction.TRANSLATE_ACTIVITY_MODIFIERS,
             ];
    }

    GetActivityTranslationModifiers(): string {
		return "hunter_night";
	}

    GetTexture(): string {
        return this.texture;
    }

    OnCreated(params : { hp_diff : number }): void {
        if (!IsServer()) return;

        //get hp_difference from params
        // if (params.hp_diff)
            this.hp_difference_percent = params.hp_diff;
        
        let total_damage_or_heal = this.hp_difference_percent/100 * this.parent.GetMaxHealth();


        this.conversion_rate = total_damage_or_heal / this.n_ticks; 

        // this.damage_or_heal_per_tick = this.conversion_rate * 0.1 * this.parent.GetHealth();

        // if (this.IsHealing())
        //     this.total_damage_or_heal = -this.total_damage_or_heal;
        
        const ticks_per_sec = this.GetDuration() / this.n_ticks;
        this.StartIntervalThink(ticks_per_sec);

    }

    OnIntervalThink(): void {
        if (!IsServer()) return;

        this.DamageOrHeal();
             
    }

    DamageOrHeal() {
        if (this.IsHealing()) 
            this.parent.Heal(this.conversion_rate, this.GetAbility());
        
        else
        {
            ApplyDamage({
                victim: this.parent,
                attacker: this.caster,
                damage: this.conversion_rate,
                damage_type: DamageTypes.MAGICAL
            });  
        }

    }
}
