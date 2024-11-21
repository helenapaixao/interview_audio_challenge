"use client";

import { useState } from "react";
import Header from "../components/Header";
import Countdown from "../components/Countdown";
import AudioRecorder from "../components/AudioRecorder";
import { Toaster, toast } from "sonner";
import { FaRedo, FaQuestionCircle, FaPlayCircle } from "react-icons/fa";

const questions = [
  "Fale sobre um projeto que você liderou.",
  "Como você lida com situações de pressão?",
  "Qual foi sua maior conquista profissional?",
  "O que é um estado em React e como ele funciona?",
  "Explique a diferença entre props e state em React.",
  "O que são hooks no React e como eles melhoraram a biblioteca?",
  "Você já utilizou useEffect? Explique como ele funciona e cite um exemplo.",
  "Como o TypeScript ajuda no desenvolvimento de aplicações React?",
  "Explique como funciona o sistema de tipagem no TypeScript.",
  "Qual a diferença entre interface e type em TypeScript?",
  "Como você define tipos para componentes em React com TypeScript?",
  "O que é memoization e como useMemo pode ser útil em React?",
  "Explique o conceito de lifting state up no React.",
  "Como funciona o Context API no React e para que ele é usado?",
  "O que é React Router e como ele ajuda na criação de SPA?",
  "Explique como gerenciar estados globais em uma aplicação React.",
];

const Interview = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isStartModalOpen, setIsStartModalOpen] = useState(true);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

  const handleSaveRecording = (url: string) => {
    setAudioUrl(url);
    toast.success("Gravação salva!");
  };

  const handleNextQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const currentTimestamp = new Date().toLocaleString();

    const existingRecordings = JSON.parse(localStorage.getItem("recordings") || "[]");

    const updatedRecordings = [
      ...existingRecordings,
      {
        question: currentQuestion,
        audioUrl: audioUrl || "Sem áudio gravado",
        timestamp: currentTimestamp,
      },
    ];

    localStorage.setItem("recordings", JSON.stringify(updatedRecordings));

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setAudioUrl(null);
      setIsTimerActive(true);
      toast("Próxima pergunta!", {
        description: "Prepare-se para gravar sua resposta.",
      });
    } else {
      setIsCompleteModalOpen(true);
    }
  };

  const startInterview = () => {
    setIsStartModalOpen(false);
    setIsTimerActive(true);
    setCurrentQuestionIndex(0); 
  };

  const restartInterview = () => {
    setIsCompleteModalOpen(false);
    startInterview();
    toast.info("Entrevista reiniciada. Boa sorte!");
  };

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto p-4">
        {isStartModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-md shadow-lg max-w-sm w-full">
              <h2 className="text-2xl font-bold text-blue-800 text-center">
                <FaQuestionCircle className="inline mr-2" />
                Iniciar Entrevista
              </h2>
              <p className="text-gray-600 text-center mt-4">
                Deseja começar a entrevista? O contador será iniciado e a primeira pergunta será exibida.
              </p>
              <p className="text-gray-600 text-center mt-2">
                Não se esqueça de clicar no botão <span className="font-bold text-blue-600">"Gravar"</span> para salvar sua resposta.
              </p>
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setIsStartModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 flex items-center"
                >
                  Cancelar
                </button>
                <button
                  onClick={startInterview}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
                >
                  <FaPlayCircle className="mr-2" />
                  Começar
                </button>
              </div>
            </div>
          </div>
        )}

        {isCompleteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-md shadow-lg max-w-sm w-full">
              <h2 className="text-2xl font-bold text-blue-800 text-center">
                🎉 Parabéns!
              </h2>
              <p className="text-gray-600 text-center mt-4">
                Você respondeu a todas as perguntas disponíveis. Deseja refazer a entrevista?
              </p>
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setIsCompleteModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 flex items-center"
                >
                  Fechar
                </button>
                <button
                  onClick={restartInterview}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
                >
                  <FaRedo className="mr-2" />
                  Refazer
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mt-20">
          <h1 className="text-3xl font-bold text-blue-800 mb-8">🎤 Entrevista</h1>
          <p className="text-lg text-gray-600 mb-6">
            Responda às perguntas gravando suas respostas em áudio.
          </p>
        </div>

        {!isStartModalOpen && !isCompleteModalOpen && (
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold">Pergunta:</h2>
            <p className="text-lg mt-4">{questions[currentQuestionIndex]}</p>

            <div className="mt-6">
              <Countdown
                key={currentQuestionIndex}
                duration={30}
                onComplete={() => {
                  setIsTimerActive(false);
                  toast.warning("Tempo esgotado! Salvando pergunta.");
                  handleNextQuestion();
                }}
              />
            </div>

            <div className="mt-6">
              <AudioRecorder
                onStop={handleSaveRecording}
                canRecord={isTimerActive}
                isReRecording={!!audioUrl}
              />
            </div>
          </div>
        )}
      </div>

      <Toaster position="top-right" richColors />
    </>
  );
};

export default Interview;
