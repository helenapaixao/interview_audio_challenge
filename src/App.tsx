import { Link } from "react-router-dom";

function App() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col items-center justify-center text-gray-800">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-blue-700">
            🎤 Bem-vindo ao Sistema de Entrevistas
          </h1>
          <p className="text-lg mt-4 text-gray-600">
            Gerencie entrevistas online com facilidade! Grave, regrave e
            acompanhe o progresso das respostas.
          </p>
        </header>

        <div className="flex space-x-6">
          <Link
            to="/interview"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            Iniciar Entrevista
          </Link>
          <Link
            to="/history"
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg shadow-md hover:bg-gray-300 transition"
          >
            Ver Histórico
          </Link>
        </div>
      </div>
      <footer className="mt-auto py-4 text-center text-sm text-gray-500">
        <p>
          Feito com <span className="text-red-500">❤️</span> por{" "}
          <a
            href="https://www.linkedin.com/in/helenapaixao/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Helena Paixão
          </a>
        </p>
      </footer>
    </>
  );
}

export default App;
