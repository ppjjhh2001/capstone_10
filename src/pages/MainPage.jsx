import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import mainImage from '../assets/main-image.png'; //main image

function MainPage() {
  const navigate = useNavigate();
  const handleStart = () => {
    navigate('/quiz/1');
  };

  return (
    <div style={styles.container}>
      {}
      <img src={mainImage} alt="여행 메인 이미지" style={styles.mainImage} />
      
      <h1 style={styles.title}>나의 여행 MBTI 찾기</h1>
      
      <p style={styles.subtitle}>
        간단한 테스트를 통해<br />
        나에게 꼭 맞는 숨겨진 여행지를 찾아보세요!
      </p>
      
      <button onClick={handleStart} style={styles.button}>
        테스트 시작하기
      </button>
      {}
      <Link to="/about" style={styles.aboutLink}>
        여행 MBTI가 뭔가요?
      </Link>
    </div>
  );
}

//css
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f8f9fa',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif'
  },
  mainImage: {
    width: '200px',
    marginBottom: '20px',
    borderRadius: '10px'
  },
  title: {
    fontSize: '2.5rem',
    color: '#343a40',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#6c757d',
    marginBottom: '30px',
    lineHeight: '1.6'
  },
  button: {
    padding: '15px 30px',
    fontSize: '1.2rem',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s',
  },
  aboutLink: {
    marginTop: '20px',
    color: '#6c757d',
    textDecoration: 'none',
    fontSize: '1rem',
  }
};

export default MainPage;