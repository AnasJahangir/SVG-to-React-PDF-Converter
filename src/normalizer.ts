import { SvgNode } from './parser';

/**
 * Converts a style string (e.g., "fill: red; stroke: blue") to an object map.
 */
function parseStyleString(style: string): Record<string, string> {
    const styles: Record<string, string> = {};
    style.split(';').forEach(rule => {
        const [key, value] = rule.split(':');
        if (key && value) {
            styles[key.trim()] = value.trim();
        }
    });
    return styles;
}

/**
 * Converts dashed-case to camelCase (e.g., "stroke-width" -> "strokeWidth").
 */
function toCamelCase(str: string): string {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

/**
 * Normalizes an SVG AST node:
 * 1. Merges style attributes into main attributes.
 * 2. CamelCases attribute names.
 * 3. Removes unnecessary metadata.
 */
export function normalizeNode(node: SvgNode): SvgNode {
    let attributes = { ...node.attributes };

    // 1. Handle Style
    if (attributes.style) {
        const styleMap = parseStyleString(attributes.style);
        attributes = { ...attributes, ...styleMap };
        delete attributes.style;
    }

    // 2. CamelCase keys and cleaned attributes
    const cleanedAttributes: Record<string, string> = {};
    for (const [key, value] of Object.entries(attributes)) {
        const camelKey = toCamelCase(key);
        let cleanValue = value;

        // Strip 'px' if it's a numeric pixel value
        if (typeof value === 'string' && value.endsWith('px')) {
            const numVal = value.slice(0, -2);
            if (!isNaN(Number(numVal))) {
                cleanValue = numVal;
            }
        }

        cleanedAttributes[camelKey] = cleanValue;
    }

    // Optimization: Remove if display="none"
    if (cleanedAttributes['display'] === 'none' || cleanedAttributes['visibility'] === 'hidden') {
        return { ...node, component: null } as any; // Hacky signal to filter out
    }

    // 3. Normalized Children
    const normalizedChildren: SvgNode[] = [];

    (node.children || []).forEach(child => {
        const normalizedChild = normalizeNode(child);
        if (!normalizedChild) return; // helper to skip nulls if defined

        // Check if it's a useless group (g tag, no attributes)
        // We check the normalized child's attributes, not the original, in case they were all cleaned up.
        if (normalizedChild.name === 'g' && Object.keys(normalizedChild.attributes).length === 0) {
            // Flatten: Add its children to our children
            normalizedChildren.push(...(normalizedChild.children || []));
        } else {
            normalizedChildren.push(normalizedChild);
        }
    });

    return {
        ...node,
        name: node.name, // Keep original tag name for now (e.g. 'svg', 'path')
        attributes: cleanedAttributes,
        children: normalizedChildren,
        value: node.value,
        type: node.type
    };
}
