import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://ijuxtimblcengcoltcxe.supabase.co',
  'sb_publishable_S4AOBjTFbVE4FMXtjJWFdw_EO7S0ZV-'
);

const styles = {
  page:{minHeight:'100vh',background:'#f3f6fb',fontFamily:'Arial',color:'#172033'},
  header:{background:'#0f2747',color:'white',padding:'28px 22px',borderRadius:'0 0 28px 28px'},
  logo:{fontSize:34,fontWeight:800},
  slogan:{fontSize:15,opacity:.9,marginTop:6},
  wrap:{maxWidth:980,margin:'0 auto',padding:20},
  card:{background:'white',borderRadius:18,padding:20,margin:'16px 0',boxShadow:'0 8px 24px rgba(15,39,71,.08)'},
  input:{width:'100%',padding:14,borderRadius:12,border:'1px solid #d8dee9',marginBottom:12,fontSize:15,boxSizing:'border-box'},
  select:{width:'100%',padding:14,borderRadius:12,border:'1px solid #d8dee9',marginBottom:12,fontSize:15},
  btn:{background:'#0f62fe',color:'white',border:0,padding:'12px 16px',borderRadius:12,fontWeight:700,marginRight:8,marginTop:8},
  dark:{background:'#0f2747',color:'white',border:0,padding:'12px 16px',borderRadius:12,fontWeight:700,marginRight:8,marginTop:8},
  green:{background:'#178a43',color:'white',border:0,padding:'12px 16px',borderRadius:12,fontWeight:700,marginRight:8,marginTop:8},
  red:{background:'#d93025',color:'white',border:0,padding:'12px 16px',borderRadius:12,fontWeight:700,marginRight:8,marginTop:8},
  badge:{display:'inline-block',padding:'6px 10px',borderRadius:999,background:'#e8f1ff',color:'#0f62fe',fontWeight:700,fontSize:13},
  pay:{display:'inline-block',padding:'6px 10px',borderRadius:999,background:'#fff4e5',color:'#b35c00',fontWeight:700,fontSize:13,marginLeft:8},
  title:{fontSize:22,fontWeight:800,marginBottom:14},
  money:{fontSize:30,fontWeight:900,color:'#178a43',marginBottom:8},
  route:{fontSize:18,fontWeight:800,marginBottom:8},
  small:{color:'#697386',fontSize:14,lineHeight:1.6},
  unpaidBox:{background:'#ffe5e5',color:'#d93025',padding:14,borderRadius:14,fontWeight:900,margin:'12px 0'},
  paidText:{color:'#178a43',fontWeight:900},
  unpaidText:{color:'#d93025',fontWeight:900}
};

export default function Home() {
  const today = new Date().toISOString().split('T')[0];

  const [user,setUser]=useState(null);
  const [profile,setProfile]=useState(null);
  const [orders,setOrders]=useState([]);
  const [mode,setMode]=useState('login');
  const [tab,setTab]=useState('main');
  const [selectedDate,setSelectedDate]=useState(today);

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
  },[]);

  useEffect(()=>{
    if(user) loadProfile();
  },[user]);

  const loadProfile=async()=>{
    const {data}=await supabase.from('profiles').select('*').eq('id',user.id).maybeSingle();
    setProfile(data||null);
  };

  const loadOrders=async()=>{
    const {data}=await supabase.from('shippers').select('*').order('created_at',{ascending:false});
    setOrders(data||[]);
  };

  const fmt=(n)=>!n?'0원':Number(n).toLocaleString()+'원';

  const isSameDate=(o,date)=>{
    if(!o.created_at) return false;
    return o.created_at.startsWith(date);
  };

  const calcSettlementDate=(terms)=>{
    const d=new Date();
    if(terms==='하차 후 즉시결제') return d.toISOString().split('T')[0];
    if(terms==='주정산'){
      const day=d.getDay();
      const diff=day<=5?5-day:12-day;
      d.setDate(d.getDate()+diff);
      return d.toISOString().split('T')[0];
    }
    if(terms==='월정산'){
      const next=new Date(d.getFullYear(),d.getMonth()+1,10);
      return next.toISOString().split('T')[0];
    }
    return d.toISOString().split('T')[0];
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
    if(error) return alert('프로필 생성 실패: '+error.message);
    alert('프로필 생성 완료');
    location.reload();
  };

  const createOrder=async()=>{
    const priceNum=Number(price);
    if(!pickup||!dropoff||!priceNum||priceNum<=0) return alert('상차지, 하차지, 운임을 입력해주세요.');

    const fee=Math.floor(priceNum*0.05);
    const driverAmount=priceNum-fee;

    const {error}=await supabase.from('shippers').insert([{
      company:profile.name,
      phone:profile.phone,
      pickup,
      dropoff,
      price:priceNum,
      fee,
      driver_amount:driverAmount,
      payment_terms:paymentTerms,
      status:'배차대기',
      payment_status:'미결제',
      settlement_status:'정산대기'
    }]);

    if(error) return alert('오더 등록 실패: '+error.message);
    alert('운송 요청 등록 완료');
    setPickup('');
    setDropoff('');
    setPrice('');
    loadOrders();
  };

  const takeOrder=async(id)=>{
    const {error}=await supabase.from('shippers')
      .update({assigned_driver:profile.name,status:'배차완료'})
      .eq('id',id)
      .eq('status','배차대기');

    if(error) return alert('배차 실패: '+error.message);
    alert('배차 완료');
    loadOrders();
  };

  const updateStatus=async(order,status)=>{
    if(status==='하차완료'){
      const due=calcSettlementDate(order.payment_terms);
      const {error}=await supabase.from('shippers')
        .update({
          status:'하차완료',
          payment_status:'결제요청',
          settlement_due_date:due,
          settlement_status:'정산대기'
        })
        .eq('id',order.id);
      if(error) return alert('상태 변경 실패: '+error.message);
    } else {
      const {error}=await supabase.from('shippers').update({status}).eq('id',order.id);
      if(error) return alert('상태 변경 실패: '+error.message);
    }
    loadOrders();
  };

  const payOrder=async(id)=>{
    const {error}=await supabase.from('shippers').update({payment_status:'결제완료'}).eq('id',id);
    if(error) return alert('결제 처리 실패: '+error.message);
    alert('결제완료 처리되었습니다.');
    loadOrders();
  };

  const completeSettlement=async(id)=>{
    const {error}=await supabase.from('shippers').update({settlement_status:'정산완료'}).eq('id',id);
    if(error) return alert('정산 처리 실패: '+error.message);
    alert('정산완료 처리되었습니다.');
    loadOrders();
  };

  if(!user){
    return (
      <div style={styles.page}>
        <div style={styles.header}><div style={styles.logo}>JB LOGIS</div><div style={styles.slogan}>전국 어디든 빠르고 정확한 배차</div></div>
        <div style={styles.wrap}><div style={styles.card}>
          <div style={styles.title}>{mode==='login'?'로그인':'회원가입'}</div>
          <input style={styles.input} placeholder="이메일" onChange={e=>setEmail(e.target.value)} />
          <input style={styles.input} type="password" placeholder="비밀번호" onChange={e=>setPassword(e.target.value)} />
          {mode==='login'?(
            <>
              <button style={styles.btn} onClick={login}>로그인</button>
              <button style={styles.dark} onClick={()=>setMode('signup')}>회원가입</button>
            </>
          ):(
            <>
              <button style={styles.btn} onClick={signUp}>가입하기</button>
              <button style={styles.dark} onClick={()=>setMode('login')}>로그인으로</button>
            </>
          )}
        </div></div>
      </div>
    );
  }

  if(!profile){
    return (
      <div style={styles.page}>
        <div style={styles.header}><div style={styles.logo}>JB LOGIS</div><div style={styles.slogan}>첫 이용을 위한 프로필 설정</div></div>
        <div style={styles.wrap}><div style={styles.card}>
          <div style={styles.title}>프로필 설정</div>
          <input style={styles.input} placeholder="이름 또는 업체명" onChange={e=>setName(e.target.value)} />
          <input style={styles.input} placeholder="연락처" onChange={e=>setPhone(e.target.value)} />
          <select style={styles.select} onChange={e=>setRole(e.target.value)}>
            <option value="driver">기사</option>
            <option value="shipper">화주</option>
            <option value="admin">관리자</option>
          </select>
          <button style={styles.btn} onClick={createProfile}>프로필 생성</button>
          <button style={styles.dark} onClick={logout}>로그아웃</button>
        </div></div>
      </div>
    );
  }

  const myOrders=orders.filter(o=>o.assigned_driver===profile.name);
  const datedMyOrders=myOrders.filter(o=>isSameDate(o,selectedDate));
  const datedAllOrders=orders.filter(o=>isSameDate(o,selectedDate));

  const thisMonth=myOrders.filter(o=>{
    if(!o.created_at) return false;
    const d=new Date(o.created_at), now=new Date();
    return d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear();
  });

  const monthCount=thisMonth.length;
  const monthTotal=thisMonth.reduce((s,o)=>s+(o.price||0),0);
  const driverTotal=thisMonth.reduce((s,o)=>s+(o.driver_amount||0),0);
  const settled=thisMonth.filter(o=>o.settlement_status==='정산완료').reduce((s,o)=>s+(o.driver_amount||0),0);
  const unpaid=thisMonth.filter(o=>o.settlement_status!=='정산완료').reduce((s,o)=>s+(o.driver_amount||0),0);
  const countStatus=(v)=>thisMonth.filter(o=>o.status===v).length;
  const countSettlement=(v)=>thisMonth.filter(o=>o.settlement_status===v).length;

  if(profile.role==='shipper'){
    return (
      <div style={styles.page}>
        <div style={styles.header}><div style={styles.logo}>JB LOGIS</div><div style={styles.slogan}>{profile.name} 화주님 전용 화면</div></div>
        <div style={styles.wrap}>
          <button style={styles.dark} onClick={logout}>로그아웃</button>

          <div style={styles.card}>
            <div style={styles.title}>운송 요청하기</div>
            <input style={styles.input} placeholder="상차지" value={pickup} onChange={e=>setPickup(e.target.value)} />
            <input style={styles.input} placeholder="하차지" value={dropoff} onChange={e=>setDropoff(e.target.value)} />
            <input style={styles.input} placeholder="총 운임 예: 300000" value={price} onChange={e=>setPrice(e.target.value)} />
            <select style={styles.select} value={paymentTerms} onChange={e=>setPaymentTerms(e.target.value)}>
              <option value="하차 후 즉시결제">하차 후 즉시결제</option>
              <option value="주정산">주정산</option>
              <option value="월정산">월정산</option>
            </select>
            <p style={styles.small}>운송 완료 후 화주는 JB LOGIS로 결제하고, JB LOGIS가 기사에게 정산합니다. 수수료는 총 운임의 5%입니다.</p>
            <button style={styles.btn} onClick={createOrder}>운송 요청 등록</button>
          </div>

          <div style={styles.card}>
            <div style={styles.title}>내 운송 요청 현황</div>
            {orders.filter(o=>o.company===profile.name).map(o=>(
              <div key={o.id} style={styles.card}>
                <span style={styles.badge}>{o.status||'배차대기'}</span><span style={styles.pay}>{o.payment_status||'미결제'}</span><br/><br/>
                <div style={styles.route}>{o.pickup} → {o.dropoff}</div>
                총 운임: <b>{fmt(o.price)}</b><br/>
                기사 정산 예정액: {fmt(o.driver_amount)}<br/>
                결제조건: {o.payment_terms||'하차 후 즉시결제'}<br/>
                정산상태: {o.settlement_status||'정산대기'}<br/>
                정산예정일: {o.settlement_due_date||'하차완료 후 자동생성'}<br/>
                배정 기사: {o.assigned_driver||'미배차'}<br/><br/>
                {o.status==='하차완료'&&o.payment_status!=='결제완료'&&(
                  <button style={styles.green} onClick={()=>payOrder(o.id)}>결제하기</button>
                )}
                {o.status!=='하차완료'&&o.payment_status!=='결제완료'&&(
                  <p style={styles.small}>하차완료 후 결제하기 버튼이 활성화됩니다.</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if(profile.role==='admin'){
    return (
      <div style={styles.page}>
        <div style={styles.header}><div style={styles.logo}>JB LOGIS</div><div style={styles.slogan}>관리자 정산관리</div></div>
        <div style={styles.wrap}>
          <button style={styles.dark} onClick={logout}>로그아웃</button>
          <div style={styles.card}>
            <div style={styles.title}>조회 날짜</div>
            <input style={styles.input} type="date" value={selectedDate} onChange={e=>setSelectedDate(e.target.value)} />
          </div>
          <div style={styles.card}><div style={styles.title}>전체 오더 / 정산관리</div>
          {datedAllOrders.map(o=>(
            <div key={o.id} style={styles.card}>
              <b>{o.company}</b> / {o.pickup} → {o.dropoff}<br/>
              기사: {o.assigned_driver||'미배차'}<br/>
              총 운임: {fmt(o.price)} / 수수료: {fmt(o.fee)} / 기사정산: {fmt(o.driver_amount)}<br/>
              상태: {o.status} / 결제: {o.payment_status||'미결제'} / 정산: {o.settlement_status||'정산대기'}<br/>
              정산예정일: {o.settlement_due_date||'미정'}<br/>
              {o.payment_status==='결제완료'&&o.settlement_status!=='정산완료'&&(
                <button style={styles.green} onClick={()=>completeSettlement(o.id)}>정산완료 처리</button>
              )}
            </div>
          ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}><div style={styles.logo}>JB LOGIS</div><div style={styles.slogan}>{profile.name} 기사님 전용 화면</div></div>
      <div style={styles.wrap}>
        <button style={styles.dark} onClick={logout}>로그아웃</button>
        <button style={styles.btn} onClick={()=>setTab('main')}>배차현황</button>
        <button style={styles.btn} onClick={()=>setTab('home')}>마이홈</button>
        <button style={styles.btn} onClick={()=>setTab('history')}>근무내역</button>

        <div style={styles.card}>
          <div style={styles.title}>조회 날짜</div>
          <input style={styles.input} type="date" value={selectedDate} onChange={e=>setSelectedDate(e.target.value)} />
        </div>

        {tab==='home'&&(
          <div style={styles.card}>
            <div style={styles.title}>기사 마이홈</div>
            <div style={styles.unpaidBox}>총 미정산 금액: {fmt(unpaid)}</div>
            이번 달 운행 건수: <b>{monthCount}건</b><br/>
            이번 달 총 운임: <b>{fmt(monthTotal)}</b><br/>
            기사 정산 예정액: <b>{fmt(driverTotal)}</b><br/>
            정산완료 금액: <b>{fmt(settled)}</b><br/>
            미정산 금액: <b style={{color:'red'}}>{fmt(unpaid)}</b><br/><br/>
            <b>상태별 건수</b><br/>
            배차완료: {countStatus('배차완료')}건<br/>
            운행중: {countStatus('운행중')}건<br/>
            하차완료: {countStatus('하차완료')}건<br/>
            정산대기: {countSettlement('정산대기')}건<br/>
            정산완료: {countSettlement('정산완료')}건<br/><br/>
            <b>정산예정일</b>
            {thisMonth.map(o=>{
              const unpaidItem=o.settlement_status!=='정산완료';
              return (
                <div key={o.id} style={styles.card}>
                  <div style={unpaidItem?styles.unpaidText:styles.paidText}>
                    {unpaidItem?'❗ 미정산':'✔ 정산완료'} / {fmt(o.driver_amount)}
                  </div>
                  {o.pickup} → {o.dropoff}<br/>
                  결제조건: {o.payment_terms||'하차 후 즉시결제'}<br/>
                  결제상태: {o.payment_status||'미결제'}<br/>
                  정산상태: {o.settlement_status||'정산대기'}<br/>
                  정산예정일: {o.settlement_due_date||'하차완료 후 자동생성'}
                </div>
              );
            })}
          </div>
        )}

        {tab==='history'&&(
          <div style={styles.card}>
            <div style={styles.title}>근무내역</div>
            {datedMyOrders.map(o=>{
              const unpaidItem=o.settlement_status!=='정산완료';
              return (
                <div key={o.id} style={styles.card}>
                  <div style={unpaidItem?styles.unpaidText:styles.paidText}>
                    {unpaidItem?'❗ 미정산':'✔ 정산완료'} / {fmt(o.driver_amount)}
                  </div>
                  {o.pickup} → {o.dropoff}<br/>
                  상태: {o.status}<br/>
                  결제상태: {o.payment_status||'미결제'}<br/>
                  정산상태: {o.settlement_status||'정산대기'}<br/>
                  정산예정일: {o.settlement_due_date||'미정'}
                </div>
              );
            })}
          </div>
        )}

        {tab==='main'&&(
          <>
            <div style={styles.card}>
              <div style={styles.title}>배차 가능한 오더</div>
              {orders.filter(o=>o.status==='배차대기').map(o=>(
                <div key={o.id} style={styles.card}>
                  <span style={styles.badge}>배차대기</span><span style={styles.pay}>{o.payment_terms||'하차 후 즉시결제'}</span><br/><br/>
                  <div style={styles.money}>{fmt(o.driver_amount)}</div>
                  <div style={styles.route}>{o.pickup} → {o.dropoff}</div>
                  <div style={styles.small}>총 운임: {fmt(o.price)}<br/>JB 수수료 5%: {fmt(o.fee)}<br/>정산방식: JB LOGIS 정산</div>
                  <button style={styles.green} onClick={()=>takeOrder(o.id)}>배차받기</button>
                </div>
              ))}
            </div>

            <div style={styles.card}>
              <div style={styles.title}>내 배차 현황</div>
              {datedMyOrders.map(o=>{
                const unpaidItem=o.settlement_status!=='정산완료';
                return (
                  <div key={o.id} style={styles.card}>
                    <span style={styles.badge}>{o.status||'배차완료'}</span><span style={styles.pay}>{o.payment_status||'미결제'}</span><br/><br/>
                    <div style={unpaidItem?{...styles.money,color:'#d93025'}:styles.money}>{fmt(o.driver_amount)}</div>
                    <div style={styles.route}>{o.pickup} → {o.dropoff}</div>
                    <div style={styles.small}>
                      총 운임: {fmt(o.price)}<br/>
                      결제조건: {o.payment_terms||'하차 후 즉시결제'}<br/>
                      정산상태: {o.settlement_status||'정산대기'}<br/>
                      정산예정일: {o.settlement_due_date||'하차완료 후 자동생성'}
                    </div>
                    <button style={styles.btn} onClick={()=>updateStatus(o,'운행중')}>운행중</button>
                    <button style={styles.green} onClick={()=>updateStatus(o,'하차완료')}>하차완료</button>
                    <button style={styles.red} onClick={()=>updateStatus(o,'배차취소')}>취소</button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
