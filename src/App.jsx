// src/App.jsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MbtiMainPage from './pages/mbtipages/MbtiMainPage';
import QuizPage from './pages/mbtipages/QuizPage';
import ResultPage from './pages/mbtipages/ResultPage';
import AboutPage from './pages/mbtipages/AboutPage';
import MainPage from './pages/Mainpages/MainPage';
import Header from './components/Header';
import LoginPage from './pages/logpages/LoginPage';
import SignupPage from './pages/logpages/SignupPage';
import MyPage from './pages/logpages/MyPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import JobBoardPage from './pages/jobpages/JobBoardPage.jsx';
import RegionalContentPage from './pages/localpages/RegionalContentPage.jsx';
import JobPostCreatePage from './pages/jobpages/JobPostCreatePage.jsx';
import JobPostDetailPage from './pages/jobpages/JobPostDetailPage.jsx';
import JobPostEditPage from './pages/jobpages/JobPostEditPage.jsx';
import RegionalContentDetailPage from './pages/localpages/RegionalContentDetailPage.jsx';

function App() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: '70px', minHeight: 'calc(100vh - 70px)' }}>
        <Routes>
          <Route path="/" element={<MainPage/>} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route path="/jobs" element={<JobBoardPage />} />
          <Route path="/regional" element={<RegionalContentPage />} />

          <Route path="/jobs/:id" element={<JobPostDetailPage />} />

          <Route path="/regional/:id" element={<RegionalContentDetailPage />} />
          
          <Route
            path="/mypage"
            element={
              <ProtectedRoute>
                <MyPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/jobs/new"
            element={
              <ProtectedRoute requiredRole="employer">
                <JobPostCreatePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/jobs/:id/edit" // 수정
            element={
              <ProtectedRoute requiredRole="employer">
                <JobPostEditPage />
              </ProtectedRoute>
            }
          />
          <Route path="/mbti-test" element={<MbtiMainPage/>} />
          <Route path="/about" element={<AboutPage/>} />
          <Route path="/quiz/:questionId" element={<QuizPage/>} />
          <Route path="/result/:mbtiType" element={<ResultPage/>} />
        </Routes>
      </main>
    </>
  );
}

export default App;