# HabitTrackerApp UI Theme & Color System Guide

## Palette Reference

| Variable           | Hex Code  | Role / Intended Usage                                    |
|--------------------|-----------|---------------------------------------------------------|
| `--ht-bg-main`     | #FEEBF6   | Main app background (body, main screens)                |
| `--ht-bg-secondary`| #FCD8CD   | Section backgrounds, cards, panels, or highlights       |
| `--ht-surface`     | #EBD6FB   | Modals, overlays, focus/highlight surfaces              |
| `--ht-primary`     | #687FE5   | Key actions (buttons/links), selected states, icons     |
| `--ht-primary-text`| #22223B   | Standard text, headings, readable content               |
| `--ht-secondary-text`| #594F6D | Muted/secondary text                                    |
| `--ht-border`      | #D6C7EE   | Borders – cards, input outlines, separators             |
| `--ht-error`       | #F87A77   | Error messages, critical UI cues                        |

## How to Use in React

- All variables are declared in `src/styles/theme.css`.
- Import this file **once** in your root (e.g., App.js):
  ```js
  import './styles/theme.css';
  ```
- Use CSS classNames provided (e.g., `button-primary`, `card`, `muted`, `text-error`).
- For custom-styled components (e.g., styled-components, inline styles, CSS modules):
  - Refer to the CSS var with: `color: var(--ht-primary);`, `background: var(--ht-bg-secondary);` etc.
  - Example:
    ```jsx
    <button style={{ background: "var(--ht-primary)", color: "#fff" }}>Track Habit</button>
    ```
  - With CSS Modules:
    ```css
    .habittile {
      background: var(--ht-bg-secondary);
      color: var(--ht-primary-text);
    }
    ```

## Accessibility Guidelines

- Prefer high-contrast pairings: 
    - Example: `background: var(--ht-primary); color: #fff` is accessible.
    - Never use pastel background with pastel text (e.g., both `--ht-bg-secondary` and `--ht-surface` together for text and background).
- Validate new UI states with [accessible color contrast checkers](https://webaim.org/resources/contrastchecker/).
- Text on `--ht-bg-main` or `--ht-surface` should always use `--ht-primary-text` or `--ht-primary`.
- Use `--ht-error` only for error cues, badges, or destructive actions.

## Suggestion for Team

- Refrain from hard-coding color hex codes; always use these variables.
- Use theme classes and variables for ease of updates and consistency.
- Utility classes (`card`, `button-primary`, etc.) are provided for common UI needs.
- If using a component library, override the default theme using these variables in the library config where possible.

---
*Maintain visual consistency throughout the app by referencing this guide and the provided variables in all UI work.*
