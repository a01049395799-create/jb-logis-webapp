import { useState } from "react";

export default function Home() {
  const [tab, setTab] = useState("home");

  const services = [
    { title: "냉동창고 시공", desc: "저온·냉동창고 설계부터 시공까지", icon: "❄️" },
    { title: "에어컨 설치", desc: "가정용·상업용·업소용 설치", icon: "🌬️" },
    { title: "해썹 전문 시공", desc: "육가공·식품공장 위생 설비", icon: "✅" },
    { title: "긴급고장출동", desc: "냉동기계·에어컨 긴급 수리", icon: "🛠️" },
  ];

  return (
    <div style={s.page}>
      <div style={s.app}>
        <header style={s.header}>
          <div style={s.logoRow}>
            <div style={s.mascot}>🧊</div>
            <div>
              <div style={s.logo}>빙고</div>
              <div style={s.hanja}>氷庫</div>
            </div>
          </div>

          <h1 style={s.hero}>
            안녕하세요 🙂<br />
            공조·냉동 설비가 필요하실 땐<br />
            빙고에 맡겨주세요
          </h1>
        </header>

        <main style={s.body}>
          {tab === "home" && (
            <>
              <h2 style={s.sectionTitle}>무엇이 필요하신가요?</h2>

              {services.map((item, i) => (
                <div key={i} style={s.card}>
                  <div style={s.icon}>{item.icon}</div>
                  <div>
                    <h3 style={s.cardTitle}>{item.title}</h3>
                    <p style={s.cardText}>{item.desc}</p>
                  </div>
                </div>
              ))}

              <button style={s.mainButton}>접수하기</button>
            </>
          )}

          {tab === "requests" && (
            <div style={s.emptyCard}>
              <h2>요청내역</h2>
              <p>접수한 작업 현황이 여기에 표시됩니다.</p>
            </div>
          )}

          {tab === "market" && (
            <div style={s.emptyCard}>
              <h2>중고장터</h2>
              <p>냉동기, 에어컨, 쇼케이스, 부품 거래 공간입니다.</p>
            </div>
          )}

          {tab === "chat" && (
            <div style={s.emptyCard}>
              <h2>채팅</h2>
              <p>고객과 기사 간 상담 공간입니다.</p>
            </div>
          )}

          {tab === "mypage" && (
            <div style={s.emptyCard}>
              <h2>마이페이지</h2>
              <p>내 정보와 접수 내역을 관리합니다.</p>
            </div>
          )}
        </main>

        <nav style={s.nav}>
          <button style={tab === "home" ? s.navActive : s.navBtn} onClick={() => setTab("home")}>홈</button>
          <button style={tab === "requests" ? s.navActive : s.navBtn} onClick={() => setTab("requests")}>요청내역</button>
          <button style={tab === "market" ? s.navActive : s.navBtn} onClick={() => setTab("market")}>중고장터</button>
          <button style={tab === "chat" ? s.navActive : s.navBtn} onClick={() => setTab("chat")}>채팅</button>
          <button style={tab === "mypage" ? s.navActive : s.navBtn} onClick={() => setTab("mypage")}>마이</button>
        </nav>
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: "100vh",
    background: "#eaf6f4",
    display: "flex",
    justifyContent: "center",
    padding: 18,
    fontFamily: "Arial, sans-serif",
  },
  app: {
    width: 390,
    minHeight: 820,
    background: "#f8fbfd",
    borderRadius: 34,
    overflow: "hidden",
    boxShadow: "0 24px 70px rgba(0,0,0,0.16)",
    position: "relative",
  },
  header: {
    background: "linear-gradient(135deg, #c8f1ec, #d9f3ff)",
    padding: "30px 24px 34px",
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  mascot: {
    width: 54,
    height: 54,
    borderRadius: 18,
    background: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 30,
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  },
  logo: {
    fontSize: 30,
    fontWeight: 900,
    color: "#12324a",
    letterSpacing: "-1px",
  },
  hanja: {
    display: "inline-block",
    marginTop: 2,
    fontSize: 11,
    color: "#456",
    background: "rgba(255,255,255,0.65)",
    borderRadius: 8,
    padding: "2px 7px",
  },
  hero: {
    margin: "28px 0 0",
    fontSize: 23,
    lineHeight: 1.45,
    color: "#12324a",
    letterSpacing: "-0.5px",
  },
  body: {
    padding: 20,
    paddingBottom: 95,
  },
  sectionTitle: {
    margin: "0 0 16px",
    fontSize: 20,
    color: "#12324a",
  },
  card: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    background: "white",
    borderRadius: 22,
    padding: 17,
    marginBottom: 13,
    boxShadow: "0 10px 26px rgba(20,60,90,0.08)",
  },
  icon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    background: "#eef9f7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 27,
  },
  cardTitle: {
    margin: 0,
    fontSize: 16,
    color: "#12263a",
  },
  cardText: {
    margin: "5px 0 0",
    fontSize: 13,
    color: "#6b7280",
  },
  mainButton: {
    width: "100%",
    border: 0,
    background: "#38b6a3",
    color: "white",
    borderRadius: 18,
    padding: 17,
    fontSize: 16,
    fontWeight: 900,
    marginTop: 12,
  },
  emptyCard: {
    background: "white",
    borderRadius: 22,
    padding: 24,
    boxShadow: "0 10px 26px rgba(20,60,90,0.08)",
    color: "#12324a",
  },
  nav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 76,
    background: "white",
    borderTop: "1px solid #e5eef2",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
  },
  navBtn: {
    border: 0,
    background: "transparent",
    color: "#8a96a3",
    fontSize: 12,
    fontWeight: 700,
  },
  navActive: {
    border: 0,
    background: "#e8f7f4",
    color: "#179b88",
    borderRadius: 14,
    padding: "10px 12px",
    fontSize: 12,
    fontWeight: 900,
  },
};
