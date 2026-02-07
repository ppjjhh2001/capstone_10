# 📍 우리 동네 알바 (Our Neighborhood Jobs)
> **React**로 구현한 지역 기반 구인구직 및 커뮤니티 플랫폼입니다.

## 🚀 프로젝트 개요
- **진행 기간:** 2024.01 ~ 2024.02 (예시)
- **주요 목적:** 사장님과 지원자가 실시간으로 소통하고, 지역 정보를 공유하는 대시보드 중심 서비스 구현

## 🛠 Tech Stack
- **Frontend:** React, React Router, Context API (State Management)
- **Styling:** CSS-in-JS (Object styles)
- **Persistence:** LocalStorage (초기 데이터 및 사용자 DB 유지)

## ✨ 주요 기능
### 🔐 권한 기반 서비스 (Auth)
- **사장님/알바님 선택 회원가입:** 역할에 따른 차별화된 대시보드 제공
- **보안 조회:** 사장님만 지원자의 연락처를 확인할 수 있는 보안 로직 구현

### 📋 공고 및 지원 시스템
- **동적 필터링:** 전체/서울/경기 등 지역별 공고 필터링 기능
- **상호작용:** 알바님의 지원하기 → 사장님 대시보드 실시간 업데이트

### 📱 대시보드 (UX/UI)
- **사장님:** 내가 올린 공고 관리 및 실시간 지원자 목록(전화번호 포함) 확인
- **알바님:** 내가 지원한 공고의 상태 확인

## 💡 개발 포인트 (Troubleshooting)
- **상태 관리:** `Context API`를 3개(`Auth`, `Job`, `Interaction`)로 분리하여 데이터 흐름을 최적화했습니다.
- **스타일 충돌 해결:** Shorthand와 Longhand 속성 충돌 문제를 `borderWidth`, `borderColor` 등으로 세분화하여 해결했습니다.
