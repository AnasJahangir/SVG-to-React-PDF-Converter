# SVG to React-PDF Converter

A powerful and extensible tool to convert SVG files or strings into React-PDF compatible JSX components. This tool parses SVG content, normalizes the structure, validates elements, and emits clean, formatted React-PDF code.

## Features

- **Robust Parsing**: Uses `svgson` for reliable SVG string to AST conversion.
- **Normalization**: Automatically handles coordinate systems, units, and structural cleanup.
- **Validation**: Ensures the input SVG contains elements supported by the converter.
- **React-PDF Optimized**: Compiles SVG nodes into `<Svg>`, `<Path>`, `<Circle>`, `<Rect>`, etc., following React-PDF specs.
- **Formatted Output**: Integrated with Prettier to generate beautiful, ready-to-use code.

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd new-folder
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

You can run the converter using `ts-node` by providing a path to an SVG file or a raw SVG string.

### Convert an SVG file
```bash
npx ts-node src/index.ts path/to/your/image.svg
```

### Convert an SVG string
```bash
npx ts-node src/index.ts '<svg ...>...</svg>'
```

The formatted React-PDF code will be printed to your terminal.

## Project Structure

- `src/index.ts`: The main entry point that coordinates the conversion pipeline.
- `src/parser.ts`: Handles the initial parsing of SVG content.
- `src/normalizer.ts`: Standardizes the SVG AST for easier compilation.
- `src/validator.ts`: Checks for unsupported SVG elements or attributes.
- `src/compiler.ts`: Transforms the SVG AST into a React-PDF compatible structure.
- `src/emitter.ts`: Generates the final JSX code from the compiled AST.

## Development

### Running Tests
*(Note: Ensure you have tests defined in your project)*
```bash
npm test
```

### Formatting Code
```bash
npx prettier --write "src/**/*.ts"
```

## Dependencies

- **svgson**: SVG to JSON parser.
- **prettier**: Code formatter.
- **typescript**: Language and compiler.
- **ts-node**: Execution environment for TypeScript.

## License

This project is licensed under the ISC License.
