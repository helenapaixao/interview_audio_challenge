"use client";

import { useState } from "react";
import Header from "../components/Header";
import Countdown from "../components/Countdown";
import AudioRecorder from "../components/AudioRecorder";
import { Toaster, toast } from "sonner";
import { FaMicrophone,FaQuestionCircle, FaPlayCircle} from "react-icons/fa";
import questions from "../utils/questions.json"



const Interview = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);

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
      toast.success("Você completou todas as perguntas!", { position: "top-right" });
    }
  };

  const startInterview = () => {
    setIsModalOpen(false);
    setIsTimerActive(true);
  };

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto p-4">
        {isModalOpen && (
       <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
       <div className="bg-white p-6 rounded-md shadow-lg max-w-sm w-full">
         <h2 className="text-2xl font-bold text-blue-800 text-center">
           <FaQuestionCircle className="inline mr-2" /> Iniciar Entrevista
         </h2>
         <p className="text-gray-600 text-center mt-4">
           Deseja começar a entrevista? O contador será iniciado e a primeira pergunta será exibida.
         </p>
         <p className="text-gray-600 text-center mt-2">
           Não se esqueça de clicar no botão{" "}
           <span className="font-bold text-blue-600">"Gravar"</span> para salvar sua resposta.
         </p>
         <div className="mt-8 flex justify-center">
           <button
             onClick={startInterview}
             className="w-full max-w-[200px] px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center text-xl"
             type="button"
           >
             <FaPlayCircle className="mr-2" />
             Começar
           </button>
         </div>
       </div>
     </div>
     
        )}

        <div className="text-center mt-20">
          <h1 className="text-3xl font-bold text-blue-800 mb-8 flex items-center justify-center">
          <FaMicrophone className="mr-2 text-blue-600" />  Entrevista
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Responda às perguntas gravando suas respostas em áudio.
          </p>
        </div>

        {!isModalOpen && (
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold flex items-center">
              <FaMicrophone className="mr-2 text-blue-600" /> Pergunta:
            </h2>
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
                question={questions[currentQuestionIndex]} 
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
