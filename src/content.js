// 확인된 이력서 내용만 입력합니다. 빈 배열/문자열은 해당 UI를 숨깁니다.
export const profile = {
  name: '변재학 · 백엔드 / 플랫폼 엔지니어',
  headline: '서버와 플랫폼을\n연결하는 개발자.',
  introduction: 'API와 데이터베이스, 메시징과 실행 환경을 함께 다룹니다.\n새로운 기능을 만들고, 운영 중인 서비스의 문제를 해결해 왔습니다.',
  description: '변재학의 자기소개. 서버 API, 데이터베이스, Kafka 메시징, Docker와 Kubernetes 환경을 경험한 백엔드·플랫폼 엔지니어입니다.',
  aboutTitle: '개발과 운영의 접점을\n이해하는 엔지니어입니다.',
  about: [
    '안녕하세요, 변재학입니다. Golang, Java, Python, Node.js 기반 서버 개발부터 데이터베이스 설계, 인증과 권한 관리, 결제 기능 구현까지 다양한 백엔드 업무를 경험했습니다.',
    'Apache Kafka를 활용한 로그 처리와 Docker·Kubernetes 실행 환경 구성 경험을 바탕으로, 기능이 동작하는 과정과 운영 환경을 함께 살펴봅니다. 기존 코드 분석, 버그 수정, 테스트와 오류 처리도 개발의 중요한 일부로 생각합니다.',
    'React 기반 화면 개발 경험을 통해 API를 사용하는 화면까지 이해하고, 서비스의 여러 구성 요소를 연결해 왔습니다.'
  ],
  skills: ['Golang · Gin', 'Java · Vert.x', 'Python · Flask', 'Node.js · Express', 'Laravel', 'React', 'MariaDB / MySQL', 'MongoDB', 'Apache Kafka', 'Docker', 'Kubernetes', 'Linux', 'AWS S3 / RDS'],
  // { period: '기간', title: '직무', organization: '조직', description: '담당 업무' }
  experience: [
    { period: '2023.03 — 2023.06', title: '서버 개발자', organization: '주식회사 스테이터스 · 계약직', description: 'Node.js·Express 기반 자체 서비스 서버를 개발하고 배포했습니다. AWS S3, Cloudflare, DNS 등 서비스 운영에 필요한 환경을 구성했습니다.' },
    { period: '2022.11', title: '개발팀', organization: '주식회사 MXN커머스코리아', description: '개발 중인 풀필먼트 서비스의 기존 코드를 분석하고 서비스 구조와 구현 내용을 파악했습니다.' },
    { period: '2022.04 — 2022.11', title: '백엔드 개발자', organization: '주식회사 주피터스튜디오 (구 주식회사 찌읏)', description: 'Laravel 기반 REST API와 백오피스 API, 데이터베이스 스키마와 마이그레이션을 개발했습니다. OAuth·SNS 로그인과 역할별 권한 제어, PG 가상계좌 결제·환불 기능을 구현하고 운영 중 버그를 수정했습니다.' },
    { period: '2019.03 — 2020.12', title: '소프트웨어 개발자', organization: '주식회사 애자일소다', description: 'Golang·Java API와 Kafka를 연동한 Docker 빌드 로그 수집·조회 기능을 개발했습니다. Python 모델 서버의 파일 관리, Kubernetes 기반 데이터 로깅, MongoDB 데이터 매핑과 테스트·오류 처리를 수행했습니다. Debian 패키지 저장소 관리 절차를 Shell Script로 자동화했습니다.' },
    { period: '2017.05 — 2017.07', title: 'iOS 개발자', organization: '후퍼 주식회사', description: 'Objective-C와 Xcode를 활용해 iOS 프론트엔드 앱을 개발했습니다.' }
  ],
  // 공개할 연락처만 입력: { label: 'GitHub', url: 'https://github.com/계정' }
  links: [],
};

// 프로젝트가 없으면 메뉴와 섹션이 모두 숨겨집니다.
// { title, summary, role, period, tags: [], image: { src, alt }, links: [{ label, url }] }
export const projects = [];
