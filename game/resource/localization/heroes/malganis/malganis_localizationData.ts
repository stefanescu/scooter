import { AbilityLocalization, LocalizationData, ModifierLocalization, StandardLocalization } from "~generator/localizationInterfaces";
import { Language } from "../../../languages";

export function GenerateLocalizationData(): LocalizationData
{
    // This section can be safely ignored, as it is only logic.
    //#region Localization logic
    // Arrays
    const Abilities: Array<AbilityLocalization> = new Array<AbilityLocalization>();
    const Modifiers: Array<ModifierLocalization> = new Array<ModifierLocalization>();
    const StandardTooltips: Array<StandardLocalization> = new Array<StandardLocalization>();    

    // Create object of arrays
    const localization_info: LocalizationData =
    {
        AbilityArray: Abilities,
        ModifierArray: Modifiers,
        StandardArray: StandardTooltips,        
    };
    //#endregion

    // Enter localization data below! 
    
    Abilities.push({
        // E
        ability_classname: "malganis_night_rush",
        name: "Night Rush",
        description: "After 0.75 seconds, gain 50% Movement Speed for 2 seconds. While active, Mal'Ganis can move through enemy Heroes and put them to Sleep for 2.5 seconds.",
        lore: "HAHA LOL2222231313",
    });


    // Return data to compiler
    return localization_info;
}
