export default function Home() {
  return (
    <>
      <style>{css}</style>

      <div className="page">

        <div className="app">

          {/* 콘텐츠 */}
          <div className="content">

            {/* 로고 */}
            <div className="logoRow">
              <div className="ice">🧊</div>
              <div>
                <div className="logo">빙고 <span>氷庫</span></div>
                <div className="slogan">작은일도 최선을 다해요 💚</div>
              </div>
            </div>

            {/* 서비스 */}
            <div className="grid">
              <div className="card blue">
                <div className="icon">❄️</div>
                <b>냉동창고 시공</b>
                <p>설계부터 시공까지</p>
              </div>

              <div className="card gray">
                <div className="icon">🌬️</div>
                <b>에어컨 설치</b>
                <p>가정용 · 업소용</p>
              </div>

              <div className="card green">
                <div className="icon">🌿</div>
                <b>해썹 전문 시공</b>
                <p>위생 설비 시공</p>
              </div>

              <div className="card red">
                <div className="icon">🚨</div>
                <b>긴급고장출동</b>
                <p>긴급 수리 · 점검</p>
              </div>
            </div>

            {/* 중고 */}
            <div className="market">
              <div>
                <h2>중고거래</h2>
                <p>냉동기, 에어컨, 쇼케이스, 부품</p>
                <button>바로가기</button>
              </div>
              <div className="cart">🛒</div>
            </div>

          </div>

          {/* 하단 메뉴 */}
          <div className="nav">
            <button className="on">홈</button>
            <button>중고거래</button>
            <button>요청내역</button>
            <button>채팅</button>
            <button>마이</button>
          </div>

        </div>

      </div>
    </>
  );
}

const css = `
body {
  margin:0;
  background:#eef5f8;
  font-family:sans-serif;
}

.page {
  display:flex;
  justify-content:center;
  padding:20px;
}

.app {
  width:390px;
  height:780px;              /* 핵심: 고정 높이 */
  background:white;
  border-radius:30px;
  box-shadow:0 24px 70px rgba(0,0,0,0.15);
  display:flex;
  flex-direction:column;     /* 핵심 */
  overflow:hidden;           /* 핵심 */
}

/* 콘텐츠 */
.content {
  flex:1;
  padding:20px;
  overflow:auto;             /* 스크롤 */
}

/* 로고 */
.logoRow {
  display:flex;
  gap:12px;
  align-items:center;
}

.ice { font-size:40px; }

.logo {
  font-size:32px;
  font-weight:900;
  color:#1a73e8;
}

.logo span {
  font-size:12px;
  border:1px solid #1a73e8;
  padding:2px 6px;
  border-radius:6px;
  margin-left:6px;
}

.slogan { font-size:13px; }

/* 카드 */
.grid {
  margin-top:20px;
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:12px;
}

.card {
  border-radius:20px;
  padding:16px;
  min-height:140px;
}

.icon { font-size:24px; margin-bottom:10px; }

.blue { background:#dff0ff; }
.gray { background:#f1f1f1; }
.green { background:#e8f8e5; }
.red { background:#ffe4e4; }

/* 중고 */
.market {
  margin-top:20px;
  background:linear-gradient(135deg,#ffe08a,#ffd24d);
  padding:20px;
  border-radius:20px;
  display:flex;
  justify-content:space-between;
  align-items:center;
}

.market button {
  margin-top:8px;
  background:#ff8f00;
  color:white;
  border:none;
  padding:8px 12px;
  border-radius:10px;
}

.cart { font-size:36px; }

/* 하단 */
.nav {
  height:70px;
  border-top:1px solid #eee;
  display:flex;
  justify-content:space-around;
  align-items:center;
  background:white;
}

.nav button {
  border:none;
  background:none;
  font-size:12px;
  color:#777;
}

.nav .on {
  color:#1a73e8;
  font-weight:900;
}
`;
