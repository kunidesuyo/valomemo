import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Create() {
  const [content, setContent] = useState([]);
  let navigate = useNavigate();

  //デバック
  useEffect(() => {console.log(content)}, [content]);

  const postData = () => {
    var params = new URLSearchParams();
    params.append("content", content);
    axios.post('api/create', params)
    .then((res) => {
      //readにリダイレクト
      console.log(res);
      navigate('/read');
    })
  }

  return (
    <div>
      <h2>create</h2>
      <form>
        <input onChange={(e) => {setContent(e.target.value)}}/>
        <input onClick={postData} type="button" value="作成" />
      </form>
    </div>
  )

}