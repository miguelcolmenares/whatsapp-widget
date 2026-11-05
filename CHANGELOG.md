# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- A documentation site built with docs-sitekit (`site/` and `docs/`): getting started, options, agents and schedules, and the files and the CDN
- The configurator is a page of that site, at `/configurator/`, with the header, the footer, the search and the light and dark themes of the site, and it generates the same code as before
- Playwright tests (`e2e/`) of the site and the configurator: the generated code against the text of the previous page, escaping, agents and schedules, the copy button, the preview widget, accessibility, and no sideways scroll from 320 px
- Automated build system using GitHub Actions
- npm-auto-build action for automatic build generation and commit
- Build-only testing mode for Pull Requests
- dist/ directory added to .gitignore for cleaner repository

### Changed
-- The documentation site is upgraded to docs-sitekit 0.2.4, and a shared link to it now shows a picture: `site.image` names `site/public/social.png`, a 1200 by 630 card drawn with [social-card-action](https://github.com/miguelcolmenares/social-card-action), so the pages have `og:image`, `twitter:image` and a large Twitter card.
 The documentation site is built with docs-sitekit 0.2.3 (was 0.2.2), so its search button and doc layout pass the accessibility checks without the exemptions for docs-sitekit issue #69, and its footer names the kit without the copyright sign
- The configurator uses the layout and the design tokens of the site, a label for every field, switches for the days of the week that the keyboard can use, a code box the keyboard can reach, and no sideways scroll on a phone
- The documentation site and the configurator are published from `main` with the Docs workflow (the Pages source is GitHub Actions), no longer from the `docs` branch, and the Sync main to docs workflow is removed
- Build workflow now runs automatically on push to main branch
- PR testing workflow modified to use build-only mode (no commits)
- Renamed workflow from "Build - Main" to "Test Build - PR" for PRs

### Removed
- Manual requirement to run npm run build before releases
- build-dev.yml workflow (no longer needed)
- dist/ directory from version control (now auto-generated)

### Technical Details
- Auto-build action will trigger on this commit to test functionality
- Generated files will be automatically committed to dist/ folder

### Fixed
- The Vite build left `{{package}}` and `{{url}}` in `dist/js/whatsapp-widget.js`, so the widget asked for `{{url}}/dist/css/{{package}}.css` and was never drawn. The build replaces them again, as the Webpack build did, and the build workflow fails if one is left. This affected the code on `main`, the `docs` branch and `@main` on the CDN, not the latest release.

## [3.3.7] - 2025-06-29

### Added
- WhatsApp Widget Configurator with enhanced layout and functionality
- Support for null values in WhatsappAgent schedule handling
- Comprehensive documentation and templates

### Changed
- Updated devDependencies to latest versions
- Enhanced README with features, documentation links, and contributor info

### Security
- Fixed incomplete string escaping or encoding (Code scanning alert #14)

## [3.3.6] - 2024-12-21

### Changed
- Dependency updates and maintenance

## [3.3.5] - 2023-12-09

### Changed
- Dependency updates and maintenance

## [3.3.4] - 2023-11-13

### Changed
- Dependency updates and maintenance

## [3.3.3] - 2023-03-22

### Changed
- Dependency updates and maintenance

## [3.3.2] - 2022-09-15

### Changed
- Dependency updates and maintenance

## [3.3.1] - 2022-09-07

### Changed
- Updated TSconfig configuration

## [3.3.0] - 2022-09-06

### Added
- Test suite with GitHub Actions integration
- TypeScript migration completed

### Changed
- Migrated codebase from JavaScript to TypeScript
- Updated webpack configuration
- Removed legacy index.js file

### Security
- Fixed security issue #127

### Fixed
- Resolved issue #129

## [3.2.4] - 2022-04-28

### Changed
- Dependency updates and maintenance

## [3.2.3] - 2022-03-09

### Changed
- Dependency updates and maintenance

## [3.2.2] - Earlier Release

### Changed
- Dependency updates and maintenance

## [3.2.1] - Earlier Release

### Changed
- Dependency updates and maintenance

## [3.2.0] - Earlier Release

### Changed
- Dependency updates and maintenance

## [3.1.1] - Earlier Release

### Changed
- Dependency updates and maintenance

## [3.1.0] - Earlier Release

### Changed
- Dependency updates and maintenance

## [3.0.0] - Earlier Release

### Added
- Grunt build system integration
- Icon fonts implementation
- Build distribution system

### Changed
- Major architecture refactoring
- File structure reorganization

## [2.0.1] - Earlier Release

### Fixed
- Bug fixes and improvements

## [2.0] - Earlier Release

### Changed
- Major version update with significant changes
