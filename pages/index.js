import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://ijuxtimblcengcoltcxe.supabase.co',
  'sb_publishable_S4AOBjTFbVE4FMXtjJWFdw_EO7S0ZV-'
);

const styles = {
  page: { minHeight: '100vh', background: '#f3f6fb', fontFamily: 'Arial, sans-serif', color: '#172033' },
  header: { background: '#0f2747', color: 'white', padding: '28px 22px', borderRadius: '0 0 28px 28px' },
  logo: { fontSize: 34, fontWeight: 800 },
  slogan: { fontSize: 15, opacity: 0.9, marginTop: 6 },
  wrap: { maxWidth: 980, margin: '0 auto', padding: 20 },
  card: { background: 'white', borderRadius: 20, padding: 22, margin: '18px 0', boxShadow: '0 8px 24px rgba(15,39,71,0.08)' },
  input: { width: '100%', padding: 14, borderRadius: 12, border: '1px solid #d8dee9', marginBottom: 12, fontSize: 15, boxSizing: 'border-box' },
  select: { width: '100%', padding: 14, borderRadius: 12, border: '1px solid #d8dee9', marginBottom: 12, fontSize: 15 },
  btn: { background: '#0f62fe', color: 'white', border: 0, padding: '12px 16px', borderRadius: 12, fontWeight: 700, cursor: 'pointer', marginRight: 8, marginTop: 8 },
  btnDark: { background: '#0f2747', color: 'white', border: 0, padding: '12px 16px', borderRadius: 12, fontWeight: 700, cursor: 'pointer', marginRight: 8, marginTop: 8 },
  btnGreen: { background: '#178a43', color: 'white', border: 0, padding: '12px 16px', borderRadius: 12, fontWeight: 700, cursor: 'pointer', marginRight: 8, marginTop: 8 },
  btnRed: { background: '#d93025', color: 'white', border: 0, padding: '12px 16px', borderRadius: 12, fontWeight: 700, cursor: 'pointer', marginRight: 8, marginTop: 8 },
  badge: { display: 'inline-block', padding: '6px 10px', borderRadius: 999, background: '#e8f1ff', color: '#0f62fe', fontWeight: 700, fontSize: 13 },
  payBadge: { display: 'inline-block', padding: '6px 10px', borderRadius: 999, background: '#fff4e5', color: '#b35c00', fontWeight: 700, fontSize: 13 },
  title: { fontSize: 22, fontWeight: 800, marginBottom: 14 },
  money: { fontSize: 30, fontWeight: 900, color: '#178a43', marginBottom: 8 },
  route: { fontSize: 18, fontWeight: 800, marginBottom: 8 },
  small: { color: '#697386', fontSize: 14, lineHeight: 1.6 }
};

export default function Home() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [mode, setMode] = useState('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('driver');

  const [orders, setOrders] = useState([]);
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [price, setPrice] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('하차 후 즉시결제');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    loadOrders();
  }, []);

  useEffect(() => {
    if (user) loadProfile();
  }, [user]);

  const loadProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    setProfile(data || null);
  };

  const loadOrders = async () => {
    const { data } = await supabase
      .from('shippers')
      .select('*')
      .order('created_at', { ascending: false });

    setOrders(data || []);
  };

  const signUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) return alert(error.message);
    alert('회원가입 완료. 로그인해주세요.');
    setMode('login');
  };

  const login = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return alert(error.message);
    location.reload();
  };

  const logout = async () => {
    await supabase.auth.signOut();
    location.reload();
  };

  const createProfile = async () => {
    if (!name || !phone) return alert('이름과 연락처를 입력해주세요.');

    const { error } = await supabase.from('profiles').insert([{
      id: user.id,
      email: user.email,
      name,
      phone,
      role
    }]);

    if (error) return alert('프로필 생성 실패: ' + error.message);

    alert('프로필 생성 완료');
    location.reload();
  };

  const createOrder = async () => {
    const priceNum = Number(price);

    if (!pickup || !dropoff || !priceNum || priceNum <= 0) {
      return alert('상차지, 하차지, 운임을 정확히 입력해주세요.');
    }

    const fee = Math.floor(priceNum * 0.05);
    const driverAmount = priceNum - fee;

    const { error } = await supabase.from('shippers').insert([{
      company: profile.name,
      phone: profile.phone,
      pickup,
      dropoff,
      price: priceNum,
      fee,
      driver_amount: driverAmount,
      status: '배차대기',
      payment_status: '미결제',
      payment_terms: paymentTerms,
      settlement_status: '정산대기'
    }]);

    if (error) return alert('오더 등록 실패: ' + error.message);

    alert('운송 요청이 등록되었습니다.');
    setPickup('');
    setDropoff('');
    setPrice('');
    setPaymentTerms('하차 후 즉시결제');
    loadOrders();
  };

  const payOrder = async (id) => {
    const { error } = await supabase
      .from('shippers')
      .update({ payment_status: '결제완료' })
      .eq('id', id)
      .eq('status', '하차완료');

    if (error) return alert('결제 처리 실패: ' + error.message);

    alert('결제완료 처리되었습니다. JB LOGIS 정산대기 상태입니다.');
    loadOrders();
  };

  const takeOrder = async (id) => {
    const { error } = await supabase.from('shippers')
      .update({
        assigned_driver: profile.name,
        status: '배차완료'
      })
      .eq('id', id)
      .eq('status', '배차대기');

    if (error) return alert('배차 실패: ' + error.message);

    alert('배차를 받았습니다.');
    loadOrders();
  };

  const updateStatus = async (id, status) => {
    const { error } = await supabase.from('shippers')
      .update({ status })
      .eq('id', id);

    if (error) return alert('상태 변경 실패: ' + error.message);

    loadOrders();
  };

  const fmt = (n) => {
    if (!n || Number(n) <= 0) return '-';
    return Number(n).toLocaleString() + '원';
  };

  if (!user) {
    return (
      <div style={styles.page}>
        <div style={styles.header}>
          <div style={styles.logo}>JB LOGIS</div>
          <div style={styles.slogan}>전국 어디든 빠르고 정확한 배차</div>
        </div>

        <div style={styles.wrap}>
          <div style={styles.card}>
            <div style={styles.title}>{mode === 'login' ? '로그인' : '회원가입'}</div>

            <input style={styles.input} placeholder="이메일" onChange={e => setEmail(e.target.value)} />
            <input style={styles.input} type="password" placeholder="비밀번호" onChange={e => setPassword(e.target.value)} />

            {mode === 'login' ? (
              <>
                <button style={styles.btn} onClick={login}>로그인</button>
                <button style={styles.btnDark} onClick={() => setMode('signup')}>회원가입</button>
              </>
            ) : (
              <>
                <button style={styles.btn} onClick={signUp}>가입하기</button>
                <button style={styles.btnDark} onClick={() => setMode('login')}>로그인으로</button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={styles.page}>
        <div style={styles.header}>
          <div style={styles.logo}>JB LOGIS</div>
          <div style={styles.slogan}>첫 이용을 위한 프로필 설정</div>
        </div>

        <div style={styles.wrap}>
          <div style={styles.card}>
            <div style={styles.title}>프로필 설정</div>

            <input style={styles.input} placeholder="이름 또는 업체명" onChange={e => setName(e.target.value)} />
            <input style={styles.input} placeholder="연락처" onChange={e => setPhone(e.target.value)} />

            <select style={styles.select} onChange={e => setRole(e.target.value)}>
              <option value="driver">기사</option>
              <option value="shipper">화주</option>
            </select>

            <button style={styles.btn} onClick={createProfile}>프로필 생성</button>
            <button style={styles.btnDark} onClick={logout}>로그아웃</button>
          </div>
        </div>
      </div>
    );
  }

  if (profile.role === 'shipper') {
    return (
      <div style={styles.page}>
        <div style={styles.header}>
          <div style={styles.logo}>JB LOGIS</div>
          <div style={styles.slogan}>{profile.name} 화주님 전용 화면</div>
        </div>

        <div style={styles.wrap}>
          <button style={styles.btnDark} onClick={logout}>로그아웃</button>

          <div style={styles.card}>
            <div style={styles.title}>운송 요청하기</div>

            <input style={styles.input} placeholder="상차지" value={pickup} onChange={e => setPickup(e.target.value)} />
            <input style={styles.input} placeholder="하차지" value={dropoff} onChange={e => setDropoff(e.target.value)} />
            <input style={styles.input} placeholder="총 운임 예: 300000" value={price} onChange={e => setPrice(e.target.value)} />

            <select style={styles.select} value={paymentTerms} onChange={e => setPaymentTerms(e.target.value)}>
              <option value="하차 후 즉시결제">하차 후 즉시결제</option>
              <option value="주정산">주정산</option>
              <option value="월정산">월정산</option>
            </select>

            <p style={styles.small}>
              결제 원칙: 화주는 운송 완료 확인 후 JB LOGIS로 결제하고, JB LOGIS가 기사에게 정산합니다.<br />
              배차 수수료는 총 운임의 5%입니다.
            </p>

            <button style={styles.btn} onClick={createOrder}>운송 요청 등록</button>
          </div>

          <div style={styles.card}>
            <div style={styles.title}>내 운송 요청 현황</div>

            {orders.filter(o => o.company === profile.name).map(o => (
              <div key={o.id} style={styles.card}>
                <span style={styles.badge}>{o.status || '배차대기'}</span>
                <span style={{ marginLeft: 8 }}></span>
                <span style={styles.payBadge}>{o.payment_status || '미결제'}</span><br /><br />

                <div style={styles.route}>{o.pickup} → {o.dropoff}</div>
                총 운임: <b>{fmt(o.price)}</b><br />
                JB 수수료: {fmt(o.fee)}<br />
                기사 정산 예정액: {fmt(o.driver_amount)}<br />
                결제조건: {o.payment_terms || '하차 후 즉시결제'}<br />
                정산상태: {o.settlement_status || '정산대기'}<br />
                배정 기사: {o.assigned_driver || '미배차'}<br /><br />

                {o.status === '하차완료' && (o.payment_status || '미결제') !== '결제완료' && (
                  <button style={styles.btnGreen} onClick={() => payOrder(o.id)}>
                    결제하기
                  </button>
                )}

                {o.status !== '하차완료' && (o.payment_status || '미결제') !== '결제완료' && (
                  <p style={styles.small}>하차완료 후 결제하기 버튼이 활성화됩니다.</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.logo}>JB LOGIS</div>
        <div style={styles.slogan}>{profile.name} 기사님 전용 화면</div>
      </div>

      <div style={styles.wrap}>
        <button style={styles.btnDark} onClick={logout}>로그아웃</button>

        <div style={styles.card}>
          <div style={styles.title}>배차 가능한 오더</div>

          {orders.filter(o => o.status === '배차대기').map(o => (
            <div key={o.id} style={styles.card}>
              <span style={styles.badge}>배차대기</span>
              <span style={{ marginLeft: 8 }}></span>
              <span style={styles.payBadge}>{o.payment_terms || '하차 후 즉시결제'}</span><br /><br />

              <div style={styles.money}>{fmt(o.driver_amount)}</div>
              <div style={styles.route}>{o.pickup} → {o.dropoff}</div>

              <div style={styles.small}>
                총 운임: {fmt(o.price)}<br />
                JB 수수료 5%: {fmt(o.fee)}<br />
                결제조건: {o.payment_terms || '하차 후 즉시결제'}<br />
                정산방식: JB LOGIS 정산
              </div>

              <button style={styles.btnGreen} onClick={() => takeOrder(o.id)}>
                배차받기
              </button>
            </div>
          ))}
        </div>

        <div style={styles.card}>
          <div style={styles.title}>내 배차 현황</div>

          {orders.filter(o => o.assigned_driver === profile.name).map(o => (
            <div key={o.id} style={styles.card}>
              <span style={styles.badge}>{o.status || '배차완료'}</span>
              <span style={{ marginLeft: 8 }}></span>
              <span style={styles.payBadge}>{o.payment_status || '미결제'}</span><br /><br />

              <div style={styles.money}>{fmt(o.driver_amount)}</div>
              <div style={styles.route}>{o.pickup} → {o.dropoff}</div>

              <div style={styles.small}>
                총 운임: {fmt(o.price)}<br />
                JB 수수료 5%: {fmt(o.fee)}<br />
                결제조건: {o.payment_terms || '하차 후 즉시결제'}<br />
                정산상태: {o.settlement_status || '정산대기'}
              </div>

              <button style={styles.btn} onClick={() => updateStatus(o.id, '운행중')}>운행중</button>
              <button style={styles.btnGreen} onClick={() => updateStatus(o.id, '하차완료')}>하차완료</button>
              <button style={styles.btnRed} onClick={() => updateStatus(o.id, '배차취소')}>취소</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
