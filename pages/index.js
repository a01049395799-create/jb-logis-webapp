export default function Home() {
  return (
    <>
      <style>{css}</style>

      <div className="page">
        <div className="app">

          {/* 상단 */}
          <div className="header">
            <div className="logoRow">
              <div className="mascot">🧊</div>
              <div>
                <div className="logo">
                  빙고 <span>氷庫</span>
                </div>
                <div className="slogan">작은일도 최선을 다해요 💚</div>
              </div>
            </div>
          </div>

          {/* 서비스 */}
          <div className="grid">

            <div className="card blue">
              <div className="icon">❄️</div>
              <h3>냉동창고 시공</h3>
              <p>설계부터 시공까지</p>
              <span>›</span>
            </div>

            <div className="card gray">
              <div className="icon">🌬️</div>
              <h3>에어컨 설치</h3>
              <p>가정용 · 업소용</p>
              <span>›</span>
            </div>

            <div className="card green">
              <div className="icon">🌿</div>
              <h3>해썹 전문 시공</h3>
              <p>위생 설비 시공</p>
              <span>›</span>
            </div>

            <div className="card red">
              <div className="icon">🚨</div>
              <h3>긴급고장출동</h3>
              <p>긴급 수리 · 점검</p>
              <span>›</span>
            </div>

          </div>

          {/* 중고거래 */}
          <div className="market">
            <div>
              <h2>중고거래</h2>
              <p>냉동기, 에어컨, 쇼케이스, 부품까지</p>
              <button>바로가기</button>
            </div>
            <div className="cart">🛒</div>
          </div>

          {/* 하단 */}
          <div className="nav">
            <div className="on">홈</div>
            <div>중고거래</div>
            <div>요청내역</div>
            <div>채팅</div>
            <div>마이</div>
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
  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Arial;
}

.page {
  display:flex;
  justify-content:center;
  padding:20px;
}

.app {
  width:390px;
  background:#fff;
  border-radius:30px;
  padding:22px;
  box-shadow:0 24px 60px rgba(0,0,0,0.15);
}

/* 헤더 */
.header {
  margin-bottom:20px;
}

.logoRow {
  display:flex;
  align-items:center;
  gap:12px;
}

.mascot {
  font-size:48px;
}

.logo {
  font-size:32px;
  font-weight:900;
  color:#1768d8;
}

.logo span {
  font-size:12px;
  border:1px solid #1768d8;
  padding:2px 6px;
  border-radius:6px;
  margin-left:6px;
}

.slogan {
  font-size:13px;
  color:#333;
}

/* 카드 */
.grid {
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:12px;
}

.card {
  border-radius:22px;
  padding:18px;
  min-height:150px;
  position:relative;
  box-shadow:0 12px 30px rgba(0,0,0,.08);
}

.card h3 {
  margin:0;
  font-size:16px;
}

.card p {
  margin-top:6px;
  font-size:13px;
  color:#555;
}

.card span {
  position:absolute;
  right:14px;
  bottom:12px;
  font-size:20px;
}

.icon {
  font-size:28px;
  margin-bottom:10px;
}

.blue { background:#dff0ff; }
.gray { background:#f1f1f1; }
.green { background:#e8f8e5; }
.red { background:#ffe4e4; }

/* 중고거래 */
.market {
  margin-top:20px;
  background:linear-gradient(135deg,#ffe08a,#ffd24d);
  padding:20px;
  border-radius:22px;
  display:flex;
  justify-content:space-between;
  align-items:center;
}

.market h2 {
  margin:0;
}

.market p {
  font-size:13px;
}

.market button {
  margin-top:8px;
  background:#ff9800;
  color:#fff;
  border:none;
  padding:8px 12px;
  border-radius:10px;
}

.cart {
  font-size:40px;
}

/* 하단 */
.nav {
  margin-top:25px;
  display:flex;
  justify-content:space-around;
  color:#777;
  font-size:12px;
}

.nav .on {
  color:#1768d8;
  font-weight:900;
}
`;
