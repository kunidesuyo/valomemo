import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



export default function Delete(props) {
  let navigate = useNavigate();

  const deleteData = async () => {
    //console.log(props.APIData);
    //console.log(props.id);
    /*var params = new URLSearchParams();
    params.append("id", props.id);*/
    await axios.delete(`api/delete/${props.id}`)
    .then((res) => {
      console.log(res);
      console.log('axios complete')
    });
    console.log('before ' + props.detectDelete);
    props.setDetectDelete((props.detectDelete + 1) % 2);
    console.log('after ' + props.detectDelete);
    //APIDataの対象データも削除
    //APIData.filter((item) => item.id !== id)
    //console.log(props.APIData);
    //console.log('redirect')
    //navigate('/read');
  }
  return (
    <button onClick={deleteData}>削除</button>
  )
}