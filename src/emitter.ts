import { ReactPdfNode } from './compiler';

const REACT_PDF_IMPORTS = new Set(['Svg', 'Path', 'Rect', 'Circle', 'Line', 'Polyline', 'Polygon', 'G', 'Text', 'View', 'Defs', 'LinearGradient', 'RadialGradient', 'Stop', 'ClipPath', 'Ellipse', 'Tspan', 'Image']);

export function generateCode(node: ReactPdfNode): string {
    const usedComponents = new Set<string>();

    function traverseAndCollect(n: ReactPdfNode) {
        if (n.component && REACT_PDF_IMPORTS.has(n.component)) {
            usedComponents.add(n.component);
        }
        n.children.forEach(traverseAndCollect);
    }
    traverseAndCollect(node);

    const importStmt = `import { ${Array.from(usedComponents).join(', ')} } from '@react-pdf/renderer';`;

    function renderNode(n: ReactPdfNode, indentLevel: number = 0): string {
        const indent = '  '.repeat(indentLevel);

        if (n.component === '_TEXT_') {
            return n.text ? `${indent}{${JSON.stringify(n.text)}}` : '';
        }

        if (!n.component) return ''; // Skip empty components (unmapped tags)
        const propsString = Object.entries(n.props)
            .map(([key, val]) => {
                // Heuristic: If value looks like a number, emit as number {123}
                // Exceptions: IDs starting with numbers (rare in SVG but possible), or specific string props.
                // But generally safe for SVG attributes converted to React-PDF props.
                const isNumber = !isNaN(Number(val)) && val.trim() !== '';
                return `${key}={${isNumber ? val : JSON.stringify(val)}}`;
            })
            .join(' ');

        const hasChildren = n.children.length > 0;
        const hasText = n.text && n.text.trim().length > 0;

        if (!hasChildren && !hasText) {
            return `${indent}<${n.component} ${propsString} />`;
        }

        let childrenCode = '';
        if (hasChildren) {
            childrenCode = '\n' + n.children.map(c => renderNode(c, indentLevel + 1)).join('\n');
        }

        // Text content
        let textCode = '';
        if (hasText) {
            textCode = `\n${indent}  {${JSON.stringify(n.text)}}`; // simple text handling
        }

        const closeIndent = (hasChildren || hasText) ? `\n${indent}` : '';

        return `${indent}<${n.component} ${propsString}>${childrenCode}${textCode}${closeIndent}</${n.component}>`;
    }

    const jsx = renderNode(node);

    return `${importStmt}\n\nconst MyConvertedSvg = () => (\n${jsx}\n);`;
}
