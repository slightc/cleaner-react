import React from 'react';
// import logo from 'src/assets/logo.svg';
import styles from './app.module.scss';

import Map from '../../page/map';
import Robot, { RobotHandler, RobotState } from '../../page/robot';
import { MapMatrix } from '../../lib/common-type';
import { random_matrix } from '../../lib/create-map';
import useRobotRunner from '../../lib/robot-runner';
import socket from '../../lib/socketio-interface';

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
    if(matrix){
      socket.emit('map',matrix);
    }
  }, [matrix]);

  React.useEffect(() => {
    updateMap();
    socket.on('updateMap', () => {
      updateMap();
    });
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
    const doCb = (cb: any, value: any) => {
      cb && cb(value);
    }
    socket.on('turnLeft',(cb: any) =>(doCb(cb,robotRef.current?.turnLeft())));
    socket.on('turnRight',(cb: any) =>(doCb(cb,robotRef.current?.turnRight())));
    socket.on('forward',(cb: any) =>(doCb(cb,robotRef.current?.forward())));

    socket.on('toUp',(cb: any) =>(doCb(cb,robotRef.current?.toUp())));
    socket.on('toDown',(cb: any) =>(doCb(cb,robotRef.current?.toDown())));
    socket.on('toLeft',(cb: any) =>(doCb(cb,robotRef.current?.toLeft())));
    socket.on('toRight',(cb: any) =>(doCb(cb,robotRef.current?.toRight())));
    socket.on('connect', ()=>{
      socket.emit('robotStart',true);
    })
  }, [])

  React.useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    }
  }, [onKeyDown]);

  const onRobotStateChanged = React.useCallback((state: RobotState) => {
    socket.emit('robotState',state);
  },[])

  return (
    <div className={styles.app}>
      <div className={styles.playground} style={{ ...playgroundSize }}>
        <Map size={playgroundSize} matrix={matrix} />
        <Robot size={playgroundSize} matrix={matrix} onStateChanged={onRobotStateChanged} startPosition={startPosition} ref={robotRef} />
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
