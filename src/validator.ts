import { SvgNode } from './parser';

const UNSUPPORTED_TAGS = ['filter', 'mask', 'animate', 'animateTransform', 'foreignObject'];

export function validateNode(node: SvgNode): void {
    if (UNSUPPORTED_TAGS.includes(node.name)) {
        console.warn(`WARN: Unsupported SVG tag detected: <${node.name}>. It may not render correctly in React-PDF.`);
    }

    if (node.attributes) {
        if (node.attributes['filter']) {
            console.warn(`WARN: 'filter' attribute detected on <${node.name}>. Filters are not supported.`);
        }
        if (node.attributes['mask']) {
            console.warn(`WARN: 'mask' attribute detected on <${node.name}>. Masks are not supported.`);
        }
    }

    (node.children || []).forEach(validateNode);
}
