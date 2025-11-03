# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Automated build system using GitHub Actions
- npm-auto-build action for automatic build generation and commit
- Build-only testing mode for Pull Requests
- dist/ directory added to .gitignore for cleaner repository

### Changed
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
