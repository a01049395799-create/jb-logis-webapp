export default function Home() {
  return (
    <>
      <style>{css}</style>

      <div className="page">
        <div className="app">

          {/* 상단 로고 */}
          <div className="header">
            <div className="logoRow">
              <div className="ice">🧊</div>
              <div>
                <div className="logo">
                  빙고 <span>氷庫</span>
                </div>
                <div className="slogan">
                  작은일도 최선을 다해요 💚
                </div>
              </div>
            </div>
          </div>

          {/* 서비스 */}
          <div className="section">
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
          </div>

          {/* 중고거래 */}
          <div className="market">
            <div>
              <h2>중고거래</h2>
              <p>냉동기, 에어컨, 쇼케이스, 부품</p>
              <button>바로가기</button>
            </div>
            <div className="cart">🛒</div>
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
  background:white;
  border-radius:30px;
  padding:20px;
}

.header {
  margin-bottom:20px;
}

.logoRow {
  display:flex;
  align-items:center;
  gap:12px;
}

.ice {
  font-size:40px;
}

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
  margin-left:5px;
}

.slogan {
  font-size:13px;
  color:#333;
}

.grid {
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:10px;
}

.card {
  border-radius:18px;
  padding:15px;
}

.icon {
  font-size:28px;
  margin-bottom:8px;
}

.blue { background:#dff0ff; }
.gray { background:#f1f1f1; }
.green { background:#e8f8e5; }
.red { background:#ffe4e4; }

.market {
  margin-top:20px;
  background:#ffe08a;
  padding:20px;
  border-radius:20px;
  display:flex;
  justify-content:space-between;
  align-items:center;
}

.market h2 {
  margin:0;
}

.market button {
  margin-top:10px;
  background:#ff9800;
  color:white;
  border:none;
  padding:8px 12px;
  border-radius:10px;
}

.cart {
  font-size:40px;
}
`;
