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
