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
  const calcDate = (terms) => {
    const d = new Date();

    if (terms === '하차 후 즉시결제') return d.toISOString().split('T')[0];

    if (terms === '주정산') {
      const diff = 5 - d.getDay();
      d.setDate(d.getDate() + diff);
      return d.toISOString().split('T')[0];
    }

    if (terms === '월정산') {
      const next = new Date(d.getFullYear(), d.getMonth() + 1, 10);
      return next.toISOString().split('T')[0];
    }
  };

  // 🔥 상태 변경
  const updateStatus = async (o, status) => {
    if (status === '하차완료') {
      const date = calcDate(o.payment_terms);

      await supabase.from('shippers').update({
        status: '하차완료',
        payment_status: '결제요청',
        settlement_due_date: date
      }).eq('id', o.id);

    } else {
      await supabase.from('shippers').update({ status }).eq('id', o.id);
    }

    loadOrders();
  };

  // 🔥 결제
  const pay = async (id) => {
    await supabase.from('shippers')
      .update({ payment_status: '결제완료' })
      .eq('id', id);

    loadOrders();
  };

  if (!profile) return <div>로딩중...</div>;

  const my = orders.filter(o => o.assigned_driver === profile.name);

  const total = my.reduce((s, o) => s + (o.driver_amount || 0), 0);
  const unpaid = my.filter(o => o.payment_status !== '결제완료')
    .reduce((s, o) => s + (o.driver_amount || 0), 0);

  const paid = my.filter(o => o.payment_status === '결제완료')
    .reduce((s, o) => s + (o.driver_amount || 0), 0);

  // =====================
  // 🔥 마이홈
  // =====================
  if (profile.role === 'driver' && tab === 'home') {
    return (
      <div style={{ padding: 20 }}>
        <h2>마이홈</h2>

        <div>총 수익: {total.toLocaleString()}원</div>
        <div>정산완료: {paid.toLocaleString()}원</div>
        <div style={{ color: 'red' }}>미수금: {unpaid.toLocaleString()}원</div>

        <br />

        {my.map(o => (
          <div key={o.id} style={{ border: '1px solid #ccc', margin: 10, padding: 10 }}>
            {o.pickup} → {o.dropoff}<br />
            금액: {o.driver_amount?.toLocaleString()}원<br />
            상태: {o.status}<br />
            결제: {o.payment_status}<br />
            정산일: {o.settlement_due_date || '미정'}
          </div>
        ))}

        <button onClick={() => setTab('main')}>뒤로</button>
      </div>
    );
  }

  // =====================
  // 🔥 기사 화면
  // =====================
  if (profile.role === 'driver') {
    return (
      <div style={{ padding: 20 }}>
        <h2>기사 ({profile.name})</h2>

        <button onClick={() => setTab('home')}>마이홈</button>

        <h3>내 배차</h3>

        {my.map(o => (
          <div key={o.id} style={{ border: '1px solid #ccc', margin: 10, padding: 10 }}>
            <b>{o.pickup} → {o.dropoff}</b><br />
            금액: {o.driver_amount?.toLocaleString()}원<br />
            상태: {o.status}<br />
            결제: {o.payment_status}<br />
            정산일: {o.settlement_due_date || '미정'}<br />

            <button onClick={() => updateStatus(o, '운행중')}>운행중</button>
            <button onClick={() => updateStatus(o, '하차완료')}>하차완료</button>
          </div>
        ))}
      </div>
    );
  }

  // =====================
  // 🔥 화주
  // =====================
  return (
    <div style={{ padding: 20 }}>
      <h2>화주 ({profile.name})</h2>

      <h3>오더</h3>

      {orders.filter(o => o.company === profile.name).map(o => (
        <div key={o.id} style={{ border: '1px solid #ccc', margin: 10, padding: 10 }}>
          {o.pickup} → {o.dropoff}<br />
          상태: {o.status}<br />
          결제: {o.payment_status}<br />

          {o.status === '하차완료' && o.payment_status !== '결제완료' && (
            <button onClick={() => pay(o.id)}>결제하기</button>
          )}
        </div>
      ))}
    </div>
  );
}
