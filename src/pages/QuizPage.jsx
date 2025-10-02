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
    const newAnswers = [...userAnswers, type];
    setUserAnswers(newAnswers);

    if (currentQuestionId < questions.length) {
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