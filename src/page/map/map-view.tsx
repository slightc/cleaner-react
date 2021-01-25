import React from 'react';
// import styles from './map.module.scss';

const MapView: React.FC<{}> = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    console.log(canvasRef.current?.getContext("2d"));
  }, []);

  return (
    <canvas ref={canvasRef} />
  );
}

export default MapView;
