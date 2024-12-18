"use client";

import Header from "../components/Header";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { FaTrashAlt, FaChevronDown, FaHistory } from "react-icons/fa";
import { FaRegSun } from "react-icons/fa6";

interface Recording {
  question: string;
  audioUrl: string | null;
  timestamp: string;
}

const PAGE_SIZE = 5;

const History = () => {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [filteredRecordings, setFilteredRecordings] = useState<Recording[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [deleteDate, setDeleteDate] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const storedRecordings = JSON.parse(
      localStorage.getItem("recordings") || "[]"
    );
    setRecordings(storedRecordings);
    setFilteredRecordings(storedRecordings);
  }, []);

  const handleFilter = () => {
    let results = recordings;

    if (searchQuery) {
      results = results.filter((recording) =>
        recording.question.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (searchDate) {
      results = results.filter((recording) => {
        const recordingDate = recording.timestamp.split(" ")[0];
        return recordingDate === searchDate.split("-").reverse().join("/");
      });
    }

    setFilteredRecordings(results);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSearchDate("");
    setFilteredRecordings(recordings);
    setCurrentPage(1);
  };

  const handleDeleteByDate = () => {
    if (!deleteDate) {
      toast.error("Selecione uma data para excluir as gravações.");
      return;
    }

    const formattedDate = deleteDate.split("-").reverse().join("/");
    const updatedRecordings = recordings.filter(
      (recording) => !recording.timestamp.startsWith(formattedDate)
    );

    setRecordings(updatedRecordings);
    setFilteredRecordings(updatedRecordings);
    localStorage.setItem("recordings", JSON.stringify(updatedRecordings));

    toast.success(`Gravações da data ${formattedDate} foram excluídas.`);
  };

  const handleDeleteRecording = (index: number) => {
    const updatedRecordings = recordings.filter((_, i) => i !== index);
    setRecordings(updatedRecordings);
    setFilteredRecordings(updatedRecordings);
    localStorage.setItem("recordings", JSON.stringify(updatedRecordings));
    toast.success("Gravação excluída com sucesso!");
  };

  const paginatedRecordings = filteredRecordings.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const totalPages = Math.ceil(filteredRecordings.length / PAGE_SIZE);

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center mt-12">
          <h1 className="text-3xl font-extrabold text-blue-700 mb-4 flex items-center justify-center">
            <FaHistory className="text-blue-500 mr-2" />
            Histórico de Gravações
          </h1>
          <p className="text-lg text-gray-600">
            Aqui estão as respostas que você já gravou. Você pode reproduzi-las
            ou verificar as informações relacionadas.
          </p>
        </div>

        <div className="relative mt-6">
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md flex items-center hover:bg-blue-600 transition"
            type="button"
          >
            <FaRegSun className="mr-2" />
            Configurações
            <FaChevronDown className="ml-2" />
          </button>
          {isMenuOpen && (
            <div className="absolute bg-white shadow-lg rounded-md mt-2 w-full max-w-md z-10">
              <div className="p-4 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">
                    Filtros
                  </h3>
                  <input
                    type="text"
                    placeholder="Buscar por pergunta"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300 mt-2 text-gray-800 placeholder-gray-500"
                  />
                  <input
                    type="date"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                    className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300 mt-2 text-gray-800"
                  />
                  <div className="flex space-x-4 mt-2">
                    <button
                      onClick={handleFilter}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                      type="button"
                    >
                      Aplicar Filtros
                    </button>
                    <button
                      onClick={resetFilters}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition"
                      type="button"
                    >
                      Limpar Filtros
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-red-500">
                    Deletar por Data
                  </h3>
                  <input
                    type="date"
                    value={deleteDate}
                    onChange={(e) => setDeleteDate(e.target.value)}
                    className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-red-300 mt-2 text-gray-800"
                  />
                  <button
                    onClick={handleDeleteByDate}
                    className="bg-red-500 text-white px-4 py-2 rounded-md w-full mt-2 hover:bg-red-600 transition flex items-center justify-center"
                    type="button"
                  >
                    <FaTrashAlt className="mr-2" />
                    Excluir Gravações
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <main className="mt-8">
          {paginatedRecordings.length === 0 ? (
            <div className="flex items-center justify-center h-96">
              <p className="text-center text-gray-600">
                Nenhuma gravação encontrada. Ajuste os filtros ou responda novas
                perguntas.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200 mb-6">
              <table className="w-full table-auto">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">
                      Pergunta
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">Áudio</th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Data e Horário
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRecordings.map((recording, index) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-gray-100 transition duration-200`}
                    >
                      <td className="px-6 py-4 text-gray-800 font-medium break-words max-w-xs">
                        {recording.question}
                      </td>
                      <td className="px-6 py-4 flex justify-center items-center">
                        {recording.audioUrl === "Sem áudio gravado" ? (
                          <span className="text-red-500 font-semibold">
                            Áudio precisa ser gravado
                          </span>
                        ) : (
                          <audio
                            src={recording.audioUrl ?? undefined}
                            controls
                            className="max-w-lg sm:max-w-md md:max-w-lg lg:max-w-xl h-14 rounded-lg shadow-sm border"
                          >
                            <track
                              kind="captions"
                              srcLang="en"
                              label="English"
                            />
                            Seu navegador não suporta o elemento de áudio.
                          </audio>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {recording.timestamp}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDeleteRecording(index)}
                          className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition flex items-center"
                          type="button"
                        >
                          <FaTrashAlt className="mr-2" />
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="flex justify-center items-center space-x-4">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-md ${
                  currentPage === page
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                }`}
                type="button"
              >
                {page}
              </button>
            ))}
          </div>
        </main>
      </div>
      <Toaster position="top-right" richColors />
    </>
  );
};

export default History;
