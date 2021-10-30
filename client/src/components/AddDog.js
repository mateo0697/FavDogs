import React from 'react'
import axios from "axios"
import {cargarPag, getTemperaments} from "../actions/index.js"
import { useDispatch, useSelector} from 'react-redux'
import styled from "styled-components"
import { Link } from 'react-router-dom';

const FormGeneral = styled.form`
display: flex;
flex-direction: column;
align-items: flex-start;
justify-content: space-between;
height: 30em;
margin-left: 1.5em;
margin-top: 0.8em;
`
const ButtonAdd = styled.button`
  background-color:#126303;
  border-radius:0.5em;
  color:white;
  width:10em;
  height:2em;
`
const DivTextos = styled.div`
  color: #126303;
  margin-bottom:0.2em;
  font-size: 1.15em;

`
const DivShow = styled.div`
margin-left: 1.5em;
display: grid;
grid-template-columns: repeat(4, minmax(5em, 1fr));
width:30em;
gap:0.5em;
text-align: center;
`
const Filtros = styled.select`
   background: transparent;
   border: solid;
   margin-top:1em;
   border-width:0.1em;
   font-size: 14px;
   height: 10em;
   padding: 5px;
   width: max-content;
`

export function AddDog(props) {
  const dispatch = useDispatch();
  const temps = useSelector(store=> store.temperament)
  const [data, setData] = React.useState({
    name: "",
    heightmin: {imperial:"", metric:""},
    heightmax: {imperial:"", metric:""},
    weightmin: {imperial:"", metric:""},
    weightmax: {imperial:"", metric:""},
    life_span: "",
    temperament:[],
  })
  const [errores, setErrores] = React.useState([])

  function capitalizarPrimeraLetra(str) {
    let validar = /[0-9]+/
    if (str.match(validar)) {
      return undefined;
    }else {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

  function handleChange(e){
    if(e.target.value === ""){setData({...data, [e.target.name]:""})}
    if (errores.length) {
      setErrores([])
    }
    var string = e.target.name
    if(string === "name"){
      var name = capitalizarPrimeraLetra(e.target.value);
      setData(
        {...data,[string]: name}
      )
    }else if(string === "life_span" && toint(e.target.value)){
      setData(
        {...data,[string]: toint(e.target.value)}
      )}else if(toint(e.target.value)){
        setData(
          {...data,[e.target.name]: {imperial:Math.round(toint(e.target.value)*0.393701),metric:toint(e.target.value)}}
        )
      }else {
        setData({...data, [e.target.name]:e.target.value})
      }
    }

  function toint(num){
    var verificar = /[a-z]+/
  if (!num.match(verificar)) {
    return (parseInt(num))
  }
}

  function validarDatos(){
    var array = []
    if (data.name) {
      array.push(true)
    }else{array.push("Solo son validos nombres sin numeros")}
    if (typeof data.heightmin.metric === "number" && typeof data.heightmax.metric === "number") {
      array.push(true)
    }else{array.push("Solo son validas alturas sin letras")}
    if (typeof data.weightmax.metric === "number" && typeof data.weightmin.metric === "number") {
      array.push(true)
    }else{array.push("Solo son validos pesos sin letras")}
    if (typeof data.life_span === "number") {
      array.push(true)
    }else{array.push("Solo son validos años sin letras")}
    setErrores(array)
    return array
  }

  async function handleSubmit(e){
      e.preventDefault();
      var arr = validarDatos().filter(p=>p!==true)
      if (arr.length === 0) {
        axios({
          method: 'post',
          url: `http://localhost:3001/dog`,
          data:data
        });
      dispatch(cargarPag(true))
      setData({
        name: "",
        heightmin: {imperial:"", metric:""},
        heightmax: {imperial:"", metric:""},
        weightmin: {imperial:"", metric:""},
        weightmax: {imperial:"", metric:""},
        life_span: "",
        temperament:[],
      })
      setErrores(["Se ha creado su perro correctamente"])
    }
  }

  function xsort(){
    if (temps.temp) {
      var arr = temps.temp.sort(function (a, b) {
        if (a.name > b.name) {
          return 1;
        }
        if (a.name < b.name) {
          return -1;
        }
        return 0;
      })
      return arr
    }else {
      console.log("entre")
      dispatch(getTemperaments())
      return []
    }
    }

  async function mostrar(e, bol){
    if (bol) {
      if(e.target.value==="Select Temperaments" || e.target.value==="") return
      if(data.temperament.includes(e.target.value)){return}
      await setData(obj => {return {...obj, temperament:[...obj.temperament, e.target.value]}})
    }else {
      var arr = data.temperament.filter(a=> a !== e.target.innerText)
      await setData(obj => {return {...obj, temperament:arr}})
    }
  }

  return (
    <div style={{backgroundColor:"#F4EADA", height:"100vh"}}>
    <Link style={{textDecoration: 'underline', color:"#126303", fontSize:"1em", marginRight:"90%", display:"block", padding:"0.5em", width:"max-content"}} to="/home">Back</Link>
    <FormGeneral onSubmit={(e)=>handleSubmit(e)}>
      <div>
        <DivTextos>name</DivTextos>
        <input value={data.name} name="name" onChange={(e)=>handleChange(e)} placeholder="(only leters)"/>
      </div>

      <div>
        <DivTextos>height</DivTextos>
        <input style={{marginRight:"0.5em"}}value={data.heightmin.metric} name="heightmin" onChange={(e)=>handleChange(e)} placeholder="min(only numbers)"/>
        <input value={data.heightmax.metric} name="heightmax" onChange={(e)=>handleChange(e)} placeholder="max(only numbers)"/>
      </div>

      <div>
      <DivTextos>weight</DivTextos>
      <input style={{marginRight:"0.5em"}}value={data.weightmin.metric} name="weightmin" onChange={(e)=>handleChange(e)} placeholder="min(only numbers)"/>
      <input value={data.weightmax.metric} name="weightmax" onChange={(e)=>handleChange(e)} placeholder="max(only numbers)"/>
      </div>

      <div>
      <DivTextos>life span</DivTextos>
      <input value={data.life_span} name="life_span" onChange={(e)=>handleChange(e)} placeholder="(only numbers)"/>
      </div>

      <div>
      <Filtros multiple onChange={(e)=>mostrar(e, true)}>{[...[{id:"x", name:"Select Temperaments"}],...xsort()].map(t=>{
        return(
          <option key={t.id}>{t.name}</option>
        )
      })}</Filtros>
      </div>
      <ButtonAdd type="submit">Agregar Dog</ButtonAdd>
      <div>{errores.map((e,i)=>{
        return(
          <div key={i}>
            {e}
          </div>

        )
      })}</div>
    </FormGeneral>
    <DivShow>{
    data.temperament.length ? data.temperament.map(t=>{
        return(
          <div key={t} onClick= {(e)=> mostrar(e, false)}>
              {t}
          </div>
        )
      }) : <div>Temperaments Selected</div>
    }
    </DivShow>
    </div>
  )
};

export default AddDog;
