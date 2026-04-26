import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [msg, setMsg] = useState('');

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
      setMsg('기사 등록 실패');
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
        pickup: f.pickup.value,
        dropoff: f.drop.value
      }
    ]);

    if (error) {
      setMsg('화주 문의 실패');
    } else {
      setMsg('화주 문의 성공');
      f.reset();
    }
  };
