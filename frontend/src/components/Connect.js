import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Connect() {
  const [APIData, setAPIData] = useState([]);
  useEffect(() => {
    axios.get(`/connect`)
    .then((res) => {
      console.log(res.data);
      setAPIData(res.data);
    })
  }, []);
  return (
    <div>
      <h2>routing success</h2>
      <h3>{APIData.id}</h3>
      <h3>{APIData.content}</h3>
      
    </div>
  )
}
