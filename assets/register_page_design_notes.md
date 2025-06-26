# Register Page Design Notes

## Layout & Structure

- **Centered Modal Box**: 
  - Large rounded rectangle, horizontally and vertically centered on the viewport.
  - Padding between modal and viewport, especially generous on all sides.
  - The modal is not fixed; the backdrop remains visible, softly blurred/colored.

- **Modal Container**:
  - Background: White, high opacity but not pure white (slight tint from overall page).
  - Border: Thin, soft gray border or subtle shadow for slight elevation.
  - Border-radius: Large (approx. 20-32px).
  - Internal Padding: Large (at least 36px all around inside modal).

## Color Palette

- **Background Gradient**: 
  - Very soft pastel pink-to-purple gradient:  
    - Top-left: `#fdf0f7` or similar very light pink  
    - Bottom-right: `#f7f2fd` or soft violet/lilac
- **Modal Background**: 
  - White, or `#ffffff` with slightly reduced opacity/tint
- **Text - Main Heading**: 
  - Deep navy/indigo: `#292661`
- **Text - Labels & Links**: 
  - Body text: Muted medium gray, `#848299`
  - Action Link ("Sign in"): Primary blue, `#6A5CFA`
- **Primary Button**: 
  - Background: Solid vibrant purple, `#6A5CFA`
  - Text: White, bold

## Typography

- **Font Family**: 
  - Sans-serif, preferably "Inter", fallback: "Helvetica Neue, Arial, sans-serif"
- **Heading (`Create Account`)**:
  - Font size: 2rem (~32px)
  - Weight: 700 (bold)
  - Letter-spacing: Normal
  - Alignment: Centered horizontally
- **Input Labels**: 
  - Font size: 1rem (16px)
  - Weight: 400 (regular)
  - Color: Mid-gray
- **Input Text**: 
  - Font size: 1rem (16px)
  - Weight: 400
- **Button Text**: 
  - Font size: 1rem (16px)
  - Weight: 600
  - All-caps: No
- **"Already have an account?" body text**: 
  - Font size: 0.9rem (14px)
  - Weight: 400
- **Action Link (Sign in)**: 
  - Font size: 0.9rem (14px)
  - Weight: 500
  - Color: Vibrant purple
  - Decoration: None by default, underline on hover

## Spacing

- **Vertical rhythm**: 
  - Large consistent vertical spacing between elements: 
    - Heading to first input: ~24px
    - Between input fields: ~16px
    - Between password input and Register button: ~24px
    - Below Register button: ~16px before secondary text
- **Horizontal padding**: 
  - Inputs and button are full width, but inset with 24px on left/right inside modal.
- **Button**: 
  - Vertical padding: ~12px (tall button)
  - Border-radius: ~22px (pill-shaped)

## Components

- **Inputs**: 
  - Full width
  - Background: White
  - Border: 1px solid very light gray (`#f0f0f6`)
  - Border-radius: 12px
  - Padding: 10px vertical, 16px horizontal
  - Placeholder/label: Muted gray, aligned left, above field
- **Button**: 
  - Gradient or solid vibrant purple background
  - No extra outline or border by default
  - Fully rounded (pill)
  - White, bold text
  - Slight upward shadow on button (optional to increase prominence)
  - Hover: Slightly darker purple; text stays white

- **Link ("Sign in")**:
  - Inline with hint text beneath the button
  - Blue/purple text, underlines on hover

## Responsive

- **Desktop**: Centered box, medium width (~430–480px)
- **Tablet/Mobile**: Modal box scales down; padding decreases, but minimum width ~95% of viewport on small screens.
- **Mobile**: Inputs and controls stack, no horizontal scroll.

## Visual Cues & Special Features

- No iconography or logo in this reference
- All transitions (focus on input, button hover) are soft and fluid, 0.2–0.3s

---

## Example Structure (Pseudocode)

```html
<div class="register-background">
  <div class="register-modal">
    <h1>Create Account</h1>
    <form>
      <label>Email</label>
      <input type="email"/>
      <label>Password</label>
      <input type="password"/>
      <button>Register</button>
    </form>
    <div class="register-footer">
      <span>Already have an account?</span>
      <a href="#">Sign in</a>
    </div>
  </div>
</div>
```

---

## CSS / Variables Cheat Sheet

```css
:root {
  --bg-gradient: linear-gradient(135deg, #fdf0f7 0%, #f7f2fd 100%);
  --modal-bg: #ffffff;
  --modal-shadow: 0 4px 24px 0 rgba(72, 73, 121, 0.06);

  --primary-text: #292661;
  --secondary-text: #848299;
  --input-label: #848299;
  --input-bg: #fff;
  --input-border: #f0f0f6;

  --primary: #6A5CFA;
  --primary-hover: #5846e8;
  --link-color: #6A5CFA;

  --border-radius-lg: 32px;
  --border-radius-md: 12px;
  --border-radius-pill: 22px;

  --modal-width: 430px;
  --input-padding: 10px 16px;
  --button-padding: 12px 0;
  --vertical-spacing-lg: 24px;
  --vertical-spacing-md: 16px;
}
```

---

## Implementation Notes

- Maintain a high degree of spacing and breathing room.
- The feel is modern, minimal, inviting, with a single strong call-to-action.
- Avoid extraneous decoration; the focus is clarity and approachability.
- Use box-shadow subtly, only for depth on modal if desired.

