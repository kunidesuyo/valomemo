import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Read() {
  const [APIData, setAPIData] = useState([]);
  useEffect(() => {
    axios.get('/api/read')
    .then((res) => {
      //console.log(res.data[0]);
      setAPIData(res.data);
    })
  }, []);
  //console.log(APIData);
  return (
    <div>
      <h2>read</h2>
      <ul>
        <li>
          <span>id </span>
          <span>content</span>
        </li>
        {APIData.map((item) => {
          return (  
            <li>
              <span>{item.id} </span>
              <span>{item.content}</span>
              <Link to="/update" state={{id: item.id, content: item.content}}>更新</Link>
            </li>
          )
        })}
      </ul>
      
    </div>
  )
}