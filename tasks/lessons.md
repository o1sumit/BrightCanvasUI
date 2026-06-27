# Lessons

- **UI Component Policy**: Always use common custom primitives from `src/components/ui-kit` (`TextInput`, `ThemedSelect`, `TextArea`, `Field`) instead of browser-native elements (like `<select>` or `<textarea>`) or standard UI library elements (like `Input` from `@/components/ui-kit`).
- **Import Verification**: Always verify that any utility functions (such as `cn` from `@/lib/utils` or icons from `lucide-react`) used in new or modified files are correctly imported at the top of the file to prevent runtime `ReferenceError`s.