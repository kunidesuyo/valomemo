import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';


export default function Update() {
  const location = useLocation();
  const [content, setContent] = useState(location.state.content);
  const id = location.state.id;
  let navigate = useNavigate();
  /*useEffect(() => {
    id = location.state.id;
    //setContent(location.state.content);
  }, []);*/
  //デバッグ
  useEffect(() => {console.log(content)}, [content]);

  const postData = () => {
    var params = new URLSearchParams();
    params.append("id", id);
    params.append("content", content);
    axios.post('api/update', params)
    .then((res) => {
      //readにリダイレクト
      console.log(res);
      navigate('/read');
    })
  }

  return (
    <div>
      <h2>update</h2>
      <form>
        <span>{id} </span>
        <input onChange={(e) => {setContent(e.target.value)}} value={content}/>
        <input onClick={postData} type="button" value="更新" />
      </form>
    </div>
  )

}