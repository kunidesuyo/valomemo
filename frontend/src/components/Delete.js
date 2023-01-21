import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



export default function Delete(props) {
  let navigate = useNavigate();

  const deleteData = () => {
    console.log(props.id);
    /*var params = new URLSearchParams();
    params.append("id", props.id);*/
    axios.delete(`api/delete/${props.id}`)
    .then((res) => {
      console.log(res);
      navigate('/read');
    })
  }
  return (
    <button onClick={deleteData}>削除</button>
  )
}