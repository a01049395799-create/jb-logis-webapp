if (user && !profile) {
  return (
    <div style={{ padding: 30 }}>
      <h2>프로필 설정</h2>
      <p>처음 로그인하셨습니다. 기본 정보를 입력해주세요.</p>

      <input placeholder="이름" onChange={e => setName(e.target.value)} /><br/><br/>
      <input placeholder="연락처" onChange={e => setPhone(e.target.value)} /><br/><br/>

      <select onChange={e => setRole(e.target.value)}>
        <option value="driver">기사</option>
        <option value="shipper">화주</option>
      </select><br/><br/>

      <button onClick={createProfile}>프로필 생성</button>
      <button onClick={logout} style={{ marginLeft: 10 }}>로그아웃</button>
    </div>
  );
}
