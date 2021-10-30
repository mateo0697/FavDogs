import axios from 'axios';


//------------------------------------------------------------------------------------------------------------
export function getDogs(pag){
  return function (dispatch){
    return(
      axios.get(`http://localhost:3001/dogs/`)
        .then(r => r.data)
        .then(r => dispatch({type:"GET_DOGS", payload: {dogs: r.perros, newdogs:r.perrosnuevos}}))
    )
  }
}

export function getTemperaments(array){
  return async function(dispatch){
    return(
    axios({
      method: 'post',
      url: `http://localhost:3001/temps`,
      data: array
    })
    .then(r=>r.data)
    .then(r=> dispatch({type:"GET_TEMPS", payload:r}))
)
}
}
export function getMostrar(buscar, orden, sentido){
  return async function(dispatch){
    return(
      axios.get(`http://localhost:3001/dogs/?name=${buscar}`)
        .then(r => r.data)
        .then(r => dispatch({type:"GET_MOSTRAR", payload:{orden:orden, sentido:sentido, dogs:r.perros, newdogs:r.perrosnuevos}}))
    )
  }
}
export function cargarPag(bol){
  return({type:"RELOAD", payload:bol})
}

export function ordenar(arr, orden, sentido){
  return({type:"ORDENAR", payload:{arr:arr, orden:orden, sentido:sentido}})
}
