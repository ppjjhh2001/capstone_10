import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useMbti } from '../../context/MbtiContext.jsx';

function QuizPage() {
  const navigate = useNavigate();
  const { questionId } = useParams();
  const currentQuestionId = parseInt(questionId);
  
  const { mbtiQuestions, loadingMbti } = useMbti();
  const location = useLocation();
  
  const [userAnswers, setUserAnswers] = useState(location.state?.answers || []);

  if (loadingMbti || !mbtiQuestions || mbtiQuestions.length === 0) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>테스트 로딩 중...</div>;
  }

  const questionData = mbtiQuestions[currentQuestionId - 1];

  const handleOptionClick = (type) => {
    const newAnswers = [...userAnswers, type];
    setUserAnswers(newAnswers);
    
    if (currentQuestionId < mbtiQuestions.length) {
      navigate(`/quiz/${currentQuestionId + 1}`, {
        state: { answers: newAnswers }
      });
    } else {
      const finalType = calculateResult(newAnswers);
      if (finalType) {
        navigate(`/result/${finalType}`);
      }
    }
  };
  
  const calculateResult = (answers) => {
    const counts = { A: 0, R: 0, S: 0, U: 0, C: 0, E: 0, P: 0, J: 0 };
    
    answers.forEach(type => {
      if (counts[type] !== undefined) {
        counts[type]++;
      }
    });
    
    let result = "";
    

  
    result += counts.R > counts.A ? 'R' : 'A';

    result += counts.U > counts.S ? 'U' : 'S';

    result += counts.E > counts.C ? 'E' : 'C';

    result += counts.J > counts.P ? 'J' : 'P';
    
    return result;
  };


  const progress = ((currentQuestionId / mbtiQuestions.length) * 100) + '%';

  return (
    <div style={styles.container}>
        <div style={styles.progressBarContainer}>
            <div style={{ ...styles.progressBar, width: progress }}></div>
        </div>

        <div style={styles.questionContainer}>
            <h1 style={styles.questionNumber}>Q{questionData.id}</h1>
            <h2 style={styles.questionText}>{questionData.question}</h2> {/* text -> question 변경 */}
        </div>

        <div style={styles.optionsContainer}>
            {questionData.options.map((option, index) => (
                <button
                    key={index}
                    style={styles.optionButton}
                    onClick={() => handleOptionClick(option.value || option.type)} // value가 없으면 type 사용
                >
                    {option.text}
                </button>
            ))}
        </div>
    </div>
  );
}

const styles = {
    container: { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f8f9fa', padding: '20px' },
    progressBarContainer: { width: '80%', maxWidth: '600px', height: '10px', backgroundColor: '#e9ecef', borderRadius: '5px', marginBottom: '40px' },
    progressBar: { height: '100%', backgroundColor: '#007bff', borderRadius: '5px', transition: 'width 0.5s ease-in-out' },
    questionContainer: { textAlign: 'center', marginBottom: '40px' },
    questionNumber: { fontSize: '2rem', color: '#007bff' },
    questionText: { fontSize: '1.5rem', color: '#343a40', lineHeight: '1.6', maxWidth: '600px' }, // 글자 크기 조정
    optionsContainer: { display: 'flex', flexDirection: 'column', width: '80%', maxWidth: '600px', gap: '15px' },
    optionButton: { padding: '20px', fontSize: '1.1rem', border: '2px solid #e9ecef', borderRadius: '10px', backgroundColor: '#fff', cursor: 'pointer', transition: 'all 0.2s ease', color: '#495057' }
};

export default QuizPage;