import React, { useEffect, useRef, useState } from "react";
import downloadAnimationData from "./download.json";
import logoutAnimationData from "./logout.json";
import Lottie, { LottieRefCurrentProps } from "lottie-react";

interface AnimProps {
  type: "download" | "logout";
  loop?: boolean;
  autoPlay?: boolean;
  shouldPlay?: boolean;
}

const DynamicLottie: React.FC<AnimProps> = ({
  type,
  shouldPlay,
  loop,
  autoPlay,
}) => {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const [animationData, setAnimationData] = useState<unknown>();

  useEffect(() => {
    switch (type) {
      case "download":
        setAnimationData(downloadAnimationData);
        break;
      case "logout":
        setAnimationData(logoutAnimationData);
        break;
    }
  }, [type]);

  useEffect(() => {
    if (lottieRef.current && animationData) {
      if (shouldPlay) {
        lottieRef.current.stop();
        lottieRef.current.play();
      } else {
        lottieRef.current.goToAndStop(0, true);
      }
    }
  }, [shouldPlay, type, animationData]);

  return (
    <Lottie
      lottieRef={lottieRef}
      animationData={animationData}
      loop={loop ?? true}
      autoplay={autoPlay ?? true}
      className="lottie-anim download"
    />
  );
};

export default DynamicLottie;
