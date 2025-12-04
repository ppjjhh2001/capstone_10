import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx'; 

function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('seeker');
  
  const [phone, setPhone] = useState('');
  const [businessNumber, setBusinessNumber] = useState('');
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (password.length < 6) {
      alert('비밀번호는 6자리 이상이어야 합니다.');
      return;
    }

    await signup(email, password, role, phone, businessNumber);
  };

  return (
    <div style={styles.authContainer}>
      <form onSubmit={handleSubmit} style={styles.authForm}>
        <h2>회원가입</h2>

        <div style={styles.inputGroup}>
          <label style={styles.label}>가입 유형</label>
          <div style={styles.radioGroup}>
            <label style={styles.radioLabel}>
              <input type="radio" name="role" value="seeker" checked={role === 'seeker'} onChange={(e) => setRole(e.target.value)} />
              알바님 (구직)
            </label>
            <label style={styles.radioLabel}>
              <input type="radio" name="role" value="employer" checked={role === 'employer'} onChange={(e) => setRole(e.target.value)} />
              사장님 (구인)
            </label>
          </div>
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="email" style={styles.label}>이메일 (아이디)</label>
          <input 
            id="email" 
            type="email"
            placeholder="example@example.com"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            style={styles.input} 
            required 
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="password" style={styles.label}>비밀번호 (6자리 이상)</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} required />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="confirmPassword" style={styles.label}>비밀번호 확인</label>
          <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={styles.input} required />
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="phone" style={styles.label}>휴대폰 번호 (인증)</label>
          <input 
            id="phone" 
            type="tel" 
            placeholder="010-0000-0000"
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            style={styles.input} 
            required 
          />
        </div>

        {role === 'employer' && (
          <div style={styles.inputGroup}>
            <label htmlFor="businessNumber" style={styles.label}>사업자등록번호 (인증)</label>
            <input 
              id="businessNumber" 
              type="text" 
              placeholder="000-00-00000"
              value={businessNumber} 
              onChange={(e) => setBusinessNumber(e.target.value)} 
              style={styles.input} 
              required 
            />
          </div>
        )}


        <button type="submit" style={styles.submitButton}>
          가입하기
        </button>
        <p style={styles.toggleLink}>
          이미 계정이 있으신가요? <Link to="/login">로그인</Link>
        </p>
      </form>
    </div>
  );
}


const styles = {
  authContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4rem 2rem', backgroundColor: '#f8f9fa' },
  authForm: { width: '100%', maxWidth: '400px', padding: '2rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
  inputGroup: { marginBottom: '1rem' },
  label: { display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' },
  input: { width: '100%', padding: '0.75rem', border: '1px solid #ced4da', borderRadius: '4px', boxSizing: 'border-box' },
  submitButton: { width: '100%', padding: '0.75rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' },
  toggleLink: { textAlign: 'center', marginTop: '1rem' },
  radioGroup: { display: 'flex', gap: '1rem' },
  radioLabel: { display: 'flex', alignItems: 'center', gap: '0.25rem' }
};

export default SignupPage;