import { useState } from "react";

export default function Home() {
  const [view, setView] = useState("home");

  if (view !== "home") {
    return (
      <>
        <style>{css}</style>
        <div className="page">
          <div className="app">
            <button className="back" onClick={() => setView("home")}>← 뒤로</button>
            <h2>{view}</h2>

            <div className="form">
              <input placeholder="이름 / 업체명" />
              <input placeholder="연락처" />
              <input placeholder="주소" />
              <textarea placeholder="요청 내용을 입력하세요" />
              <button className="submit">접수하기</button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{css}</style>

      <div className="page">
        <div className="app">

          {/* 로고 */}
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
          <div className="grid">

            <div className="card blue" onClick={() => setView("냉동창고 시공")}>
              <div className="icon">❄️</div>
              <b>냉동창고 시공</b>
              <p>설계부터 시공까지</p>
            </div>

            <div className="card gray" onClick={() => setView("에어컨 설치")}>
              <div className="icon">🌬️</div>
              <b>에어컨 설치</b>
              <p>가정용 · 업소용</p>
            </div>

            <div className="card green" onClick={() => setView("해썹 전문 시공")}>
              <div className="icon">🌿</div>
              <b>해썹 전문 시공</b>
              <p>위생 설비 시공</p>
            </div>

            <div className="card red" onClick={() => setView("긴급고장출동")}>
              <div className="icon">🚨</div>
              <b>긴급고장출동</b>
              <p>긴급 수리 · 점검</p>
            </div>

          </div>

          {/* 중고거래 */}
          <div className="market">
            <div>
              <h2>중고거래</h2>
              <p>냉동기, 에어컨, 쇼케이스, 부품</p>
              <button onClick={() => alert("중고거래 화면 준비중")}>바로가기</button>
            </div>
            <div className="cart">🛒</div>
          </div>

          {/* 하단 */}
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
body { margin:0; background:#eef5f8; font-family:sans-serif; }

.page { display:flex; justify-content:center; padding:20px; }

.app {
  width:390px;
  background:white;
  border-radius:30px;
  padding:22px;
  box-shadow:0 24px 70px rgba(0,0,0,0.15);
  position:relative;
}

.header { margin-bottom:25px; }

.logoRow { display:flex; align-items:center; gap:12px; }

.ice { font-size:42px; }

.logo {
  font-size:34px;
  font-weight:900;
  color:#1a73e8;
}

.logo span {
  font-size:13px;
  border:1.5px solid #1a73e8;
  padding:2px 6px;
  border-radius:6px;
  margin-left:6px;
}

.slogan { font-size:13px; color:#333; }

.grid {
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:12px;
}

.card {
  border-radius:22px;
  padding:18px;
  min-height:160px;
  box-shadow:0 12px 30px rgba(0,0,0,.08);
  transition:0.2s;
}

.card:active { transform:scale(0.96); }

.icon { font-size:26px; margin-bottom:12px; }

.blue { background:#dff0ff; }
.gray { background:#f1f1f1; }
.green { background:#e8f8e5; }
.red { background:#ffe4e4; }

.market {
  margin-top:22px;
  background:linear-gradient(135deg,#ffe08a,#ffd24d);
  padding:22px;
  border-radius:24px;
  display:flex;
  justify-content:space-between;
  align-items:center;
}

.market button {
  margin-top:12px;
  background:#ff8f00;
  color:white;
  border:none;
  padding:10px 14px;
  border-radius:12px;
  font-weight:900;
}

.cart { font-size:42px; }

.nav {
  position:absolute;
  bottom:10px;
  left:0;
  right:0;
  display:flex;
  justify-content:space-around;
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

.form {
  margin-top:20px;
}

input, textarea {
  width:100%;
  margin:8px 0;
  padding:12px;
  border-radius:12px;
  border:1px solid #ddd;
}

.submit {
  width:100%;
  margin-top:10px;
  background:#1a73e8;
  color:white;
  padding:14px;
  border:none;
  border-radius:14px;
}

.back {
  border:none;
  background:#eee;
  padding:8px 12px;
  border-radius:10px;
}
`;
