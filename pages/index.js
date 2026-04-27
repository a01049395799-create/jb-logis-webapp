import { useState } from "react";

export default function Home() {
  const [tab, setTab] = useState("home");
  const [selectedService, setSelectedService] = useState(null);

  const services = [
    { title: "냉동창고 시공", desc: "저온 · 냉동창고 설계부터 시공까지", icon: "❄️", color: "#dff0ff" },
    { title: "에어컨 설치", desc: "가정용 · 상업용 · 업소용 설치", icon: "🌬️", color: "#eeeeee" },
    { title: "해썹 전문 시공", desc: "식품공장 · 육가공 등 위생 설비 시공", icon: "🌿", color: "#e7f6df" },
    { title: "긴급고장출동", desc: "냉동기계 · 에어컨 긴급 수리 및 점검", icon: "🚨", color: "#ffe4e1" },
  ];

  const marketItems = [
    ["중고 냉동기 50마력", "1,200,000원", "경기도 화성시"],
    ["업소용 냉장쇼케이스", "600,000원", "서울 강서구"],
    ["스탠드 에어컨 15평형", "350,000원", "경기도 시흥시"],
  ];

  if (selectedService) {
    return (
      <Layout tab={tab} setTab={setTab}>
        <button className="back" onClick={() => setSelectedService(null)}>← 뒤로</button>
        <h2>{selectedService.title}</h2>
        <p className="desc">{selectedService.desc}</p>

        <div className="formCard">
          <input placeholder="이름 또는 업체명" />
          <input placeholder="연락처" />
          <input placeholder="주소" />
          <textarea placeholder="요청 내용을 입력해주세요" />
          <button className="mainBtn">접수하기</button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout tab={tab} setTab={setTab}>
      {tab === "home" && (
        <>
          <div className="logoBox">
            <div className="ice">🧊</div>
            <div>
              <div className="logo">빙고 <span>氷庫</span></div>
              <div className="slogan">작은일도 최선을 다해요! 💚</div>
            </div>
          </div>

          <h3 className="section">필요한 서비스를 선택해주세요</h3>

          <div className="serviceGrid">
            {services.map((s, i) => (
              <div key={i} className="serviceCard" style={{ background: s.color }} onClick={() => setSelectedService(s)}>
                <div className="serviceIcon">{s.icon}</div>
                <b>{s.title}</b>
                <p>{s.desc}</p>
                <span>›</span>
              </div>
            ))}
          </div>

          <div className="marketBanner" onClick={() => setTab("market")}>
            <div>
              <h2>중고거래</h2>
              <p>냉동기, 에어컨, 쇼케이스, 부품까지 한눈에!</p>
              <button>바로가기 ›</button>
            </div>
            <div className="marketIcon">🛒</div>
          </div>
        </>
      )}

      {tab === "market" && (
        <>
          <h2>중고거래</h2>
          <input className="search" placeholder="검색어를 입력하세요" />

          {marketItems.map((item, i) => (
            <div key={i} className="itemCard">
              <div className="thumb">🧰</div>
              <div>
                <b>{item[0]}</b>
                <p>{item[2]}</p>
                <strong>{item[1]}</strong>
              </div>
            </div>
          ))}
        </>
      )}

      {tab === "requests" && (
        <>
          <h2>요청내역</h2>
          {["냉동창고 온도 이상", "에어컨 냉방 불량", "쇼케이스 성에 문제"].map((t, i) => (
            <div key={i} className="requestCard">
              <span>{i === 0 ? "진행중" : i === 1 ? "예약중" : "접수완료"}</span>
              <b>{t}</b>
              <p>2024.05.{20 - i} 14:30</p>
            </div>
          ))}
        </>
      )}

      {tab === "chat" && (
        <>
          <h2>채팅</h2>
          {["빙고 고객센터", "김사장님", "이대표님"].map((name, i) => (
            <div key={i} className="chatCard">
              <div className="avatar">👷</div>
              <div>
                <b>{name}</b>
                <p>문의 내용을 확인해주세요.</p>
              </div>
            </div>
          ))}
        </>
      )}

      {tab === "my" && (
        <>
          <h2>마이페이지</h2>
          {["내 정보 관리", "알림 설정", "자주 묻는 질문", "이용 가이드", "고객센터 문의"].map((m, i) => (
            <div key={i} className="menuRow">{m}<span>›</span></div>
          ))}
        </>
      )}
    </Layout>
  );
}

function Layout({ children, tab, setTab }) {
  return (
    <>
      <style>{css}</style>
      <div className="page">
        <div className="app">
          <main>{children}</main>

          <nav>
            <button className={tab === "home" ? "on" : ""} onClick={() => setTab("home")}>홈</button>
            <button className={tab === "market" ? "on" : ""} onClick={() => setTab("market")}>중고거래</button>
            <button className={tab === "requests" ? "on" : ""} onClick={() => setTab("requests")}>요청내역</button>
            <button className={tab === "chat" ? "on" : ""} onClick={() => setTab("chat")}>채팅</button>
            <button className={tab === "my" ? "on" : ""} onClick={() => setTab("my")}>마이</button>
          </nav>
        </div>
      </div>
    </>
  );
}

const css = `
body { margin:0; background:#eef5f8; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif; color:#111; }
.page { min-height:100vh; display:flex; justify-content:center; padding:18px; }
.app { width:390px; min-height:820px; background:#fff; border-radius:34px; overflow:hidden; box-shadow:0 24px 70px rgba(0,0,0,.16); position:relative; }
main { padding:26px 22px 96px; }
.logoBox { display:flex; align-items:center; gap:14px; margin-bottom:28px; }
.ice { font-size:48px; }
.logo { font-size:42px; font-weight:900; color:#1768d8; letter-spacing:-2px; }
.logo span { font-size:14px; border:1px solid #1768d8; border-radius:7px; padding:2px 6px; margin-left:6px; color:#1768d8; vertical-align:middle; }
.slogan { margin-top:6px; font-size:15px; color:#333; }
.section { margin:10px 0 16px; }
.serviceGrid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.serviceCard { border-radius:20px; padding:17px; min-height:150px; position:relative; box-shadow:0 8px 22px rgba(0,0,0,.06); cursor:pointer; }
.serviceIcon { font-size:34px; margin-bottom:12px; }
.serviceCard b { font-size:17px; }
.serviceCard p { font-size:13px; color:#555; line-height:1.45; }
.serviceCard span { position:absolute; right:15px; bottom:14px; font-size:24px; }
.marketBanner { margin-top:18px; background:#ffe59c; border-radius:22px; padding:22px; display:flex; justify-content:space-between; align-items:center; cursor:pointer; }
.marketBanner h2 { margin:0; font-size:30px; color:#634000; }
.marketBanner p { color:#5b4a20; font-size:14px; }
.marketBanner button { background:#f3a600; color:white; border:0; border-radius:999px; padding:10px 16px; font-weight:800; }
.marketIcon { font-size:46px; }
.search, input, textarea { width:100%; box-sizing:border-box; border:1px solid #e1e6eb; border-radius:16px; padding:15px; margin:10px 0; font-size:15px; }
textarea { min-height:120px; resize:none; }
.itemCard, .requestCard, .chatCard, .menuRow, .formCard { background:white; border:1px solid #edf1f4; border-radius:20px; padding:17px; margin:13px 0; box-shadow:0 8px 22px rgba(0,0,0,.05); }
.itemCard, .chatCard { display:flex; gap:14px; align-items:center; }
.thumb { width:72px; height:72px; border-radius:16px; background:#eef6ff; display:flex; align-items:center; justify-content:center; font-size:32px; }
.itemCard p, .chatCard p, .requestCard p, .desc { color:#666; font-size:14px; }
.itemCard strong { font-size:17px; }
.requestCard span { display:inline-block; background:#e8f1ff; color:#1768d8; padding:6px 10px; border-radius:999px; font-size:12px; font-weight:800; margin-bottom:8px; }
.avatar { width:48px; height:48px; border-radius:50%; background:#e8f5ee; display:flex; align-items:center; justify-content:center; font-size:24px; }
.menuRow { display:flex; justify-content:space-between; align-items:center; font-weight:700; }
.mainBtn { width:100%; border:0; background:#2f89e8; color:white; border-radius:18px; padding:17px; font-size:16px; font-weight:900; margin-top:10px; }
.back { border:0; background:#eef4f7; border-radius:999px; padding:10px 14px; font-weight:800; margin-bottom:16px; }
nav { position:absolute; bottom:0; left:0; right:0; height:76px; background:white; border-top:1px solid #e8edf1; display:flex; justify-content:space-around; align-items:center; }
nav button { border:0; background:transparent; color:#777; font-size:12px; font-weight:800; }
nav button.on { color:#1768d8; }
`;
