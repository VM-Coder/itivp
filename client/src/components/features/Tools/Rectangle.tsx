export const Rectangle = (
        corner: {
                x: number;
                y: number;
        },
        size: {
                w: number;
                h: number;
        },
        ctx: CanvasRenderingContext2D,
) => {
        ctx.strokeRect(corner.x, corner.y, size.w, size.h);
};
