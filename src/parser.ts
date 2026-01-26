import { parse, INode } from 'svgson';

// Re-export INode from svgson or define our own simplified one if needed
export type SvgNode = INode;

export async function parseSvg(svg: string): Promise<SvgNode> {
    return parse(svg, {
        camelcase: false, // We will handle normalization ourselves to be explicit
        transformNode: (node) => node // pass-through
    });
}
