import React from "react";
import {useSelector} from 'react-redux'
import styled from "styled-components"
import { Link } from 'react-router-dom';

const DivGeneral = styled.div`
display: flex;
flex-direction: column;
justify-content:space-between;
height:10em;
margin-left:2.5em;
margin-top: 1em;
margin-bottom: 1em;
`
const DivTitulo = styled.div`
color: #FFBD00;
font-size:2.5em;
margin-left:0.5em;
`
const DivInfo = styled.div`
color: #156C50;
font-size:1.5em;
`
export function Detail(props) {
  const dogs = useSelector(store => store.dogs)
  const newdogs = useSelector(store => store.newdogs)
  const mostrar = useSelector(store => store.mostrar)
  var num = props.match.params.id
  var arr = [...mostrar,...[...dogs,...newdogs]]
  var dog = arr.find(d => {
    if (typeof d.id === "number") {
      return d.id === parseInt(num)
    }else {
      return d.id === num
    }
  })
  function temperamentos(array){
    var string = ""
    array.forEach((obj, i)=>{
      console.log(i)
      if (i===array.length-1) {
        string = string +" "+ obj.name
      }else {
        string = string + " " + obj.name + ","
      }
    })
    return(<div>{string}</div>)
  }
  return (
    <div style={{backgroundColor:"#F4EADA", height:"53em"}}>
      <Link style={{textDecoration: 'underline', color:"#156C50", fontSize:"1.4em", marginRight:"90%", display:"block", padding:"0.5em", width:"max-content"}} to="/home">Back</Link>
      <DivTitulo>{dog.name}</DivTitulo>
        <DivGeneral>
          <DivInfo>weight: imperial: {dog.weight.imperial ? dog.weight.imperial : "No hay valor en imperial"}, metric: {dog.weight.metric ? dog.weight.metric : "No hay valor en Metric"}</DivInfo>
          <DivInfo>height: imperial: {dog.height.imperial ? dog.height.imperial : "No hay valor en imperial"}, metric: {dog.height.metric ? dog.height.metric : "No hay valor en Metric"}</DivInfo>
          <DivInfo>{dog.temperament ? dog.temperament : dog.temps.length ? temperamentos(dog.temps): "No hay temperamentos disponibles"}</DivInfo>
        </DivGeneral>

        <div>{dog.image?<img style={{width: "50%", display:"block", margin:"0 auto"}} className="photo" src={dog.image.url} alt=""/>:"No hay foto"}</div>
    </div>
  )
};

export default Detail;
