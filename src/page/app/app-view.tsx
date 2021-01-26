import React from 'react';
// import logo from 'src/assets/logo.svg';
import styles from './app.module.scss';

import Map from '../../page/map';
import Robot, { RobotHandler } from '../../page/robot';
import { MapMatrix } from '../../lib/common-type';
import { random_matrix } from '../../lib/create-map';
import useRobotRunner from '../../lib/robot-runner';

const playgroundSize = { width: 400, height: 400 };

/////////////////////////////////////////////////

const AppView: React.FC<{}> = () => {

  const [matrix, setMatrix] = React.useState<MapMatrix>(null)
  const [startPosition, setStartPosition] = React.useState<{ x: number, y: number } | null>(null);
  const robotRef = React.useRef<RobotHandler>(null);

  const [startAutoRun] = useRobotRunner();

  const updateMap = React.useCallback(() => {
    const info = random_matrix(10, 10, 10);
    setMatrix(info.matrix);
    setStartPosition(info.startPosition);
  }, []);
  const clearPath = React.useCallback(() => {
    let handle = robotRef.current;
    if (!handle) return;
    handle.clearPath();
  }, []);

  const startRun = React.useCallback(() => {
    startAutoRun({
      robot: robotRef,
      matrix: matrix,
    })
  }, [startAutoRun, matrix])

  React.useEffect(() => {
    startAutoRun(null);
  }, [matrix, startAutoRun]);

  React.useEffect(() => {
    updateMap();
  }, [updateMap]);

  const onKeyDown = React.useCallback((event: KeyboardEvent) => {
    let handle = robotRef.current;
    if (!handle) return;
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
      <div className={styles.playground} style={{ ...playgroundSize }}>
        <Map size={playgroundSize} matrix={matrix} />
        <Robot size={playgroundSize} matrix={matrix} startPosition={startPosition} ref={robotRef} />
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
