import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';


export default function Update() {
  const location = useLocation();
  console.log(location.state);
  //content変数名変える
  const [content, setContent] = useState(location.state);
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
    Object.entries(content).map(([key, value]) => {
      params.append([key], value);
    })
    /*params.append("id", id);
    params.append("content", content);*/
    console.log('send');
    axios.post('api/update', params)
    .then((res) => {
      //readにリダイレクト
      //console.log(res);
      navigate('/read');
    })
  }

  const handleChange = (e) => {
    //console.log(e.target.value);
    //console.log(e.target.id);
    setContent({...content, [e.target.id]: e.target.value})
    console.log(content);
  }

  return (
    <div>
      <h2>update</h2>
      <form>
        <span>{id} </span>
        {Object.entries(content).map(([key, value]) => {
          if(key==="id") return '';
          return (
            <input key={key} id={key} onChange={(e) => {handleChange(e)}} defaultValue={value}/>
          )
        })}
        <input onClick={postData} type="button" value="更新" />
      </form>
    </div>
  )

}