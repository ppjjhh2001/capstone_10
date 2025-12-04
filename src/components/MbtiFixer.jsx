import React, { useState } from 'react';
import { db } from '../firebaseConfig.js';
import { doc, updateDoc } from 'firebase/firestore';

function MbtiFixer() {
  const [loading, setLoading] = useState(false);

  const fixData = async () => {
    if (!window.confirm("질문 데이터를 여행 MBTI 형식으로 수정하시겠습니까?")) return;
    
    setLoading(true);
    try {
      await updateDoc(doc(db, "mbtiQuestions", "q1"), {
        type: "A_R",
        options: [
          { text: "새로운 사람들과 어울릴 때 (활동형)", value: "A" }, 
          { text: "혼자만의 시간을 가질 때 (휴식형)", value: "R" }
        ]
      });

      await updateDoc(doc(db, "mbtiQuestions", "q2"), {
        type: "S_U",
        options: [
          { text: "유명한 관광지와 맛집 (관광형)", value: "S" }, 
          { text: "남들이 모르는 숨겨진 장소 (탐험형)", value: "U" }
        ]
      });

      await updateDoc(doc(db, "mbtiQuestions", "q3"), {
        type: "C_E",
        options: [
          { text: "효율적인 동선과 가성비가 중요해 (실속형)", value: "C" }, 
          { text: "그날의 기분과 감성이 중요해 (경험형)", value: "E" }
        ]
      });

      await updateDoc(doc(db, "mbtiQuestions", "q4"), {
        type: "P_J",
        options: [
          { text: "시간 단위로 철저하게! (계획형)", value: "P" }, 
          { text: "그때그때 끌리는 대로! (즉흥형)", value: "J" }
        ]
      });

      alert("✅ DB 수정 완료! 이제 테스트를 다시 해보세요.");
    } catch (error) {
      console.error(error);
      alert("오류 발생: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999, padding: '20px', background: 'yellow' }}>
      <button onClick={fixData} disabled={loading}>
        {loading ? "수정 중..." : "🚨 MBTI 질문 DB 수정하기 (한 번만 클릭)"}
      </button>
    </div>
  );
}

export default MbtiFixer;