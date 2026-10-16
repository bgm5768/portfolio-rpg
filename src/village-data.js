import { projects } from './content.js';
import { visibleProjects } from './model.js';
export const villagers = [
  { id:'intro', name:'마을 안내인', topic:'처음 만나는 재학', role:'입구에서 건네는 인사', icon:'✦', color:0xd78d53, x:0, z:2,
    paragraphs:['어서 와요! 이 마을은 백엔드·플랫폼 엔지니어 변재학의 경험을 담은 작은 공간이에요.', '재학은 API를 만드는 데서 그치지 않고, 데이터가 저장되고 서비스가 실행되는 환경까지 함께 다뤄왔어요. 서버, 데이터베이스, 메시징, 컨테이너 사이를 오가며 일을 해왔죠.', '새 기능을 만드는 일만큼 기존 코드를 읽고 운영 중인 문제를 고치는 일도 경험했어요. 다른 주민에게도 말을 걸어보세요. 저마다 다른 이야기를 들려줄 거예요.'], tags:['Backend','Platform','반가워요!'] },
  { id:'backend', name:'공방의 개발자', topic:'서비스를 만드는 일', role:'API와 데이터의 작업실', icon:'{ }', color:0x6889a4, x:-5.5, z:-1,
    paragraphs:['눈에 보이는 기능 뒤에는 데이터를 다루고 요청에 응답하는 일이 있어요. 재학은 Golang, Java, Python, Node.js 기반 서버 개발을 경험했어요.', '주피터스튜디오에서는 Laravel API와 데이터베이스 스키마를 만들고 OAuth·SNS 로그인, 역할별 권한 제어, 결제·환불 기능을 구현했어요. 기능을 하나씩 서비스의 흐름으로 연결하는 일이었죠.', 'React 화면도 개발해 봤기에, API를 사용하는 쪽까지 함께 이해하며 작업해 왔어요.'], tags:['Golang · Gin','Java · Vert.x','Python · Flask','Node.js · Express','Laravel','React'] },
  { id:'platform', name:'물레방아 지기', topic:'흐름을 이어가는 일', role:'로그, 메시지, 실행 환경', icon:'≈', color:0x719a70, x:6, z:-1,
    paragraphs:['이 물처럼, 서비스 안에서도 데이터가 흐릅니다. 애자일소다에서 재학은 Docker 빌드 로그를 수집하고 조회하는 API를 개발하고, Kafka로 서버 간 통신을 연결했어요.', 'Kubernetes 환경에서 원하는 데이터를 MongoDB에 적재하고 조회하는 기능도 만들었어요. 데이터 매핑과 테스트, 오류 처리, 실행 환경 구성을 함께 다뤘죠.', '반복되는 Debian 패키지 저장소 관리 절차는 Shell Script로 자동화했어요. 개발한 기능이 놓일 환경까지 살피는 경험이 쌓였습니다.'], tags:['Kafka','Docker','Kubernetes','MongoDB','Linux','Shell Script'] },
  { id:'journey', name:'기록 보관인', topic:'지나온 경험의 기록', role:'작은 도서관에 남긴 발자취', icon:'▤', color:0x9c789c, x:0, z:-6.5,
    paragraphs:['처음부터 한 가지 영역만 다룬 건 아니에요. iOS 앱 개발을 거쳐 서버와 플랫폼, 웹 서비스 개발을 경험해 왔어요.', '애자일소다에서는 플랫폼 기능을, 주피터스튜디오에서는 서비스 API와 인증·결제 기능을 다뤘어요. MXN커머스코리아에서는 기존 풀필먼트 서비스 코드를 분석했죠.', '스테이터스에서는 Node.js·Express 서버를 개발하고 배포하면서 AWS S3, Cloudflare, DNS 설정까지 맡았어요. 각각의 경험은 기능과 운영 환경을 함께 이해하는 바탕이 되었습니다.'], tags:['코드 분석','서버 개발','배포 환경','운영 중 문제 해결'] },
  ...visibleProjects(projects).map((p,i)=>({id:`project-${i}`,name:p.title,topic:p.title,role:p.role||'프로젝트 이야기',icon:'◇',color:0xcc9966,x:p.npc?.x??(-6+i*3),z:p.npc?.z??6,paragraphs:[p.summary],tags:p.tags||[],links:p.links||[],image:p.image}))
];
