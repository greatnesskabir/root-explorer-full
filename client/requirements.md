## Packages
framer-motion | Smooth page transitions and elegant minimal entry animations for the UI.

## Notes
- Expecting a minimalist, editorial-style layout.
- The backend API endpoints are assumed to be /api/roots/search (POST) and /api/roots/recent (GET).
- If no recent searches exist, the UI gracefully falls back to an empty state.
- Derived forms from the database will have parts in parentheses visually faded (opacity-50) using regex logic in the frontend.
