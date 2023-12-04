export class BaseAbility {
}
export class BaseItem {
}
export class BaseModifier {
    static apply(target, caster, ability, modifierTable) {
        return target.AddNewModifier(caster, ability, this.name, modifierTable);
    }
}
export class BaseModifierMotionHorizontal extends BaseModifier {
}
export class BaseModifierMotionVertical extends BaseModifier {
}
export class BaseModifierMotionBoth extends BaseModifier {
}
// Add standard base classes to prototype chain to make `super.*` work as `self.BaseClass.*`
setmetatable(BaseAbility.prototype, { __index: CDOTA_Ability_Lua ?? C_DOTA_Ability_Lua });
setmetatable(BaseItem.prototype, { __index: CDOTA_Item_Lua ?? C_DOTA_Item_Lua });
setmetatable(BaseModifier.prototype, { __index: CDOTA_Modifier_Lua ?? CDOTA_Modifier_Lua });
export const registerAbility = (name) => (ability, context) => {
    if (name !== undefined) {
        // @ts-ignore
        ability.name = name;
    }
    if (context.name) {
        name = context.name;
    }
    else {
        throw "Unable to determine name of this ability class!";
    }
    const [env] = getFileScope();
    env[name] = {};
    toDotaClassInstance(env[name], ability);
    const originalSpawn = env[name].Spawn;
    env[name].Spawn = function () {
        this.____constructor();
        if (originalSpawn) {
            originalSpawn.call(this);
        }
    };
};
export const registerModifier = (name) => (modifier, context) => {
    if (name !== undefined) {
        // @ts-ignore
        modifier.name = name;
    }
    if (context.name) {
        name = context.name;
    }
    else {
        throw "Unable to determine name of this modifier class!";
    }
    const [env, source] = getFileScope();
    const [fileName] = string.gsub(source, ".*scripts[\\/]vscripts[\\/]", "");
    env[name] = {};
    toDotaClassInstance(env[name], modifier);
    const originalOnCreated = env[name].OnCreated;
    env[name].OnCreated = function (parameters) {
        this.____constructor();
        if (originalOnCreated !== undefined) {
            originalOnCreated.call(this, parameters);
        }
    };
    let type = 0 /* LuaModifierMotionType.NONE */;
    let base = modifier.____super;
    while (base) {
        if (base === BaseModifierMotionBoth) {
            type = 3 /* LuaModifierMotionType.BOTH */;
            break;
        }
        else if (base === BaseModifierMotionHorizontal) {
            type = 1 /* LuaModifierMotionType.HORIZONTAL */;
            break;
        }
        else if (base === BaseModifierMotionVertical) {
            type = 2 /* LuaModifierMotionType.VERTICAL */;
            break;
        }
        base = base.____super;
    }
    LinkLuaModifier(name, fileName, type);
};
/**
 * Use to expose top-level functions in entity scripts.
 * Usage: registerEntityFunction("OnStartTouch", (trigger: TriggerStartTouchEvent) => { <your code here> });
 */
export function registerEntityFunction(name, f) {
    const [env] = getFileScope();
    env[name] = function (...args) {
        f(...args);
    };
}
function clearTable(table) {
    for (const key in table) {
        delete table[key];
    }
}
function getFileScope() {
    let level = 1;
    while (true) {
        const info = debug.getinfo(level, "S");
        if (info && info.what === "main") {
            return [getfenv(level), info.source];
        }
        level += 1;
    }
}
function toDotaClassInstance(instance, table) {
    let { prototype } = table;
    while (prototype) {
        for (const key in prototype) {
            // Using hasOwnProperty to ignore methods from metatable added by ExtendInstance
            // https://github.com/SteamDatabase/GameTracking-Dota2/blob/7edcaa294bdcf493df0846f8bbcd4d47a5c3bd57/game/core/scripts/vscripts/init.lua#L195
            if (!instance.hasOwnProperty(key)) {
                instance[key] = prototype[key];
            }
        }
        prototype = getmetatable(prototype);
    }
}
