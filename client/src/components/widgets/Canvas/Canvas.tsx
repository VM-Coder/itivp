import { useAppSelector } from "@src/hooks";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { socket } from "@src/socket";
import { Ellipse } from "@features/Tools/Ellipse";
import { Rectangle } from "@features/Tools/Rectangle";
import { Line } from "@features/Tools/Line";
import { Brush } from "@features/Tools/Brush";
import { Fill } from "@features/Tools/Fill";

interface ICanvas {
        width: number;
        height: number;
}

export interface CanvasRef {
        drawFromData: (data: { tool: string; options: any }) => void;
}

const Canvas = forwardRef<CanvasRef, ICanvas>(({ width, height }, ref) => {
        const firstColor = useAppSelector((state) => state.painting.firstColor);
        const secondColor = useAppSelector((state) => state.painting.secondColor);
        const tool = useAppSelector((state) => state.painting.tool);
        const lineWidth = useAppSelector((state) => state.painting.lineWidth);
        const role = useAppSelector((state) => state.game.role);
        const wordData = useAppSelector((state) => state.game.wordData);

        const hold = useRef(false);
        const canv = useRef<HTMLCanvasElement>(null);
        const selection = useRef<HTMLDivElement>(null);
        const ctx = useRef<CanvasRenderingContext2D | null>(null);
        const point = useRef<{
                x: number;
                y: number;
        }>({
                x: NaN,
                y: NaN,
        });

        const drawFromData = (data: { tool: string; options: any }) => {
                if (ctx.current) {
                        switch (data.tool) {
                                case "ellipse":
                                        ctx.current.lineWidth = data.options.lineWidth;
                                        ctx.current.strokeStyle = data.options.strokeStyle;
                                        Ellipse(data.options.center, data.options.size, ctx.current);
                                        break;
                                case "rectangle":
                                        ctx.current.lineWidth = data.options.lineWidth;
                                        ctx.current.strokeStyle = data.options.strokeStyle;
                                        Rectangle(data.options.corner, data.options.size, ctx.current);
                                        break;
                                case "line":
                                        ctx.current.lineWidth = data.options.lineWidth;
                                        ctx.current.strokeStyle = data.options.strokeStyle;
                                        Line(data.options.from, data.options.to, ctx.current);
                                        break;
                                case "brush":
                                        ctx.current.lineWidth = data.options.lineWidth;
                                        ctx.current.strokeStyle = data.options.strokeStyle;
                                        ctx.current.fillStyle = data.options.strokeStyle;
                                        Brush(data.options.current, data.options.previous, ctx.current);
                                        break;
                                case "pencil":
                                        ctx.current.lineWidth = 1;
                                        ctx.current.strokeStyle = data.options.strokeStyle;
                                        ctx.current.fillStyle = data.options.strokeStyle;
                                        Brush(data.options.current, data.options.previous, ctx.current);
                                        break;
                                case "fill":
                                        ctx.current.fillStyle = data.options.fillStyle;
                                        Fill(data.options.start_point, { w: width, h: height }, ctx.current);
                                        break;
                        }
                }
        };

        useImperativeHandle(ref, () => {
                return {
                        drawFromData,
                };
        });

        useEffect(() => {
                if (canv.current) {
                        ctx.current = canv.current.getContext("2d", { willReadFrequently: true, alpha: false });

                        if (ctx.current) {
                                ctx.current.fillStyle = "#ffffff";
                                ctx.current.fillRect(0, 0, width, height);
                        }
                }
        }, [canv.current, wordData]);

        const pointerDownHandle = (event: React.PointerEvent<HTMLCanvasElement>) => {
                event.preventDefault();

                hold.current = true;

                if (canv.current && ctx.current) {
                        const rect = canv.current.getBoundingClientRect();

                        point.current = {
                                x: event.clientX - rect.left,
                                y: event.clientY - rect.top,
                        };

                        if (tool != "pencil") {
                                ctx.current.lineWidth = lineWidth;
                        } else {
                                ctx.current.lineWidth = 1;
                        }

                        if (event.button == 0) {
                                ctx.current.fillStyle = `rgb(${firstColor.rgb})`;
                                ctx.current.strokeStyle = `rgb(${firstColor.rgb})`;
                        } else if (event.button == 2) {
                                ctx.current.fillStyle = `rgb(${secondColor.rgb})`;
                                ctx.current.strokeStyle = `rgb(${secondColor.rgb})`;
                        }

                        if (tool == "fill") {
                                Fill(
                                        {
                                                x: Math.round(point.current.x),
                                                y: Math.round(point.current.y),
                                        },
                                        {
                                                w: width,
                                                h: height,
                                        },
                                        ctx.current,
                                );
                                socket.emit(
                                        "request",
                                        JSON.stringify({
                                                type: "draw",
                                                tool: "fill",
                                                options: {
                                                        fillStyle: ctx.current.fillStyle,
                                                        start_point: {
                                                                x: Math.round(point.current.x),
                                                                y: Math.round(point.current.y),
                                                        },
                                                },
                                        }),
                                );
                        }

                        if (["ellipse", "rectangle", "line"].includes(tool) && selection.current) {
                                selection.current.style.borderWidth = "1px";
                                selection.current.style.left = String(point.current.x) + "px";
                                selection.current.style.top = String(point.current.y) + "px";
                        }
                }
        };

        const pointerUpHandle = (event: React.PointerEvent<HTMLCanvasElement>) => {
                hold.current = false;

                if (canv.current && ctx.current) {
                        const rect = canv.current.getBoundingClientRect();
                        const x = event.clientX - rect.left;
                        const y = event.clientY - rect.top;

                        const dx = x - point.current.x;
                        const dy = y - point.current.y;

                        switch (tool) {
                                case "ellipse":
                                        Ellipse(
                                                {
                                                        x: (point.current.x + x) / 2,
                                                        y: (point.current.y + y) / 2,
                                                },
                                                {
                                                        w: Math.abs(dx) / 2,
                                                        h: Math.abs(dy) / 2,
                                                },
                                                ctx.current,
                                        );
                                        socket.emit(
                                                "request",
                                                JSON.stringify({
                                                        type: "draw",
                                                        tool: "ellipse",
                                                        options: {
                                                                strokeStyle: ctx.current.strokeStyle,
                                                                lineWidth: ctx.current.lineWidth,
                                                                center: {
                                                                        x: (point.current.x + x) / 2,
                                                                        y: (point.current.y + y) / 2,
                                                                },
                                                                size: {
                                                                        w: Math.abs(dx) / 2,
                                                                        h: Math.abs(dy) / 2,
                                                                },
                                                        },
                                                }),
                                        );
                                        break;
                                case "rectangle":
                                        Rectangle(
                                                {
                                                        x: point.current.x,
                                                        y: point.current.y,
                                                },
                                                {
                                                        w: dx,
                                                        h: dy,
                                                },
                                                ctx.current,
                                        );
                                        socket.emit(
                                                "request",
                                                JSON.stringify({
                                                        type: "draw",
                                                        tool: "rectangle",
                                                        options: {
                                                                strokeStyle: ctx.current.strokeStyle,
                                                                lineWidth: ctx.current.lineWidth,
                                                                corner: {
                                                                        x: point.current.x,
                                                                        y: point.current.y,
                                                                },
                                                                size: {
                                                                        w: dx,
                                                                        h: dy,
                                                                },
                                                        },
                                                }),
                                        );
                                        break;
                                case "line":
                                        Line(
                                                {
                                                        x: point.current.x,
                                                        y: point.current.y,
                                                },
                                                {
                                                        x: x,
                                                        y: y,
                                                },
                                                ctx.current,
                                        );
                                        socket.emit(
                                                "request",
                                                JSON.stringify({
                                                        type: "draw",
                                                        tool: "line",
                                                        options: {
                                                                strokeStyle: ctx.current.strokeStyle,
                                                                lineWidth: ctx.current.lineWidth,
                                                                from: {
                                                                        x: point.current.x,
                                                                        y: point.current.y,
                                                                },
                                                                to: {
                                                                        x: x,
                                                                        y: y,
                                                                },
                                                        },
                                                }),
                                        );
                                        break;
                        }

                        if (selection.current) {
                                selection.current.style.borderWidth = "0px";
                                selection.current.style.left = "0px";
                                selection.current.style.top = "0px";
                                selection.current.style.width = "0px";
                                selection.current.style.height = "0px";
                        }
                }
        };

        const pointerMoveHandle = (event: React.PointerEvent<HTMLCanvasElement>) => {
                if (canv.current && ctx.current) {
                        const rect = canv.current.getBoundingClientRect();
                        const x = event.clientX - rect.left;
                        const y = event.clientY - rect.top;

                        if (hold.current) {
                                if (tool == "brush" || tool == "pencil") {
                                        Brush(
                                                {
                                                        x: x,
                                                        y: y,
                                                },
                                                {
                                                        x: x - event.movementX,
                                                        y: y - event.movementY,
                                                },
                                                ctx.current,
                                        );

                                        socket.emit(
                                                "request",
                                                JSON.stringify({
                                                        type: "draw",
                                                        tool: tool,
                                                        options: {
                                                                strokeStyle: ctx.current.strokeStyle,
                                                                lineWidth: ctx.current.lineWidth,
                                                                current: {
                                                                        x: x,
                                                                        y: y,
                                                                },
                                                                previous: {
                                                                        x: x - event.movementX,
                                                                        y: y - event.movementY,
                                                                },
                                                        },
                                                }),
                                        );
                                }
                                if (["ellipse", "rectangle", "line"].includes(tool) && selection.current) {
                                        selection.current.style.left = Math.min(x, point.current.x) + "px";
                                        selection.current.style.top = Math.min(y, point.current.y) + "px";
                                        selection.current.style.width = String(Math.abs(x - point.current.x)) + "px";
                                        selection.current.style.height = String(Math.abs(y - point.current.y)) + "px";
                                }
                        }
                }
        };

        const pointerLeaveHandle = () => {
                hold.current = false;

                if (selection.current) {
                        selection.current.style.borderWidth = "0px";
                        selection.current.style.left = "0px";
                        selection.current.style.top = "0px";
                        selection.current.style.width = "0px";
                        selection.current.style.height = "0px";
                }
        };

        return (
                <div className='absolute w-fit h-fit inset-0 m-auto'>
                        {role == "painter" && (
                                <canvas
                                        ref={canv}
                                        onPointerDown={pointerDownHandle}
                                        onPointerUp={pointerUpHandle}
                                        onPointerMove={pointerMoveHandle}
                                        onPointerLeave={pointerLeaveHandle}
                                        onContextMenu={(event) => event.preventDefault()}
                                        width={width}
                                        height={height}
                                ></canvas>
                        )}
                        {role == "responder" && <canvas ref={canv} width={width} height={height}></canvas>}
                        <div
                                ref={selection}
                                className='absolute top-0 left-0 w-0 h-0 border-0 border-black border-dashed bg-transparent pointer-events-none'
                        ></div>
                </div>
        );
});

export default Canvas;
