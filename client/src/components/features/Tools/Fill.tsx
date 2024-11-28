const colorToRgba = (hex: string): Array<number> => {
        return Array.prototype.concat(
                [0, 1, 2].map((elem) => {
                        return parseInt(hex[2 * elem + 1] + hex[2 * elem + 2], 16);
                }),
                255,
        );
};

const getPixelColor = (imageData: ImageData, index: number) => {
        return imageData.data[index] + "," + imageData.data[index + 1] + "," + imageData.data[index + 2] + "," + imageData.data[index + 3];
};

export const Fill = (
        start_point: {
                x: number;
                y: number;
        },
        canv_size: {
                w: number;
                h: number;
        },
        ctx: CanvasRenderingContext2D,
) => {
        let imageData = ctx.getImageData(0, 0, canv_size.w, canv_size.h);

        const replace = getPixelColor(imageData, 4 * (start_point.y * canv_size.w + start_point.x));
        const color = colorToRgba(ctx.fillStyle.toString());

        if (color.join(",") == replace) return;

        let points: Array<{ x: number; y: number }> = [{ x: start_point.x, y: start_point.y }];

        while (points.length > 0) {
                let point = points.pop();

                if (point) {
                        if (point.y >= canv_size.h || point.y < 0) continue;

                        let covTop = false;
                        let covBottom = false;

                        let i = point.x;

                        while (i < canv_size.w && getPixelColor(imageData, 4 * (point.y * canv_size.w + i)) == replace) {
                                const pb = getPixelColor(imageData, 4 * ((point.y + 1) * canv_size.w + i));
                                const pt = getPixelColor(imageData, 4 * ((point.y - 1) * canv_size.w + i));

                                if (covBottom) {
                                        if (pb != replace) {
                                                covBottom = false;
                                        }
                                } else {
                                        if (pb == replace) {
                                                points.push({ x: i, y: point.y + 1 });
                                                covBottom = true;
                                        }
                                }

                                if (covTop) {
                                        if (pt != replace) {
                                                covTop = false;
                                        }
                                } else {
                                        if (pt == replace) {
                                                points.push({ x: i, y: point.y - 1 });
                                                covTop = true;
                                        }
                                }

                                for (let j = 0; j < 4; j++) {
                                        imageData.data[4 * point.y * canv_size.w + 4 * i + j] = color[j];
                                }

                                i++;
                        }

                        i = point.x - 1;

                        covTop = false;
                        covBottom = false;

                        while (i > -1 && getPixelColor(imageData, 4 * (point.y * canv_size.w + i)) == replace) {
                                const pb = getPixelColor(imageData, 4 * ((point.y + 1) * canv_size.w + i));
                                const pt = getPixelColor(imageData, 4 * ((point.y - 1) * canv_size.w + i));

                                if (covBottom) {
                                        if (pb != replace) {
                                                covBottom = false;
                                        }
                                } else {
                                        if (pb == replace) {
                                                points.push({ x: i, y: point.y + 1 });
                                                covBottom = true;
                                        }
                                }

                                if (covTop) {
                                        if (pt != replace) {
                                                covTop = false;
                                        }
                                } else {
                                        if (pt == replace) {
                                                points.push({ x: i, y: point.y - 1 });
                                                covTop = true;
                                        }
                                }

                                for (let j = 0; j < 4; j++) {
                                        imageData.data[4 * point.y * canv_size.w + 4 * i + j] = color[j];
                                }

                                i--;
                        }
                }
        }

        ctx.putImageData(imageData, 0, 0);
};
