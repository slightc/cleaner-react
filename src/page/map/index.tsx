import React from 'react';
import styles from './map.module.scss';
import { MapMatrix } from 'src/lib/common-type';

const initCanvas = (canvas: HTMLCanvasElement, backgroundStyle?: string) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (backgroundStyle) {
    ctx.fillStyle = backgroundStyle;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

const drawGrid = (canvas: HTMLCanvasElement, rows: number, cols: number, color?: string) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;

  const row_height = height / rows;
  const col_width = width / cols;
  ctx.strokeStyle = color || '#999999';
  ctx.lineWidth = 2;

  for (let i = 1; i < rows; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * row_height);
    ctx.lineTo(width, i * row_height);
    ctx.stroke();
  }

  for (let i = 1; i < cols; i++) {
    ctx.beginPath();
    ctx.moveTo(i * col_width, 0);
    ctx.lineTo(i * col_width, height);
    ctx.stroke();
  }
}

const getCellColor = (cellType: number | undefined | null) => {
  if(cellType === 0) {
    return '#ffffff';
  }
  if(cellType === 1){
    return '#000000';
  }

  return '#aaaaaa';
}

const drawMatrix = (canvas: HTMLCanvasElement, matrix: MapMatrix) => {
  if (!matrix) return;
  const rowNum = matrix.length;
  const colNum = matrix[0].length;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;

  const cellHeight = height / rowNum;
  const cellWidth = width / colNum;

  for (let i = 0; i < rowNum; i++) {
    for(let j = 0; j < colNum; j++) {
      const cell = matrix[i][j];
      const cellColor = getCellColor(cell);

      ctx.fillStyle = cellColor;
      const x = j*cellWidth;
      const y = i*cellHeight;
      ctx.fillRect(x+1, y+1, cellWidth-2, cellHeight-2);
    }
  }
}

type MapProps = React.PropsWithChildren<{
  size: { width: number; height: number },
  matrix: MapMatrix,
}>;

const Map: React.FC<MapProps> = ({ size, matrix }: MapProps) => {
  const [canvas, setCanvas] = React.useState<HTMLCanvasElement | null>(null);
  const getCanvas = React.useCallback((el: HTMLCanvasElement | null) => {
    if(el) {
      setCanvas(el)
    }
  }, [])

  React.useEffect(() => {
    if(canvas && matrix && matrix.length>0 && size) {
      let rowNum = matrix.length;
      let colNum = matrix[0].length;

      initCanvas(canvas,'rgb(235,235,235)');
      drawGrid(canvas,rowNum,colNum);
      drawMatrix(canvas, matrix);
    }
  }, [canvas, matrix, size])

  return (
    <canvas ref={getCanvas} width={size.width} height={size.height} className={styles.canvas} />
  );
}

export default Map;
