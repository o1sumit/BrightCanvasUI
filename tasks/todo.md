# Tasks

- [x] Create implementation plan and get user feedback <!-- id: 0 -->
- [x] Update `src/routes/_app.agents.index.tsx` to initialize `useScopedList` with mock data fallback <!-- id: 1 -->
- [x] Update `src/routes/_app.agents.$agentId.tsx` to fetch the agent from the scoped workspace list <!-- id: 2 -->
- [x] Implement actual save logic in `src/routes/_app.agents.$agentId.tsx` to persist changes back to workspace <!-- id: 3 -->
- [x] Implement actual delete logic in `src/routes/_app.agents.$agentId.tsx` to remove agent and navigate back <!-- id: 4 -->
- [x] Verify that navigating to detail screens, editing, and deleting works seamlessly <!-- id: 5 -->
- [x] Write walkthrough summary and present results <!-- id: 6 -->

# Review

- **Voice Picker**: Selecting a voice persona doesn't close the modal. Added inline previews and a Done button to close the modal.
- **Agent Detail Screen**: Restructured routing data lookup to query the workspace-scoped agent list (`useScopedList`). Selecting an agent card now navigates properly to its detail page. Saving and deleting are fully functional and persist back to `localStorage`.
- **Card Icon Change**: Replaced the `Sparkles` icon on the detailed page navigation button with `ArrowRight` to make the forward navigation intent clear to users.
- **TypeScript & Build**: All code compiled and built successfully.
