import React from 'react';
import styles from './robot.module.scss';
import { MapMatrix } from 'src/lib/common-type';

type Size = { width: number; height: number };
type Position = { x: number; y: number };

type RobotProps = React.PropsWithChildren<{
  size: Size,
  startPosition: Position,
  matrix: MapMatrix,
}>;

export interface RobotHandler {
  toUp: () => boolean;
  toDown: () => boolean;
  toLeft: () => boolean;
  toRight: () => boolean;
  forward: () => boolean;
  turnLeft: () => boolean;
  turnRight: () => boolean;
  clearPath: () => void;
}

type RobotHandlerRef = React.ForwardedRef<RobotHandler>;


const initCanvas = (canvas: HTMLCanvasElement, backgroundStyle?: string) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (backgroundStyle) {
    ctx.fillStyle = backgroundStyle;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

const clacTopLeft = (position: Position | null, size: Size) => {
  const topLeft = {top: 0, left: 0};
  
  if(position){
    topLeft.top = position.y * size.height;
    topLeft.left = position.x * size.width;
  }

  return topLeft;
}

const drawPath = (canvas: HTMLCanvasElement, start: Position, end: Position, size: Size) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  let startPos = {
    x: start.x * size.width + size.width / 2,
    y: start.y * size.height + size.height / 2,
  }
  let endPos = {
    x: end.x * size.width + size.width / 2,
    y: end.y * size.height + size.height / 2,
  }
  ctx.beginPath();
  ctx.strokeStyle = '#ff0000';
  ctx.lineWidth = 2;

  ctx.moveTo(startPos.x, startPos.y);
  ctx.lineTo(endPos.x, endPos.y);
  ctx.stroke();
  console.log('drawPath');
}

const Robot = ({ matrix, size, startPosition }: RobotProps, ref: RobotHandlerRef) => {
  const [cellSize, setCellSize] = React.useState<Size>({width: 0, height: 0});
  const [nowPosition, setNowPosition] = React.useState<Position>({x: 0, y: 0});
  const [robotZ, setRobotZ] = React.useState(0);

  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const toPosition = React.useCallback((pos: Position) => {
    if (matrix && matrix.length > 0) {
      let rowNum = matrix.length;
      let colNum = matrix[0].length;

      if (pos.x > -1 && pos.x < colNum &&
        pos.y > -1 && pos.y < rowNum &&
        matrix[pos.y][pos.x] === 0
      ) {
        setNowPosition((oldPos) => {
          if (canvasRef.current) {
            drawPath(canvasRef.current, oldPos, pos, cellSize);
          }
          return pos;
        });
        return true;
      }
      return false;
    }
    return false;
  }, [matrix, cellSize]);

  const toUp = React.useCallback(() => {
    let pos = {
      x: nowPosition.x,
      y: nowPosition.y - 1,
    }
    setRobotZ(-90);
    return toPosition(pos);
  }, [nowPosition, toPosition]);

  const toDown = React.useCallback(() => {
    let pos = {
      x: nowPosition.x,
      y: nowPosition.y + 1,
    }
    setRobotZ(90);
    return toPosition(pos);
  }, [nowPosition, toPosition]);

  const toLeft = React.useCallback(() => {
    let pos = {
      x: nowPosition.x - 1,
      y: nowPosition.y,
    }
    setRobotZ(180);
    return toPosition(pos);
  }, [nowPosition, toPosition]);

  const toRight = React.useCallback(() => {
    let pos = {
      x: nowPosition.x + 1,
      y: nowPosition.y,
    }
    setRobotZ(0);
    return toPosition(pos);
  }, [nowPosition, toPosition]);

  const forward = React.useCallback(() => {
    let z = (360 + robotZ)%360;
    let pos = {
      x: nowPosition.x,
      y: nowPosition.y,
    }
    switch (z) {
      case 0: pos.x = nowPosition.x + 1; break;
      case 90: pos.y = nowPosition.y + 1; break;
      case 180: pos.x = nowPosition.x - 1; break;
      case 270: pos.y = nowPosition.y - 1; break;
      default: break;
    }
    return toPosition(pos);
  }, [nowPosition, toPosition, robotZ]);

  const turnLeft = React.useCallback(() => {
    let z = (robotZ - 90)%360;
    setRobotZ(z);
    return true;
  }, [robotZ]);
  const turnRight = React.useCallback(() => {
    let z = (robotZ + 90)%360;
    setRobotZ(z);
    return true;
  }, [robotZ]);

  const clearPath = React.useCallback(() => {
    if(canvasRef.current){
      initCanvas(canvasRef.current);
    }
  },[]);

  React.useEffect(() => {
    if (matrix && matrix.length > 0 && size) {
      let rowNum = matrix.length;
      let colNum = matrix[0].length;

      let { width, height } = size;

      setCellSize({ width: width / colNum, height: height / rowNum });
    }
  }, [matrix, size])

  React.useEffect(() => {
    clearPath();
  }, [matrix, clearPath])
  
  React.useEffect(() => {
    setRobotZ(Math.floor(Math.random() * (4)) * 90);
  }, [matrix])

  React.useEffect(() => {
    if(startPosition){
      setNowPosition(startPosition);
    }
  }, [startPosition])


  React.useImperativeHandle(ref, () => {
    return {
      toUp, toDown, toLeft, toRight, forward, turnLeft, turnRight, clearPath,
    }
  }, [toUp, toDown, toLeft, toRight, forward, turnLeft, turnRight, clearPath]);


  return (
    <div className={styles.robotWrapper}>
      <div className={styles.robotRelative}>
        <canvas ref={canvasRef} width={size.width} height={size.height} className={styles.robotCanvas} />
        <div className={styles.robot} style={{...cellSize, ...clacTopLeft(nowPosition, cellSize)}}>
          <div className={styles.robotIcon} style={{transform:`rotate(${robotZ}deg)`}}/>
        </div>
      </div>
    </div>
  );
}

export default React.forwardRef(Robot);
