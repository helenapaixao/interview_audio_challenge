"use client";

import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { Toaster, toast } from "sonner";
import { FaClock } from "react-icons/fa";

interface CountdownProps {
  duration: number;
  colors?: string[];
  colorsTime?: number[];
  onComplete: () => void;
}


const Countdown = ({
  duration,
  onComplete,
}: CountdownProps) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <CountdownCircleTimer
          isPlaying
          duration={duration}
           colors="#A30000"
          size={120} 
          strokeWidth={8} 
          onComplete={() => {
            toast.success("Tempo terminou!");
            onComplete();
            return { shouldRepeat: false };
          }}
        >
          {({ remainingTime }: { remainingTime: number }) => (
            <div className="flex items-center space-x-2 text-2xl font-bold">
              <FaClock className="text-blue-500" />
              <span className="text-gray-300">{remainingTime}s</span> 
            </div>
          )}
        </CountdownCircleTimer>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
};

export default Countdown;
