# UI/UX Design System & Toolkit

## 1. Core Philosophy
* **Ethereal Utility:** Combine high-density data views (Dashboard) with soft, organic aesthetics (Glassmorphism).
* **Radical Softness:** Avoid sharp corners. Use `rounded-full` for inputs/buttons and `rounded-3xl` for cards.
* **Depth over Borders:** Use `backdrop-blur`, varying opacities, and soft shadows instead of hard border strokes.
* **Focus-Driven Contrast:** Primary actions are Solid Black (#1A1A1A). Secondary elements are transparent or gray.

## 2. Design Tokens (Tailwind CSS)

### Colors
| Name | Tailwind Class | Hex Value | Usage |
| :--- | :--- | :--- | :--- |
| **Surface Base** | `bg-gray-50` | `#F9FAFB` | App background |
| **Glass Surface** | `bg-white/70` | `rgba(255,255,255,0.7)` | Cards, Panels |
| **Text Primary** | `text-gray-900` | `#111827` | Headings |
| **Text Muted** | `text-gray-500` | `#6B7280` | Meta data |
| **Primary Action** | `bg-[#1A1A1A]` | `#1A1A1A` | Main Buttons |
| **Aura Purple** | `from-purple-200` | `#E9D5FF` | Gradient Backgrounds |

### Typography
* **Font:** Inter or Plus Jakarta Sans.
* **H1:** `text-5xl font-bold tracking-tight`
* **H2:** `text-2xl font-semibold`
* **Body:** `text-sm text-gray-600`
* **Caption:** `text-xs font-medium uppercase tracking-wider text-gray-400`

### Effects
* **Glass Blur:** `backdrop-blur-xl`
* **Soft Shadow:** `shadow-[0_8px_30px_rgb(0,0,0,0.04)]`
* **Pill Shape:** `rounded-full`

## 3. Component Rules

### Containers (Cards & Modals)
* Must use the **Glass Effect**: White background with 40-70% opacity + blur.
* Border should be subtle: `border border-white/40`.
* Radius: `rounded-3xl` (24px).

### Inputs
* Always **Pill Shaped** (`rounded-full`).
* No standard borders; use `ring` for focus states.
* Internal buttons (Search/Send) are circular and nested inside the input right side.

### Buttons
* **Primary:** Solid Black, White Text, `rounded-full`, Medium weight.
* **Secondary:** Ghost/Transparent, Gray Text.

## 4. Layout Patterns
* **Dashboard:** Central search transitions to data tables.
* **Chat:** Floating glass cards over a soft gradient mesh background.

## 5. Design System Components

All reusable components are located in `/src/components/DesignSystem/`:

### AuroraBackground
* **Purpose:** Provides the soft gradient mesh background with purple, blue, and pink blobs
* **Usage:** Wrap the entire application or main sections
* **Features:** Gradient blobs with blur and mix-blend-multiply for ethereal effect

### GlassCard
* **Purpose:** Core container for glassmorphism effect
* **Usage:** All cards, panels, and containers
* **Features:** 
  - `backdrop-blur-xl` for blur effect
  - `bg-white/70` for transparency
  - `border-white/50` for subtle borders
  - `rounded-3xl` for soft corners
  - Hover shadow enhancement

### PrimaryButton
* **Purpose:** High contrast action buttons
* **Usage:** Primary actions, CTAs
* **Features:**
  - Solid black `#1A1A1A` background
  - White text
  - `rounded-full` pill shape
  - Hover and active states
  - Optional icon support

### PillInput
* **Purpose:** Fully rounded input with nested action button
* **Usage:** Search bars, chat inputs
* **Features:**
  - `rounded-full` shape
  - Nested circular action button
  - Support for search or send icon
  - Focus ring states

### DataRow
* **Purpose:** Minimalist list items for data display
* **Usage:** Candidate lists, data tables
* **Features:**
  - Glassmorphic background
  - Hover effects
  - Avatar support
  - Optional arrow indicator

### GatedOverlay
* **Purpose:** Blurred overlay for locked content
* **Usage:** Premium features, locked content
* **Features:**
  - Backdrop blur effect
  - Centered modal card
  - Lock icon
  - Customizable messaging