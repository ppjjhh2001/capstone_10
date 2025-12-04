import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function Header() {
  const { isLoggedIn, user, logout } = useAuth();

  const getRoleName = (role) => {
    if (role === 'employer') return '사장님';
    if (role === 'seeker') return '알바님';
    return '회원';
  };

  return (
    <header style={styles.header}>

      <div style={styles.headerLeft}>
        <Link to="/" style={styles.logo}>
          Re:Town
        </Link>
        <nav style={styles.mainNav}>
          <Link to="/regional" style={styles.navLink}>
            지역 명소
          </Link>
          <Link to="/jobs" style={styles.navLink}>
            돈 벌면서 여행하기
          </Link>
        </nav>
      </div>

      <nav style={styles.authNav}>
        {isLoggedIn ? (
          <>
            <span style={styles.welcomeMessage}>
              [{getRoleName(user.role)}] {user.email}님
            </span>
            <Link to="/mypage" style={styles.navLink}>
              마이페이지
            </Link>
            <button onClick={logout} style={styles.navLinkButton}>
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.navLink}>
              로그인
            </Link>
            <Link to="/signup" style={styles.navLink}>
              회원가입
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#fff',
    borderBottom: '1px solid #dee2e6',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#343a40',
    textDecoration: 'none',
  },
  mainNav: {
    display: 'flex',
    gap: '1rem',
  },
  authNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  navLink: {
    textDecoration: 'none',
    color: '#007bff',
    fontWeight: '500',
    padding: '0.5rem',
  },
  navLinkButton: {
    textDecoration: 'none',
    color: '#007bff',
    fontWeight: '500',
    padding: '0.5rem',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  welcomeMessage: {
    color: '#495057',
    marginRight: '0.5rem',
  },
};

export default Header;