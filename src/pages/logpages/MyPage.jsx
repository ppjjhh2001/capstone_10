import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useJobs } from '../../context/JobContext.jsx';
import { useInteraction } from '../../context/InteractionContext.jsx';
import { Link } from 'react-router-dom';

function MyPage() {
  const { user, loading: authLoading } = useAuth();
  const { jobs, deleteJob, loadingJobs } = useJobs();
  const { applications, favorites } = useInteraction(); 

  const [activeTab, setActiveTab] = useState(user?.role === 'employer' ? 'jobs' : 'my-applications'); 

  if (authLoading || loadingJobs) return <div style={{ padding: '2rem', textAlign: 'center' }}>로딩 중...</div>;
  if (!user) return <div style={{ padding: '2rem', textAlign: 'center' }}>로그인이 필요합니다.</div>;

  // ---사장님 로직---
  const myJobs = jobs.filter(job => job.authorId === user.uid);
  const myJobIds = myJobs.map(job => String(job.id));
  const myApplicants = applications.filter(app => myJobIds.includes(String(app.jobId)));

  const handleDeleteJob = async (jobId) => {
    if (window.confirm("정말 공고를 삭제하시겠습니까?")) {
      await deleteJob(jobId);
    }
  };

  // ---구직자 로직---
  const myApplicationsList = applications.filter(app => app.userId === user.uid);
  const myFavoritesList = favorites.filter(fav => fav.userId === user.uid);

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h3 style={styles.sidebarTitle}>마이페이지</h3>
        <div style={styles.profileSummary}>
          <div style={styles.avatar}>{user.name ? user.name[0] : 'U'}</div>
          <div style={styles.userInfo}>
            <span style={styles.userName}>{user.name || '사용자'}님</span>
            <span style={styles.userRole}>{user.role === 'employer' ? '사장님' : '구직자'}</span>
          </div>
        </div>
        
        <nav style={styles.nav}>
          <button style={activeTab === 'profile' ? styles.activeNavItem : styles.navItem} onClick={() => setActiveTab('profile')}>내 정보</button>
          {user.role === 'employer' ? (
            <>
              <button style={activeTab === 'jobs' ? styles.activeNavItem : styles.navItem} onClick={() => setActiveTab('jobs')}>채용 공고 관리</button>
              <button style={activeTab === 'applicants' ? styles.activeNavItem : styles.navItem} onClick={() => setActiveTab('applicants')}>
                지원자 관리 {myApplicants.length > 0 && <span style={styles.badge}>{myApplicants.length}</span>}
              </button>
            </>
          ) : (
            <>
               <button style={activeTab === 'my-applications' ? styles.activeNavItem : styles.navItem} onClick={() => setActiveTab('my-applications')}>지원 내역 확인</button>
               <button style={activeTab === 'my-favorites' ? styles.activeNavItem : styles.navItem} onClick={() => setActiveTab('my-favorites')}>관심 공고 (즐겨찾기)</button>
            </>
          )}
        </nav>
      </div>

      <div style={styles.content}>
        {activeTab === 'profile' && (
          <div>
            <h2 style={styles.contentTitle}>내 정보</h2>
            <div style={styles.card}><p><strong>이메일:</strong> {user.email}</p><p><strong>이름:</strong> {user.name}</p></div>
          </div>
        )}
        {activeTab === 'jobs' && user.role === 'employer' && (
          <div>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={styles.contentTitle}>채용 공고 관리</h2>
              <Link to="/jobs/new" style={styles.createButton}>+ 새 공고 등록</Link>
            </div>
            {myJobs.length > 0 ? (
              <div style={styles.grid}>
                {myJobs.map(job => (
                  <div key={job.id} style={styles.jobCard}>
                    <h3 style={styles.jobTitle}>{job.title}</h3>
                    <p style={styles.jobDate}>{job.date}</p>
                    <div style={styles.cardActions}>
                      <Link to={`/jobs/${job.id}`} style={styles.viewLink}>상세보기</Link>
                      <div style={styles.actionButtons}>
                        <Link to={`/jobs/${job.id}/edit`} style={styles.editBtn}>수정</Link>
                        <button onClick={() => handleDeleteJob(job.id)} style={styles.deleteBtn}>삭제</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : <div style={styles.emptyState}><p>등록된 공고가 없습니다.</p></div>}
          </div>
        )}

        {activeTab === 'applicants' && user.role === 'employer' && (
          <div>
            <h2 style={styles.contentTitle}>지원자 관리</h2>
            {myApplicants.length > 0 ? (
               <ul style={styles.list}>
                 {myApplicants.map(app => {
                   const targetJob = myJobs.find(j => String(j.id) === String(app.jobId));
                   return (
                     <li key={app.id} style={styles.listItem}>
                       <div style={{flex: 1}}>
                         <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                            <div>
                              <span style={{fontSize: '1.1rem', fontWeight: 'bold'}}>{app.applicantName || '이름 없음'}</span>
                              <span style={{marginLeft: '10px', color: '#007bff'}}>📞 {app.applicantPhone || '전화번호 없음'}</span>
                            </div>
                            <span style={styles.date}>{new Date(app.appliedAt).toLocaleDateString()}</span>
                         </div>
                         
                         <div style={styles.introBox}>
                            <strong>📄 자기소개:</strong><br/>
                            {app.applicantIntro ? app.applicantIntro : <span style={{color:'#999'}}>(입력된 소개가 없습니다)</span>}
                         </div>

                         <div style={{marginTop: '8px', fontSize: '0.9rem', color: '#666'}}>
                           지원한 공고: {targetJob ? targetJob.title : `삭제된 공고 (ID: ${app.jobId})`}
                         </div>
                       </div>
                     </li>
                   );
                 })}
               </ul>
            ) : (
              <div style={styles.emptyState}><p>아직 지원자가 없습니다.</p></div>
            )}
          </div>
        )}

        {activeTab === 'my-applications' && user.role === 'seeker' && (
           <div>
             <h2 style={styles.contentTitle}>내 지원 내역</h2>
             {myApplicationsList.length > 0 ? (
               <ul style={styles.list}>
                 {myApplicationsList.map(app => {
                   const appliedJob = jobs.find(j => String(j.id) === String(app.jobId));
                   return (
                     <li key={app.id} style={styles.listItem}>
                        {appliedJob ? (
                          <div>
                            <Link to={`/jobs/${appliedJob.id}`} style={{ textDecoration: 'none', color: '#333' }}>
                              <h4 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', fontWeight: 'bold' }}>{appliedJob.title}</h4>
                            </Link>
                            <span style={{ color: '#555' }}>🏢 {appliedJob.company}</span>
                          </div>
                        ) : (
                          <span style={{ color: '#999' }}>삭제된 공고입니다. (ID: {app.jobId})</span>
                        )}
                        <div style={{ textAlign: 'right' }}>
                           <span style={styles.statusBadge}>지원완료</span><br/>
                           <span style={styles.date}>{new Date(app.appliedAt).toLocaleDateString()}</span>
                        </div>
                     </li>
                   );
                 })}
               </ul>
             ) : <div style={styles.emptyState}><p>지원한 내역이 없습니다.</p></div>}
           </div>
        )}

        {activeTab === 'my-favorites' && user.role === 'seeker' && (
           <div>
             <h2 style={styles.contentTitle}>관심 공고</h2>
             {myFavoritesList.length > 0 ? (
               <div style={styles.grid}>
                 {myFavoritesList.map(fav => {
                   const favJob = jobs.find(j => String(j.id) === String(fav.jobId));
                   if (!favJob) return null;
                   return (
                     <div key={fav.id} style={styles.jobCard}>
                       <h3 style={styles.jobTitle}>{favJob.title}</h3>
                       <p style={styles.companyName}>{favJob.company}</p>
                       <div style={styles.cardActions}>
                          <Link to={`/jobs/${favJob.id}`} style={styles.viewLink}>상세보기 &rarr;</Link>
                       </div>
                     </div>
                   );
                 })}
               </div>
             ) : <div style={styles.emptyState}><p>즐겨찾기한 공고가 없습니다.</p></div>}
           </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', minHeight: 'calc(100vh - 70px)', backgroundColor: '#f4f6f8' },
  sidebar: { width: '250px', backgroundColor: '#fff', borderRight: '1px solid #e0e0e0', padding: '2rem 1rem', display: 'flex', flexDirection: 'column' },
  sidebarTitle: { fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '2rem', color: '#333', paddingLeft: '0.5rem' },
  profileSummary: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' },
  avatar: { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#007bff', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '1.2rem' },
  userInfo: { display: 'flex', flexDirection: 'column' },
  userName: { fontWeight: 'bold', fontSize: '0.95rem' },
  userRole: { fontSize: '0.8rem', color: '#666' },
  nav: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  navItem: { padding: '0.8rem 1rem', border: 'none', backgroundColor: 'transparent', textAlign: 'left', fontSize: '1rem', color: '#555', cursor: 'pointer', borderRadius: '6px', transition: '0.2s' },
  activeNavItem: { padding: '0.8rem 1rem', border: 'none', backgroundColor: '#e3f2fd', textAlign: 'left', fontSize: '1rem', color: '#007bff', fontWeight: 'bold', cursor: 'pointer', borderRadius: '6px' },
  content: { flex: 1, padding: '3rem' },
  contentTitle: { fontSize: '1.8rem', marginBottom: '1.5rem', color: '#333' },
  card: { backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' },
  jobCard: { backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #eee', display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  jobTitle: { fontSize: '1.2rem', margin: 0 },
  companyName: { fontSize: '1rem', color: '#555', margin: 0 },
  jobDate: { fontSize: '0.9rem', color: '#888' },
  cardActions: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' },
  viewLink: { color: '#007bff', textDecoration: 'none', fontWeight: 'bold' },
  actionButtons: { display: 'flex', gap: '0.5rem' },
  editBtn: { padding: '0.4rem 0.8rem', backgroundColor: '#f0f0f0', color: '#333', textDecoration: 'none', borderRadius: '4px', fontSize: '0.9rem' },
  deleteBtn: { padding: '0.4rem 0.8rem', backgroundColor: '#fff0f0', color: '#dc3545', border: '1px solid #dc3545', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' },
  emptyState: { textAlign: 'center', padding: '4rem', backgroundColor: '#fff', borderRadius: '8px', color: '#666' },
  createButton: { display: 'inline-block', padding: '0.6rem 1.2rem', backgroundColor: '#007bff', color: '#fff', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.9rem', marginTop: '1rem' },
  list: { listStyle: 'none', padding: 0 },
  listItem: { backgroundColor: '#fff', padding: '1.5rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  badge: { backgroundColor: '#dc3545', color: 'white', borderRadius: '12px', padding: '2px 8px', fontSize: '0.75rem', marginLeft: 'auto' },
  date: { fontSize: '0.85rem', color: '#888' },
  statusBadge: { backgroundColor: '#28a745', color: 'white', fontSize: '0.8rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' },
  
  // ▼▼▼ 자기소개 스타일 추가 ▼▼▼
  introBox: { marginTop: '10px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '6px', fontSize: '0.95rem', whiteSpace: 'pre-wrap', border: '1px solid #eee' }
};

export default MyPage;