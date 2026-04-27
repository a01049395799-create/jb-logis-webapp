export default function Home() {
  return (
    <div style={styles.app}>
      <div style={styles.phone}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.logo}>JB LOGIS</h1>
            <p style={styles.sub}>기사님, 오늘도 안전운행 하세요!</p>
          </div>
          <div style={styles.bell}>🔔</div>
        </div>

        <div style={styles.hero}>
          <div>
            <p style={styles.heroLabel}>오늘 배차 가능</p>
            <h2 style={styles.heroNumber}>8건</h2>
            <p style={styles.heroSub}>업데이트 09:30</p>
          </div>
          <div style={styles.truck}>🚚</div>
        </div>

        <div style={styles.grid}>
          <div style={styles.summary}>
            <p>정산 예정액</p>
            <h3>1,250,000원</h3>
            <span>3건</span>
          </div>
          <div style={styles.summary}>
            <p>이번 달 정산완료</p>
            <h3>3,750,000원</h3>
            <span>12건</span>
          </div>
        </div>

        <div style={styles.sectionTitle}>
          <h3>최근 운행 현황</h3>
          <span>전체보기 ›</span>
        </div>

        {[
          ['운행중', '인천 → 부산', '450,000원', '05.20 09:15'],
          ['하차완료', '김포 → 울산', '650,000원', '05.19 14:20'],
          ['정산완료', '서울 → 광주', '550,000원', '05.18 11:30']
        ].map((item, i) => (
          <div key={i} style={styles.jobCard}>
            <div>
              <span style={{
                ...styles.badge,
                background: item[0] === '운행중' ? '#e8f1ff' : item[0] === '하차완료' ? '#e8f7ee' : '#eef2f7',
                color: item[0] === '운행중' ? '#1457d9' : item[0] === '하차완료' ? '#0f8a43' : '#374151'
              }}>
                {item[0]}
              </span>
              <b style={styles.route}>{item[1]}</b>
              <p style={styles.time}>{item[3]}</p>
            </div>
            <strong style={styles.price}>{item[2]}</strong>
          </div>
        ))}

        <div style={styles.bottomNav}>
          <div style={styles.navActive}>🚚<br />배차</div>
          <div>📦<br />내운송</div>
          <div>🏠<br />마이홈</div>
          <div>📅<br />근무내역</div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    background: '#eaf0f7',
    display: 'flex',
    justifyContent: 'center',
    padding: '24px',
    fontFamily: 'Arial, sans-serif'
  },
  phone: {
    width: '390px',
    minHeight: '820px',
    background: '#f7f9fc',
    borderRadius: '34px',
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
    position: 'relative'
  },
  header: {
    background: 'linear-gradient(135deg,#071f3d,#0d55b8)',
    color: 'white',
    padding: '34px 24px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  logo: { margin: 0, fontSize: '24px', fontWeight: 900 },
  sub: { margin: '8px 0 0', fontSize: '14px', opacity: 0.9 },
  bell: { fontSize: '20px' },
  hero: {
    margin: '16px',
    padding: '22px',
    background: 'linear-gradient(135deg,#0f62fe,#003ea8)',
    borderRadius: '22px',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  heroLabel: { margin: 0, fontSize: '14px', opacity: 0.9 },
  heroNumber: { margin: '8px 0', fontSize: '36px' },
  heroSub: { margin: 0, fontSize: '13px', opacity: 0.85 },
  truck: { fontSize: '56px' },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    padding: '0 16px'
  },
  summary: {
    background: 'white',
    borderRadius: '18px',
    padding: '18px',
    boxShadow: '0 8px 24px rgba(15,35,65,0.08)'
  },
  sectionTitle: {
    padding: '20px 18px 8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  jobCard: {
    margin: '10px 16px',
    background: 'white',
    borderRadius: '18px',
    padding: '16px',
    boxShadow: '0 8px 22px rgba(15,35,65,0.07)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  badge: {
    display: 'inline-block',
    padding: '6px 10px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 800,
    marginRight: '8px'
  },
  route: { fontSize: '15px' },
  time: { margin: '8px 0 0', color: '#6b7280', fontSize: '13px' },
  price: { color: '#111827', fontSize: '15px' },
  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '76px',
    background: 'white',
    borderTop: '1px solid #e5eaf2',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    fontSize: '12px',
    color: '#6b7280'
  },
  navActive: { color: '#1457d9', fontWeight: 900 }
};
