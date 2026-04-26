import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://ijuxtimblcengcoltcxe.supabase.co',
  'sb_publishable_S4AOBjTFbVE4FMXtjJWFdw_EO7S0ZV-'
);

export default function Home() {
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState(null);
  const [price, setPrice] = useState('');
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');

  useEffect(() => {
    loadData();
    getProfile();
  }, []);

  const loadData = async () => {
    const { data } = await supabase.from('shippers').select('*');
    setOrders(data || []);
  };

  const getProfile = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setProfile(data);
    }
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

    alert('오더 등록 완료');
    loadData();
  };

  // 🔥 기사 배차
  const takeOrder = async (id) => {
    await supabase
      .from('shippers')
      .update({
        assigned_driver: profile.name,
        status: '배차완료'
      })
      .eq('id', id)
      .eq('status', '배차대기');

    loadData();
  };

  // 🔥 상태 변경
  const updateStatus = async (id, status) => {
    await supabase
      .from('shippers')
      .update({ status })
      .eq('id', id);

    loadData();
  };

  if (!profile) return <div>로딩중...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>JB LOGIS</h1>

      {/* 화주 화면 */}
      {profile.role === 'shipper' && (
        <>
          <h2>운송 요청</h2>

          <input placeholder="상차지" onChange={e => setPickup(e.target.value)} /><br/><br/>
          <input placeholder="하차지" onChange={e => setDropoff(e.target.value)} /><br/><br/>
          <input placeholder="운임" onChange={e => setPrice(e.target.value)} /><br/><br/>

          <button onClick={createOrder}>요청하기</button>

          <h2>내 오더</h2>

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
        </>
      )}

      {/* 기사 화면 */}
      {profile.role === 'driver' && (
        <>
          <h2>배차 가능한 오더</h2>

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

          <h2>내 배차</h2>

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
        </>
      )}
    </div>
  );
}
