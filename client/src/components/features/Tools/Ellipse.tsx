export const Ellipse = (
        center: {
                x: number;
                y: number;
        },
        size: {
                w: number;
                h: number;
        },
        ctx: CanvasRenderingContext2D,
) => {
        ctx.beginPath();
        ctx.ellipse(center.x, center.y, size.w, size.h, 0, 0, 2 * Math.PI);
        ctx.stroke();
};
