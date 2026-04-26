import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://ijuxtimblcengcoltcxe.supabase.co',
  'sb_publishable_S4AOBjTFbVE4FMXtjJWFdw_EO7S0ZV-'
);

export default function Home() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('driver');

  const [agree1, setAgree1] = useState(false);
  const [agree2, setAgree2] = useState(false);
  const [agree3, setAgree3] = useState(false);

  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  // 회원가입
  const signUp = async () => {
    if (!agree1 || !agree2 || !agree3) {
      return alert('모든 동의 체크 필요');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) return alert(error.message);

    await supabase.from('profiles').insert([{
      id: data.user.id,
      email,
      name,
      phone,
      role,
      agree_privacy: agree1,
      agree_location: agree2,
      agree_terms: agree3
    }]);

    alert('회원가입 완료');
    setMode('login');
  };

  // 로그인
  const login = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) alert(error.message);
    else location.reload();
  };

  // 로그아웃
  const logout = async () => {
    await supabase.auth.signOut();
    location.reload();
  };

  // 로그인 후 프로필 조회
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (user) {
      supabase.from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
        .then(({ data }) => setProfile(data));
    }
  }, [user]);

  // ======================
  // 🔐 로그인 안된 화면
  // ======================
  if (!user) {
    return (
      <div style={{ padding: 30, textAlign: 'center' }}>
        <h1>JB LOGIS</h1>
        <p>전국 어디든 빠르고 정확한 운송 플랫폼</p>

        {mode === 'login' ? (
          <>
            <h2>로그인</h2>
            <input placeholder="이메일" onChange={e => setEmail(e.target.value)} /><br /><br />
            <input type="password" placeholder="비밀번호" onChange={e => setPassword(e.target.value)} /><br /><br />
            <button onClick={login}>로그인</button><br /><br />
            <button onClick={() => setMode('signup')}>회원가입</button>
          </>
        ) : (
          <>
            <h2>회원가입</h2>

            <input placeholder="이름" onChange={e => setName(e.target.value)} /><br /><br />
            <input placeholder="연락처" onChange={e => setPhone(e.target.value)} /><br /><br />
            <input placeholder="이메일" onChange={e => setEmail(e.target.value)} /><br /><br />
            <input type="password" placeholder="비밀번호" onChange={e => setPassword(e.target.value)} /><br /><br />

            <select onChange={e => setRole(e.target.value)}>
              <option value="driver">기사</option>
              <option value="shipper">화주</option>
            </select><br /><br />

            <label><input type="checkbox" onChange={e => setAgree1(e.target.checked)} /> 개인정보 동의</label><br />
            <label><input type="checkbox" onChange={e => setAgree2(e.target.checked)} /> 위치정보 동의</label><br />
            <label><input type="checkbox" onChange={e => setAgree3(e.target.checked)} /> 약관 동의</label><br /><br />

            <button onClick={signUp}>가입하기</button><br /><br />
            <button onClick={() => setMode('login')}>로그인으로</button>
          </>
        )}
      </div>
    );
  }

  // ======================
  // 로그인 후 화면
  // ======================
  return (
    <div style={{ padding: 20 }}>
      <h2>환영합니다 {profile?.name}</h2>
      <p>역할: {profile?.role === 'driver' ? '기사' : '화주'}</p>
      <button onClick={logout}>로그아웃</button>

      {profile?.role === 'driver' && <h3>👉 기사 화면 (다음 단계에서 연결)</h3>}
      {profile?.role === 'shipper' && <h3>👉 화주 화면 (다음 단계에서 연결)</h3>}
    </div>
  );
}
