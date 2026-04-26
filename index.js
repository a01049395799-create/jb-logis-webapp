import { useState } from 'react';

export default function Home() {
  const [drivers, setDrivers] = useState([]);
  const [shippers, setShippers] = useState([]);
  const [dispatches, setDispatches] = useState([]);

  const addDriver = (e) => {
    e.preventDefault();
    const f = e.target;
    setDrivers([...drivers,{name:f.name.value,phone:f.phone.value,vehicle:f.vehicle.value,area:f.area.value}]);
    alert('기사 등록 완료');
    f.reset();
  };

  const addShipper = (e) => {
    e.preventDefault();
    const f = e.target;
    setShippers([...shippers,{company:f.company.value,pickup:f.pickup.value,drop:f.drop.value}]);
    alert('화주 문의 접수');
    f.reset();
  };

  const assign = (s,d) => {
    setDispatches([...dispatches,{shipper:s.company,route:`${s.pickup}→${s.drop}`,driver:d.name}]);
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
      {shippers.map((s,i)=><div key={i}>{s.company}/{s.pickup}→{s.drop}</div>)}
      {drivers.map((d,i)=><div key={i}>{d.name}/{d.vehicle} <button onClick={()=>shippers[0]&&assign(shippers[0],d)}>배정</button></div>)}
      {dispatches.map((x,i)=><div key={i}>{x.shipper}/{x.route}/{x.driver}</div>)}
    </div>
  );
}
