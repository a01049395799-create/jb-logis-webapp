import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://ijuxtimblcengcoltcxe.supabase.co',
  'sb_publishable_S4AOBjTFbVE4FMXtjJWFdw_EO7S0ZV-'
);

export default function Home() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState('main');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    loadOrders();
  }, []);

  useEffect(() => {
    if (user) loadProfile();
  }, [user]);

  const loadProfile = async () => {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
    setProfile(data);
  };

  const loadOrders = async () => {
    const { data } = await supabase.from('shippers').select('*');
    setOrders(data || []);
  };

  // 🔥 정산일 계산
  const getSettlementDate = (terms) => {
    const today = new Date();

    if (terms === '하차 후 즉시결제') {
      return today.toISOString().split('T')[0];
    }

    if (terms === '주정산') {
      const day = today.getDay();
      const diff = 5 - day; // 금요일
      const next = new Date(today);
      next.setDate(today.getDate() + diff);
      return next.toISOString().split('T')[0];
    }

    if (terms === '월정산') {
      const next = new Date(today.getFullYear(), today.getMonth() + 1, 10);
      return next.toISOString().split('T')[0];
    }

    return null;
  };

  // 🔥 상태 변경 (핵심)
  const updateStatus = async (id, status, terms) => {
    if (status === '하차완료') {
      const dueDate = getSettlementDate(terms);

      await supabase.from('shippers')
        .update({
          status: '하차완료',
          payment_status: '결제요청',
          settlement_due_date: dueDate
        })
        .eq('id', id);

    } else {
      await supabase.from('shippers')
        .update({ status })
        .eq('id', id);
    }

    loadOrders();
  };

  // 🔥 마이홈 계산
  const myOrders = orders.filter(o => o.assigned_driver === profile?.name);

  const total = myOrders.reduce((sum, o) => sum + (o.driver_amount || 0), 0);
  const unpaid = myOrders.filter(o => o.payment_status !== '결제완료')
    .reduce((sum, o) => sum + (o.driver_amount || 0), 0);

  const paid = myOrders.filter(o => o.payment_status === '결제완료')
    .reduce((sum, o) => sum + (o.driver_amount || 0), 0);

  if (!profile) return <div>로딩중...</div>;

  // =======================
  // 🔥 기사 마이홈
  // =======================
  if (profile.role === 'driver' && tab === 'home') {
    return (
      <div style={{ padding: 20 }}>
        <h2>기사 마이홈</h2>

        <div>총 운행 수익: {total.toLocaleString()}원</div>
        <div>정산 완료: {paid.toLocaleString()}원</div>
        <div>미수금: {unpaid.toLocaleString()}원</div>

        <br />

        {myOrders.map(o => (
          <div key={o.id} style={{ border: '1px solid #ccc', padding: 10, margin: 10 }}>
            {o.pickup} → {o.dropoff}<br />
            정산금: {o.driver_amount?.toLocaleString()}원<br />
            결제상태: {o.payment_status}<br />
            정산예정일: {o.settlement_due_date}
          </div>
        ))}

        <button onClick={() => setTab('main')}>뒤로</button>
      </div>
    );
  }

  // =======================
  // 🔥 기사 메인
  // =======================
  if (profile.role === 'driver') {
    return (
      <div style={{ padding: 20 }}>
        <h2>기사 화면 ({profile.name})</h2>

        <button onClick={() => setTab('home')}>마이홈</button>

        <h3>내 배차</h3>

        {myOrders.map(o => (
          <div key={o.id} style={{ border: '1px solid #ccc', padding: 10, margin: 10 }}>
            <b>{o.pickup} → {o.dropoff}</b><br />
            금액: {o.driver_amount?.toLocaleString()}원<br />
            상태: {o.status}<br />
            결제: {o.payment_status}<br />
            정산일: {o.settlement_due_date}<br />

            <button onClick={() => updateStatus(o.id, '운행중')}>운행중</button>
            <button onClick={() => updateStatus(o.id, '하차완료', o.payment_terms)}>하차완료</button>
          </div>
        ))}
      </div>
    );
  }

  return <div>화주 화면 생략 (기존 그대로 유지)</div>;
}
