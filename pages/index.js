import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://ijuxtimblcengcoltcxe.supabase.co',
  'sb_publishable_S4AOBjTFbVE4FMXtjJWFdw_EO7S0ZV-'
);

export default function Home() {
  const [drivers, setDrivers] = useState([]);
  const [shippers, setShippers] = useState([]);
  const [dispatches, setDispatches] = useState([]);
  const [msg, setMsg] = useState('');

  const loadData = async () => {
    const { data: d } = await supabase.from('drivers').select('*');
    const { data: s } = await supabase.from('shippers').select('*');
    const { data: ds } = await supabase.from('dispatches').select('*');

    setDrivers(d || []);
    setShippers(s || []);
    setDispatches(ds || []);
  };

  useEffect(() => {
    loadData();

    const ch = supabase
      .channel('rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'dispatches' }, loadData)
      .subscribe();

    return () => supabase.removeChannel(ch);
  }, []);

  const assignDispatch = async (shipper, driverId) => {
    const driver = drivers.find(d => String(d.id) === driverId);

    if (!driver) return alert('기사 선택');

    await supabase.from('dispatches').insert([{
      shipper: shipper.company,
      route: shipper.pickup + ' → ' + shipper.dropoff,
      driver: driver.name,
      status: '배차완료'
    }]);

    setMsg('배차 완료');
  };

  const updateStatus = async (id, status) => {
    await supabase.from('dispatches')
      .update({ status })
      .eq('id', id);

    setMsg('상태 변경: ' + status);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>JB LOGIS</h1>
      <p>{msg}</p>

      <h2>배차 현황</h2>

      {dispatches.map(d => (
        <div key={d.id} style={{ border: '1px solid #ccc', margin: 10, padding: 10 }}>
          <b>{d.shipper}</b><br/>
          {d.route}<br/>
          기사: {d.driver}<br/>
          상태: <b>{d.status}</b><br/><br/>

          <button onClick={() => updateStatus(d.id, '운행중')}>운행중</button>
          <button onClick={() => updateStatus(d.id, '완료')}>완료</button>
          <button onClick={() => updateStatus(d.id, '취소됨')}>취소</button>
        </div>
      ))}
    </div>
  );
}
