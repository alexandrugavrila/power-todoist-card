// #region HEADER
import { LitElement, html, css, unsafeCSS } from "https://cdn.jsdelivr.net/npm/lit-element@2.4.0/+esm?module";
// TODO: register with HACS: https://hacs.xyz/docs/publish/start
// #endregion HEADER

// #region UTILS
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
} 

/**
 * Replaces multiple placeholders in a string with values from a mapping.
 * @param {string} str The string to modify.
 * @param {object} mapReplaces The mapping of placeholders to values.
 * @param {string} was Value for '%was%' placeholder.
 * @param {string} input Value for '%input%' placeholder.
 * @returns {string} The modified string.
 */
function replaceMultiple(str, mapReplaces, was, input) {
    mapReplaces["%was%"] = was;
    mapReplaces["%input%"] = input;
    mapReplaces["%line%"] = "\n";
    const re = new RegExp(Object.keys(mapReplaces).join("|"), "gi");
    if (typeof str !== "string") return str;
    return str.replace(re, (matched) => mapReplaces[matched.toLowerCase()]);
}

/**
 * Returns a configuration value or a default if undefined.
 * @param {object} config The configuration object.
 * @param {string} key The property key.
 * @param {any} defaultValue The default value if the key is undefined.
 * @returns {any}
 */
function getConfigValue(config, key, defaultValue) {
    return (config && config[key] !== undefined) ? config[key] : defaultValue;
}

/**
 * Checks if a given value is numeric.
 * @param {any} value The value to check.
 * @returns {boolean}
 */
function isNumeric(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
}

/**
 * Generates a pseudo-unique identifier.
 * @returns {string}
 */
function getUUID() {
    const date = new Date();
    return Math.floor(Math.random() * (100 - 1) + 1) + '-' + (+date) + '-' + date.getMilliseconds();
}

/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 * https://blog.stevenlevithan.com/archives/javascript-date-format
 */
var dateFormat = function () {
    var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
        timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
        timezoneClip = /[^-+\dA-Z]/g,
        pad = function (val, len) {
            val = String(val);
            len = len || 2;
            while (val.length < len) val = "0" + val;
            return val;
        };

    // Regexes and supporting functions are cached through closure
    return function (date, mask, utc) {
        var dF = dateFormat;

        // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
        if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
            mask = date;
            date = undefined;
        }

        // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date;
        if (isNaN(date)) throw SyntaxError("invalid date");

        mask = String(dF.masks[mask] || mask || dF.masks["default"]);

        // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) == "UTC:") {
            mask = mask.slice(4);
            utc = true;
        }

        var _ = utc ? "getUTC" : "get",
            d = date[_ + "Date"](),
            D = date[_ + "Day"](),
            m = date[_ + "Month"](),
            y = date[_ + "FullYear"](),
            H = date[_ + "Hours"](),
            M = date[_ + "Minutes"](),
            s = date[_ + "Seconds"](),
            L = date[_ + "Milliseconds"](),
            o = utc ? 0 : date.getTimezoneOffset(),
            flags = {
                d: d,
                dd: pad(d),
                ddd: dF.i18n.dayNames[D],
                dddd: dF.i18n.dayNames[D + 7],
                m: m + 1,
                mm: pad(m + 1),
                mmm: dF.i18n.monthNames[m],
                mmmm: dF.i18n.monthNames[m + 12],
                yy: String(y).slice(2),
                yyyy: y,
                h: H % 12 || 12,
                hh: pad(H % 12 || 12),
                H: H,
                HH: pad(H),
                M: M,
                MM: pad(M),
                s: s,
                ss: pad(s),
                l: pad(L, 3),
                L: pad(L > 99 ? Math.round(L / 10) : L),
                t: H < 12 ? "a" : "p",
                tt: H < 12 ? "am" : "pm",
                T: H < 12 ? "A" : "P",
                TT: H < 12 ? "AM" : "PM",
                Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
            };

        return mask.replace(token, function ($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
    };
}();

// Some common format strings
dateFormat.masks = {
    "default": "ddd mmm dd yyyy HH:MM:ss",
    shortDate: "m/d/yy",
    mediumDate: "mmm d, yyyy",
    longDate: "mmmm d, yyyy",
    fullDate: "dddd, mmmm d, yyyy",
    shortTime: "h:MM TT",
    mediumTime: "h:MM:ss TT",
    longTime: "h:MM:ss TT Z",
    isoDate: "yyyy-mm-dd",
    isoTime: "HH:MM:ss",
    isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
    dayNames: [
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ],
    monthNames: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
    return dateFormat(this, mask, utc);
};
// #endregion UTILS

// #region CONSTANTS
const todoistColors = {
    "berry_red": "rgb(184, 37, 111)",
    "red": "rgb(219, 64, 53)",
    "orange": "rgb(255, 153, 51)",
    "yellow": "rgb(250, 208, 0)",
    "olive_green": "rgb(175, 184, 59)",
    "lime_green": "rgb(126, 204, 73)",
    "green": "rgb(41, 148, 56)",
    "mint_green": "rgb(106, 204, 188)",
    "teal": "rgb(21, 143, 173)",
    "sky_blue": "rgb(20, 170, 245)",
    "light_blue": "rgb(150, 195, 235)",
    "blue": "rgb(64, 115, 255)",
    "grape": "rgb(136, 77, 255)",
    "violet": "rgb(175, 56, 235)",
    "lavender": "rgb(235, 150, 235)",
    "magenta": "rgb(224, 81, 148)",
    "salmon": "rgb(255, 141, 133)",
    "charcoal": "rgb(128, 128, 128)",
    "grey": "rgb(184, 184, 184)",
    "taupe": "rgb(204, 172, 147)",
    "black": "rgb(0, 0, 0)",
    "white": "rgb(255, 255, 255)"
};

const getTodoistColor = (key, fallback = 'grey') => {
    return todoistColors[key] || todoistColors[fallback];
};

const isValidTodoistColor = (value) => {
    return value && typeof value === "string" && Object.prototype.hasOwnProperty.call(todoistColors, value);
};
// #endregion CONSTANTS

class PowerTodoistCardEditor extends LitElement {
    static get properties() {
        return {
            hass: Object,
            config: Object,
        };
    }

    // #region GETTERS

    get _entity() { return getConfigValue(this.config, 'entity', ''); }

    get _show_completed() { return getConfigValue(this.config, 'show_completed', 5); }

    get _show_header() { return getConfigValue(this.config, 'show_header', true); }

    get _show_item_add() { return getConfigValue(this.config, 'show_item_add', true); }

    get _use_quick_add() { return getConfigValue(this.config, 'use_quick_add', false); }

    get _show_item_close() { return getConfigValue(this.config, 'show_item_close', true); }

    get _show_item_delete() { return getConfigValue(this.config, 'show_item_delete', true); }

    get _filter_today_overdue() { return getConfigValue(this.config, 'filter_today_overdue', false); }
    // #endregion GETTERS

    // #region CONFIG HANDLERS
    setConfig(config) {
        // Simply assign the configuration
        this.config = config;
    }

    configChanged(config) {
        // Dispatch a custom event with the updated config
        const e = new Event('config-changed', {
            bubbles: true,
            composed: true,
        });
        e.detail = { config };
        this.dispatchEvent(e);
    }
    // #endregion CONFIG HANDLERS

    // #region UTILITY METHODS
    getEntitiesByType(type) {
        // Return entities whose type (the prefix before the dot) matches the provided type
        return this.hass
            ? Object.keys(this.hass.states).filter(entity => entity.substr(0, entity.indexOf('.')) === type)
            : [];
    }

    isNumeric(v) {
        return !isNaN(parseFloat(v)) && isFinite(v);
    }

    valueChanged(e) {
        // If config or hass is missing, or the value hasn't changed, do nothing
        if (!this.config || !this.hass || (this[`_${e.target.configValue}`] === e.target.value)) {
            return;
        }

        if (e.target.configValue) {
            if (e.target.value === '') {
                // For most properties (except 'entity' and 'show_completed') remove the property when the value is empty
                if (!['entity', 'show_completed'].includes(e.target.configValue)) {
                    delete this.config[e.target.configValue];
                }
            } else {
                this.config = {
                    ...this.config,
                    [e.target.configValue]:
                        // If the target has a checked property, use that; otherwise use our isNumeric utility
                        e.target.checked !== undefined
                            ? e.target.checked
                            : isNumeric(e.target.value)
                                ? parseFloat(e.target.value)
                                : e.target.value,
                };
            }
        }

        // Dispatch the updated configuration
        this.configChanged(this.config);
    }
    // #endregion UTILITY METHODS

    // #region STYLES
    static styles = css`
        :host {
            font-size: 10px;
        }

        /* Optional: more specific targeting if needed */
        .task {
            font-size: 10px;
        }

        .section {
            font-size: 10px;
        }

        .labels, .due-date, .priority, .assignee {
            font-size: 10px;
        }
        `;

    static get styles() {
        return css`
            .card-config ha-select {
                width: 100%;
            }
            
            .option {
                display: flex;
                align-items: center;
                padding: 5px;
            }
            
            .option ha-switch {
                margin-right: 10px;
            }
        `;
    }
    // #endregion STYLES

    // #region RENDER
    render() {
        if (!this.hass) {
            return html``;
        }

        const entities = this.getEntitiesByType('sensor');
        const completedCount = [...Array(16).keys()];

        return html`<div class="card-config">
            <div class="option">
                <ha-select
                    naturalMenuWidth
                    fixedMenuPosition
                    label="Entity (required)"
                    @selected=${this.valueChanged}
                    @closed=${(event) => event.stopPropagation()}
                    .configValue=${'entity'}
                    .value=${this._entity}
                >
                    ${entities.map(entity => {
            return html`<mwc-list-item .value="${entity}">${entity}</mwc-list-item>`;
        })}
                </ha-select>
            </div>

            <div class="option">
                <ha-select
                    naturalMenuWidth
                    fixedMenuPosition
                    label="Number of completed tasks shown at the end of the list (0 to disable)"
                    @selected=${this.valueChanged}
                    @closed=${(event) => event.stopPropagation()}
                    .configValue=${'show_completed'}
                    .value=${this._show_completed}
                >
                    ${completedCount.map(count => {
            return html`<mwc-list-item .value="${count}">${count}</mwc-list-item>`;
        })}
                </ha-select>
            </div>
            
            <div class="option">
                <ha-switch
                    .checked=${this._show_header}
                    .configValue=${'show_header'}
                    @change=${this.valueChanged}>
                >
                </ha-switch>
                <span>Show header</span>
            </div>

            <div class="option">
                <ha-switch
                    .checked=${this._show_item_add}
                    .configValue=${'show_item_add'}
                    @change=${this.valueChanged}
                >
                </ha-switch>
                <span>Show text input element for adding new items to the list</span>
            </div>

            <div class="option">
                <ha-switch
                    .checked=${this._use_quick_add}
                    .configValue=${'use_quick_add'}
                    @change=${this.valueChanged}
                >
                </ha-switch>
                <span>
                    Use the <a target="_blank" href="https://todoist.com/help/articles/task-quick-add">Quick Add</a> implementation, available in the official Todoist clients
                </span>
            </div>
            <div class="option" style="font-size: 0.7rem; margin: -12px 0 0 45px">
                <span>
                    Check your <a target="_blank" href="https://github.com/grinstantin/todoist-card#using-the-card">configuration</a> before using this option
                </span>
            </div>

            <div class="option">
                <ha-switch
                    .checked=${this._show_item_close}
                    .configValue=${'show_item_close'}
                    @change=${this.valueChanged}
                >
                </ha-switch>
                <span>Show "close/complete" and "uncomplete" buttons</span>
            </div>

            <div class="option">
                <ha-switch
                    .checked=${this._show_item_delete}
                    .configValue=${'show_item_delete'}
                    @change=${this.valueChanged}
                >
                </ha-switch>
                <span>Show "delete" buttons</span>
            </div>

            <div class="option">
                <ha-switch
                    .checked=${this._filter_today_overdue}
                    .configValue=${'filter_today_overdue'}
                    @change=${this.valueChanged}
                >
                </ha-switch>
                <span>Only show today or overdue</span>
            </div>
        </div>`;
    }
    // #endregion RENDER
}

class PowerTodoistCard extends LitElement {
    constructor() {
        super();

        this.hassTodoistService = null;  // Interface to Home Assistant Todoist service
        this.myConfig = {};  // The parsed and merged config (default + user-provided) used throughout the card
        this.uiActionMap = {};  // Mapping of UI action strings to supported Todoist service types

        this.itemsJustCompleted = [];  // Stores task IDs that were just completed, for temporary visual feedback (e.g., undo)
        this.itemsEmphasized = [];  // Stores task IDs that should be visually emphasized (e.g., pulsed or highlighted)
        this.toastText = "";   // Last toast message shown, mainly for inline feedback on actions

        this.showAddDialog = false;  // Controls whether the "Add Task" modal is currently shown
        this.newTaskContent = '';  // Holds the user’s input for new task content (title)
        this.newTaskDescription = '';  // Holds the user’s input for new task description (optional)
    }

    static get properties() {
        return {
            hass: Object,  // Home Assistant object, automatically injected by Lovelace
            config: Object,  // Raw user-provided config from Lovelace YAML

            showAddDialog: { type: Boolean },  // Reactive state for the "Add Task" dialog
            newTaskContent: { type: String },  // Reactive state for task title input in the dialog
            newTaskDescription: { type: String },  // Reactive state for task description input in the dialog
        };
    }

    /**
     * Maps default UI actions to built-in Todoist commands.
     * Can be overridden by YAML config via `actions_<name>`.
     * 
     * Supports optional `toast` messages for feedback.
     * 
     * Example:
     * {
     *   close: { type: "item_complete", toast: (item) => `Closed "${item.content}"` },
     *   delete: { type: "item_delete", toast: "Task deleted." }
     * }
     */
    static get DEFAULT_UI_COMMANDS() {
        const API_COMMANDS = HassTodoistService.API_COMMANDS;
    
        return Object.freeze({
            add: {
                type: API_COMMANDS.ITEM_ADD,
                toast: (item) => `"${item.content}" added.`,
            },
            close: {
                type: API_COMMANDS.ITEM_COMPLETE,
                toast: (item) => `"${item.content}" completed.`,
            },
            dbl_close: {
                type: API_COMMANDS.ITEM_COMPLETE,
            },
            content: {
                type: API_COMMANDS.ITEM_UPDATE,
            },
            dbl_content: {
                type: API_COMMANDS.ITEM_UPDATE,
            },
            description: {
                type: API_COMMANDS.ITEM_UPDATE,
            },
            dbl_description: {
                type: API_COMMANDS.ITEM_UPDATE,
            },
            delete: {
                type: API_COMMANDS.ITEM_DELETE,
                toast: "Task deleted.",
            },
            dbl_delete: {
                type: API_COMMANDS.ITEM_DELETE,
            },
            uncomplete: {
                type: API_COMMANDS.ITEM_UNCOMPLETE,
                toast: "Task reopened.",
            },
            dbl_uncomplete: {
                type: API_COMMANDS.ITEM_UNCOMPLETE,
            },
            unlist_completed: null,
            dbl_unlist_completed: null,
            label: null,
            dbl_label: null,
        });
    }
    
    // #region INITIALIZATION
    /**
     * Returns the approximate card size for Lovelace layout calculations.
     * This affects vertical space estimation in vertical stacks.
     */
    getCardSize() {
        return this.hass
            ? (this.hass.states[this.config.entity].attributes.items.length || 1)
            : 1;
    }

    /**
     * Lifecycle hook called after the element's DOM is first rendered.
     * 
     * Responsibilities:
     * - Injects CSS variables for Todoist label colors
     * - Instantiates HassTodoistService interface
     * - Builds the action registry from defaults and YAML overrides
     */
    firstUpdated() {
        // Inject static Todoist color variables once
        const colorVars = Object.entries(todoistColors).map(
            ([name, color]) => `--todoist-color-${name}: ${color};`
        ).join("\n");

        const style = document.createElement("style");
        style.textContent = `:host { ${colorVars} }`;
        this.shadowRoot.appendChild(style);

        // Initialize the hass todoist service interface 
        this.hassTodoistService = new HassTodoistService(this.hass);

        // Find custom actions in the YAML and merge them into the action mapping
        this.actionRegistry = this.buildActionRegistry();
    }

    /**
     * Builds the complete action registry by merging:
     * 1. Built-in defaults from DEFAULT_UI_ACTIONS
     * 2. User-defined YAML actions via `actions_<name>`
     * 
     * Validates command types and wraps each action in an ActionEntry.
     * 
     * Returns: { [actionName: string]: ActionEntry }
     */
    buildActionRegistry() {
        const CMD = HassTodoistService.API_COMMANDS;
        const config = this.myConfig || this.config || {};
        const merged = {};
    
        const defaultFields = {
            type: CMD.ITEM_UPDATE,
            toast: null,
            updates: [],
            label: [],
            add: [],
            confirm: "",
            match: [],
            allow: [],
            emphasis: [],
            service: "",
            promptTexts: "",
            move: false,
        };
    
        const defaultMap = PowerTodoistCard.DEFAULT_UI_COMMANDS;
    
        // Built-in defaults
        for (const actionName in defaultMap) {
            const entry = defaultMap[actionName];
    
            if (entry === null) continue;
    
            const mergedEntry = {
                ...structuredClone(defaultFields),
                ...entry,
            };
    
            // Validate type if defined
            if (mergedEntry.type && !Object.values(CMD).includes(mergedEntry.type)) {
                throw new Error(`[DEFAULT_UI_ACTIONS] "${actionName}" has invalid type: "${mergedEntry.type}"`);
            }
    
            merged[actionName] = new ActionEntry({
                ...mergedEntry,
                name: actionName,
                parent: this,
            });
        }
    
        // YAML overrides
        for (const key of Object.keys(config)) {
            if (!key.startsWith("actions_")) continue;
    
            const actionName = key.replace("actions_", "");
            const parsed = this.parseConfig(config[key]);
    
            const base = merged[actionName] 
                ? structuredClone(merged[actionName]) 
                : { ...structuredClone(defaultFields) };
    
            for (const field in defaultFields) {
                base[field] = this._extractActionField(parsed, field, base[field]);
            }
    
            if (base.type && !Object.values(CMD).includes(base.type)) {
                console.warn(`[YAML] Action "${actionName}" uses unknown type:`, base.type);
            }
    
            merged[actionName] = new ActionEntry({
                ...base,
                name: actionName,
                parent: this,
            });
        }

        return merged;
    }

    /**
     * Safely extract a field from the actions array.
     * @param {Array} actions - The array of action config objects.
     * @param {string} key - The field to extract (e.g. 'toast', 'service').
     * @param {any} fallback - Value to return if not found.
     * @returns {any}
     */
    _extractActionField(actions, key, fallback = "") {
        if (!Array.isArray(actions)) return fallback;
        const entry = actions.find(a => typeof a === "object" && a.hasOwnProperty(key));
        return entry ? entry[key] : fallback;
    }
    // #endregion INITIALIZATION

    // #region CONFIG HANDLERS
    static getConfigElement() {
        return document.createElement('powertodoist-card-editor');
    }

    setConfig(config) {
        if (!config.entity) {
            throw new Error('Entity is not set!');
        }

        this.config = config;
        this.myConfig = this.parseConfig(config);
    }

    parseConfig(srcConfig) {
        var parsedConfig;
        var project_notes = [];
        let myStrConfig = JSON.stringify(srcConfig);
        let date_formatted = (new Date()).format(getConfigValue(this.config, "date_format", "mmm dd H:mm"));
        try {
            project_notes = this.hass.states[this.config.entity].attributes['project_notes'];
        } catch (error) { }
        const strLabels = (typeof (item) !== "undefined" && item.labels) ? JSON.stringify(item.labels) : "";

        var mapReplaces = {
            "%user%": this.hass ? this.hass.user.name : "",
            "%date%": `${date_formatted}`,
            "%str_labels%": strLabels,
        };
        project_notes.forEach(function (value, index) {
            mapReplaces["%project_notes_" + index - 1 + '%'] = value.content;
            if (index == 0) mapReplaces["%project_notes%"] = value.content;
        });

        myStrConfig = replaceMultiple(myStrConfig, mapReplaces);
        try {
            parsedConfig = JSON.parse(myStrConfig);
        } catch (err) {
            var source = "";
            parsedConfig = JSON.parse(JSON.stringify(srcConfig)); // clone to bypass preventExtensions
            try {
                const span = 40;
                const start = err.message.match(/[-+]?[0-9]*\.?[0-9]+/g)[1] - span / 2;
                source = "(near --> " + myStrConfig.substring(start, start + span) + " <---)";
            } catch (err2) { }
            parsedConfig["error"] = err.name + ": " + err.message + source;
        }
        return parsedConfig;
    }
    // #endregion CONFIG HANDLERS

    // #region UTILITY METHODS
    random(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    resolveColor(key, fallbackKey) {
        if (isValidTodoistColor(key)) {
            return todoistColors[key];
        } else {
            return todoistColors[fallbackKey];
        }
    }   
    // #endregion UTILITY METHODS

    // #region FILTER METHODS
    filterDates(items) {
        if (typeof this.myConfig.sort_by_due_date !== 'undefined' && this.myConfig.sort_by_due_date !== false) {
            items.sort((a, b) => {
                if (!(a.due && b.due)) return 0;
                return this.myConfig.sort_by_due_date === 'ascending'
                    ? new Date(a.due.date).getTime() - new Date(b.due.date).getTime()
                    : new Date(b.due.date).getTime() - new Date(a.due.date).getTime();
            });
        }

        if (typeof this.myConfig.filter_show_dates_starting !== 'undefined' ||
            typeof this.myConfig.filter_show_dates_ending !== 'undefined') {
            let startCompare = Number(this.myConfig.filter_show_dates_starting);
            let endCompare = Number(this.myConfig.filter_show_dates_ending);
            if (typeof this.myConfig.filter_show_dates_starting === 'string' && !isNaN(startCompare))
                startCompare = new Date().setHours(0, 0, 0, 0) + (startCompare * 24 * 60 * 60 * 1000);
            else
                startCompare = new Date().getTime() + (startCompare * 1 * 60 * 60 * 1000);
            if (typeof this.myConfig.filter_show_dates_ending === 'string' && !isNaN(endCompare))
                endCompare = new Date().setHours(23, 59, 59, 999) + (endCompare * 24 * 60 * 60 * 1000);
            else
                endCompare = new Date().getTime() + (endCompare * 1 * 60 * 60 * 1000);

            var dItem, dItem1, dItem2;
            items = items.filter(item => {
                if (!item.due) return (this.myConfig.filter_show_dates_empty !== false);
                let duration = 0;
                if (item.duration)
                    duration = item.duration.unit === 'day'
                        ? item.duration.amount * 24 * 60 * 60 * 1000
                        : item.duration.amount * 1 * 60 * 1000;

                if (/^\d{4}-\d{2}-\d{2}$/.test(item.due.date)) {
                    dItem1 = new Date(item.due.date + 'T23:59:59').getTime();
                    dItem2 = new Date(item.due.date + 'T00:00:00').getTime();
                } else {
                    dItem1 = new Date(item.due.date).getTime();
                    dItem2 = dItem1;
                }

                if (isNaN(endCompare) && duration) {
                    startCompare -= duration;
                    endCompare = new Date().getTime();
                }

                let passStart = isNaN(startCompare) ? true : startCompare <= dItem1;
                let passEnd = isNaN(endCompare) ? true : endCompare >= dItem2;
                return passStart && passEnd;
            });
        }
        return items;
    }

    filterPriority(items) {
        if (typeof this.myConfig.sort_by_priority !== 'undefined' && this.myConfig.sort_by_priority !== false) {
            items.sort((a, b) => {
                if (!(a.priority && b.priority)) return 0;
                return this.myConfig.sort_by_priority === 'ascending'
                    ? a.priority - b.priority
                    : b.priority - a.priority;
            });
        }
        return items;
    }
    // #endregion FILTER METHODS

    // #region NEW TASK FORM METHODS
    openGlobalAddDialog() {
        const dialog = document.createElement("ha-dialog");
        dialog.setAttribute("open", "");
        dialog.setAttribute("scrimClickAction", "");

        dialog.heading = "Add New Task";
        dialog.innerHTML = `
          <div class="dialog-content">
            <ha-textfield label="Task" id="taskField" dialogInitialFocus></ha-textfield>
            <ha-textfield label="Description (optional)" id="descField"></ha-textfield>
          </div>
        `;

        const cancel = document.createElement("mwc-button");
        cancel.setAttribute("slot", "secondaryAction");
        cancel.textContent = "Cancel";
        cancel.addEventListener("click", () => dialog.close());

        const add = document.createElement("mwc-button");
        add.setAttribute("slot", "primaryAction");
        add.textContent = "Add Task";
        add.addEventListener("click", () => {
            const task = dialog.querySelector("#taskField").value.trim();
            const desc = dialog.querySelector("#descField").value.trim();
            this.submitNewTaskDirect(task, desc);
            dialog.close();
        });

        dialog.appendChild(cancel);
        dialog.appendChild(add);

        document.body.appendChild(dialog);
    }

    /**
     * Adds a new task to Todoist using the AddActionEntry.
     * 
     * This method builds a minimal task object with the given content and description,
     * then delegates the actual command construction and service call to an ActionEntry
     * specialized for `item_add`.
     * 
     * @param {string} task - The task content/title.
     * @param {string} [desc=""] - Optional task description.
     */
    submitNewTaskDirect(task, desc = "") {
        if (!task) {
            this.showToast("Task name is required", 3000);
            return;
        }

        const item = {
            id: getUUID(), // temporary client-side ID
            content: task,
            description: desc,
            project_id: this.hass.states[this.config.entity].state,
        };

        // Use existing ActionEntry instance
        const entry = this.actionRegistry["add"];
        if (!entry) {
            console.error("[submitNewTaskDirect] No 'add' action defined.");
            return;
        }

        console.log("[submitNewTaskDirect] executing 'add' entry:", entry);
        this.actionRegistry["add"].execute(item);
    }

    // Saving this for later, old todoist used a drop down dialog that could parse quick add text, this may be useful later
    getQuickAddText(taskText, sectionName, projectName) {
        let qa = taskText || "";
    
        try {
            if (sectionName && !qa.includes('/')) {
                qa += ' /' + sectionName;
            }
        } catch (_) {}
    
        try {
            if (projectName && !qa.includes('#')) {
                qa += ' #' + projectName;
            }
        } catch (_) {}
    
        return qa;
    }
    // #endregion NEW TASK FORM METHODS

    // #region STATE CONTEXT
    computeStateContext() {
        const config = this.parseConfig(this.config);
        const entity = this._getEntityState(config.entity);
        const labelColors = this._getLabelColors();

        const icons = this._getIcons(config);
        const sizeVars = this._computeSizeVars(config);
        const iconColors = this._computeIconColors();

        let items = this._filterItems(entity.attributes.items, config, entity);
        const sectionId = this._getSectionId(config, entity);
        const cardLabels = this._extractCardLabels(config, items);

        const cardName = this._getCardName(config, entity, sectionId);

        return {
            config, entity, labelColors, icons, sizeVars, iconColors,
            items, cardLabels, cardName, sectionId,
        };
    }

    _getEntityState(entityId) {
        const entity = this.hass?.states?.[entityId];
        if (!entity) throw new Error(`PowerTodoistCard: entity "${entityId}" not found`);
        return entity;
    }

    _getLabelColors() {
        const sensor = this.hass?.states?.["sensor.label_colors"];
        if (!sensor) throw new Error(`PowerTodoistCard: sensor.label_colors not found`);
        return sensor.attributes.label_colors;
    }

    _getIcons(config) {
        return Array.isArray(config.icons) && config.icons.length === 4
            ? config.icons
            : ["checkbox-marked-circle-outline", "circle-medium", "plus-outline", "trash-can-outline"];
    }

    _computeSizeVars(config) {
        const base = getConfigValue(config, 'line_size', 12);
        const font = getConfigValue(config, 'font_size', base);
        const icon = getConfigValue(config, 'icon_size', base);
        const computed = Math.max(base, font, icon);

        if (computed > base) {
            console.warn(`line_size (${base}) is smaller than override size (${computed})`);
        }

        return {
            baseLineSize: base,
            overrideFontSize: font,
            overrideIconSize: icon,
            computedSize: computed,
            linePaddingTop: getConfigValue(config, 'line_padding_top', 0),
            linePaddingBottom: getConfigValue(config, 'line_padding_bottom', 0),
        };
    }

    _computeIconColors() {
        const styles = getComputedStyle(this);
        const base = styles.getPropertyValue('--pt-icon-color').trim();
        return {
            complete: this.resolveColor(styles.getPropertyValue('--pt-complete-icon-color').trim() || base, "black"),
            incomplete: this.resolveColor(styles.getPropertyValue('--pt-incomplete-icon-color').trim() || base, "black"),
            uncomplete: this.resolveColor(styles.getPropertyValue('--pt-uncomplete-icon-color').trim() || base, "black"),
            delete: this.resolveColor(styles.getPropertyValue('--pt-delete-icon-color').trim() || base, "red"),
        };
    }

    _getSectionId(config, entity) {
        const sectionMap = {};
        entity.attributes.sections.forEach(s => sectionMap[s.name] = s.id);
        return config.filter_section_id || sectionMap[config.filter_section];
    }

    _filterItems(items, config, entity) {
        let filtered = this.filterDates([...items]);
        filtered = this.filterPriority(filtered);
        const sectionId = this._getSectionId(config, entity);
        if (sectionId) filtered = filtered.filter(i => i.section_id === sectionId);
        return filtered;
    }

    _extractCardLabels(config, items) {
        const cardLabels = [];
        if (!config.filter_labels) return cardLabels;

        items.forEach(item => {
            config.filter_labels.forEach(label => {
                if (!label.startsWith("!") && (item.labels.includes(label) || label === "*")) {
                    if (!cardLabels.includes(label)) cardLabels.push(label);
                }
            });
        });
        return cardLabels;
    }

    _getCardName(config, entity, sectionId) {
        return (
            config.name ||
            config.friendly_name ||
            (entity.attributes.sections.find(s => s.id === sectionId)?.name) ||
            config.filter_section ||
            "ToDoist"
        );
    }
    // #endregion STATE CONTEXT

    // #region RENDER METHODS
    render() {
        let context;

        try {
            context = this.computeStateContext();
        } catch (e) {
            console.warn(e);
            return html`<ha-card><div>${e.message}</div></ha-card>`;
        }

        return html`
          <ha-card>
            ${this._renderDynamicStyle(
            context.sizeVars.computedSize,
            context.sizeVars.linePaddingTop,
            context.sizeVars.linePaddingBottom
        )}
    
            ${this._renderHeader(context.cardName, context.cardLabels, context.labelColors)}

            <div class="powertodoist-list-wrapper">
              ${this._renderLoadingSpinner()}
              <div class="powertodoist-list">
                ${context.items.length
                ? context.items.map(item =>
                    this._renderTaskLine(item, context.icons, context.labelColors, context.cardLabels, context.iconColors)
                )
                : html`<div class="powertodoist-list-empty">No uncompleted tasks!</div>`}
    
                ${this._renderLowerPart(context.icons, context.iconColors)}
              </div>
            </div>

            ${this._renderFooter()}

            ${this._renderToast()}
          </ha-card>
    
          ${this._renderAddDialog()}
        `;
    }

    // #region HELPERS
    _renderDynamicStyle(computedSize, top, bottom) {
        return html`
          <style>
            :host {
              --pt-item-line-size: ${computedSize}px;
              --pt-item-font-size: ${computedSize}px;
              --pt-item-icon-size: ${computedSize}px;
              --pt-line-padding-top: ${top}px;
              --pt-line-padding-bottom: ${bottom}px;
            }
            .powertodoist-item {
              height: calc(var(--pt-item-line-size) + var(--pt-line-padding-top) + var(--pt-line-padding-bottom));
              font-size: var(--pt-item-font-size);
              padding-top: var(--pt-line-padding-top);
              padding-bottom: var(--pt-line-padding-bottom);
            }
            ha-icon {
              width: var(--pt-item-icon-size);
              height: var(--pt-item-icon-size);
            }
          </style>
        `;
    }

    _renderHeader(cardName, cardLabels, label_colors) {
        if (this.config.show_header === false) return null;

        return html`
          <h1 class="card-header">
            <div class="name">
              ${cardName}
              ${this.config.show_card_labels !== false
                ? html`${this._renderLabels(undefined, (cardLabels.length === 1 ? cardLabels : []), [], label_colors)}`
                : html``}
            </div>
          </h1>
          <div id="powertodoist-toast">${this.toastText}</div>
        `;
    }

    _renderTaskLine(item, icons, label_colors, cardLabels, iconColors) {
        const isEmphasized = this.itemsEmphasized?.[item.id];
        const labelList = [
            this.myConfig.show_dates && item.due
                ? dateFormat(item.due.date, "🗓 " + (this.config.date_format || "dd-mmm H'h'MM"))
                : null,
            ...item.labels,
        ].filter(Boolean);

        const exclusionList = [
            ...(cardLabels.length === 1 ? cardLabels : []),
            ...item.labels.filter(l => l.startsWith("_")),
        ];

        return html`
          <div class="powertodoist-item" .id=${"item_" + item.id}>
            ${(this.config.show_item_close ?? true)
                ? html`
                    <ha-icon-button class="powertodoist-item-close"
                        @click=${() => this.actionRegistry["close"].execute(item)}
                        @dblclick=${() => this.actionRegistry["dbl_close"].execute(item)}>
                        ${this._renderIcon(icons[0], { color: iconColors.complete })}
                    </ha-icon-button>`
                : this._renderIcon(icons[1], { color: iconColors.incomplete })}
    
            <div class="powertodoist-item-text">
              <div @click=${() => this.actionRegistry["content"].execute(item)}
                   @dblclick=${() => this.actionRegistry["dbl_content"].execute(item)}>
                <span class="powertodoist-item-content ${isEmphasized ? 'powertodoist-special' : ''}">
                  ${item.content}
                </span>
              </div>
    
              ${item.description
                ? html`
                    <div @click=${() => this.actionRegistry["description"].execute(item)}
                         @dblclick=${() => this.actionRegistry["dbl_description"].execute(item)}>
                      <span class="powertodoist-item-description">${item.description}</span>
                    </div>`
                : null}
    
              ${this._renderLabels(item, labelList, exclusionList, label_colors)}
            </div>
    
            ${(this.config.show_item_delete ?? true)
                ? html`
                  <ha-icon-button class="powertodoist-item-delete"
                    @click=${() => this.actionRegistry["delete"].execute(item)}
                    @dblclick=${() => this.actionRegistry["dbl_delete"].execute(item)}>
                    ${this._renderIcon(icons[3], { color: iconColors.delete })}
                  </ha-icon-button>`
                : null}
          </div>
        `;
    }

    _renderLowerPart(icons, iconColors) {
        const shouldShowCompleted = this.config.show_completed && this.itemsJustCompleted.length > 0;

        return html`
        ${shouldShowCompleted
                ? this.itemsJustCompleted.map(item => html`
                    <div class="powertodoist-item todoist-item-completed">
                        ${(this.config.show_item_close !== false)
                        ? html`
                                <ha-icon-button class="powertodoist-item-close"
                                    @click=${() => this.actionRegistry["uncomplete"].execute(item)}
                                    @dblclick=${() => this.actionRegistry["dbl_uncomplete"].execute(item)}>
                                    ${this._renderIcon(icons[2], { color: iconColors.uncomplete })}
                                </ha-icon-button>`
                        : this._renderIcon(icons[0], { color: iconColors.complete })}
                        
                        <div class="powertodoist-item-text">
                            ${item.description
                        ? html`
                                    <span class="powertodoist-item-content">${item.content}</span>
                                    <span class="powertodoist-item-description">${item.description}</span>`
                        : item.content}
                        </div>

                        ${(this.config.show_item_delete !== false)
                        ? html`
                                <ha-icon-button class="powertodoist-item-delete"
                                    @click=${() => this.actionRegistry["unlist_completed"].execute(item)}
                                    @dblclick=${() => this.actionRegistry["dbl_unlist_completed"].execute(item)}>
                                    ${this._renderIcon(icons[3], { color: iconColors.delete })}
                                </ha-icon-button>`
                        : html``}
                    </div>
                `) :
                html``}`;
    }

    _renderFooter() {
        if (this.config.show_item_add === false) return html``;

        return html`
          <div class="powertodoist-add-button">
            <mwc-button @click=${() => this.openGlobalAddDialog()}>
                <ha-icon icon="mdi:plus" slot="icon"></ha-icon>
                Add Task
            </mwc-button>
          </div>
        `;
    }

    _renderLabels(item, labels, exclusions, label_colors) {
        // Skip labels if item exists and config disables label display
        if (item !== undefined && this.config.show_item_labels === false) {
            labels = this.myConfig.show_dates && item.due ? [labels[0]] : [];
        }

        // No labels to show
        if ((labels.length - exclusions.length) <= 0) return html``;

        return html`
          <div class="labelsDiv">
            <ul class="labels">
              ${labels.map(label => {
            if (exclusions.includes(label)) return html``;

            // Find label color from label_colors or fallback to "black"
            const labelColor = label_colors.find(lc => lc.name === label)?.color || "black";
            const backgroundColor = todoistColors[labelColor] || todoistColors["black"];

            return html`
                  <li style="background-color: ${backgroundColor}"
                      @click=${() => this.actionRegistry["label"].execute(item)}
                      @dblclick=${() => this.actionRegistry["dbl_label"].execute(item)}>
                    <span>${label}</span>
                  </li>`;
        })}
            </ul>
          </div>
        `;
    }

    _renderIcon(iconName, options = {}) {
        const {
            color = getTodoistColor("black"),
            size = '24px',
            tooltip = '',
            style = '',
            onClick = null,
            onDblClick = null,
            extraClass = '',
        } = options;

        const finalStyle = `
            color: ${color};
            fill: ${color};
            width: ${size};
            height: ${size};
            ${style}
        `.trim();

        return html`
            <ha-icon
                .icon=${"mdi:" + iconName}
                title=${tooltip}
                class=${extraClass}
                style=${finalStyle}
                ?hidden=${!iconName}
                @click=${onClick}
                @dblclick=${onDblClick}>
            </ha-icon>
        `;
    }

    _renderToast() {
        return html`
          <div id="powertodoist-toast" style="display: none;">
            ${this.toastText}
          </div>
        `;
      }

    _renderLoadingSpinner() {
        if (!this.loading) return null;

        return html`
            <div class="loading-overlay">
                <div class="loading-spinner"></div>
            </div>
        `;
    }

    _renderAddDialog() {
        if (!this.showAddDialog) return null;

        return html`
          <ha-dialog
            open
            scrimClickAction
            .heading=${"Add New Task"}
            @closed=${() => this.showAddDialog = false}
          >
            <div class="dialog-content">
              <ha-textfield
                label="Task"
                .value=${this.newTaskContent}
                @input=${e => this.newTaskContent = e.target.value}
                required
                dialogInitialFocus
              ></ha-textfield>
      
              <ha-textfield
                label="Description (optional)"
                .value=${this.newTaskDescription}
                @input=${e => this.newTaskDescription = e.target.value}
              ></ha-textfield>
            </div>
      
            <mwc-button slot="secondaryAction" dialogAction="cancel">
              Cancel
            </mwc-button>
      
            <mwc-button slot="primaryAction" @click=${this.submitNewTask.bind(this)}>
              Add Task
            </mwc-button>
          </ha-dialog>
        `;
    }
    // #endregion HELPERS
    // #endregion RENDER METHODS

    // #region STYLES
    static get styles() {
        return css`
    
          /* === HEADER === */
          .card-header {
            padding-bottom: unset;
          }
    
          /* === LIST & ITEM LAYOUT === */
          .powertodoist-list {
            display: flex;
            flex-direction: column;
            padding: 15px;
          }
    
          .powertodoist-list-empty {
            padding: 15px;
            text-align: center;
            font-size: calc(var(--pt-item-font-size) * 1.5);
          }
    
          .powertodoist-item {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 8px;
            padding-top: var(--row-padding-top);
            padding-bottom: var(--row-padding-bottom);
          }
    
          .powertodoist-item-text {
            display: flex;
            flex-direction: column;
            justify-content: center;
            flex-grow: 1;
            overflow: hidden;
            min-width: 0;
          }
    
          .powertodoist-item-content {
            font-size: var(--pt-item-font-size);
            line-height: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
    
          .powertodoist-special {
            font-weight: bolder;
            color: darkred;
          }
    
          .powertodoist-item-description {
            font-size: calc(var(--pt-item-font-size) * 0.75);
            opacity: 0.5;
            line-height: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin: 0;
          }
    
          /* === COLORS === */
          .powertodoist-item-completed {
            color: #808080;
          }
    
          .powertodoist-item-close {
            color: #808080;
          }
    
          .powertodoist-item-delete {
            color: #800000;
            margin-left: auto;
          }
    
          /* === ADD FORM === */
          .powertodoist-item-add {
            width: calc(100% - 30px);
            height: calc(var(--pt-item-line-size) * 1.2);
            margin: 0 15px 30px;
            padding: 10px;
            box-sizing: border-box;
            border-radius: 5px;
            font-size: var(--pt-item-font-size);
          }
    
          .powertodoist-add-form {
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 15px;
          }
    
          .powertodoist-add-button {
            padding: 15px;
            touch-action: auto;
            pointer-events: auto;
          }
    
          .powertodoist-add-form-buttons {
            display: flex;
            gap: 10px;
          }
    
          .dialog-content {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            padding: 1rem 0;
          }
    
          /* === ICONS === */
          ha-icon-button {
            --mdc-icon-size: var(--pt-item-icon-size);
            width: var(--pt-item-icon-size);
            height: var(--pt-item-icon-size);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            margin: 0;
            flex-shrink: 0;
          }
    
          ha-icon-button ha-icon {
            width: var(--pt-item-icon-size) !important;
            height: var(--pt-item-icon-size) !important;
            display: flex !important;
            align-items: center;
            justify-content: center;
          }
    
          ha-icon-button ha-icon ha-svg-icon {
            width: var(--pt-item-icon-size) !important;
            height: var(--pt-item-icon-size) !important;
            display: block !important;
            margin: 0 !important;
            vertical-align: middle !important;
          }
    
          /* === LABELS === */
          ul.labels {
            font-weight: 100;
            line-height: 1;
            padding: 0;
            margin: 0;
            flex-wrap: wrap;
          }
    
          ul.labels li {
            display: inline;
            color: #CCCCCC;
            float: left;
            margin: 0 2px 2px 0;
            height: calc(var(--pt-item-font-size) * 0.9);
            border-radius: 4px;
          }
    
          ul.labels li span {
            font-size: calc(var(--pt-item-font-size) * 0.7);
            font-weight: normal;
            white-space: nowrap;
            padding: 0px 3px;
            color: white;
            vertical-align: top;
            float: left;
          }
    
          ul.labels li a {
            padding: 1px 4px 0 11px;
            cursor: pointer;
            border-left: 1px dotted white;
            outline: none;
          }
    
          .labelsDiv {
            display: inline-flex;
            flex-wrap: wrap;
          }
    
          /* === TOAST === */
          #powertodoist-toast {
            position: relative;
            bottom: 20px;
            left: 40%;
            transform: translateX(-50%);
            background-color: #333;
            color: #fff;
            padding: 10px 20px;
            border-radius: 14px;
            border: 1px solid red;
            z-index: 999;
            display: none;
            text-align: center;
            margin: 15px 35px -30px 45px;
            font-size: var(--pt-item-font-size);
          }

            /* === LOADING SPINNER === */
            .powertodoist-list-wrapper {
                position: relative;
            }

            .loading-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(255, 255, 255, 0.6);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10;
            }
            .loading-spinner {
                position: absolute;
                top: 50%;
                left: 50%;
                z-index: 11;
                transform: translate(-50%, -50%);
                border: 4px solid #ccc;
                border-top: 4px solid var(--primary-color, #3498db);
                border-radius: 50%;
                width: 24px;
                height: 24px;
                animation: spin 1s linear infinite;
            }

            @keyframes spin {
                to {
                    transform: translate(-50%, -50%) rotate(360deg);
                }
            }
        `;
    }

    // #endregion STYLES

    // #region FEEDBACK HELPERS
    /**
     * Temporarily emphasize an item visually by applying a CSS class.
     * @param {object} item The task item to emphasize.
     * @param {string} emphasisClass The class suffix (e.g., 'special' = 'powertodoist-special').
     */
    emphasizeItem(item, emphasisClass = 'special') {
        const itemNode = this.shadowRoot.querySelector(`#item_${item.id}`);
        if (!itemNode) return;

        const className = `powertodoist-${emphasisClass}`;
        itemNode.classList.add(className);

        setTimeout(() => {
            itemNode.classList.remove(className);
        }, 3000);
    }

    /**
     * Clears all emphasized task items after a given delay.
     * Useful for bulk resetting highlight effects.
     * @param {number} delayMs How long to wait before clearing.
     */
    clearEmphasizedItems(delayMs = 0) {
        const emphasized = this.shadowRoot.querySelectorAll(".powertodoist-special");
        emphasized.forEach(el => {
            setTimeout(() => {
                el.classList.remove("powertodoist-special");
                this.itemsEmphasized = []; // Optional: clear reference state
            }, delayMs);
        });
    }
    // #endregion FEEDBACK HELPERS

    // #region UI COMMANDS
    // UI_COMMANDS is a mapping from command name to function handler
    showToast(message, duration = 3000, delay = 0) {
        const toast = this.shadowRoot.querySelector("#powertodoist-toast");
        if (!toast || !message) return;
    
        toast.innerHTML = message;
        this.toastText = message;
    
        setTimeout(() => {
            toast.style.display = 'block';
        }, delay);
    
        setTimeout(() => {
            toast.innerHTML = "";
            this.toastText = "";
            toast.style.display = 'none';
        }, delay + duration);
    }
    // #endregion UI COMMANDS
} 

class ActionEntry {
    /**
     * Constructs a new ActionEntry.
     * This defines a single user-action (e.g., close, update, move) and how it should be executed.
     * 
     * @param {object} options Configuration values passed from the registry builder
     */
    constructor({
        name,
        type,
        toast = null,
        updates = [],
        label = [],
        add = [],
        confirm = "",
        match = [],
        allow = [],
        emphasis = [],
        service = "",
        promptTexts = "",
        move = false,
        parent,
    }) {
        this.name = name;             // Action name, e.g. "close", "update", "delete"
        this.type = type;             // Todoist service command, e.g. "item_update", "item_close"
        this.parent = parent;         // Reference to PowerTodoistCard (to access helpers/hass)

        // Only add members that are defined
        if (toast) this.toast = toast;                      // (Optional) toast to show after execution
        if (updates?.length) this.updates = updates;        // (Optional) Configured update fields (may include placeholders)
        if (label?.length) this.label = label;              // (Optional) Label manipulations (e.g., add/remove)
        if (add?.length) this.add = add;                    // (Optional) Not yet used, but could trigger quick_add entries
        if (confirm) this.confirm = confirm;                // (Optional) user confirmation dialog
        if (match?.length) this.match = match;              // (Optional) condition-triggered subactions (not implemented yet)
        if (allow?.length) this.allow = allow;              // (Optional) Restrict to specific users
        if (emphasis?.length) this.emphasis = emphasis;     // (Optional) Temporary visual class (e.g. 'special')
        if (service) this.service = service;                // (Optional) HA automation/script to trigger
        if (promptTexts) this.promptTexts = promptTexts;    // (Optional) prompt override for input actions
        if (move) this.move = move;                         // (Optional) Whether this action includes section movement

        this.validate();  // Validate all members
    }

    /**
     * Validates all fields within this ActionEntry instance.
     * Logs warnings to console if types or formats are invalid.
     * This helps catch malformed YAML configs or default action overrides.
     * 
     * Validation includes:
     * - Command `type` is a valid Todoist command
     * - Expected types for all major fields (arrays, strings, booleans)
     */
    validate() {
        const warn = (msg) => console.warn(`[ActionEntry] "${this.name}" ${msg}`);

        if (this.type && !this.parent?.hassTodoistService?.isValidCommand({ type: this.type })) {
            warn(`uses unknown command type "${this.type}"`);
        }

        if (this.toast != null && typeof this.toast !== "string" && typeof this.toast !== "function") {
            warn(`has invalid toast (must be string, function or null)`);
        }

        if (this.updates && !Array.isArray(this.updates)) {
            warn(`expects "updates" to be an array`);
        }

        if (this.label && !Array.isArray(this.label)) {
            warn(`expects "label" to be an array`);
        }

        if (this.add && !Array.isArray(this.add)) {
            warn(`expects "add" to be an array`);
        }

        if (this.confirm && typeof this.confirm !== "string") {
            warn(`expects "confirm" to be a string`);
        }

        if (this.match && !Array.isArray(this.match)) {
            warn(`expects "match" to be an array`);
        }

        if (this.allow && !Array.isArray(this.allow)) {
            warn(`expects "allow" to be an array`);
        }

        if (this.emphasis && !Array.isArray(this.emphasis)) {
            warn(`expects "emphasis" to be an array`);
        }

        if (this.service && typeof this.service !== "string") {
            warn(`expects "service" to be a string`);
        }

        if (this.promptTexts && typeof this.promptTexts !== "string") {
            warn(`expects "promptTexts" to be a string`);
        }

        if (typeof this.move !== "undefined" && typeof this.move !== "boolean") {
            warn(`expects "move" to be a boolean`);
        }
    }

    /**
     * Top-level wrapper for executing this action.
     * Handles UI lifecycle: spinner, entity update, post-effects, and toasts.
     */
    async execute(item) {
        const card = this.parent;

        card.loading = true;
        card.requestUpdate();
        await sleep(10); // Allow spinner to show

        try {
            const { commands, toasts, type } = await this._runAction(item);

            this.postActionEffects(item, type);

            await card.hass.callService("homeassistant", "update_entity", {
                entity_id: card.config.entity,
            });

            return { commands, toasts, type };

        } catch (err) {
            console.error(`[ActionEntry] Failed "${this.name}"`, err);

            const fallbackMsg = "Action failed";
            const canUndo = this.name === "close" && card.actionRegistry["uncomplete"];

            card.showToast(fallbackMsg, 4000, 1000, canUndo
                ? () => card.actionRegistry["uncomplete"].execute(item)
                : undefined
            );

            return { commands: [], toasts: [], type: null };

        } finally {
            card.loading = false;
            card.requestUpdate();
        }
    }

    /**
     * Core logic of the action. Builds commands, toasts, triggers effects.
     * 
     * @param {object} item - The Todoist task item this action is being applied to.
     * @returns {Promise<{commands: Array, toasts: Array, type: string}>}
     */
    async _runAction(item) {
        const card = this.parent;
        const commands = [];
        const toasts = [];

        // Restrict to allowed users
        if (this.allow?.length && !this.allow.includes(card.hass.user.name)) return { commands, toasts, type: this.type };

        // Ask for confirmation
        if (this.confirm && !window.confirm(this.confirm)) return { commands, toasts, type: this.type };

        // Prompt input if needed
        const input = (this.promptTexts || JSON.stringify(this.updates ?? []).includes("%input%"))
            ? this._promptUser?.(item) ?? ""
            : "";

        const formattedDate = new Date().format(getConfigValue(card.config, "date_format", "mmm dd H:mm"));
        const mapReplaces = {
            "%user%": card.hass.user.name,
            "%date%": formattedDate,
            "%str_labels%": JSON.stringify(item.labels ?? []),
        };

        // Label changes
        const labels = this._processLabelChanges?.(item, this.label ?? []) ?? [];

        // Update command
        if ((this.updates?.length ?? 0) > 0 || labels.length > 0) {
            const updateCmd = this._buildUpdateCommand?.(item, this.updates, labels, mapReplaces, input);
            if (updateCmd) commands.push(updateCmd);
        }

        // Move command
        if (this.move) {
            const sections = card.hass.states[card.config.entity]?.attributes?.sections ?? [];
            const nextSection = card._getNextSectionId?.(item, sections);
            if (nextSection) {
                const moveCmd = card._processMoveCommand?.(item, nextSection);
                if (moveCmd) commands.push(moveCmd);
            }
        }

        // Primary action (e.g. item_add, item_complete)
        if (this.type) {
            if (this.type === "item_add") {
                commands.push(card.hassTodoistService.buildItemAdd({
                    content: item.content,
                    project_id: item.project_id,
                    description: item.description || "",
                    section_id: item.section_id,
                    labels: item.labels || [],
                    parent_id: item.parent_id,
                }));
            } else {
                commands.push(card.hassTodoistService.buildCommand(this.type, { id: item.id }));
            }
        }

        // Toast message
        if (this.toast) {
            const toastMsg = typeof this.toast === "function" ? this.toast(item) : this.toast;
            if (toastMsg) toasts.push(toastMsg);
        }

        // Emphasis
        if (this.emphasis?.length) {
            card.emphasizeItem(item, this.emphasis[0]);
        }

        // Trigger HA automation/script
        if (this.service) {
            const isScript = this.service.includes("script.");
            card.hass.callService(
                isScript ? "homeassistant" : "automation",
                isScript ? "turn_on" : "trigger",
                { entity_id: this.service }
            );
        }

        // Send commands
        if (commands.length > 0) {
            await card.hassTodoistService.send(commands);
            toasts.forEach(t => card.showToast(t, 3000));
        }

        return { commands, toasts, type: this.type };
    }

    postActionEffects(item, type) {
        const card = this.parent;
        const CMD = HassTodoistService.API_COMMANDS;
    
        if (type === CMD.ITEM_COMPLETE) {
            const max = getConfigValue(card.config, "show_completed", 5);
            if (card.itemsJustCompleted.length >= max) {
                card.itemsJustCompleted.splice(0, card.itemsJustCompleted.length - max + 1);
            }
            card.itemsJustCompleted.push(item);
            card.requestUpdate();
        }
    
        if (type === CMD.ITEM_UNCOMPLETE) {
            card.itemsJustCompleted = card.itemsJustCompleted.filter(i => i.id !== item.id);
            card.requestUpdate();
        }
    }

    /**
     * Determines if this action requires user input.
     * @returns {boolean}
     */
    _needsInput() {
        return this.promptTexts ||
            JSON.stringify(this.updates).includes("%input%");
    }

    /**
     * Prompts the user for input if the action requires it.
     * Uses optional `promptTexts` or falls back to a basic message.
     * 
     * @param {PowerTodoistCard} card - The parent card for context and access to `hass`.
     * @param {object} item - The task item this prompt is acting on.
     * @returns {string} - User input or an empty string.
     */
    _promptUser(item) {
        const field = this.name; // e.g. "description"
        let questionText = `Please enter a new value for ${field}:`;
        let defaultText = item[field] || "";

        if (this.promptTexts) {
            const [q, d] = this.promptTexts.split("|");
            questionText = q || questionText;
            defaultText = d || defaultText;
          }

        const match = defaultText.match(/%(.+?)%/);
        if (match && item[match[1]]) {
            defaultText = defaultText.replaceAll(`%${match[1]}%`, item[match[1]]);
        }

        return window.prompt(questionText, defaultText) || "";
    }
  
    /**
     * Builds an `item_update` command with provided updates and labels.
     * 
     * @param {object} item - The task item to update.
     * @param {Array} updates - Fields to update, each an object like `{ content: "..." }`.
     * @param {Array<string>} labels - Final list of labels to apply.
     * @param {object} mapReplaces - Placeholder replacements (e.g., `%user%`).
     * @param {string} input - User-provided input, if applicable.
     * @returns {object|null} - The update command or `null` if nothing to update.
     */
    _buildUpdateCommand(item, updates = [], labels = [], mapReplaces = {}, input = "") {
        if (!updates.length && !labels.length) return null;
    
        const command = {
            type: "item_update",
            uuid: getUUID(),
            args: {
                id: item.id,
            },
        };
    
        if (labels.length) {
            command.args.labels = labels;
        }
    
        for (const update of updates) {
            if (!update || typeof update !== "object") continue;
    
            const field = Object.keys(update)[0];
            let value = update[field];
    
            if (!field || value === undefined) continue;
    
            const allowed = [
                "content", "description", "due", "priority",
                "collapsed", "assigned_by_uid", "responsible_uid",
                "day_order"
            ];
            if (!allowed.includes(field)) continue;
    
            command.args[field] = replaceMultiple(value, mapReplaces, item[field], input);
        }
    
        return Object.keys(command.args).length > 1 ? command : null;
    }  
  
    /**
     * Processes label changes according to the action config.
     * Supports adding, removing, and filtering labels using special syntax.
     * 
     * @param {object} item - The task item being modified.
     * @param {Array<string>} labelChanges - List of label instructions.
     * @returns {Array<string>} - Final list of labels.
     */
    _processLabelChanges(item, labelChanges = []) {
        if (!Array.isArray(labelChanges)) return [];
    
        let labels = item.labels ? [...item.labels] : [];
    
        for (const change of labelChanges) {
            if (change === "!*") {
                labels = [];
            } else if (change === "!_") {
                labels = labels.filter(label => !label.startsWith("_"));
            } else if (change === "!!") {
                labels = labels.filter(label => label.startsWith("_"));
            } else if (change.startsWith("!")) {
                const toRemove = change.slice(1);
                labels = labels.filter(label => label !== toRemove);
            } else {
                const newLabel = replaceMultiple(change, {
                    "%user%": this.parent.hass.user.name,
                });
                if (!labels.includes(newLabel)) {
                    labels.push(newLabel);
                }
            }
        }
    
        return labels;
    }    

    /**
    * Finds the next section after the current one, or defaults to the project.
    * 
    * @param {object} item - The task item to move.
    * @param {Array<object>} sections - Sections in the current project.
    * @returns {string|number} - The target section or project ID.
    */
    _getNextSectionId(item, sections = []) {
        const orderMap = {};
        const reverseMap = [];
    
        sections.forEach(section => {
            orderMap[section.id] = section.section_order;
            reverseMap[section.section_order] = section.id;
        });
    
        const currentOrder = orderMap[item.section_id] ?? -1;
        return reverseMap[currentOrder + 1] || item.project_id;
    }

    /**
     * Builds a `item_move` command to move the item to a different section or project.
     * 
     * @param {object} item - The task item.
     * @param {string|number} nextSection - Target section or project ID.
     * @returns {object} - The move command.
     */
    _buildMoveCommand(item, nextSection) {
        return {
            type: "item_move",
            uuid: getUUID(),
            args: {
                id: item.id,
                [nextSection !== item.project_id ? "section_id" : "project_id"]: nextSection,
            },
        };
    }
}    

class HassTodoistService {
    constructor(hass) {
        this.hass = hass;
    }

    /**
     * List of all supported Todoist service command types.
     * These correspond to the Home Assistant todoist.sync supported operations.
     * @returns {Array<string>}
     */
    static get API_COMMANDS() {
        return Object.freeze({
            ITEM_ADD: "item_add",
            ITEM_UPDATE: "item_update",
            ITEM_DELETE: "item_delete",
            ITEM_COMPLETE: "item_complete",
            ITEM_UNCOMPLETE: "item_uncomplete",
            ITEM_MOVE: "item_move",
        });
    }

    /**
     * Builds a fully structured `item_add` command.
     * 
     * @param {object} options
     * @param {string} options.content                (Required) task content/title.
     * @param {string|number} options.project_id      (Required) project ID.
     * 
     * @param {string} [options.description]          (Optional) task description.
     * @param {string|number} [options.section_id]    (Optional) section ID.
     * @param {Array<string>} [options.labels]        (Optional) labels.
     * @param {string|number} [options.parent_id]     (Optional) parent task ID.
     * 
     * @returns {object}                              A properly formatted `item_add` command.
     */
    buildItemAdd({
        content,
        project_id,
        description = "",
        section_id,
        labels = [],
        parent_id = null
    }) {
        if (!content || !project_id) {
            throw new Error("[TodoistService] buildItemAdd requires content and project_id");
        }

        const uuid = getUUID();
        const args = {
            content,
            project_id
        };

        if (description) args.description = description;
        if (section_id) args.section_id = section_id;
        if (labels?.length) args.labels = labels;
        if (parent_id) args.parent_id = parent_id;

        return {
            type: "item_add",
            temp_id: uuid,
            uuid,
            args
        };
    }

    /**
     * Checks whether a given command type is supported.
     * @param {object} command - A command object with a `type` property.
     * @returns {boolean} True if the command type is supported.
     */
    isValidCommand(command) {
        return Object.values(HassTodoistService.API_COMMANDS).includes(command.type);
    }

    /**
     * Sends valid commands to the Home Assistant Todoist service.
     * Filters out unsupported command types.
     * @param {Array<object>} commands - Array of command objects to send.
     * @returns {Promise<void>} Resolves when the callService is complete.
     */
    async send(commands = []) {
        const filtered = commands.filter(c => this.isValidCommand(c));

        if (!filtered.length) return;

        return this.hass.callService("rest_command", "todoist", {
            url: "sync",
            payload: "commands=" + JSON.stringify(filtered),
        });
    }

    /**
     * Generates a properly formatted command object with UUID.
     * @param {string} type - The command type (e.g. "item_add").
     * @param {object} args - Arguments to send with the command.
     * @returns {object} A command object suitable for `todoist.sync`.
     */
    buildCommand(type, args = {}) {
        if (!this.isValidCommand({ type })) {
            console.warn(`[TodoistService] Unsupported command type: ${type}`);
        }

        return {
            type,
            uuid: getUUID(),
            args,
        };
    }
}


// #region CUSTOM ELEMENT REGISTRATION
customElements.define('powertodoist-card-editor', PowerTodoistCardEditor);
customElements.define('powertodoist-card', PowerTodoistCard);

window.customCards = window.customCards || [];
window.customCards.push({
    preview: true,
    type: 'powertodoist-card',
    name: 'PowerTodoist Card',
    description: 'Custom card to interact with Todoist items.',
});

console.info(
    '%c POWERTODOIST-CARD ',
    'color: white; background: orchid; font-weight: 700',
);
// #endregion CUSTOM ELEMENT REGISTRATION