import { useState } from 'react';

const SUPABASE_URL = 'https://ijuxtimblcengcoltcxe.supabase.co';
const SUPABASE_KEY = 'sb_publishable_S4AOBjTFbVE4FMXtjJWFdw_EO7S0ZV-';

export default function Home() {
  const [drivers, setDrivers] = useState([]);
  const [shippers, setShippers] = useState([]);
  const [dispatches, setDispatches] = useState([]);

  const addDriver = async (e) => {
    e.preventDefault();
    const f = e.target;

    const body = {
      name: f.name.value,
      phone: f.phone.value,
      vehicle: f.vehicle.value,
      area: f.area.value
    };

    await fetch(`${SUPABASE_URL}/rest/v1/drivers`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
      },
      body: JSON.stringify(body)
    });

    alert('기사 등록 완료');
    f.reset();
  };

  const addShipper = async (e) => {
    e.preventDefault();
    const f = e.target;

    const body = {
      company: f.company.value,
      pickup: f.pickup.value,
      dropoff: f.drop.value
    };

    await fetch(`${SUPABASE_URL}/rest/v1/shippers`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
      },
      body: JSON.stringify(body)
    });

    alert('화주 문의 접수');
    f.reset();
  };

  const assign = async (shipper, driver) => {
    const body = {
      shipper: shipper.company,
      route: shipper.pickup + '→' + shipper.dropoff,
      driver: driver.name
    };

    await fetch(`${SUPABASE_URL}/rest/v1/dispatches`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
      },
      body: JSON.stringify(body)
    });

    alert('배차 완료');
  };
  return (
    <div style={{padding:'20px',fontFamily:'Arial'}}>
      <h1>JB LOGIS WEB APP</h1>
      <h3>전국 어디든 빠르고 정확한 배차</h3>

      <h2>협력기사 등록</h2>
      <form onSubmit={addDriver}>
        <input name="name" placeholder="기사명"/><br/><br/>
        <input name="phone" placeholder="연락처"/><br/><br/>
        <input name="vehicle" placeholder="차량종류"/><br/><br/>
        <input name="area" placeholder="활동지역"/><br/><br/>
        <button type="submit">기사 등록 신청</button>
      </form>

      <h2>화주 견적문의</h2>
      <form onSubmit={addShipper}>
        <input name="company" placeholder="업체명"/><br/><br/>
        <input name="pickup" placeholder="상차지"/><br/><br/>
        <input name="drop" placeholder="하차지"/><br/><br/>
        <button type="submit">견적 문의 접수</button>
      </form>

      <h2>배차관리</h2>
      {shippers.map((s,i)=><div key={i}>{s.company}/{s.pickup}→{s.dropoff}</div>)}
      {drivers.map((d,i)=><div key={i}>{d.name}/{d.vehicle} <button onClick={()=>shippers[0]&&assign(shippers[0],d)}>배정</button></div>)}
      {dispatches.map((x,i)=><div key={i}>{x.shipper}/{x.route}/{x.driver}</div>)}
    </div>
  );
}
