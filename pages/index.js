import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://ijuxtimblcengcoltcxe.supabase.co',
  'sb_publishable_S4AOBjTFbVE4FMXtjJWFdw_EO7S0ZV-'
);

export default function Home() {
  const [drivers, setDrivers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [msg, setMsg] = useState('');

  const loadData = async () => {
    const { data: d } = await supabase.from('drivers').select('*');
    const { data: s } = await supabase.from('shippers').select('*');

    setDrivers(d || []);
    setOrders(s || []);
  };

  useEffect(() => {
    loadData();

    const ch = supabase
      .channel('rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'shippers' }, loadData)
      .subscribe();

    return () => supabase.removeChannel(ch);
  }, []);

  // 🔥 기사 직접 배차받기
  const takeOrder = async (orderId, driverName) => {
    const { error } = await supabase
      .from('shippers')
      .update({
        assigned_driver: driverName,
        status: '배차완료'
      })
      .eq('id', orderId);

    if (error) {
      alert('배차 실패');
    } else {
      alert('배차 완료');
      loadData();
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>JB LOGIS 기사 화면</h1>
      <p>{msg}</p>

      <h2>배차 가능한 오더</h2>

      {orders
        .filter(o => o.status === '배차대기')
        .map(o => (
          <div key={o.id} style={{ border: '1px solid #ccc', margin: 10, padding: 10 }}>
            <b>{o.company}</b><br/>
            {o.pickup} → {o.dropoff}<br/>
            연락처: {o.phone}<br/><br/>

            {drivers.map(d => (
              <button
                key={d.id}
                style={{ margin: '5px' }}
                onClick={() => takeOrder(o.id, d.name)}
              >
                {d.name} 배차받기
              </button>
            ))}
          </div>
        ))}

      <h2>배차 완료 오더</h2>

      {orders
        .filter(o => o.status === '배차완료')
        .map(o => (
          <div key={o.id} style={{ border: '1px solid green', margin: 10, padding: 10 }}>
            <b>{o.company}</b><br/>
            {o.pickup} → {o.dropoff}<br/>
            기사: {o.assigned_driver}<br/>
            상태: {o.status}
          </div>
        ))}
    </div>
  );
}
