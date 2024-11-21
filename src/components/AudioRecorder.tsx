"use client";

import { useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { Toaster, toast } from "sonner";

interface AudioRecorderProps {
  question: string;
  onStop: (audioUrl: string) => void;
  canRecord: boolean;
  isReRecording: boolean;
}

const AudioRecorder = ({
  question,
  onStop,
  canRecord,
  isReRecording,
}: AudioRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);

  const { startRecording, stopRecording } = useReactMediaRecorder({
    audio: true,
    onStop: (blobUrl, blob) => {
      if (blobUrl) {
        const persistentUrl = URL.createObjectURL(blob);

        const recordings = JSON.parse(localStorage.getItem("recordings") || "[]");
        const newRecording = {
          question,
          audioUrl: persistentUrl,
          timestamp: new Date().toLocaleString(),
        };
        localStorage.setItem(
          "recordings",
          JSON.stringify([...recordings, newRecording])
        );

        onStop(persistentUrl);
        setIsRecording(false);
        toast.success(isReRecording ? "Regravação salva!" : "Gravação salva!");
      } else {
        toast.error("Erro ao salvar áudio. Tente novamente.");
      }
    },
  });

  const handleStartRecording = () => {
    if (!canRecord) {
      toast.error("O tempo acabou! Você não pode gravar.");
      return;
    }
    if (isRecording) {
      toast.error("A gravação já foi iniciada!");
      return;
    }
    setIsRecording(true);
    startRecording();
    toast(isReRecording ? "Regravação iniciada!" : "Gravação iniciada!", {
      description: "Por favor, responda à pergunta com clareza.",
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
        type="button"
      >
        {isReRecording ? "🔄 Regravar" : "🎙️ Gravar"}
      </button>

      {isRecording && (
        <button
          onClick={handleStopRecording}
          className="relative px-6 py-3 font-semibold text-white bg-gray-200 hover:bg-gray-300 rounded-lg shadow-md transition-transform duration-300 transform hover:scale-105 flex items-center justify-center"
           type="button"
        >
          <div className="flex items-center space-x-4">
            <div className="relative">
              <span className="absolute inset-0 h-4 w-4 bg-red-500 rounded-full animate-ping" />
              <span className="relative h-4 w-4 bg-red-600 rounded-full"/>
            </div>
            <span className="text-gray-800">Parar e Salvar a Gravação</span>
          </div>
        </button>
      )}

      <Toaster position="top-right" richColors />
    </div>
  );
};

export default AudioRecorder;
