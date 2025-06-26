# Dashboard UI Design Notes

## 1. Layout and Structure

- **Overall Container**
  - Background: Pastel soft-peach gradient (`--bg-canvas`), subtle and light.
  - Margin: Generous outer padding (~24–32px).
  - Width: Centered, max-width ~600–750px ideal.

- **Main Flex Arrangement**
  - Layout is **horizontal:**
    - **Left Section (~65–70%)**:
      - "Your Habits This Week" heading
      - Current habit list with checkbox progress
    - **Right Section (~30–35%)** (Sidebar):
      - "Progress Snapshot"
      - "Quote of the Day"
      - Monthly Calendar

  - **Gap**: ~24px between main sections.
  - **Rounded Corners**: All card/section containers have strong border-radius (18–24px).

## 2. Components & Arrangement

### A. Header
- Text: **Your Habits This Week**
  - Font: Bold, large (~22–26px), dark slate color
  - Margin-bottom: 16px

### B. Weekly Habits Section (Left Main Card)
- Card background: White, subtle soft shadow
- Each item (row):
  - Left: Icon in pastel box (rounded, color respective to habit)
    - Drink Water: Blue pastel, bottle icon
    - Read: Purple pastel, book icon
    - Exercise: Red/Coral pastel, dumbbell icon
  - Center: Habit text (medium-weight, muted dark)
  - Right: 4 circular, green-filled checkmarks for progress (light border, spaced evenly)
- Spacing: 12–16px between rows
- Card margin-bottom: 22–28px

### C. Tracker Table (Below Weekly Habits)
- Card: Soft white, same border-radius as main
- Habit rows as above, but with 7 green check circles per row (days of week)
- Spacing: 8–12px vertical between rows

### D. Sidebar (Right Column)
#### 1. Progress Snapshot (Top Card)
  - Title: "Progress Snapshot" (semi-bold, 16–18px)
  - Stat Rows:
    - Labels: Muted grey
    - Numbers: Bold, larger, black/dark
    - Example:
      - Total Habits      3
      - Completed Today   2
      - Longest Streak    7
  - Alignment: Label left, Value right

#### 2. Quote of the Day Card
  - Title: “Quote of the Day” (semi-bold)
  - Quote: Italic, medium grey
  - Author: Small font, right aligned or underneath quote

#### 3. Calendar Card
  - Title: Small cap, muted
  - Calendar grid: 
    - Days: Small, medium-grey text
    - Selected/current day: Circle with pastel highlight

## 3. Color Palette

| CSS Variable     | Hex Example    | Usage                                               |
|------------------|---------------|-----------------------------------------------------|
| --bg-canvas      | #FDF6F2       | Main page background (pastel peach)                 |
| --white          | #FFFFFF       | Card backgrounds                                    |
| --primary-text   | #232B3A       | Headers/titles text                                 |
| --muted-text     | #7A7F92       | Hints, labels, small text                           |
| --blue-pastel    | #D1EAFD       | Habit icon box: Drink Water                         |
| --purple-pastel  | #E1DDFC       | Habit icon box: Read                                |
| --coral-pastel   | #FFD7DD       | Habit icon box: Exercise                            |
| --accent-green   | #54CB73       | Completed habit checkmarks, highlights              |
| --circle-border  | #DADEE3       | Check/icon border                                   |
| --neutral-bg     | #F8F7FA       | Calendar/quote box backgrounds                      |

*All colors should be tested and picked for best match; hex codes are close approximations.*

## 4. Typography

- Base font: `Helvetica Neue, Arial, sans-serif`
- Primary heading: 22–26px, bold, `--primary-text`
- Section headings: 16–18px, semi-bold, `--primary-text`
- Main content/body: 14–16px, medium-weight, `--primary-text`
- Muted/labels: 13–15px, normal, `--muted-text`
- Quotes: Italic, 14–15px, `--muted-text`

## 5. Spacing

- Outer padding (page): 24–32px
- Between main columns: 24px
- Card internal padding: 22–26px
- Spacing between list/rows: 12–16px
- Element margin-bottom for cards: 22–28px

## 6. Widgets & Interactivity

- Icons: Rounded, soft-pastel bgs, size ~28px
- Checkmarks: Circular, filled if completed, subtle border
- Buttons: None present in screenshot; all list/check actions are display-only
- Cards: Soft shadow or very subtle elevation (if any)
- All elements should use hover/focus pastel highlight if they become interactive in the future

## 7. Responsive Notes

- For mobile: Stack sidebar underneath main, cards go full-width, spacing reduced to 12–16px
- Typical breakpoints: 480px (stack), 768px (sidebar collapses)

---

# Visual Hierarchy Guide

1. **Header:** Primary focal point
2. **Progress list:** Next in line, bold habit icons/text
3. **Tracker Table:** Immediate follow-through
4. **Sidebar:** Quick stats, then inspiration (quote), then navigation tool (calendar)

---

# SUMMARY

- Pastel color palette, soft and welcoming scandi/modern feel
- Boxy cards with large, rounded corners
- Habit progress visualized with icons and checkmarks, in clear grid
- Sidebar: Stacked cards; snapshot, quote, and calendar
- Large header, gentle font, simple consistent spacing and alignment

---

**Use these details to create React components, SCSS/CSS modules, and a matching visual layout for your Dashboard.js.**

