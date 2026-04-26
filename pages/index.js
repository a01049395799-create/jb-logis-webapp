import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://ijuxtimblcengcoltcxe.supabase.co',
  'sb_publishable_S4AOBjTFbVE4FMXtjJWFdw_EO7S0ZV-'
);

export default function Home() {
  const [msg, setMsg] = useState('');
  const [drivers, setDrivers] = useState([]);
  const [shippers, setShippers] = useState([]);

  const loadData = async () => {
    const { data: driverData } = await supabase
      .from('drivers')
      .select('*')
      .order('created_at', { ascending: false });

    const { data: shipperData } = await supabase
      .from('shippers')
      .select('*')
      .order('created_at', { ascending: false });

    setDrivers(driverData || []);
    setShippers(shipperData || []);
  };

  useEffect(() => {
    loadData();

    const channel = supabase
      .channel('realtime-update')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'drivers' },
        () => loadData()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'shippers' },
        () => loadData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addDriver = async (e) => {
    e.preventDefault();
    const f = e.target;

    const { error } = await supabase.from('drivers').insert([
      {
        name: f.name.value,
        phone: f.phone.value,
        vehicle: f.vehicle.value,
        area: f.area.value
      }
    ]);

    if (error) {
      setMsg('기사 등록 실패: ' + error.message);
    } else {
      setMsg('기사 등록 성공');
      f.reset();
    }
  };

  const addShipper = async (e) => {
    e.preventDefault();
    const f = e.target;

    const { error } = await supabase.from('shippers').insert([
      {
        company: f.company.value,
        phone: f.phone.value,
        pickup: f.pickup.value,
        dropoff: f.drop.value
      }
    ]);

    if (error) {
      setMsg('화주 문의 실패: ' + error.message);
    } else {
      setMsg('화주 문의 성공');
      f.reset();
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>JB LOGIS WEB APP</h1>
      <h3>전국 어디든 빠르고 정확한 배차</h3>

      <p style={{ color: 'red', fontWeight: 'bold' }}>{msg}</p>

      <h2>협력기사 등록</h2>
      <form onSubmit={addDriver}>
        <input name="name" placeholder="기사명" /><br /><br />
        <input name="phone" placeholder="연락처" /><br /><br />
        <input name="vehicle" placeholder="차량종류" /><br /><br />
        <input name="area" placeholder="활동지역" /><br /><br />
        <button type="submit">기사 등록 신청</button>
      </form>

      <hr />

      <h2>화주 견적문의</h2>
      <form onSubmit={addShipper}>
        <input name="company" placeholder="업체명" /><br /><br />
        <input name="phone" placeholder="연락처" /><br /><br />
        <input name="pickup" placeholder="상차지" /><br /><br />
        <input name="drop" placeholder="하차지" /><br /><br />
        <button type="submit">견적 문의 접수</button>
      </form>

      <hr />

      <h2>관리자 실시간 조회</h2>

      <h3>등록 기사 목록</h3>
      {drivers.map((d) => (
        <div key={d.id} style={{ borderBottom: '1px solid #ccc', padding: '8px 0' }}>
          {d.name} / {d.phone} / {d.vehicle} / {d.area}
        </div>
      ))}

      <h3>화주 문의 목록</h3>
      {shippers.map((s) => (
        <div key={s.id} style={{ borderBottom: '1px solid #ccc', padding: '8px 0' }}>
          {s.company} / {s.phone} / {s.pickup} → {s.dropoff}
        </div>
      ))}
    </div>
  );
}
