"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateLocalizationData = void 0;
function GenerateLocalizationData() {
    // This section can be safely ignored, as it is only logic.
    //#region Localization logic
    // Arrays
    var Abilities = new Array();
    var Modifiers = new Array();
    var StandardTooltips = new Array();
    // Create object of arrays
    var localization_info = {
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
exports.GenerateLocalizationData = GenerateLocalizationData;
