import React, { useEffect, useRef } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import approveAnimationData from "./approve-tick.json";
import pendingAnimationData from "./pending.json";
import rejectedAnimationData from "./rejected.json";
import homeAnimationData from "./Home.json";
import winnerAnimationData from "./Trophy.json";

interface SectionAnimProps {
  type: "pending" | "approved" | "rejected" | "home" | "winner";
  shouldPlay?: boolean;
  showLastFrame?: boolean;
}

const SectionAnim: React.FC<SectionAnimProps> = ({
  type,
  shouldPlay = false,
  showLastFrame = false,
}) => {
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  const animationData =
    type === "approved"
    ? approveAnimationData
    : type === "rejected"
    ? rejectedAnimationData
    : type === "home"
    ? homeAnimationData
    : type === "winner"
    ? winnerAnimationData
    : pendingAnimationData;

  useEffect(() => {
    if (lottieRef.current) {
      if (shouldPlay) {
        lottieRef.current.stop();
        lottieRef.current.play();
      } else if (showLastFrame) {
        const lastFrame = animationData.op ?? 100;
        lottieRef.current.goToAndStop(lastFrame, true);
      } else {
        lottieRef.current.goToAndStop(0, true);
      }
    }
  }, [animationData.op, shouldPlay, showLastFrame, type]);

  return (
    <Lottie
      lottieRef={lottieRef}
      animationData={animationData}
      loop={false}
      autoplay={false}
      style={{ height: 35, width: 35 }}
    />
  );
};

export default SectionAnim;
