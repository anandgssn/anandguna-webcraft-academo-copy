# AGENTS Guide

This file defines the implementation standards agents should follow when making changes in this repository.

## Core Principle

Prefer a smaller complete site over a larger broken one. Cutting scope is acceptable. Shipping broken scope is not.

## Code Quality Rules

| Area | Agent instruction |
| --- | --- |
| Route/component structure | Keep a clean mapping between routes and user-visible pages. Avoid unclear routing, overloaded entry points, or components with mixed page responsibilities. |
| No dead ends | Do not leave broken links, placeholder sections, empty states with no purpose, or half-removed features in the claimed scope of the work. |
| Animation implementation | Organize animation logic so it can be iterated on and maintained. Avoid spaghetti inline styles or scattered timing logic with no structure. |
| Scope discipline | Do not introduce unnecessary complexity for features that were intentionally cut or deferred. |
| Semantic HTML | Use proper heading hierarchy, landmark elements, buttons for actions, links for navigation, and accessible markup by default. |
| Responsive implementation | Build layouts with grid, flex, and media queries so breakpoints work intentionally across screen sizes. |

## Maintainability Rules

| Area | Agent instruction |
| --- | --- |
| Dead code | Do not leave commented-out blocks, unreachable branches, unused imports, or components that are defined but never rendered. |
| Duplicated code | Extract repeated logic into shared utilities, components, or tokens instead of copying the same implementation across files. |
| Large god files/classes | Split files that grow beyond roughly 500 lines or mix unrelated concerns. Prefer focused modules over monoliths. |
| Hardcoded magic values | Replace unexplained inline numbers, colors, breakpoints, spacing values, and repeated strings with named constants or design tokens where appropriate. |
| Tight coupling | Keep components composable. Avoid circular imports, sibling-aware components, and deep child mutations of global state. |
| Missing tests | Add or update tests when changing non-trivial behavior, especially for routing, state logic, and animations. Avoid leaving complex logic untested. |

## Accessibility & Responsiveness Rules

| Area | Agent instruction |
| --- | --- |
| Accessibility | Provide alt text where needed, maintain keyboard access, include ARIA only when semantic HTML is insufficient, preserve visible focus states, and keep contrast at or above WCAG-friendly levels. |
| Responsive design | Avoid fixed widths that break on mobile, ensure touch targets are at least 44px when interactive, prevent horizontal overflow, and keep text readable on small screens. |
| Multilingual readiness | Avoid hardcoded left-to-right assumptions, avoid embedding important text in images, account for longer translations, and ensure the document language is declared with `lang`. |

## Integrity & Security Rules

AI-assisted changes must remain readable, attributable, and safe. Do not introduce code that obscures behavior, hides provenance, or adds risk without explicit justification.

| Area | Agent instruction |
| --- | --- |
| Obfuscated code | Do not introduce unreadable variable names, encoded strings, or intentionally obscured logic. Code should be easy to inspect and explain. |
| Minified code | Do not commit `.min.js` files or bundled artifacts as source unless the repository explicitly requires them and the reason is documented. |
| Generated bundles | Do not commit `dist/`, `build/`, or `node_modules/` output unless the repository workflow explicitly depends on it. |
| Copied code | Do not paste large external code blocks without verifying they fit the stack, style, and licensing constraints of the project. |
| Copyright / licensing | Only use assets, fonts, libraries, and snippets with licensing that is compatible with the project. |
| Third-party assets | Document the source and usage of externally sourced images, video, fonts, or embeds when they are added. |
| Network calls | Keep external requests explicit and intentional. Do not add analytics, tracking, beaconing, or undocumented third-party calls silently. |
| Unsafe script patterns | Avoid `eval()`, `new Function()`, `document.write()`, dynamic script injection, and unsafe `innerHTML`, especially with user-controlled data. |
| Secrets | Never commit API keys, tokens, passwords, private credentials, or secret-bearing config values. |
