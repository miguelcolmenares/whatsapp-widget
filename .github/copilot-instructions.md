# WhatsApp Widget - GitHub Copilot Instructions

## Project Overview
This is a TypeScript-based embeddable WhatsApp widget that creates a floating button with multi-agent support and business hours scheduling. The widget is distributed as a standalone JavaScript library via JSDelivr CDN.

## Architecture & Key Components

### Core Classes
- **`WhatsappWidget`** (`src/ts/whatsappWidget.ts`): Main widget controller that manages rendering, agent aggregation, and Google Analytics tracking
- **`WhatsappAgent`** (`src/ts/whatsappAgent.ts`): Individual agent handler with schedule-based availability logic using `isEnabled` getter
- **Entry point**: `src/ts/index.ts` exposes `WhatsappWidget` as `window.whatsapp`

### Build System (Dual Pipeline)
```bash
npm run build  # Runs: grunt && npx webpack --mode production
```
1. **Grunt** (`Gruntfile.js`): Processes LESS → CSS, copies fonts, handles CDN path variables via `modifyVars`
2. **Webpack** (`webpack.config.js`): Bundles TypeScript → JavaScript, performs string replacements for `{{package}}` and `{{url}}` tokens

### Styling Architecture
- **LESS structure**: `src/less/index.less` imports `icomoon.less` (icons), `variables.less`, `widget.less`
- **CSS classes follow `wa-w` prefix**: `wa-w` (widget), `wa-w_a` (agents), `wa-w_b` (button), `wa-w_h` (header)
- **CDN integration**: Uses `@cdnPath` and `@version` variables for asset loading

## Development Patterns

### String Safety
- All user input is sanitized using `striptags()` before DOM insertion
- Template literals in methods like header, button, and WhatsappAgent.render use `striptags()` consistently

### Agent Scheduling Logic
```typescript
// Schedule format: [["9:00", "18:00"], ...] for Sunday-Saturday
get isEnabled(): boolean {
    // Complex time-based availability check in WhatsappAgent
}
```

### Google Analytics Integration
- Widget tracks clicks via `window.dataLayer` with predefined event structure
- Agent clicks include agent name as label for attribution

### Dynamic CSS Loading
- Widget loads CSS dynamically via `loadStyles()` Promise-based method
- CSS URL constructed from `{{url}}` template replacement

## Testing & Development

### Test Commands
```bash
npm test           # Jest with coverage and jsdom environment
npm run lint       # ESLint with --fix flag
npm run prettier   # Code formatting
```

### Test Structure
- Tests in `__tests__/` using Jest with `jsdom` environment
- Agent scheduling tests verify time-based availability logic
- Widget instantiation tests cover default value fallbacks

## Key Integration Points

### CDN Distribution
- Package distributed via JSDelivr: `cdn.jsdelivr.net/gh/miguelcolmenares/whatsapp-widget`
- Version from `package.json` used in CSS asset paths
- Built files go to `dist/js/` and `dist/css/`

### WhatsApp URL Generation
```typescript
const text = message ? `?text=${striptags(message)}` : "";
window.open(`https://wa.me/${phone?.replace(/ /g, "").replace("+", "")}${striptags(text)}`, "_blank");
```

### Widget API
Instantiation requires agents array with `name`, `phone`, `hours`, `cta`, `message`, and optional `schedule` properties. Widget auto-hides if no active agents based on current time.

## Development Workflows
- Use `npm run build` before testing CDN integration
- LESS changes require Grunt rebuild to see CSS updates
- TypeScript changes need Webpack rebuild for browser testing
- Tests run in jsdom - no browser required for development

## GitHub CLI (gh) Usage
When using `gh` commands in the terminal, always disable the pager to prevent the terminal from hanging:
- **Preferred**: Use `PAGER=cat gh ...` (e.g., `PAGER=cat gh run list`)
- **Alternative**: Pipe to cat: `gh ... | cat` (e.g., `gh run list | cat`)
- This prevents interactive pager mode that waits for user input