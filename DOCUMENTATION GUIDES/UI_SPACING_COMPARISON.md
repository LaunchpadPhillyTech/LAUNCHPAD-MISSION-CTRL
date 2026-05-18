# UI Spacing Comparison

This document compares the spacing and layout conventions used in Launchpad Mission Control.

## Spacing System
- Uses Tailwind CSS spacing scale (e.g., `p-4`, `m-2`, `gap-6`)
- Consistent use of `rem` units for padding and margin

## Layout Guidelines
- Responsive flexbox and grid layouts
- Sidebar navigation with fixed width
- Main content area uses `max-w-screen-lg` for readability

## Example
```
<div className="p-6 m-4 gap-4 flex flex-col">
  ...
</div>
```

## Notes
- All UI components follow a consistent spacing and sizing system for maintainability and visual harmony.
