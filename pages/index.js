import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://ijuxtimblcengcoltcxe.supabase.co',
  'sb_publishable_S4AOBjTFbVE4FMXtjJWFdw_EO7S0ZV-'
);

export default function Home() {
  const [orders, setOrders] = useState([]);
  const [myName, setMyName] = useState('');
  const [inputName, setInputName] = useState('');
  const [mode, setMode] = useState('driver'); // driver / shipper

  const loadData = async () => {
    const { data } = await supabase.from('shippers').select('*');
    setOrders(data || []);
  };

  useEffect(() => {
    loadData();

    const ch = supabase
      .channel('rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'shippers' }, loadData)
      .subscribe();

    return () => supabase.removeChannel(ch);
  }, []);

  const login = () => {
    if (!inputName) return alert('이름 입력');
    setMyName(inputName);
  };

  const takeOrder = async (orderId) => {
    await supabase
      .from('shippers')
      .update({
        assigned_driver: myName,
        status: '배차완료'
      })
      .eq('id', orderId)
      .eq('status', '배차대기');

    loadData();
  };

  const updateStatus = async (id, status) => {
    await supabase
      .from('shippers')
      .update({ status })
      .eq('id', id);

    loadData();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>JB LOGIS</h1>

      <button onClick={() => setMode('driver')}>기사모드</button>
      <button onClick={() => setMode('shipper')} style={{ marginLeft: 10 }}>
        화주모드
      </button>

      {!myName && (
        <div>
          <input
            placeholder="이름 입력"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
          />
          <button onClick={login}>로그인</button>
        </div>
      )}

      {/* 기사 모드 */}
      {mode === 'driver' && myName && (
        <div>
          <h3>{myName} 기사님</h3>

          <h2>배차 가능한 오더</h2>
          {orders
            .filter(o => o.status === '배차대기')
            .map(o => (
              <div key={o.id} style={{ border: '1px solid #ccc', margin: 10, padding: 10 }}>
                {o.company} / {o.pickup} → {o.dropoff}
                <br />
                <button onClick={() => takeOrder(o.id)}>배차받기</button>
              </div>
            ))}

          <h2>내 배차</h2>
          {orders
            .filter(o => o.assigned_driver === myName)
            .map(o => (
              <div key={o.id} style={{ border: '1px solid green', margin: 10, padding: 10 }}>
                {o.company} / {o.pickup} → {o.dropoff}
                <br />
                상태: {o.status}
                <br />
                <button onClick={() => updateStatus(o.id, '운행중')}>운행중</button>
                <button onClick={() => updateStatus(o.id, '하차완료')}>하차완료</button>
                <button onClick={() => updateStatus(o.id, '배차취소')}>취소</button>
              </div>
            ))}
        </div>
      )}

      {/* 화주 모드 */}
      {mode === 'shipper' && (
        <div>
          <h2>화주 오더 조회</h2>

          {orders.map(o => (
            <div key={o.id} style={{ border: '1px solid #ccc', margin: 10, padding: 10 }}>
              {o.company} / {o.pickup} → {o.dropoff}
              <br />
              상태: {o.status}
              <br />
              기사: {o.assigned_driver || '미배차'}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
