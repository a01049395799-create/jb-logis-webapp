export default function Home() {
  return (
    <>
      <style>{css}</style>

      <div className="page">
        <div className="app">
          <div className="top">
            <div className="menu">☰</div>
            <div className="bell">🔔<span></span></div>
          </div>

          <section className="brand">
            <div className="ice">🧊</div>
            <div>
              <div className="logo">빙고 <em>氷庫</em></div>
              <p>작은일도 최선을 다해요 💚</p>
            </div>
          </section>

          <section className="grid">
            <div className="card blue">
              <div className="pic">❄️🏢</div>
              <h3>냉동창고 시공 <b>›</b></h3>
            </div>

            <div className="card gray">
              <div className="pic">🌬️</div>
              <h3>에어컨 설치 <b>›</b></h3>
            </div>

            <div className="card green">
              <div className="pic">🌿</div>
              <h3>해썹 전문 시공 <b>›</b></h3>
            </div>

            <div className="card red">
              <div className="pic">🚨</div>
              <h3>긴급고장출동 <b>›</b></h3>
            </div>
          </section>

          <section className="market">
            <div>
              <h2>중고거래</h2>
              <p>냉동기, 에어컨, 쇼케이스,<br />부품까지 한눈에!</p>
              <button>바로가기 ›</button>
            </div>
            <div className="marketIcon">🛒</div>
          </section>

          <nav>
            <button className="active">⌂<br />홈</button>
            <button>🛒<br />중고거래</button>
            <button>▣<br />요청내역</button>
            <button>☏<br />채팅</button>
            <button>♙<br />마이페이지</button>
          </nav>
        </div>
      </div>
    </>
  );
}

const css = `
* { box-sizing:border-box; }

body {
  margin:0;
  background:#eef5f8;
  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;
  color:#111;
}

.page {
  min-height:100vh;
  display:flex;
  justify-content:center;
  padding:18px;
}

.app {
  width:390px;
  min-height:780px;
  background:white;
  border-radius:32px;
  overflow:hidden;
  box-shadow:0 22px 60px rgba(0,0,0,.12);
  position:relative;
  padding:22px 22px 82px;
}

.top {
  display:flex;
  justify-content:space-between;
  align-items:center;
  height:28px;
}

.menu {
  font-size:24px;
  line-height:1;
}

.bell {
  position:relative;
  font-size:21px;
}

.bell span {
  position:absolute;
  top:-2px;
  right:-2px;
  width:8px;
  height:8px;
  background:#ff2b2b;
  border-radius:50%;
}

.brand {
  display:flex;
  align-items:center;
  justify-content:center;
  gap:13px;
  margin:10px 0 24px;
}

.ice {
  font-size:58px;
  line-height:1;
}

.logo {
  font-size:42px;
  font-weight:950;
  letter-spacing:-3px;
  color:#1469e8;
}

.logo::first-letter {
  color:#1469e8;
}

.logo em {
  font-style:normal;
  font-size:13px;
  color:#1265df;
  border:1.5px solid #1265df;
  border-radius:7px;
  padding:2px 6px;
  margin-left:6px;
  vertical-align:middle;
  letter-spacing:0;
}

.brand p {
  margin:3px 0 0;
  font-size:13px;
  color:#333;
  text-align:center;
}

.grid {
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:13px;
}

.card {
  height:158px;
  border-radius:22px;
  padding:17px 15px;
  display:flex;
  flex-direction:column;
  justify-content:space-between;
}

.blue { background:#dff0ff; }
.gray { background:#f1f1f1; }
.green { background:#e8f8e5; }
.red { background:#ffe4e4; }

.pic {
  font-size:42px;
  line-height:1;
  height:74px;
  display:flex;
  align-items:center;
}

.card h3 {
  margin:0;
  font-size:16px;
  font-weight:900;
  display:flex;
  justify-content:space-between;
  align-items:center;
}

.card b {
  font-size:22px;
  font-weight:400;
}

.market {
  margin-top:18px;
  min-height:160px;
  border-radius:24px;
  padding:22px;
  background:linear-gradient(135deg,#ffe590,#ffd34d);
  display:flex;
  align-items:center;
  justify-content:space-between;
}

.market h2 {
  margin:0 0 10px;
  font-size:32px;
  letter-spacing:-1px;
  color:#5a3700;
}

.market p {
  margin:0;
  font-size:14px;
  line-height:1.55;
  color:#503900;
}

.market button {
  margin-top:14px;
  background:#ff9500;
  color:white;
  border:0;
  border-radius:999px;
  padding:10px 17px;
  font-weight:900;
  font-size:14px;
}

.marketIcon {
  font-size:50px;
}

nav {
  position:absolute;
  left:0;
  right:0;
  bottom:0;
  height:72px;
  background:white;
  border-top:1px solid #edf1f4;
  display:flex;
  justify-content:space-around;
  align-items:center;
}

nav button {
  border:0;
  background:transparent;
  color:#333;
  font-size:11px;
  font-weight:700;
  line-height:1.35;
}

nav .active {
  color:#1473ff;
  font-weight:900;
}
`;
