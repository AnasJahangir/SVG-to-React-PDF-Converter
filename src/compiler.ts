import { SvgNode } from './parser';

export interface ReactPdfNode {
    component: string;
    props: Record<string, string>;
    children: ReactPdfNode[];
    text?: string;
}

const TAG_MAP: Record<string, string> = {
    'svg': 'Svg',
    'path': 'Path',
    'rect': 'Rect',
    'circle': 'Circle',
    'line': 'Line',
    'polyline': 'Polyline',
    'polygon': 'Polygon',
    'g': 'G',
    'text': 'Text',
    'tspan': 'Tspan',
    'defs': 'Defs',
    'linearGradient': 'LinearGradient',
    'radialGradient': 'RadialGradient',
    'stop': 'Stop',
    'clipPath': 'ClipPath',
    'ellipse': 'Ellipse'
};

// Attributes valid in React-PDF that match SVG
// We pass through anything that looks like a valid prop, but could filter strictly if needed.
// Common ones: fill, stroke, strokeWidth, opacity, d, x, y, width, height, viewBox...

export function compileNode(node: SvgNode): ReactPdfNode {
    if (node.type === 'text') {
        return {
            component: '_TEXT_',
            props: {},
            children: [],
            text: node.value
        };
    }

    const componentName = TAG_MAP[node.name];

    // If tag is not supported (e.g. 'defs', 'desc'), we might want to return a special null/fragment or filter it out.
    // For this simple version, if it's not in the map, we might skip it or leave it as is.
    // Let's default to a generic View or filter. The plan says "Validator" catches unsupported.
    // So here we assume valid inputs or best-effort map.

    // Recursive compile children
    const compiledChildren = (node.children || [])
        .map(compileNode)
        .filter(c => c.component || c.text); // Keep nodes with component or text

    return {
        component: componentName || '', // If empty, it will be ignored/handled by emitter (unless it has text? handled above)
        props: node.attributes,
        children: compiledChildren,
        text: node.value
    };
}
