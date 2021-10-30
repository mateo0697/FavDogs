import React,{useEffect} from "react";
import {useSelector, useDispatch} from 'react-redux'
import { Link } from 'react-router-dom';
import "../componentsCss/Dogs.css"
import {getMostrar, ordenar} from "../actions/index.js"
import styled from "styled-components"

const DivGeneral = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color:#F4EADA;
`
const PageButton = styled.button`
display: inlin-flex;
align-items: center;
justify-content: center;
width: 3em;
min-width: max-content;
height: 1.5em;
background-color: #184e77;
color: white;
border-radius: 10px;
border-width: 0px;
border-color: black;
margin: 5px;
font-size: 15px;
text-align: center;
`
const Cartas = styled.div`
margin-top: 1em;
display: grid;
grid-template-columns: repeat(auto-fill, minmax(20em, 1fr));
gap: 1em;
padding: 1em;
`
const Carta = styled.div`
padding:0.5em;
border: 0.2em solid #184e77;
border-radius:1em;
color:#184e77;
display: flex;
flex-direction: column;
align-items: center;
justify-content:space-between;
`
const Filtros = styled.select`
  background: transparent;
   border: solid;
   border-width:0.1em;
   margin:0.5em;
   font-size: 14px;
   height: 30px;
   padding: 5px;
   width: max-content;
`

export default function Dogs(props) {
const dispatch = useDispatch();
const mostrar = useSelector(store=> store.mostrar)
const temperaments = useSelector(store => store.temperament.temp)
const [pag,setPag] = React.useState(0)
const [orden, setOrden] = React.useState("name")
const [sentido, setSentido] = React.useState(false)
const [texto, setTexto] = React.useState("")
const [pagmax, setPagmax] = React.useState("inicio")
const [filtro, setFiltro] = React.useState({tipo:"all", temps:[]})

useEffect(()=>{
  async function fetch(){
    let hola = await dispatch(getMostrar(texto, orden, sentido))
    setPagmax(Math.ceil(parseInt(filtros([...hola.payload.dogs,...hola.payload.newdogs]).length.toString())/8))
  }
  fetch()
},[texto])

useEffect(()=>{
  if (mostrar.length) {
      dispatch(ordenar(mostrar, orden, sentido))
  }
},[sentido, orden])

useEffect(()=>{
  setPagmax(Math.ceil(parseInt(filtros(mostrar).length.toString())/8))
  if (filtro.temps.length === 0) {
  }
},[filtro])

function xsort(array, orden, sentido){
  var arrayfin = array.sort(function (a, b) {
    if (a[orden] > b[orden]) {
      return 1;
    }
    if (a[orden] < b[orden]) {
      return -1;
    }
    return 0;
  })
  if (sentido){arrayfin.reverse()}
  return arrayfin
}

function validarTemps(obj){
  var arr =[]
  if (typeof obj.id === "number" && obj.temperament) {
    arr = obj.temperament.split(",").map(string=>string.trim())
  }else if(obj.temps){
    arr = obj.temps.map(t=>{return t.name})
  }else {
    return
  }
  if (!filtro.temps.length) {
    return true
  }
  var array = filtro.temps.map(t=>{
    if (arr.includes(t)) {
      return true
    }else return false
  })
  if (array.includes(false)) {
    return false
  }else {
    return true
  }
}

async function handleClick(event) {
  event.preventDefault();
  let hola = await dispatch(getMostrar(texto, orden, sentido))
  setPagmax(Math.ceil(parseInt(filtros(hola.payload.final).length.toString())/8))
}

function ordenartemps(arr){
  var arrayfin = arr.sort(function (a, b) {
    if (a.name > b.name) {
      return 1;
    }
    if (a.name < b.name) {
      return -1;
    }
    return 0;
  })
  return arrayfin
}

async function nextPag(){
  if (pag === pagmax-1) {
      setPag((pag) => 0)
      return
    }
      setPag((pag) => pag + 1)
}

async function prevPag(){
  if (pag === 0) {
    let id = pagmax - 1
    setPag((pag) => id)
    return
  }
  setPag((pag) => pag - 1)
}

async function decidirOrden(texto){
  let string = texto.charAt(0).toLowerCase() + texto.slice(1)
  await setOrden(string)
}

async function decidirSentido(){
  await setSentido(s=>!s)
}

async function decidirFiltroTipo(e){
  let string = e.charAt(0).toLowerCase() + e.slice(1)
  setFiltro(f => {return {...f, tipo:string}})
}

async function decidirFiltroTemp(e, bol){
  if (bol) {
    if(e.target.value==="All") {setFiltro(f=>{return{...f, temps:[]}});return}
    if(filtro.temps.includes(e.target.value)){return}
    await setFiltro(obj => {return {...obj, temps:[...obj.temps, e.target.value]}})
  }else {
    var arr = filtro.temps.filter(a=> a !== e.target.innerText)
    await setFiltro(obj => {return {...obj, temps:arr}})
  }
}

async function handleChange(e){
  var buscar;
  if(!e.target.value){
    buscar = "error"
    await setTexto("")
    return
  }else{buscar = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)}
  setTexto(buscar)
}

function pagEspecifica(e){
  setPag(parseInt(e)-1)
}

function paginas(cantidad){
  var arr = [];
  for (var i = 1; i < cantidad+1; i++) {
    arr.push(<PageButton key={i} value={i} onClick={(e)=>pagEspecifica(e.target.value)}>{i}</PageButton>)
  }
  return arr
}

function filtros(array){
  var arr = [];
  if (filtro.tipo === "all") {
    arr = array
  }else if (filtro.tipo === "api") {
    arr = array.filter(a=> typeof a.id === "number")
  }else {
    arr = array.filter(a=> typeof a.id === "string")
  }
  if (filtro.temps.length) {
    return arr.filter(obj=>validarTemps(obj))
  }else {
    return arr
  }

}

function temperamentos(array){
  var string = ""
  array.forEach((obj, i)=>{
    if (i===array.length-1) {
      string = string +" "+ obj.name
    }else {
      string = string + " " + obj.name + ","
    }
  })
  return(<div>{string}</div>)
}

function mapeador(){
  var arr = filtros(mostrar)
  if (!arr.length) {
    return("No se encuentran perros con esas caracterizticas")
  }
  return (arr.slice(8*pag, 8*(pag+1)).map((dog,i) => {
    return (
      <Carta key={dog.id}>
      <Link style={{textDecoration: 'none', display:"block", width:"max-content", color:"#184e77"}}to={`/data/${dog.id}`}><div>{dog.name}</div></Link>
        <div>{dog.image?<img style={{width: "50%", display:"block", margin:"0 auto"}} src={dog.image.url} alt=""/>:"No hay foto"}</div>
        <div style={{textAlign:"center"}}>{dog.temperament ? dog.temperament : dog.temps ? temperamentos(dog.temps): "No hay temperamentos disponibles"}</div>
        <br/>
      </Carta>
    )
  }))
}

  return (
    <div style={{backgroundColor:"#F4EADA", height:"45em"}}>
    <DivGeneral>
    <form style={{margin:"1em"}}>
      <Filtros onChange={async (e)=> decidirOrden(e.target.value)}>
        <option defaultValue="name">Name</option>
        <option value="weightCOMP">Weight</option>
      </Filtros>
      <Filtros onChange={async (e)=> decidirFiltroTipo(e.target.value)}>
        <option defaultValue="all">All</option>
        <option value="api">Api</option>
        <option value="db">Data Base</option>
      </Filtros>
      <Filtros id="temps" onChange={async (e)=> decidirFiltroTemp(e, true)}>
        <option defaultValue="all">All</option>
        {temperaments?ordenartemps(temperaments).map(t=>{
          return(
            <option key={t.id} value={t.name}>{t.name}</option>
          )
        }):<option>Loading Temperaments</option>}
      </Filtros>
      <Filtros onChange={async(e)=> decidirSentido()}>
        <option defaultValue="ascendant">Ascendant</option>
        <option value="descendant">Descendant</option>
      </Filtros>
      <input name="name" style={{backgroundColor:"#F4EADA"}} onChange={(e)=>handleChange(e)}/>
        <PageButton id="hola" onClick={(e) => handleClick(e)}>BUSCAR</PageButton>
      </form>
      <div>{
      filtro.temps.length ? filtro.temps.map(t=>{
          return(
            <div key={t} onClick= {(e)=> decidirFiltroTemp(e, false)}>
                {t}
            </div>
          )
        }) : ""
      }
      </div>
      <h2>Dogs</h2>
      <div>
        <PageButton onClick= {() => nextPag()}>Next</PageButton>
        <span>{pag + 1}</span>
        <PageButton onClick= {() => prevPag()}>prev</PageButton>
      </div>
      <Cartas>{mostrar.length ? mapeador() : texto ? "This dog dosen't exist" : "Loading Dogs"}</Cartas>
      <div>
        {paginas(pagmax)}
      </div>
    </DivGeneral>
    </div>

  )
};
