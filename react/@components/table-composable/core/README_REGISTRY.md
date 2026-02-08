# SmartTable – v1 (Handmade)

This was my first composable table abstraction, created before I adopted registry-based solutions.

It solved real production problems and helped me deeply understand:

- composition vs wrapper APIs  
- separation of UI and table logic  
- extensibility patterns  
- DX trade-offs  

Today, I would not build this from scratch again.

Instead, I prefer relying on mature registry-driven solutions.

👉 Current preferred table UI approach:
https://www.kibo-ui.com/components/table

This folder remains as a historical and learning reference.

---

# Current Architecture – Hooks & State

While the UI layer is now registry-based, I extracted and evolved the **logic layer** into reusable primitives.

These hooks are inspired by DiceUI’s data-table ideas, but refactored and decomposed by responsibility.

- useDataTable → TanStack table orchestration  
- usePagination → pagination state & navigation  
- useUrlState → URL synchronization layer  

👉 Inspired by DiceUI:
https://www.diceui.com/docs/components/data-table