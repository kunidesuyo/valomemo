import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Delete from './Delete'

export default function Read() {
  const [APIData, setAPIData] = useState([]);
  const [detectDelete, setDetectDelete] = useState([0]);

  const db_column_name =
  [
    "id",
    "map",
    "agent",
    "skill",
    "position_image",
    "aim_image",
    "landing_image",
    "content"
  ]

  /*useEffect(() => {
    console.log('init')
    axios.get('/api/read')
    .then((res) => {
      //console.log(res.data[0]);
      setAPIData(res.data);
    })
  }, []);*/
  
  useEffect(() => {
    //console.log('detect delete')
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
        {db_column_name.map((item) => {
          //console.log(item);
          return (
            <span>{item} </span>
          )
        })}
        {//コンポーネント化したい
          APIData.map((item) => {
          //console.log(item)
          return (  
            <li key={item.id}>
              {Object.values(item).map((value) => {
                return (
                  <span>{value} </span>
                )
              })}
              <Link to="/update" state={item}>更新</Link>
              <Delete id={item.id} detectDelete={detectDelete} setDetectDelete={setDetectDelete} />
            </li>
          )
        })}
      </ul>
      
    </div>
  )
}