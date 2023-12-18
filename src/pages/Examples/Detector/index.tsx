import React, { useCallback, useEffect, useRef, useState } from "react";
import { VisualDetector, DetectedObject } from "../../../../packages/tensorflow";
import TargetView from "../../../components/TargetView";

export default function Detector() {
  const detector = new VisualDetector();
  const $videoContainer = useRef<HTMLDivElement>(null);
  const [objects, setObjects] = useState<DetectedObject[]>([]);
  const [isShow, setIsShow] = useState<boolean>(false);

  const handleDetect = useCallback(() => {
    if(detector.$video && detector._$video) {
      $videoContainer.current?.appendChild(detector.$video);
    }
    detector.start((objects) => {
      setObjects(objects);
    });
  },[$videoContainer]);

  useEffect(() => {
    const init = async () => {
      // await detector.load({ width: 640, height: 480 });
      await detector.load({ width: window.innerWidth, height: window.innerHeight });
      setIsShow(true);
    }
    init();

    return () => {
      detector.stop();
    }
  },[]);


  return (
    <div>
      { isShow && <button onClick={handleDetect}>start detect</button>}
      <TargetView
        ref={$videoContainer}
        objects={objects.filter(obj => obj.class === 'person')}
        opacity={0.6}
      />
    </div>
  )
}
