import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Navigate, Link, useNavigate } from 'react-router-dom';
import { useJobs } from '../../context/JobContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useInteraction } from '../../context/InteractionContext.jsx'; 
import { useTourist } from '../../context/TouristContext.jsx';
import KakaoMapDisplay from '../../components/KakaoMapDisplay.jsx';
import ContentCard from '../../components/ContentCard.jsx';
import { getDistanceFromLatLonInKm } from '../../utils/distance.js';
import { getCoordsByAddress } from '../../utils/geocoder.js';

function JobPostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { getJobById, deleteJob, loadingJobs } = useJobs();
  const { user } = useAuth();
  const { addApplication, addFavorite, removeFavorite, hasApplied, isFavorited } = useInteraction();
  const { spots, loadingSpots } = useTourist();
  
  const [isInteracting, setIsInteracting] = useState(false);
  const [jobCoords, setJobCoords] = useState(null);
  
  const [convertedSpots, setConvertedSpots] = useState([]);
  
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyForm, setApplyForm] = useState({ name: '', phone: '', intro: '' });

  const job = getJobById(id);

  useEffect(() => {
    const setLocation = async () => {
      if (!job) return;

      if (job.lat && job.lng && job.lat !== 0) {
        setJobCoords({ lat: job.lat, lng: job.lng });
      } else if (job.address) {
        try {
          const coords = await getCoordsByAddress(job.address);
          if (coords) setJobCoords(coords);
        } catch (e) { console.error(e); }
      }
    };
    setLocation();
  }, [job]);

  useEffect(() => {
    const convertNearbySpots = async () => {
      if (!job || !job.address || !spots || spots.length === 0) return;

      const addressParts = job.address.split(" ");
      if (addressParts.length < 2) return;
      const cityKey = addressParts[1].substr(0, 2);

      console.log(`🔎 [${cityKey}] 지역 여행지 좌표 변환 시작...`);

      const targetSpots = spots.filter(spot => spot.address.includes(cityKey));

      const updatedSpots = await Promise.all(targetSpots.map(async (spot) => {
        if (spot.lat !== 0 && spot.lng !== 0) return spot;

        try {
          const coords = await getCoordsByAddress(spot.address);
          if (coords) {
            return { ...spot, lat: coords.lat, lng: coords.lng };
          }
        } catch (e) {
          console.error(`변환 실패 (${spot.name}):`, e);
        }
        return spot;
      }));

      setConvertedSpots(updatedSpots);
      console.log(`✅ ${updatedSpots.length}개 여행지 좌표 준비 완료!`);
    };

    convertNearbySpots();
  }, [job, spots]);




  const nearbySpots = useMemo(() => {
    if (!jobCoords || !convertedSpots || convertedSpots.length === 0) return [];

    const RECOMMENDED_RADIUS_KM = 20;

    return convertedSpots
      .map(spot => {
        if (!spot.lat || !spot.lng) return { ...spot, distance: 9999 };

        const distance = getDistanceFromLatLonInKm(
          jobCoords.lat, jobCoords.lng, 
          spot.lat, spot.lng
        );
        return { ...spot, distance };
      })
      .filter(spot => spot.distance <= RECOMMENDED_RADIUS_KM)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3); 
  }, [jobCoords, convertedSpots]);


  useEffect(() => {
    const convertNearbySpots = async () => {
      if (!job || !job.address || !spots || spots.length === 0) return;

      const addressParts = job.address.split(" ");
      if (addressParts.length < 2) return;
      const cityKey = addressParts[1].substr(0, 2); 


      const targetSpots = spots.filter(spot => {
        if (!spot.address || typeof spot.address !== 'string') {
            return false;
        }
        return spot.address.includes(cityKey);
      });

      console.log(`   -> 필터링된 여행지: ${targetSpots.length}개`);

      const updatedSpots = await Promise.all(targetSpots.map(async (spot) => {
        if (spot.lat && spot.lat !== 0 && spot.lng && spot.lng !== 0) return spot;

        try {
          const coords = await getCoordsByAddress(spot.address);
          if (coords) {
            return { ...spot, lat: coords.lat, lng: coords.lng }; 
          }
        } catch (e) {
        }
        return spot; 
      }));
      setConvertedSpots(updatedSpots);
      console.log(`최종 좌표 준비 완료!`);
    };

    convertNearbySpots();
  }, [job, spots]);

  if (loadingJobs || loadingSpots) return <div style={{ padding: '4rem', textAlign: 'center' }}>정보 로딩 중...</div>;
  if (!job) { 
    alert('해당 공고를 찾을 수 없습니다.');
    return <Navigate to="/jobs" replace />;
  }
  
  const isApplied = user && job ? hasApplied(user.uid, job.id) : false;
  const isFaved = user && job ? isFavorited(user.uid, job.id) : false;
  const isAuthor = user && job && user.uid === job.authorId;
  const isSeeker = user && user.role === 'seeker';

  const handleEdit = () => navigate(`/jobs/${id}/edit`);
  const handleDelete = async () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      await deleteJob(id);
      navigate('/jobs');
    }
  };
  const handleToggleFavorite = async () => {
    if (!user || !job || isInteracting) return;
    setIsInteracting(true); 
    try { isFaved ? await removeFavorite(user.uid, job.id) : await addFavorite(user.uid, job.id); } 
    catch (e) { alert('오류'); } finally { setIsInteracting(false); }
  };
  const openApplyModal = () => { if (!user) { alert('로그인 필요'); return; } setShowApplyModal(true); };
  const submitApplication = async () => {
    if (!applyForm.name || !applyForm.phone) { alert("필수 입력 누락"); return; }
    setIsInteracting(true);
    try { await addApplication(user.uid, job.id, applyForm.name, applyForm.phone, applyForm.intro); alert('완료'); setShowApplyModal(false); } 
    catch (e) { alert('오류'); } finally { setIsInteracting(false); }
  };

  return (
    <div style={styles.container}>
      {isAuthor && <div style={styles.buttonContainer}><button onClick={handleEdit} style={styles.editButton}>수정</button><button onClick={handleDelete} style={styles.deleteButton}>삭제</button></div>}
      <header style={styles.header}>
        <h1 style={styles.title}>{job.title}</h1>
        <div style={styles.meta}><span style={styles.company}>{job.company}</span> | <span style={styles.region}>{job.address}</span> | <span style={styles.date}>{job.date}</span></div>
      </header>
      {isSeeker && <div style={styles.seekerActions}>
          <button onClick={handleToggleFavorite} style={isFaved ? styles.favedButton : styles.favButton} disabled={isInteracting}>{isInteracting ? "..." : (isFaved ? '❤️ 찜 취소' : '🤍 찜하기')}</button>
          <button onClick={openApplyModal} style={styles.applyButton} disabled={isApplied || isInteracting}>{isApplied ? '지원 완료' : '📝 지원서 작성하기'}</button>
      </div>}
      <div style={styles.content}><p style={{ whiteSpace: 'pre-wrap' }}>{job.description}</p></div>
      
      <div style={styles.mapContainer}>
        <h3 style={styles.mapTitle}>근무지 상세 위치</h3>
        {jobCoords ? <KakaoMapDisplay lat={jobCoords.lat} lng={jobCoords.lng} /> : <p>주소를 확인해주세요.</p>}
      </div>

      <div style={styles.recommendationSection}>
        <h3 style={styles.mapTitle}>퇴근 후 가볼 만한 힐링 스팟 🌿</h3>
        {nearbySpots.length > 0 ? (
          <div style={styles.recommendationContainer}>
            {nearbySpots.map(spot => (
              <Link key={spot.id} to={`/regional/${spot.id}`} style={{ textDecoration: 'none' }}>
                <ContentCard item={{ title: spot.name, description: `📍 약 ${spot.distance.toFixed(1)}km | ${spot.category}`, imageUrl: spot.imageUrl }} />
              </Link>
            ))}
          </div>
        ) : (
          <div style={styles.emptyBox}>
            <p>근처(20km)에 등록된 여행지가 없습니다.</p>
            <Link to="/regional" style={{ color: '#007bff' }}>전체 여행지 확인하기 &rarr;</Link>
          </div>
        )}
      </div>
      <Link to="/jobs" style={styles.backButton}>목록으로</Link>

      {showApplyModal && <div style={styles.modalOverlay}><div style={styles.modalContent}><h2>지원서 작성</h2><input placeholder="이름" value={applyForm.name} onChange={e=>setApplyForm({...applyForm, name:e.target.value})} style={styles.input}/><input placeholder="연락처" value={applyForm.phone} onChange={e=>setApplyForm({...applyForm, phone:e.target.value})} style={styles.input}/><textarea placeholder="자기소개" value={applyForm.intro} onChange={e=>setApplyForm({...applyForm, intro:e.target.value})} style={styles.textarea}/><div style={styles.modalActions}><button onClick={()=>setShowApplyModal(false)} style={styles.cancelButton}>취소</button><button onClick={submitApplication} style={styles.submitButton}>제출</button></div></div></div>}
    </div>
  );
}

const styles = {
  container: { maxWidth: '800px', margin: '2rem auto', padding: '2rem', border: '1px solid #e0e0e0', borderRadius: '8px', position: 'relative' },
  buttonContainer: { display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px dashed #ccc' },
  editButton: { padding: '0.5rem 1rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  deleteButton: { padding: '0.5rem 1rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  header: { paddingBottom: '1.5rem', marginBottom: '1.5rem' },
  title: { fontSize: '2.2rem', margin: '0 0 0.5rem 0' },
  meta: { display: 'flex', gap: '0.5rem', color: '#666', fontSize: '1rem' },
  company: { fontWeight: 'bold' },
  separator: { color: '#ddd' },
  region: { color: '#666' },
  date: { color: '#666' },
  seekerActions: { display: 'flex', gap: '1rem', padding: '1.5rem 0', borderBottom: '1px solid #f0f0f0' },
  applyButton: { flex: 1, padding: '1rem', fontSize: '1.2rem', fontWeight: 'bold', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', '&:disabled': { backgroundColor: '#ccc' } },
  favButton: { padding: '1rem', fontSize: '1.2rem', backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px', cursor: 'pointer' },
  favedButton: { padding: '1rem', fontSize: '1.2rem', backgroundColor: '#fff0f0', border: '1px solid #dc3545', color: '#dc3545', borderRadius: '8px', cursor: 'pointer' },
  content: { minHeight: '150px', padding: '1rem 0', fontSize: '1.1rem', lineHeight: '1.7' },
  mapContainer: { marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #f0f0f0' },
  mapTitle: { fontSize: '1.3rem', marginBottom: '1rem' },
  backButton: { display: 'inline-block', marginTop: '2rem', padding: '0.5rem 1rem', textDecoration: 'none', color: '#007bff', border: '1px solid #007bff', borderRadius: '4px' },
  recommendationSection: { marginTop: '3rem', paddingTop: '2rem', borderTop: '2px dashed #ccc', backgroundColor: '#f9fbfc', padding: '2rem', borderRadius: '12px' },
  recommendationContainer: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  emptyBox: { textAlign: 'center', padding: '2rem', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #eee' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalContent: { backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '500px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)' },
  inputGroup: { marginBottom: '1rem' },
  label: { display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.95rem' },
  input: { width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem' },
  textarea: { width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem', minHeight: '100px', resize: 'vertical' },
  modalActions: { display: 'flex', gap: '1rem', marginTop: '1.5rem' },
  cancelButton: { flex: 1, padding: '0.8rem', border: '1px solid #ccc', backgroundColor: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem' },
  submitButton: { flex: 2, padding: '0.8rem', border: 'none', backgroundColor: '#007bff', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' }
};

export default JobPostDetailPage;