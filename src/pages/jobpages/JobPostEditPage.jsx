import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useJobs } from '../../context/JobContext.jsx';
import { useParams, useNavigate, Navigate, Link } from 'react-router-dom';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import { regionData, findRegionKeyByName, findCityKeyByName } from '../../data/regionData.js';

const useKakaoLoader = () => {
  const [loading, setLoading] = useState(true);
  React.useEffect(() => {
    if (!window.kakao) return;
    window.kakao.maps.load(() => setLoading(false));
  }, []);
  return [loading];
};

function JobPostEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getJobById, updateJob } = useJobs();
  const { user } = useAuth();
  const [kakaoLoading] = useKakaoLoader();
  
  const jobToEdit = getJobById(id);

  const [title, setTitle] = useState(jobToEdit ? jobToEdit.title : '');
  const [company, setCompany] = useState(jobToEdit ? jobToEdit.company : '');
  const [description, setDescription] = useState(jobToEdit ? jobToEdit.description : '');
  const [address, setAddress] = useState(jobToEdit ? jobToEdit.address : '');
  const [coords, setCoords] = useState(
    jobToEdit && jobToEdit.lat ? { lat: jobToEdit.lat, lng: jobToEdit.lng } : null
  );
  const [locationKeys, setLocationKeys] = useState(
    jobToEdit && jobToEdit.regionKey ? { regionKey: jobToEdit.regionKey, cityKey: jobToEdit.cityKey } : null
  );

  if (!jobToEdit) {
    alert('공고를 찾을 수 없습니다.');
    return <Navigate to="/jobs" replace />;
  }
  /*
  if (!user || String(user.uid) !== String(jobToEdit.author)) {
    alert('이 공고를 수정할 권한이 없습니다.');
    return <Navigate to={`/jobs/${id}`} replace />;
  }
  */
  const openPostcode = useDaumPostcodePopup();

  const handleCompletePostcode = (data) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') extraAddress += data.bname;
      if (data.buildingName !== '') extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
      fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
    }
    
    const regionName = data.sido;
    const sigunguName = data.sigungu;
    const regionKey = findRegionKeyByName(regionName);
    const cityKey = findCityKeyByName(regionKey, sigunguName);

    if (!regionKey || !cityKey) {
      alert('선택한 주소가 현재 저희가 지원하는 지역(시/군/구)이 아닙니다.');
      return;
    }

    setAddress(fullAddress);
    setLocationKeys({ regionKey, cityKey });

    if (!kakaoLoading) {
      const geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.addressSearch(fullAddress, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          setCoords({ lat: parseFloat(result[0].y), lng: parseFloat(result[0].x) });
        } else {
          setCoords(null);
        }
      });
    }
  };

  const handleClickAddress = () => {
    openPostcode({ onComplete: handleCompletePostcode });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !company || !description || !address || !coords || !locationKeys) {
      alert('모든 항목을 입력하고, 유효한 주소 검색을 완료해주세요.');
      return;
    }
    
    try {
      await updateJob(id, {
        title,
        company,
        description,
        address,
        lat: coords.lat,
        lng: coords.lng,
        regionKey: locationKeys.regionKey,
        cityKey: locationKeys.cityKey,
      });
      
      alert('공고가 성공적으로 수정되었습니다.');
      navigate(`/jobs/${id}`);
      
    } catch (error) {
      console.error("공고 수정 중 오류:", error);
      alert("공고 수정에 실패했습니다.");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.pageTitle}>구인 공고 수정</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label htmlFor="title" style={styles.label}>공고 제목</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="company" style={styles.label}>회사명</label>
          <input
            id="company"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            style={styles.input}
          />
        </div>
      
      <div style={styles.inputGroup}>
        <label htmlFor="address" style={styles.label}>근무지 주소</label>
        <div style={styles.addressContainer}>
          <input
              id="address"
              type="text"
              value={address}
              style={{...styles.input, flex: 1}}
              placeholder="주소 검색 버튼을 눌러주세요"
              readOnly
            />
            <button 
              type="button" 
              onClick={handleClickAddress} 
              style={styles.addressButton}
              disabled={kakaoLoading}
            >
              주소 검색
            </button>
        </div>
        {locationKeys && (
          <small style={{ color: 'blue', marginTop: '0.5rem' }}>
            [선택된 지역: {regionData[locationKeys.regionKey].name} - {locationKeys.cityKey}]
          </small>
        )}
      </div>
      
      <div style={styles.inputGroup}>
          <label htmlFor="description" style={styles.label}>상세 내용</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.textarea}
            rows={10}
          />
        </div>
        
        <button type="submit" style={styles.submitButton}>
          공고 등록하기
        </button>
        <Link to="/jobs" style={styles.backButton}>
        &larr; 목록으로 돌아가기
      </Link>
      </form>
    </div>
  );
}

const styles = {
  container: { maxWidth: '800px', margin: '2rem auto', padding: '2rem', fontFamily: 'Arial, sans-serif' },
  pageTitle: { fontSize: '2rem', borderBottom: '2px solid #333', paddingBottom: '0.5rem' },
  subtitle: { fontSize: '1.1rem', color: '#555' },
  form: { display: 'flex', flexDirection: 'column', gap: '1.2rem' },
  inputGroup: { display: 'flex', flexDirection: 'column' },
  label: { fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.9rem' },
  input: { padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' },
  textarea: { padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem', fontFamily: 'Arial, sans-serif' },
  addressContainer: { display: 'flex', gap: '0.5rem' },
  addressButton: { padding: '0 1rem', border: '1px solid #007bff', backgroundColor: '#007bff', color: 'white', borderRadius: '4px', cursor: 'pointer' },
  backButton: { padding: '1rem', backgroundColor: '#ffffffff', color: '#007bff', border: '1.5px solid #007bff', borderRadius: '8px', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold' },
  submitButton: { padding: '1rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold' }
};
export default JobPostEditPage;