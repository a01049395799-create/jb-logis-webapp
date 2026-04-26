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
  const [dispatches, setDispatches] = useState([]);

  const loadData = async () => {
    const { data: driverData } = await supabase
      .from('drivers')
      .select('*')
      .order('created_at', { ascending: false });

    const { data: shipperData } = await supabase
      .from('shippers')
      .select('*')
      .order('created_at', { ascending: false });

    const { data: dispatchData } = await supabase
      .from('dispatches')
      .select('*')
      .order('created_at', { ascending: false });

    setDrivers(driverData || []);
    setShippers(shipperData || []);
    setDispatches(dispatchData || []);
  };

  useEffect(() => {
    loadData();

    const channel = supabase
      .channel('jb-logis-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'drivers' }, loadData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'shippers' }, loadData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'dispatches' }, loadData)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const addDriver = async (e) => {
    e.preventDefault();
    const f = e.target;

    const { error } = await supabase.from('drivers').insert([{
      name: f.name.value,
      phone: f.phone.value,
      vehicle: f.vehicle.value,
      area: f.area.value
    }]);

    if (error) {
      alert('기사 등록 실패: ' + error.message);
      setMsg('기사 등록 실패');
    } else {
      alert('기사 등록 성공');
      setMsg('기사 등록 성공');
      f.reset();
      loadData();
    }
  };

  const addShipper = async (e) => {
    e.preventDefault();
    const f = e.target;

    const { error } = await supabase.from('shippers').insert([{
      company: f.company.value,
      phone: f.phone.value,
      pickup: f.pickup.value,
      dropoff: f.drop.value
    }]);

    if (error) {
      alert('화주 문의 실패: ' + error.message);
      setMsg('화주 문의 실패');
    } else {
      alert('화주 문의 성공');
      setMsg('화주 문의 성공');
      f.reset();
      loadData();
    }
  };

  const assignDispatch = async (shipper, driverId) => {
    const driver = drivers.find((d) => String(d.id) === String(driverId));

    if (!driver) {
      alert('기사를 선택하세요');
      return;
    }

    const { error } = await supabase.from('dispatches').insert([{
      shipper: shipper.company,
      route: shipper.pickup + ' → ' + shipper.dropoff,
      driver: driver.name,
      status: '배차완료'
    }]);

    if (error) {
      alert('배차 실패: ' + error.message);
      setMsg('배차 실패');
    } else {
      alert('배차 완료');
      setMsg('배차 완료');
      loadData();
    }
  };

  const updateStatus = async (id, status) => {
    const { error } = await supabase
      .from('dispatches')
      .update({ status: status })
      .eq('id', id);

    if (error) {
      alert('상태 변경 실패: ' + error.message);
      setMsg('상태 변경 실패');
    } else {
      alert('상태 변경 완료: ' + status);
      setMsg('상태 변경 완료: ' + status);
      loadData();
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>JB LOGIS</h1>
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

      <h2>관리자 배차관리</h2>

      <h3>화주 오더 목록</h3>
      {shippers.map((s) => (
        <div key={s.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
          <b>{s.company}</b> / {s.phone}<br />
          {s.pickup} → {s.dropoff}<br /><br />

          <select id={'driver-' + s.id}>
            <option value="">기사 선택</option>
            {drivers.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} / {d.vehicle} / {d.area}
              </option>
            ))}
          </select>

          <button
            style={{ marginLeft: '10px' }}
            onClick={() => assignDispatch(s, document.getElementById('driver-' + s.id).value)}
          >
            배차하기
          </button>
        </div>
      ))}

      <h3>배차 현황</h3>
      {dispatches.map((d) => (
        <div key={d.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
          <b>{d.shipper}</b><br />
          {d.route}<br />
          기사: {d.driver}<br />
          상태: <b>{d.status || '배차완료'}</b><br /><br />

          <button onClick={() => updateStatus(d.id, '운행중')}>운행중</button>
          <button onClick={() => updateStatus(d.id, '완료')} style={{ marginLeft: '5px' }}>완료</button>
          <button onClick={() => updateStatus(d.id, '취소됨')} style={{ marginLeft: '5px' }}>취소</button>
        </div>
      ))}
    </div>
  );
}
