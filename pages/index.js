import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://ijuxtimblcengcoltcxe.supabase.co',
  'sb_publishable_S4AOBjTFbVE4FMXtjJWFdw_EO7S0ZV-'
);

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

  // 로그인 상태 확인
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  // 프로필 가져오기
  useEffect(() => {
    if (user) {
      supabase.from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
        .then(({ data }) => setProfile(data));
    }
  }, [user]);

  // 데이터 불러오기
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const { data } = await supabase.from('shippers').select('*');
    setOrders(data || []);
  };

  // 회원가입
  const signUp = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) return alert(error.message);

    await supabase.from('profiles').insert([{
      id: data.user.id,
      email,
      name,
      phone,
      role
    }]);

    alert('회원가입 완료');
    setMode('login');
  };

  // 로그인
  const login = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) alert(error.message);
    else location.reload();
  };

  // 로그아웃
  const logout = async () => {
    await supabase.auth.signOut();
    location.reload();
  };

  // 🔥 화주 오더 등록
  const createOrder = async () => {
    const priceNum = Number(price);

    const fee = Math.floor(priceNum * 0.05);
    const driverAmount = priceNum - fee;

    await supabase.from('shippers').insert([{
      company: profile.name,
      pickup,
      dropoff,
      price: priceNum,
      fee,
      driver_amount: driverAmount,
      status: '배차대기'
    }]);

    alert('등록 완료');
    loadOrders();
  };

  // 🔥 기사 배차
  const takeOrder = async (id) => {
    await supabase.from('shippers')
      .update({
        assigned_driver: profile.name,
        status: '배차완료'
      })
      .eq('id', id)
      .eq('status', '배차대기');

    loadOrders();
  };

  // 🔥 상태 변경
  const updateStatus = async (id, status) => {
    await supabase.from('shippers')
      .update({ status })
      .eq('id', id);

    loadOrders();
  };

  // =====================
  // 로그인 화면
  // =====================
  if (!user) {
    return (
      <div style={{ padding: 30, textAlign: 'center' }}>
        <h1>JB LOGIS</h1>

        {mode === 'login' ? (
          <>
            <h2>로그인</h2>
            <input placeholder="이메일" onChange={e => setEmail(e.target.value)} /><br/><br/>
            <input type="password" placeholder="비밀번호" onChange={e => setPassword(e.target.value)} /><br/><br/>
            <button onClick={login}>로그인</button><br/><br/>
            <button onClick={() => setMode('signup')}>회원가입</button>
          </>
        ) : (
          <>
            <h2>회원가입</h2>
            <input placeholder="이름" onChange={e => setName(e.target.value)} /><br/><br/>
            <input placeholder="연락처" onChange={e => setPhone(e.target.value)} /><br/><br/>
            <input placeholder="이메일" onChange={e => setEmail(e.target.value)} /><br/><br/>
            <input type="password" placeholder="비밀번호" onChange={e => setPassword(e.target.value)} /><br/><br/>

            <select onChange={e => setRole(e.target.value)}>
              <option value="driver">기사</option>
              <option value="shipper">화주</option>
            </select><br/><br/>

            <button onClick={signUp}>가입하기</button><br/><br/>
            <button onClick={() => setMode('login')}>로그인으로</button>
          </>
        )}
      </div>
    );
  }

  // =====================
  // 로그인 됐지만 프로필 없음
  // =====================
  if (!profile) {
    return <div style={{ padding: 30 }}>프로필 불러오는 중...</div>;
  }

  // =====================
  // 화주 화면
  // =====================
  if (profile.role === 'shipper') {
    return (
      <div style={{ padding: 20 }}>
        <h2>화주 화면 ({profile.name})</h2>
        <button onClick={logout}>로그아웃</button>

        <h3>운송 요청</h3>
        <input placeholder="상차지" onChange={e => setPickup(e.target.value)} /><br/><br/>
        <input placeholder="하차지" onChange={e => setDropoff(e.target.value)} /><br/><br/>
        <input placeholder="운임" onChange={e => setPrice(e.target.value)} /><br/><br/>
        <button onClick={createOrder}>요청하기</button>

        <h3>내 오더</h3>
        {orders
          .filter(o => o.company === profile.name)
          .map(o => (
            <div key={o.id} style={{ border: '1px solid #ccc', margin: 10, padding: 10 }}>
              {o.pickup} → {o.dropoff}<br/>
              운임: {o.price}원<br/>
              상태: {o.status}<br/>
              기사: {o.assigned_driver || '미배차'}
            </div>
          ))}
      </div>
    );
  }

  // =====================
  // 기사 화면
  // =====================
  return (
    <div style={{ padding: 20 }}>
      <h2>기사 화면 ({profile.name})</h2>
      <button onClick={logout}>로그아웃</button>

      <h3>배차 가능한 오더</h3>
      {orders
        .filter(o => o.status === '배차대기')
        .map(o => (
          <div key={o.id} style={{ border: '1px solid #ccc', margin: 10, padding: 10 }}>
            {o.pickup} → {o.dropoff}<br/>
            운임: {o.price}원<br/>
            기사정산: {o.driver_amount}원<br/>
            수수료: {o.fee}원<br/><br/>
            <button onClick={() => takeOrder(o.id)}>배차받기</button>
          </div>
        ))}

      <h3>내 배차</h3>
      {orders
        .filter(o => o.assigned_driver === profile.name)
        .map(o => (
          <div key={o.id} style={{ border: '1px solid green', margin: 10, padding: 10 }}>
            {o.pickup} → {o.dropoff}<br/>
            상태: {o.status}<br/>
            기사정산: {o.driver_amount}원<br/><br/>

            <button onClick={() => updateStatus(o.id, '운행중')}>운행중</button>
            <button onClick={() => updateStatus(o.id, '하차완료')}>완료</button>
            <button onClick={() => updateStatus(o.id, '배차취소')}>취소</button>
          </div>
        ))}
    </div>
  );
}
