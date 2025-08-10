# Topper's Toolkit - Design & Styling Specification

This document provides a highly detailed, component-by-component design specification for the "Topper's Toolkit" website, enabling an exact visual recreation. It details the specific Tailwind CSS classes, color variables, and structural composition for each key part of the application.

---

### **Part 1: The Global Design System**

This is the foundation of the site's look and feel, defined in `src/app/globals.css`, `tailwind.config.ts`, and `src/app/layout.tsx`.

#### **1.1. Color Palette**

The site uses a variable-based color system that supports both light and dark modes.

*   **Primary (`--primary: 195 86% 55%`)**: A bright, commanding cyan-blue.
    *   **Usage**: Main call-to-action buttons (`<Button>`), links on hover, important icons, and focus rings (`--ring`).
*   **Background (`--background`)**:
    *   **Light Mode**: `220 15% 96%` (A very light, cool gray).
    *   **Dark Mode**: `220 15% 10%` (A deep, dark blue-gray).
*   **Card (`--card`)**: The surface color for card-like elements.
    *   **Light Mode**: `220 15% 96%` (Identical to the background, creating a unified, layered look).
    *   **Dark Mode**: `220 15% 15%` (Slightly lighter than the dark background for subtle contrast).
*   **Text/Foreground (`--foreground`)**:
    *   **Light Mode**: `220 15% 15%` (A dark, desaturated blue, not pure black).
    *   **Dark Mode**: `220 15% 90%` (A soft off-white, not pure white).
*   **Muted Text (`--muted-foreground`)**: A lower-contrast text color for descriptions, subtitles, and secondary information.
    *   **Light Mode**: `220 10% 45%`.
    *   **Dark Mode**: `220 10% 65%`.
*   **Borders (`--border`)**:
    *   **Light Mode**: `220 10% 85%` (A light gray).
    *   **Dark Mode**: `220 15% 25%` (A dark gray).
*   **Destructive (`--destructive`)**: A strong red for error states and delete actions.
    *   `0 84% 60%` (Light mode) and `0 62% 50%` (Dark mode).

#### **1.2. Typography**

*   **Font Family**: **Inter**. It is used exclusively for all text, providing a clean, modern, and highly legible interface.
*   **Headlines**: Use heavy weights. The main hero headline (`h1` on the homepage) uses `font-black` and `tracking-tighter`. Section headings (`h2`) use `font-bold`.
*   **Body Text**: Standard weights, primarily `font-medium`. Descriptions use `font-normal`.
*   **Sizing**: The site uses Tailwind's standard type scale (`text-sm`, `text-lg`, `text-4xl`, `text-6xl`).

#### **1.3. Spacing, Borders, and Shadows**

*   **Layout Spacing**: Page sections use heavy vertical padding like `py-16` (4rem) or `py-24` (6rem) to create separation and breathing room. Grids use `gap-8` (2rem) for spacing between items.
*   **Container**: The main content area is constrained by a centered `container` class with `2rem` of horizontal padding.
*   **Border Radius**: A consistent corner radius is used, defined by `--radius: 0.75rem`. Components like Cards and Buttons use this (`rounded-lg`, `rounded-md`).
*   **Shadows**: Subtle shadows (`shadow-sm`, `shadow-lg`, `shadow-xl`) are applied, especially on hover, to lift elements off the page. Example: Cards use `hover:shadow-xl`.

#### **1.4. Icons**

*   **Library**: **`lucide-react`**. All icons are from this set.
*   **Style**: Stroke-based, 2px width, clean and minimal.
*   **Size**: Typically `h-4 w-4` (16px) or `h-5 w-5` (20px). Larger icons on subject cards are `h-8 w-8` (32px).

---

### **Part 2: Homepage Component Breakdown (`src/app/page.tsx`)**

#### **2.1. Hero Section**

*   **Background**: A vertical gradient from the `--card` color to the `--background` color.
*   **Layout**: `container` with `text-center`.
*   **Headline (`h1`)**:
    *   **Text**: "Unlock Your Academic Potential"
    *   **Styling**: `text-4xl md:text-6xl`, `font-black`, `font-headline`, `tracking-tighter`.
*   **Subheading (`p`)**:
    *   **Text**: "High-quality, chapter-wise notes..."
    *   **Styling**: `mt-4`, `max-w-2xl`, `mx-auto`, `text-lg`, `text-muted-foreground`.
*   **Buttons**:
    *   **Layout**: `mt-8`, `flex`, `justify-center`, `gap-4`.
    *   **Primary Button**: "Browse Subjects". `size="lg"`. Uses the default solid blue button style. Contains an `ArrowRight` icon.
    *   **Secondary Button**: "See Latest Notes". `variant="outline"`, `size="lg"`. Transparent with a 1px border.

#### **2.2. Subjects Section (`<SubjectCard />`)**

*   **Layout**: Grid with 4 columns on large screens (`lg:grid-cols-4`).
*   **Card Styling**:
    *   `Card` component with `h-full` to ensure all cards in a row have the same height.
    *   **Hover Effect**: `transition-all`, `duration-300`, `hover:shadow-xl`, `hover:-translate-y-2`, `hover:bg-accent/40`.
*   **Icon**:
    *   Contained within a `div` with `p-4`, `bg-primary/10` (a semi-transparent primary color), and `rounded-lg`.
    *   The icon itself is `h-8 w-8` and `text-primary`.
*   **Text Content**:
    *   **Title (`CardTitle`)**: `text-xl`, `font-bold`.
    *   **Subcategories**: A `p` tag with `text-sm`, `text-muted-foreground`, and a fixed height of `h-10` to ensure alignment.
    *   **"View Chapters" Link**: `flex`, `items-center`, `text-sm`, `font-semibold`, `text-primary/80`. The text color deepens to full `text-primary` on `group-hover`. The `ArrowRight` icon moves right on hover (`group-hover:translate-x-1`).

#### **2.3. Recent Notes Section (`<NoteCard />`)**

*   **Layout**: Same grid structure as the Subjects section.
*   **Card Styling**:
    *   `Card` with `overflow-hidden`, `h-full`, `flex flex-col`.
    *   **Hover Effect**: `transition-all`, `duration-300`, `hover:shadow-xl`, `hover:-translate-y-2`.
*   **Image**:
    *   Contained in a `div` with `relative h-48 w-full`.
    *   The `img` tag uses `w-full h-full object-cover`.
    *   A gradient overlay (`bg-gradient-to-t from-black/60 to-transparent`) is absolutely positioned over the image to ensure the title is readable if it overlaps.
*   **Content**:
    *   **Badge**: A `Badge` component with `variant="secondary"` displays the subject and subcategory.
    *   **Title (`CardTitle`)**: `text-lg`, `font-bold`, `leading-tight`. Color changes to primary on `group-hover`.
    *   **Description**: `text-sm`, `text-muted-foreground`, `line-clamp-2` to limit it to two lines.
*   **Footer**:
    *   **Layout**: `flex`, `justify-between`, `items-center`.
    *   **Price**: `font-bold`, `text-lg`, `flex`, `items-center`. The `IndianRupee` icon is `h-5 w-5` and `text-primary`.
    *   **"Explore" Link**: Same styling as the "View Chapters" link on the `SubjectCard`.

---

### **Part 3: Admin Page (`src/app/admin/page.tsx`)**

*   **Layout**: Standard `container` with a main heading and logout button at the top (`flex justify-between items-center`).
*   **Tabs Component**:
    *   `TabsList` is centered (`flex justify-center`) and uses the default `bg-muted` background.
    *   `TabsTrigger` is the button for each tab. When active, it gets a `bg-background` color and a `shadow-sm` to make it pop.
*   **Order List (`<OrderList />`)**:
    *   Each order is a `Card`.
    *   **Header**: `flex justify-between items-start` to place the title/date on the left and the price/status on the right.
    *   **Status Badge**: `Badge` with `variant="destructive"` for "new" orders.
    *   **Price**: `font-semibold`, `text-xl`.
*   **Note Manager (`<NoteManager />`)**:
    *   Uses a `Collapsible` component for each note.
    *   The card background is dimmed (`bg-muted/50`) if a note's `status` is "hidden".
    *   **Note Details**: Layout is a `flex` row with the image on the left and text details (`CardTitle`, `CardDescription`, prices) on the right (`flex-grow`).
    *   **Actions**:
        *   **Status Toggle**: A `Switch` component. The label next to it includes an `Eye` or `EyeOff` icon.
        *   **Edit Button**: `variant="outline"` with an `Edit` icon and a `ChevronDown` icon that rotates 180 degrees when the collapsible is open.
        *   **Delete Button**: `variant="destructive"` with a `Trash2` icon. This triggers an `AlertDialog` for confirmation.