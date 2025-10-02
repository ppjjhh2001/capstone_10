import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { questions } from '../data/mbtiData.js';

function QuizPage() {
  const navigate = useNavigate();
  const { questionId } = useParams();
  const currentQuestionId = parseInt(questionId);

  const location = useLocation();
  const [userAnswers, setUserAnswers] = useState(location.state?.answers || []);

  const questionData = questions[currentQuestionId - 1];


  const handleOptionClick = (type) => {
    // 1. 버튼 클릭이 잘 되는지 확인
    console.log(`✅ ----------------------------------`);
    console.log(`현재 질문 ID: ${currentQuestionId}`);
    console.log(`클릭! 선택된 타입: ${type}`);

    const newAnswers = [...userAnswers, type];
    setUserAnswers(newAnswers);

    // 2. 답변이 정상적으로 쌓이는지 확인
    console.log(`현재까지의 답변 (${newAnswers.length}개):`, newAnswers);

    // 3. 마지막 질문인지 아닌지 확인
    if (currentQuestionId < questions.length) {
      console.log("아직 질문이 남았습니다. 다음 질문으로 넘어갑니다.");
      navigate(`/quiz/${currentQuestionId + 1}`, {
        state: { answers: newAnswers }
      });
    } else {
      console.log("🚩 마지막 질문입니다! 결과 계산을 시작합니다.");

      const finalType = calculateResult(newAnswers);
      
      // 4. MBTI 타입이 정상적으로 계산되었는지 확인
      console.log(`계산된 최종 MBTI 타입: ${finalType}`);

      // 5. 결과 페이지로
      if (finalType) {
        console.log(`결과 페이지(/result/${finalType})로 이동합니다!`);
        navigate(`/result/${finalType}`);
      } else {
        console.error("🚨 오류: 최종 MBTI 타입이 계산되지 않았습니다!");
      }
    }
  };

  const calculateResult = (answers) => {
    const counts = { R: 0, A: 0, S: 0, U: 0, C: 0, E: 0, P: 0, J: 0 };
    answers.forEach(type => {
      counts[type]++;
    });
    
    let result = "";
    result += counts.R > counts.A ? 'R' : 'A';
    result += counts.S > counts.U ? 'S' : 'U';
    result += counts.C > counts.E ? 'C' : 'E';
    result += counts.P > counts.J ? 'P' : 'J';
    
    return result;
  };
  
  const progress = (currentQuestionId / questions.length) * 100;

  return (
    <div style={styles.container}>
      <div style={styles.progressBarContainer}>
        <div style={{...styles.progressBar, width: `${progress}%`}}></div>
      </div>
      
      <div style={styles.questionContainer}>
        <h2 style={styles.questionNumber}>Q{currentQuestionId}.</h2>
        <p style={styles.questionText}>{questionData.question}</p>
      </div>

      <div style={styles.optionsContainer}>
        <button 
          style={styles.optionButton}
          onClick={() => handleOptionClick(questionData.options[0].type)}
        >
          {questionData.options[0].text}
        </button>
        <button 
          style={styles.optionButton}
          onClick={() => handleOptionClick(questionData.options[1].type)}
        >
          {questionData.options[1].text}
        </button>
      </div>
    </div>
  );
}

// styles
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f8f9fa',
        padding: '20px'
    },
    progressBarContainer: {
        width: '80%',
        maxWidth: '600px',
        height: '10px',
        backgroundColor: '#e9ecef',
        borderRadius: '5px',
        marginBottom: '40px'
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#007bff',
        borderRadius: '5px',
        transition: 'width 0.5s ease-in-out'
    },
    questionContainer: {
        textAlign: 'center',
        marginBottom: '40px',
    },
    questionNumber: {
        fontSize: '2rem',
        color: '#007bff',
    },
    questionText: {
        fontSize: '1.8rem',
        color: '#343a40',
        lineHeight: '1.6'
    },
    optionsContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '80%',
        maxWidth: '600px',
    },
    optionButton: {
        padding: '20px',
        fontSize: '1.2rem',
        backgroundColor: '#fff',
        border: '2px solid #dee2e6',
        borderRadius: '12px',
        marginBottom: '15px',
        cursor: 'pointer',
        transition: 'background-color 0.2s, transform 0.2s',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
    }
};


export default QuizPage;