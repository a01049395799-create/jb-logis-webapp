export default function Home() {
  const menu = [
    { title: "냉동창고 시공", icon: "🏗️", desc: "저온창고 · 냉동창고 설계 및 시공" },
    { title: "에어컨 설치", icon: "❄️", desc: "상업용 · 업소용 · 가정용 설치" },
    { title: "해썹 전문 시공", icon: "🏭", desc: "육가공 · 식품공장 HACCP 설비" },
    { title: "긴급고장출동", icon: "🚨", desc: "냉동기계 · 에어컨 긴급 수리" }
  ];

  return (
    <div style={styles.page}>
      <div style={styles.phone}>
        <div style={styles.header}>
          <div style={styles.badge}>설비 전문 서비스</div>
          <h1>금호냉동산업</h1>
          <p>냉동 · 에어컨 · 해썹 설비 전문</p>
        </div>

        <div style={styles.content}>
          <h2>필요한 서비스를 선택하세요</h2>

          {menu.map((item, i) => (
            <div key={i} style={styles.card}>
              <div style={styles.icon}>{item.icon}</div>
              <div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}

          <button style={styles.mainBtn}>접수하기</button>
          <button style={styles.subBtn}>상담 문의</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#eaf0f7",
    display: "flex",
    justifyContent: "center",
    padding: 20,
    fontFamily: "Arial, sans-serif"
  },
  phone: {
    width: 390,
    background: "#f7f9fc",
    borderRadius: 32,
    overflow: "hidden",
    boxShadow: "0 20px 60px rgba(0,0,0,0.18)"
  },
  header: {
    background: "linear-gradient(135deg,#071f3d,#0d55b8)",
    color: "white",
    padding: 28
  },
  badge: {
    display: "inline-block",
    background: "rgba(255,255,255,0.18)",
    padding: "7px 12px",
    borderRadius: 999,
    fontSize: 12,
    marginBottom: 14
  },
  content: {
    padding: 20
  },
  card: {
    display: "flex",
    gap: 14,
    alignItems: "center",
    background: "white",
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    boxShadow: "0 8px 24px rgba(15,35,65,0.08)"
  },
  icon: {
    fontSize: 34,
    width: 52,
    height: 52,
    borderRadius: 16,
    background: "#eef4ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  mainBtn: {
    width: "100%",
    padding: 16,
    border: 0,
    borderRadius: 16,
    background: "#1457d9",
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 8
  },
  subBtn: {
    width: "100%",
    padding: 15,
    border: "1px solid #cdd6e3",
    borderRadius: 16,
    background: "white",
    fontWeight: "bold",
    fontSize: 15,
    marginTop: 10
  }
};
