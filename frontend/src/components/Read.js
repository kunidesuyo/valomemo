import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Delete from './Delete'

export default function Read() {
  const [APIData, setAPIData] = useState([]);
  const [detectDelete, setDetectDelete] = useState([0]);

  /*useEffect(() => {
    console.log('init')
    axios.get('/api/read')
    .then((res) => {
      //console.log(res.data[0]);
      setAPIData(res.data);
    })
  }, []);*/
  
  useEffect(() => {
    console.log('detect delete')
    axios.get('/api/read')
    .then((res) => {
      //console.log(res.data[0]);
      setAPIData(res.data);
    })
  }, [detectDelete]);
  
  //console.log(APIData);
  return (
    <div>
      <h2>read</h2>
      <Link to="/create">新規作成</Link>
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
              <Delete id={item.id} detectDelete={detectDelete} setDetectDelete={setDetectDelete} />
            </li>
          )
        })}
      </ul>
      
    </div>
  )
}