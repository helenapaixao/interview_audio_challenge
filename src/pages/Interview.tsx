"use client";

import { useEffect, useState } from "react";
import Header from "../components/Header";
import Countdown from "../components/Countdown";
import AudioRecorder from "../components/AudioRecorder";
import { Toaster, toast } from "sonner";

const questions = [
  "Você já utilizou useEffect? Explique como ele funciona e cite um exemplo.",
  "Como o TypeScript ajuda no desenvolvimento de aplicações React?",
  "Explique como funciona o sistema de tipagem no TypeScript.",
];

const Interview = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isStartModalOpen, setIsStartModalOpen] = useState(true);

  useEffect(() => {
    const storedRecordings = JSON.parse(
      localStorage.getItem("recordings") || "[]"
    );

    const answeredQuestions = storedRecordings.map(
      (recording: { question: string }) => recording.question
    );
    const firstUnansweredIndex = questions.findIndex(
      (question) => !answeredQuestions.includes(question)
    );

    setCurrentQuestionIndex(
      firstUnansweredIndex >= 0 ? firstUnansweredIndex : questions.length
    );
  }, []);

  const handleSaveRecording = (url: string) => {
    setAudioUrl(url);
    toast.success("Gravação salva!");
  };

  const handleNextQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const existingRecordings = JSON.parse(
      localStorage.getItem("recordings") || "[]"
    );

    const updatedRecordings = [
      ...existingRecordings,
      {
        question: currentQuestion,
        audioUrl: audioUrl || "Sem áudio gravado",
        timestamp: new Date().toLocaleString(),
      },
    ];

    localStorage.setItem("recordings", JSON.stringify(updatedRecordings));

    if (currentQuestionIndex < questions.length - 1) {
      const nextQuestionIndex = questions.findIndex(
        (q, idx) =>
          idx > currentQuestionIndex &&
          !updatedRecordings.some((recording) => recording.question === q)
      );

      setCurrentQuestionIndex(
        nextQuestionIndex !== -1 ? nextQuestionIndex : questions.length
      );
      setAudioUrl(null);
      setIsTimerActive(true);
      toast("Próxima pergunta!", {
        description: "Prepare-se para gravar sua resposta.",
      });
    } else {
      toast.success("Você completou todas as perguntas!");
    }
  };

  const startInterview = () => {
    setIsStartModalOpen(false);
    setIsTimerActive(true);
  };

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto p-4">
        {isStartModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-md shadow-lg max-w-sm w-full">
              <h2 className="text-2xl font-bold text-blue-800 text-center">
                Iniciar Entrevista
              </h2>
              <p className="text-gray-600 text-center mt-4">
                Deseja começar a entrevista? A primeira pergunta será exibida.
              </p>
              <button
                onClick={startInterview}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mt-6 mx-auto block"
              >
                Começar
              </button>
            </div>
          </div>
        )}

        {!isStartModalOpen && currentQuestionIndex < questions.length && (
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold">Pergunta:</h2>
            <p className="text-lg mt-4">{questions[currentQuestionIndex]}</p>

            <Countdown
              key={currentQuestionIndex}
              duration={30}
              onComplete={() => {
                setIsTimerActive(false);
                toast.warning("Tempo esgotado! Salvando pergunta.");
                handleNextQuestion();
              }}
            />

            <AudioRecorder
              question={questions[currentQuestionIndex]}
              onStop={handleSaveRecording}
              canRecord={isTimerActive}
              isReRecording={!!audioUrl}
            />
          </div>
        )}

        {currentQuestionIndex >= questions.length && (
          <div className="text-center mt-20">
            <h2 className="text-xl font-bold text-green-600">
              🎉 Todas as perguntas foram respondidas!
            </h2>
            <p className="text-gray-600 mt-4">
              Você pode revisar ou apagar as gravações no histórico para
              responder novamente.
            </p>
          </div>
        )}
      </div>
      <Toaster position="top-right" richColors />
    </>
  );
};

export default Interview;
