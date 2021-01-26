import React from 'react';
import { RobotHandler } from '../page/robot';
import { MapMatrix } from '../lib/common-type';

export interface RobotRunnerRuntime {
  robot: React.RefObject<RobotHandler>;
  matrix: MapMatrix;
  startPosition?: { x: number, y: number };
}

const startRuntime = (runtime: RobotRunnerRuntime) => {
  return undefined;
}

const RobotRunState = {
  STOP: 0,
  START: 1,
}

const useRobotRunner = () => {
  const [runtime, setRuntime] = React.useState<RobotRunnerRuntime | null>(null);
  const [runState, setRunState] = React.useState(0);

  React.useEffect(() => {
    if (runtime && runtime.robot.current) {
      setRunState(RobotRunState.START);
      let timer =  startRuntime(runtime);
      return ()=>{
        clearInterval(timer);
        setRunState(RobotRunState.STOP);
      }
    }else {
      setRunState(RobotRunState.STOP);
    }
  }, [runtime])

  return [setRuntime, runState] as [React.Dispatch<React.SetStateAction<RobotRunnerRuntime | null>>, number];
}

export default useRobotRunner;