# Desktop Dashboard Wireframe & Style Guide

## Layout Zones (Desktop Adaptation)

### 1. Header (Top Navigation/Welcome)
- **Full-width, fixed-height strip at the top.**
- Contains:
  - Left: Logo or app name (optional).
  - Center/Left-Center: Greeting (e.g., “Good Morning, Adhirai!”)
  - Below Greeting: Subtext with date (e.g., “Today is Thursday, June 27”)
  - Right: User avatar or settings icon (optional).
- **Spacing:** Ample vertical padding (~32px top & bottom), left and right padding (~48px).
- **Font:** Large, friendly, bold heading (~2rem, semi-bold).

### 2. Main Content Wrapper
- **Horizontal flex layout:** Header above, then content horizontally divided below.
- **Structure:** Left section (main habit tracker), right sidebar (widgets).

#### 2a. Habit Tracker Zone (Main)
- **“Your Habits This Week”**
- **Wide, scrollable (horizontal) habit card list beneath the week label.**
- Each habit = Card with:
  - Icon on left.
  - Habit name (bold).
  - Horizontal row of day checkmarks (7, one for each day; use pastel green for “checked” circles).
  - Optional: Small streak indicator/icon at far right.
- **Spacing:** Cards with rounded corners, gentle drop shadow, background color for contrast (#fff or very light pastel). Cards spaced by at least 24px horizontally, 24-32px vertically.
- **Responsive note:** Cards snap into grid or horizontal scroll on smaller widths.

#### 2b. Sidebar (Right)
- **Fixed-width column (300-360px), vertically stacked widgets:**
    1. **Progress Snapshot (Stats)**
        - Data values bold/larger (e.g., “Total Habits: 3”)
        - Sub-labels smaller/gray.
        - Small colored check/circle icons for accent.
    2. **Quote of the Day**
        - Top: “Quote of the Day” label.
        - Body: Short quote (italic/soft).
        - Attribution below or right-aligned.
    3. **Mini Calendar (Floating/Fixed)**
        - Should always be visible (e.g., stick to lower part of sidebar or float in corner).
        - Shows current week with pastel highlight for today.

- **Widget Spacing:** Each widget spaced by at least 24px vertically, internal card padding 24-32px all round, border-radius 18-28px, subtle shadow.

### 3. Background & Canvas
- **Base background:** #FCD8CD (main pastel).
- **Widget/zone backgrounds:** White or #FEEBF6 for cards/sidebars for contrast.

---

## Visual/Style Guidance

### Color Palette
- --pastel-peach: #FCD8CD (main background)
- --pastel-pink:  #FEEBF6 (secondary widgets/bg)
- --pastel-lavender: #EBD6FB (accents, highlights, icons)
- --pastel-blue: #687FE5 (main accent, headings, checkmarks)
- --success-green: #67d88a (habit “completed” day circles)
- --gray-dark: #333340 (main text)
- --gray-light: #B0B0C3 (secondary info)

### Typography
- **Font-family:** "Helvetica Neue, Arial, sans-serif"
- **Heading (H1, greeting):** 2rem-2.4rem, bold, #333340 or --pastel-blue
- **Subheading:** 1.15-1.32rem, semi-bold
- **Body text:** 1rem, regular, #333340
- **Widget/card labels:** 0.95rem, medium, --gray-dark
- **Secondary:** 0.88rem, regular, --gray-light
- **Quote:** italic, 1.1rem, --pastel-lavender or --gray-dark

### Spacing/Radius
- **Main page padding:** 48-64px sides, 32-40px top/bottom
- **Card/widget padding:** 24-32px
- **Spacing between cards/widgets:** 24px (vertical & horizontal), min 16px responsive
- **Border radius (cards/widgets):** 18-28px (soft, pastel feel)
- **Shadow:** Subtle, 0 2px 8px rgba(104,127,229,0.08)

### Layout (CSS Guide)
- **Wrapper:** display: flex; flex-direction: row; align-items: flex-start;
- **Main content:** flex: 1 1 0; min-width: 0;
- **Sidebar:** width: 320px; flex-shrink: 0;
- **Header:** position: sticky/fixed on top;
- **Cards/Widgets:** display: flex; flex-direction: column; align-items: flex-start;
- **Habit list for week:** display: flex; flex-direction: row; gap: 24px;

### Responsive/Adaptation
- At ≥1200px: Zones as above, with generous padding and max 1280px container width.
- At <1000px: Sidebar collapses or slides below main; calendar widget may float bottom-right or become an overlay.
- At <700px: Stack zones vertically, cards shrink to mobile version.

### Iconography & Images
- Habit icons: 32x32px, pastel icon background circles (lavender or blue).
- Completion: Check icons within colored pastel green circles, diameter ~28px.
- Streak: Small flame/star icon, pastel orange/yellow.
- Calendar: Use icon set style matching overall rounded/pastel theme.

---

## Desktop Wireframe (Textual Outline)

```
------------------------------------------------------
|     HEADER:                                         |
|    [Logo]  Good morning, Adhirai!        [Avatar]   |
|    Today is Thursday, June 27                       |
------------------------------------------------------
|  [Main: Habit tracker]       |  [Sidebar]           |
|  Your Habits This Week:      |  Progress Snapshot   |
|  [Habit card:                |  Quote of the Day    |
|    Icon  Name  O O O O O O O]|  [Mini Calendar]     |
|  [Habit card: ...            |                      |
------------------------------------------------------
| (Background: peach pastel, widgets on white cards)  |
------------------------------------------------------
```

---

### Notes:
- All cards, widgets, and UI elements retain a highly rounded, gentle pastel aesthetic, inspired by the mobile version.
- Desktop experience should feel spacious, friendly, and uncluttered—avoid stacking all widgets vertically as on mobile.
- Interactivity cues: cards highlight slightly on hover, check circles animate when toggled.

---

Task completed: This file contains the full desktop wireframe and design spec, ready for use by UI/engineering teams.
