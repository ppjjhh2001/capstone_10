// src/App.jsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import QuizPage from './pages/QuizPage';
import ResultPage from './pages/ResultPage';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {}
        <Route path="/" element={<MainPage />} />

        <Route path="/about" element={<AboutPage/>} />
        <Route path="/quiz/:questionId" element={<QuizPage/>} />
        <Route path="/result/:mbtiType" element={<ResultPage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;