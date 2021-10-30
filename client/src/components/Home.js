import React,{ useEffect }from 'react';
import { Link } from 'react-router-dom';
import Dogs from "./Dogs.js"
import {getDogs, getTemperaments, cargarPag, } from "../actions/index.js"
import {useSelector, useDispatch} from 'react-redux'

export function Home() {
  const load = useSelector(store => store.cargar)
  const dispatch = useDispatch();
  useEffect(()=>{
    async function correr(){
      if (load){
      var disp = await dispatch(getDogs())
      await dispatch(cargarPag(false))
      dispatch(getTemperaments(disp.payload.dogs))
    }
    }
        correr()
  },[load, dispatch]
  );
  return (
    <div style={{backgroundColor:"#F4EADA"}}>
      <Link style={{textDecoration:"none", backgroundColor:"#184e77", color:"white", padding:"0.5em", margin:"0em auto", display:"block", width:"max-content"}} to="/addDog">add</Link>
      <Dogs/>
    </div>
  )
};

export default Home;
