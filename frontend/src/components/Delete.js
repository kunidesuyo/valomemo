import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Button from '@mui/material/Button'

export default function Delete(props) {
  let navigate = useNavigate();

  const deleteData = async () => {
    //console.log(props.APIData);
    //console.log(props.id);
    /*var params = new URLSearchParams();
    params.append("id", props.id);*/
    //ログインしているユーザーとセットアップの作成者が違ったら弾く
    if(props.setup.created_by !== localStorage.getItem("username")) {
      console.log("作成したユーザーではないため削除できません");
      navigate('/read');
    }
    await axios.delete(`api/delete/${props.setup.id}`)
    .then((res) => {
      console.log(res);
      console.log('delete complete')
    })
    .catch((error) => {
      console.log(error);
      navigate('/login');
    })
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
    <Button onClick={deleteData} variant="contained">削除</Button>
  )
}