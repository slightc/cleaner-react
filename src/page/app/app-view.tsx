import React from 'react';
// import logo from 'src/assets/logo.svg';
import styles from './app.module.scss';

import Map from 'src/page/map';
import Robot, {RobotHandler} from 'src/page/robot';
import { MapMatrix } from 'src/lib/common-type';
const playgroundSize = { width: 600, height: 600 };

function random_int(b: number) {
  return Math.floor(Math.random() * (b + 1));
}

function shuffle(array: number[]) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function random_matrix(no_rows: number, no_cols: number, no_obs: number) {
  let arr = [];
  for (let i = 0; i < no_rows * no_cols; i++) {
    arr.push(i < no_obs ? 1 : 0);
  }

  shuffle(arr);

  let startPosition = { x: 0, y: 0 };
  let rand_pos = random_int(no_rows * no_cols - no_obs - 1);

  let matrix = [];
  let count = 0;
  for (let i = 0; i < no_rows; i++) {
    let row = [];
    for (let j = 0; j < no_cols; j++) {
      let item = arr[i * no_cols + j];
      row.push(item);
      if (item === 0) {
        if (count === rand_pos)
          startPosition = { x: j, y: i };
        count++;
      }
    }
    matrix.push(row);
  }
  return {
    matrix: matrix,
    startPosition: startPosition
  }
}

/////////////////////////////////////////////////

interface RobotRunnerRuntime {
  robot: React.RefObject<RobotHandler>;
  matrix: MapMatrix;
  startPosition?: {x: number, y: number};
}

const useRobotRunner = ()=>{
  const [runtime, setRuntime] = React.useState<RobotRunnerRuntime | null>(null);
  
  React.useEffect(() => {
    if(runtime){
      console.log(runtime);
    }
  },[runtime])

  return [setRuntime]
}

/////////////////////////////////////////////////

const AppView: React.FC<{}> = () => {

  const [matrix, setMatrix] = React.useState<MapMatrix>(null)
  const [startPosition, setStartPosition] = React.useState<{x: number, y: number} | null>(null);
  const robotRef = React.useRef<RobotHandler>(null);

  const [startAutoRun] =  useRobotRunner();

  const updateMap = React.useCallback(() => {
    const info = random_matrix(10, 10, 10);
    setMatrix(info.matrix);
    setStartPosition(info.startPosition);
  }, []);
  const clearPath = React.useCallback(() => {
    let handle = robotRef.current;
    if(!handle) return;
    handle.clearPath();
  }, []);

  const startRun = React.useCallback(() => {
    startAutoRun({
      robot: robotRef,
      matrix: matrix,
    })
  }, [startAutoRun,matrix])

  React.useEffect(() => {
    updateMap();
  }, [updateMap]);

  const onKeyDown = React.useCallback((event: KeyboardEvent) => {
    let handle = robotRef.current;
    if(!handle) return;
    if (event.key === 'ArrowUp') {
      handle.toUp();
    }
    if (event.key === 'ArrowDown') {
      handle.toDown();
    }
    if (event.key === 'ArrowLeft') {
      handle.toLeft();
    }
    if (event.key === 'ArrowRight') {
      handle.toRight();
    }
    if (event.key === 'w') {
      handle.forward();
    }
    if (event.key === 'a') {
      handle.turnLeft();
    }
    if (event.key === 'd') {
      handle.turnRight();
    }
    if (event.key === 'Backspace') {
      handle.clearPath();
    }
  }, []);

  React.useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    }
  }, [onKeyDown]);

  return (
    <div className={styles.app}>
      <div className={styles.playground} style={{ width: playgroundSize.width, height: playgroundSize.height }}>
        <Map size={playgroundSize} matrix={matrix} />
        <Robot size={playgroundSize} matrix={matrix} startPosition={startPosition} ref={robotRef}/>
      </div>
      <div>
        <button onClick={updateMap}>Update Map</button>
        <button onClick={clearPath}>Clear Path</button>
        <button onClick={startRun}>Run</button>
      </div>
      <div>
        键盘上下左右移动；键盘 A左转 D右转 W前进；Backspace键清除路径
      </div>
    </div>
  );
}

export default AppView;
