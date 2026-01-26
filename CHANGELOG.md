# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-26

### Added
- Functional SVG parsing using `svgson` integration.
- Normalization layer to handle SVG coordinate systems and unit standardization.
- Validation mechanism to ensure input SVG elements are supported by React-PDF.
- Compilation engine to transform standard SVG AST nodes into React-PDF compatible JSX.
- Emitter module for generating clean, ready-to-use TypeScript/JSX code.
- CLI interface allowing users to convert SVG files or raw SVG strings via command line.
- Integrated Prettier formatting for the generated output.
- Comprehensive `README.md` documentation.
