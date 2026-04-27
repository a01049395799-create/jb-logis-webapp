import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://ijuxtimblcengcoltcxe.supabase.co',
  'sb_publishable_S4AOBjTFbVE4FMXtjJWFdw_EO7S0ZV-'
);

const S = {
  page:{minHeight:'100vh',background:'#eef3f8',fontFamily:'Arial, sans-serif',color:'#111827'},
  head:{background:'#0b2341',color:'#fff',padding:'26px 20px',borderRadius:'0 0 28px 28px'},
  logo:{fontSize:32,fontWeight:900,letterSpacing:-1},
  sub:{opacity:.85,marginTop:6},
  wrap:{maxWidth:980,margin:'0 auto',padding:18},
  card:{background:'#fff',borderRadius:20,padding:20,margin:'14px 0',boxShadow:'0 10px 30px rgba(15,35,65,.08)'},
  title:{fontSize:21,fontWeight:900,marginBottom:14},
  input:{width:'100%',padding:14,border:'1px solid #d7dde8',borderRadius:12,marginBottom:10,boxSizing:'border-box'},
  select:{width:'100%',padding:14,border:'1px solid #d7dde8',borderRadius:12,marginBottom:10},
  btn:{background:'#1457d9',color:'#fff',border:0,borderRadius:12,padding:'12px 16px',fontWeight:800,margin:'6px 6px 6px 0'},
  dark:{background:'#0b2341',color:'#fff',border:0,borderRadius:12,padding:'12px 16px',fontWeight:800,margin:'6px 6px 6px 0'},
  gray:{background:'#e5eaf2',color:'#223',border:0,borderRadius:12,padding:'12px 16px',fontWeight:800,margin:'6px 6px 6px 0'},
  danger:{background:'#c92a2a',color:'#fff',border:0,borderRadius:12,padding:'12px 16px',fontWeight:800,margin:'6px 6px 6px 0'},
  badge:{display:'inline-block',padding:'6px 10px',borderRadius:999,background:'#e8f1ff',color:'#1457d9',fontWeight:800,fontSize:13,marginRight:6},
  warn:{display:'inline-block',padding:'6px 10px',borderRadius:999,background:'#fff1e6',color:'#b45309',fontWeight:800,fontSize:13,marginRight:6},
  bad:{display:'inline-block',padding:'6px 10px',borderRadius:999,background:'#ffe3e3',color:'#c92a2a',fontWeight:800,fontSize:13,marginRight:6},
  ok:{display:'inline-block',padding:'6px 10px',borderRadius:999,background:'#e7f7ee',color:'#0f7b3a',fontWeight:800,fontSize:13,marginRight:6},
  money:{fontSize:32,fontWeight:900,color:'#0f7b3a',margin:'10px 0'},
  route:{fontSize:18,fontWeight:900,margin:'8px 0'},
  small:{color:'#667085',fontSize:14,lineHeight:1.6},
  nav:{position:'sticky',bottom:0,background:'#fff',borderTop:'1px solid #dde3ec',padding:10,display:'flex',gap:8,justifyContent:'space-around'},
  navBtn:{background:'#f2f5f9',border:0,borderRadius:12,padding:'10px 12px',fontWeight:800}
};

export default function Home(){
  const today = new Date().toISOString().split('T')[0];

  const [user,setUser]=useState(null);
  const [profile,setProfile]=useState(null);
  const [orders,setOrders]=useState([]);
  const [mode,setMode]=useState('login');
  const [tab,setTab]=useState('dispatch');
  const [date,setDate]=useState(today);

  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [name,setName]=useState('');
  const [phone,setPhone]=useState('');
  const [role,setRole]=useState('driver');

  const [pickup,setPickup]=useState('');
  const [dropoff,setDropoff]=useState('');
  const [price,setPrice]=useState('');
  const [paymentTerms,setPaymentTerms]=useState('하차 후 즉시결제');

  useEffect(()=>{
    supabase.auth.getUser().then(({data})=>setUser(data.user));
    loadOrders();

    const ch = supabase.channel('jb-logis-live')
      .on('postgres_changes',{event:'*',schema:'public',table:'shippers'},loadOrders)
      .subscribe();

    return ()=>supabase.removeChannel(ch);
  },[]);

  useEffect(()=>{ if(user) loadProfile(); },[user]);

  const loadProfile=async()=>{
    const {data}=await supabase.from('profiles').select('*').eq('id',user.id).maybeSingle();
    setProfile(data||null);
  };

  const loadOrders=async()=>{
    const {data}=await supabase.from('shippers').select('*').order('created_at',{ascending:false});
    setOrders(data||[]);
  };

  const fmt=n=>!n?'0원':Number(n).toLocaleString()+'원';
  const sameDate=(o,d)=>o.created_at && o.created_at.startsWith(d);

  const settlementDate=(terms)=>{
    const d=new Date();
    if(terms==='하차 후 즉시결제') return d.toISOString().split('T')[0];
    if(terms==='주정산'){
      const day=d.getDay();
      d.setDate(d.getDate()+(day<=5?5-day:12-day));
      return d.toISOString().split('T')[0];
    }
    const next=new Date(d.getFullYear(),d.getMonth()+1,10);
    return next.toISOString().split('T')[0];
  };

  const signUp=async()=>{
    const {error}=await supabase.auth.signUp({email,password});
    if(error) return alert(error.message);
    alert('회원가입 완료. 로그인해주세요.');
    setMode('login');
  };

  const login=async()=>{
    const {error}=await supabase.auth.signInWithPassword({email,password});
    if(error) return alert(error.message);
    location.reload();
  };

  const logout=async()=>{
    await supabase.auth.signOut();
    location.reload();
  };

  const createProfile=async()=>{
    if(!name||!phone) return alert('이름과 연락처를 입력해주세요.');
    const {error}=await supabase.from('profiles').insert([{id:user.id,email:user.email,name,phone,role}]);
    if(error) return alert(error.message);
    location.reload();
  };

  const createOrder=async()=>{
    const p=Number(price);
    if(!pickup||!dropoff||!p||p<=0) return alert('상차지, 하차지, 운임을 입력해주세요.');

    const fee=Math.floor(p*0.05);
    const driverAmount=p-fee;

    const {error}=await supabase.from('shippers').insert([{
      company:profile.name,
      phone:profile.phone,
      pickup,
      dropoff,
      price:p,
      fee,
      driver_amount:driverAmount,
      payment_terms:paymentTerms,
      status:'배차대기',
      payment_status:'미결제',
      settlement_status:'정산대기'
    }]);

    if(error) return alert(error.message);
    alert('운송 요청이 등록되었습니다.');
    setPickup('');setDropoff('');setPrice('');
    loadOrders();
  };

  const takeOrder=async(o)=>{
    const {error}=await supabase.from('shippers')
      .update({assigned_driver:profile.name,status:'배차완료'})
      .eq('id',o.id)
      .eq('status','배차대기');

    if(error) return alert(error.message);
    alert('배차를 받았습니다.');
    loadOrders();
  };

  const updateStatus=async(o,status)=>{
    if(status==='하차완료'){
      const due=settlementDate(o.payment_terms);
      const {error}=await supabase.from('shippers')
        .update({status:'하차완료',payment_status:'결제요청',settlement_due_date:due,settlement_status:'정산대기'})
        .eq('id',o.id);
      if(error) return alert(error.message);
    }else{
      const {error}=await supabase.from('shippers').update({status}).eq('id',o.id);
      if(error) return alert(error.message);
    }
    loadOrders();
  };

  const cancelOrder=async(o,by)=>{
    const reason=prompt('취소 사유를 입력하세요');
    if(!reason) return;

    const {error}=await supabase.from('shippers')
      .update({
        status:'배차취소',
        canceled_by:by,
        cancel_reason:reason,
        canceled_at:new Date().toISOString()
      })
      .eq('id',o.id);

    if(error) return alert(error.message);
    alert('취소 처리되었습니다.');
    loadOrders();
  };

  const payOrder=async(o)=>{
    const {error}=await supabase.from('shippers')
      .update({payment_status:'결제완료'})
      .eq('id',o.id);
    if(error) return alert(error.message);
    alert('결제완료 처리되었습니다.');
    loadOrders();
  };

  const settle=async(o)=>{
    const {error}=await supabase.from('shippers')
      .update({settlement_status:'정산완료'})
      .eq('id',o.id);
    if(error) return alert(error.message);
    alert('정산완료 처리되었습니다.');
    loadOrders();
  };

  const Status=(o)=>(
    <>
      <span style={S.badge}>{o.status||'배차대기'}</span>
      {o.payment_status==='결제완료'
        ? <span style={S.ok}>결제완료</span>
        : <span style={S.warn}>{o.payment_status||'미결제'}</span>}
      {o.settlement_status==='정산완료'
        ? <span style={S.ok}>정산완료</span>
        : <span style={S.warn}>{o.settlement_status||'정산대기'}</span>}
    </>
  );

  if(!user){
    return <div style={S.page}>
      <div style={S.head}><div style={S.logo}>JB LOGIS</div><div style={S.sub}>전국 어디든 빠르고 정확한 배차</div></div>
      <div style={S.wrap}><div style={S.card}>
        <div style={S.title}>{mode==='login'?'로그인':'회원가입'}</div>
        <input style={S.input} placeholder="이메일" onChange={e=>setEmail(e.target.value)}/>
        <input style={S.input} type="password" placeholder="비밀번호" onChange={e=>setPassword(e.target.value)}/>
        {mode==='login'
          ? <>
              <button style={S.btn} onClick={login}>로그인</button>
              <button style={S.dark} onClick={()=>setMode('signup')}>회원가입</button>
            </>
          : <>
              <button style={S.btn} onClick={signUp}>가입하기</button>
              <button style={S.dark} onClick={()=>setMode('login')}>로그인으로</button>
            </>}
      </div></div>
    </div>;
  }

  if(!profile){
    return <div style={S.page}>
      <div style={S.head}><div style={S.logo}>JB LOGIS</div><div style={S.sub}>프로필 설정</div></div>
      <div style={S.wrap}><div style={S.card}>
        <input style={S.input} placeholder="이름 또는 업체명" onChange={e=>setName(e.target.value)}/>
        <input style={S.input} placeholder="연락처" onChange={e=>setPhone(e.target.value)}/>
        <select style={S.select} onChange={e=>setRole(e.target.value)}>
          <option value="driver">기사</option>
          <option value="shipper">화주</option>
        </select>
        <button style={S.btn} onClick={createProfile}>프로필 생성</button>
        <button style={S.dark} onClick={logout}>로그아웃</button>
      </div></div>
    </div>;
  }

  const my=orders.filter(o=>o.assigned_driver===profile.name);
  const datedMy=my.filter(o=>sameDate(o,date));
  const month=my.filter(o=>{
    if(!o.created_at) return false;
    const d=new Date(o.created_at), n=new Date();
    return d.getMonth()===n.getMonth() && d.getFullYear()===n.getFullYear();
  });

  const monthCount=month.length;
  const monthPrice=month.reduce((s,o)=>s+(o.price||0),0);
  const monthDriver=month.reduce((s,o)=>s+(o.driver_amount||0),0);
  const paid=month.filter(o=>o.settlement_status==='정산완료').reduce((s,o)=>s+(o.driver_amount||0),0);
  const unpaid=monthDriver-paid;
  const count=v=>month.filter(o=>o.status===v).length;

  if(profile.role==='shipper'){
    const mine=orders.filter(o=>o.company===profile.name);
    return <div style={S.page}>
      <div style={S.head}><div style={S.logo}>JB LOGIS</div><div style={S.sub}>{profile.name} 화주님</div></div>
      <div style={S.wrap}>
        <button style={S.dark} onClick={logout}>로그아웃</button>

        <div style={S.card}>
          <div style={S.title}>운송 요청</div>
          <input style={S.input} placeholder="상차지" value={pickup} onChange={e=>setPickup(e.target.value)}/>
          <input style={S.input} placeholder="하차지" value={dropoff} onChange={e=>setDropoff(e.target.value)}/>
          <input style={S.input} placeholder="총 운임 예: 300000" value={price} onChange={e=>setPrice(e.target.value)}/>
          <select style={S.select} value={paymentTerms} onChange={e=>setPaymentTerms(e.target.value)}>
            <option value="하차 후 즉시결제">하차 후 즉시결제</option>
            <option value="주정산">주정산</option>
            <option value="월정산">월정산</option>
          </select>
          <button style={S.btn} onClick={createOrder}>운송 요청 등록</button>
        </div>

        <div style={S.card}>
          <div style={S.title}>내 오더 현황</div>
          {mine.map(o=><div key={o.id} style={S.card}>
            <Status {...o}/>
            <div style={S.route}>{o.pickup} → {o.dropoff}</div>
            총 운임: <b>{fmt(o.price)}</b><br/>
            기사 정산: {fmt(o.driver_amount)}<br/>
            기사: {o.assigned_driver||'미배차'}<br/>
            정산예정일: {o.settlement_due_date||'하차완료 후 자동생성'}<br/>
            {o.status==='하차완료' && o.payment_status!=='결제완료' && <button style={S.btn} onClick={()=>payOrder(o)}>결제하기</button>}
            {o.status!=='하차완료' && o.status!=='배차취소' && <button style={S.gray} onClick={()=>cancelOrder(o,'화주')}>요청취소</button>}
          </div>)}
        </div>
      </div>
    </div>;
  }

  if(profile.role==='admin'){
    return <div style={S.page}>
      <div style={S.head}><div style={S.logo}>JB LOGIS</div><div style={S.sub}>관리자 대시보드</div></div>
      <div style={S.wrap}>
        <button style={S.dark} onClick={logout}>로그아웃</button>
        <input style={S.input} type="date" value={date} onChange={e=>setDate(e.target.value)}/>
        {orders.filter(o=>sameDate(o,date)).map(o=><div key={o.id} style={S.card}>
          <Status {...o}/>
          <div style={S.route}>{o.company} / {o.pickup} → {o.dropoff}</div>
          기사: {o.assigned_driver||'미배차'}<br/>
          총 운임: {fmt(o.price)} / 수수료: {fmt(o.fee)} / 기사정산: {fmt(o.driver_amount)}<br/>
          취소자: {o.canceled_by||'-'} / 사유: {o.cancel_reason||'-'}<br/>
          {o.payment_status==='결제완료' && o.settlement_status!=='정산완료' && <button style={S.btn} onClick={()=>settle(o)}>정산완료 처리</button>}
          {o.status!=='배차취소' && <button style={S.danger} onClick={()=>cancelOrder(o,'관리자')}>강제취소</button>}
        </div>)}
      </div>
    </div>;
  }

  return <div style={S.page}>
    <div style={S.head}><div style={S.logo}>JB LOGIS</div><div style={S.sub}>{profile.name} 기사님</div></div>
    <div style={S.wrap}>
      <button style={S.dark} onClick={logout}>로그아웃</button>

      {tab==='dispatch' && <>
        <div style={S.card}>
          <div style={S.title}>배차 가능한 운송</div>
          {orders.filter(o=>o.status==='배차대기').map(o=><div key={o.id} style={S.card}>
            <Status {...o}/>
            <div style={S.money}>{fmt(o.driver_amount)}</div>
            <div style={S.route}>{o.pickup} → {o.dropoff}</div>
            <div style={S.small}>총 운임 {fmt(o.price)} / 수수료 5% {fmt(o.fee)}<br/>결제조건 {o.payment_terms||'하차 후 즉시결제'}</div>
            <button style={S.btn} onClick={()=>takeOrder(o)}>배차받기</button>
          </div>)}
        </div>

        <div style={S.card}>
          <div style={S.title}>내 운송</div>
          {my.filter(o=>o.status!=='배차취소').map(o=><div key={o.id} style={S.card}>
            <Status {...o}/>
            <div style={o.settlement_status==='정산완료'?S.money:{...S.money,color:'#c92a2a'}}>{fmt(o.driver_amount)}</div>
            <div style={S.route}>{o.pickup} → {o.dropoff}</div>
            <div style={S.small}>정산예정일 {o.settlement_due_date||'하차완료 후 자동생성'}<br/>결제조건 {o.payment_terms}</div>
            <button style={S.btn} onClick={()=>updateStatus(o,'운행중')}>운행중</button>
            <button style={S.btn} onClick={()=>updateStatus(o,'하차완료')}>하차완료</button>
            <button style={S.danger} onClick={()=>cancelOrder(o,'기사')}>취소</button>
          </div>)}
        </div>
      </>}

      {tab==='home' && <div style={S.card}>
        <div style={S.title}>마이홈</div>
        <div style={{...S.card,background:'#fff7f7'}}>
          <b style={{color:'#c92a2a'}}>총 미정산 금액 {fmt(unpaid)}</b>
        </div>
        이번 달 운행 건수: <b>{monthCount}건</b><br/>
        이번 달 총 운임: <b>{fmt(monthPrice)}</b><br/>
        기사 정산 예정액: <b>{fmt(monthDriver)}</b><br/>
        정산완료 금액: <b>{fmt(paid)}</b><br/>
        미정산 금액: <b style={{color:'#c92a2a'}}>{fmt(unpaid)}</b><br/><br/>
        배차완료 {count('배차완료')}건 / 운행중 {count('운행중')}건 / 하차완료 {count('하차완료')}건
      </div>}

      {tab==='history' && <div style={S.card}>
        <div style={S.title}>근무내역</div>
        <input style={S.input} type="date" value={date} onChange={e=>setDate(e.target.value)}/>
        {datedMy.map(o=><div key={o.id} style={S.card}>
          <Status {...o}/>
          <div style={o.settlement_status==='정산완료'?S.money:{...S.money,color:'#c92a2a'}}>{fmt(o.driver_amount)}</div>
          <div style={S.route}>{o.pickup} → {o.dropoff}</div>
          정산예정일: {o.settlement_due_date||'미정'}
        </div>)}
      </div>}
    </div>

    <div style={S.nav}>
      <button style={S.navBtn} onClick={()=>setTab('dispatch')}>배차</button>
      <button style={S.navBtn} onClick={()=>setTab('home')}>마이홈</button>
      <button style={S.navBtn} onClick={()=>setTab('history')}>근무내역</button>
    </div>
  </div>;
}
