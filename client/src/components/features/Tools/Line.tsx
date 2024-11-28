export const Line = (
        from: {
                x: number;
                y: number;
        },
        to: {
                x: number;
                y: number;
        },
        ctx: CanvasRenderingContext2D,
) => {
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
};
