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
    if (!myName) return alert('로그인 필요');

    const { error } = await supabase
      .from('shippers')
      .update({
        assigned_driver: myName,
        status: '배차완료'
      })
      .eq('id', orderId)
      .eq('status', '배차대기'); // 🔥 중복 배차 방지

    if (error) {
      alert('배차 실패');
    } else {
      alert('배차 완료');
      loadData();
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>JB LOGIS 기사앱</h1>

      {!myName ? (
        <div>
          <h3>기사 로그인</h3>
          <input
            placeholder="이름 입력"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
          />
          <button onClick={login} style={{ marginLeft: 10 }}>
            로그인
          </button>
        </div>
      ) : (
        <div>
          <h3>환영합니다, {myName} 기사님</h3>

          <h2>배차 가능한 오더</h2>

          {orders
            .filter(o => o.status === '배차대기')
            .map(o => (
              <div key={o.id} style={{ border: '1px solid #ccc', margin: 10, padding: 10 }}>
                <b>{o.company}</b><br/>
                {o.pickup} → {o.dropoff}<br/>
                연락처: {o.phone}<br/><br/>

                <button onClick={() => takeOrder(o.id)}>
                  배차받기
                </button>
              </div>
            ))}

          <h2>내 배차</h2>

          {orders
            .filter(o => o.assigned_driver === myName)
            .map(o => (
              <div key={o.id} style={{ border: '1px solid green', margin: 10, padding: 10 }}>
                <b>{o.company}</b><br/>
                {o.pickup} → {o.dropoff}<br/>
                상태: {o.status}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
