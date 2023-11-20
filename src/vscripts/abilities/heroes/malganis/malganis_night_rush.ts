import { BaseAbility, registerAbility } from "../../../lib/dota_ts_adapter";
import { modifier_night_rush } from "../../../modifiers/malganis/modifier_night_rush"

@registerAbility()
export class malganis_night_rush extends BaseAbility {
    particle?: ParticleID;
    caster = this.GetCaster();
    // cast_anim = GameActivity.DOTA_ATTACK;
    cast_anim = GameActivity.DOTA_CAST_ABILITY_4_END;
    cast_sound = "Hero_NightStalker.Darkness";
    cast_point = 0.4;

    OnAbilityPhaseStart() {
        if (IsServer()) {
            this.caster.EmitSound(this.cast_sound);
        }
        
        return true;
    }

    OnAbilityPhaseInterrupted() {
        this.caster.StopSound(this.cast_sound);
    }

    GetCastAnimation(): GameActivity {
        return this.cast_anim;
    }

    GetCastPoint(): number {
        return this.cast_point;
    }
    
    GetBehavior(): AbilityBehavior | Uint64 {
        return AbilityBehavior.IMMEDIATE | AbilityBehavior.NO_TARGET
        | AbilityBehavior.DONT_CANCEL_MOVEMENT
        | AbilityBehavior.ROOT_DISABLES
       ;
    }
    
    OnSpellStart(): void {
        
        const kv = {
            duration: 3
        };

        this.caster.AddNewModifier(this.caster, this, "modifier_night_stalker_darkness", kv); 
        // this.caster.AddNewModifier(this.caster, this, "modifier_night_stalker_hunter_in_the_night", kv); 
        this.caster.AddNewModifier(this.caster, this, modifier_night_rush.name, kv); 
        
        // this.caster.AddNewModifier(this.caster, this, "modifier_night_stalker_darkness_transform", kv);
        // this.caster.StartGesture(GameActivity.FLY);
    }

    // GetChannelAnimation(): GameActivity {
    //     return GameActivity.DOTA_NIGHTSTALKER_TRANSITION;
    // }
    
    // GetChannelTime(): number {
    //     return 1;
    // }
    
}
