"use client";

import { useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { Toaster, toast } from "sonner";

interface AudioRecorderProps {
  onStop: (audioUrl: string) => void;
  canRecord: boolean; 
  isReRecording: boolean; 
}

const AudioRecorder = ({ onStop, canRecord, isReRecording }: AudioRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false); 

  const { startRecording, stopRecording } = useReactMediaRecorder({
    audio: true,
    onStop: (blobUrl) => {
      if (blobUrl) {
        onStop(blobUrl);
        setIsRecording(false); 
        toast.success(isReRecording ? "Regravação salva!" : "Gravação salva!");
      }
    },
  });

  const handleStartRecording = () => {
    if (!canRecord) {
      toast.error("O tempo acabou! Você não pode regravar.");
      return;
    }
    if (isRecording) {
      toast.error("A gravação já foi iniciada!");
      return;
    }
    setIsRecording(true); 
    startRecording();
    toast(isReRecording ? "Regravação iniciada!" : "Gravação iniciada!", {
      description: "Por favor, responda a pergunta com clareza.",
    });
  };

  const handleStopRecording = () => {
    stopRecording();
    setIsRecording(false); 
  };

  return (
    <div className="text-center space-y-6">
      <button
        onClick={handleStartRecording}
        className={`px-6 py-3 font-semibold text-white ${
          canRecord
            ? "bg-blue-500 hover:bg-blue-600"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        } rounded-lg shadow-md transition-transform duration-300 transform hover:scale-105`}
        disabled={!canRecord}
      >
        {isReRecording ? "🔄 Regravar" : "🎙️ Gravar"}
      </button>

      {isRecording && (
        <button
          onClick={handleStopRecording}
          className="relative px-6 py-3 font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg shadow-md transition-transform duration-300 transform hover:scale-105 flex items-center justify-center"
        >
          <div className="flex items-center space-x-4">
            <div className="relative">
              <span className="absolute inset-0 h-5 w-5 bg-red-500 rounded-full animate-ping"></span>
              <span className="relative h-5 w-5 bg-red-600 rounded-full"></span>
            </div>
            <span>Parar Gravação</span>
          </div>
        </button>
      )}

      <Toaster position="top-right" richColors />
    </div>
  );
};

export default AudioRecorder;
