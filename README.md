# PowerTodoist Card — Custom Fork

This is a **refactored and enhanced fork** of the original [PowerTodoist Card](https://github.com/pgorod/power-todoist-card) for Home Assistant Lovelace dashboards.
It is built for **YAML-mode users**, **custom theming**, **local self-hosted environments**, and **advanced action customization**.

---

## Highlights of This Fork

- 🌟 **Full refactor:** clean architecture, logical code regions, easier maintenance
- 🌺 **Self-hosted friendly:** no CDN dependency, all Lit imports via ESM
- 📊 **Dynamic UI actions:** modular action registry for task management (complete, delete, uncomplete, edit)
- 🎨 **Extensive theming:** full color override with CSS variables; supports `card-mod` and HA themes
- 🔄 **Live task editing:** title, description, label modifications directly in-card
- ➕ **Add Task Dialog:** clean, built-in HA style task creation flow
- ✨ **Visual feedback:** toasts, emphasis highlights, undo options
- ⏳ **Loading spinner:** clean spinner overlay during async operations

---

## Installation

### Manual Install

1. Download `powertodoist-card.js` from this repository.
2. Place it in your Home Assistant `/config/www/custom-cards/` directory.
3. Add the resource to Lovelace:

```yaml
resources:
  - url: /local/custom-cards/powertodoist-card.js
    type: module
```

### Lit Dependency

This card imports Lit from a CDN ESM endpoint:
```javascript
import { LitElement, html, css, unsafeCSS } from "https://cdn.jsdelivr.net/npm/lit-element@2.4.0/+esm?module";
```

Ensure your Home Assistant frontend allows external ESM module loading (default for modern installs).

---

## Key Features

### ✨ Advanced Color Theming

Fully customizable icon colors via CSS variables:
- `--pt-icon-color`
- `--pt-complete-icon-color`
- `--pt-delete-icon-color`
- `--pt-uncomplete-icon-color`
- `--pt-incomplete-icon-color`

Override globally in your theme or locally via `card-mod`:

```yaml
style: |
  :host {
    --pt-complete-icon-color: green;
    --pt-delete-icon-color: red;
  }
```

Todoist label colors are RGB-correct for seamless matching.

### 🗓️ Dynamic Row and Font Sizing

Customize your list's compactness or expand it for touchscreen layouts:

```yaml
type: custom:powertodoist-card
line_size: 18
font_size: 20
icon_size: 20
line_padding_top: 2
line_padding_bottom: 2
```

Automatically warns if sizing is misaligned.

### ➕ Native Add Task Dialog

Enable a clean "Add Task" button:

```yaml
show_item_add: true
```

Creates a native HA dialog for adding tasks with title and optional description.

### 🔁 Configurable Actions

Map any button or double-click to custom behaviors.
Supports:
- Complete
- Uncomplete
- Delete
- Edit Content
- Edit Description
- Label manipulation
- Section movement
- Custom service triggers
- Toast notifications

Example YAML override:
```yaml
actions_content:
  - content: "+%input%"
```

### 🚫 Offline & Error-Resistant

- Zero runtime external dependencies.
- Graceful error handling and fallback modes.
- Safe YAML parsing with user feedback.

### 🔄 Undo Recent Completions

Completed tasks show temporarily for undo within a timeout.

---

## Project Layout

```plaintext
powertodoist-card/
├── powertodoist-card.js     # Main custom card code
├── README.md                # This file
└── (Optional) update scripts, patches
```

---

## Future Enhancements

- HACS registration
- Improved accessibility (ARIA labels)
- Keyboard navigation support
- Optional offline Lit bundle

---

## Credits

Original PowerTodoist Card by [pgorod](https://github.com/pgorod).  
Enhancements, restructuring, and self-hosted compatibility by this fork's maintainer.

Licensed under the MIT License.

---

## Quick Start Example

```yaml
type: custom:powertodoist-card
entity: sensor.todoist_my_project
show_completed: 5
show_item_add: true
show_item_close: true
show_item_delete: true
filter_today_overdue: true
line_size: 16
font_size: 18
icon_size: 18
```

---

**Happy tasking!**

