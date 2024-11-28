export const Brush = (
        current: {
                x: number;
                y: number;
        },
        previous: {
                x: number;
                y: number;
        },
        ctx: CanvasRenderingContext2D,
) => {
        ctx.beginPath();
        ctx.arc(current.x, current.y, ctx.lineWidth / 2, 0, 2 * Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(current.x, current.y);
        ctx.lineTo(previous.x, previous.y);
        ctx.stroke();
};
