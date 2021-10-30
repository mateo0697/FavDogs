const initialState = {
  dogs:[],
  newdogs:[],
  temperament:[],
  mostrar:[],
  cargar:true,
};

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

const todos = (state = initialState, action) => {
  switch(action.type) {
    case "GET_DOGS":
      return {...state, dogs:action.payload.dogs, newdogs:action.payload.newdogs}
    case "GET_TEMPS":
      return {...state, temperament:action.payload}
    case "GET_MOSTRAR":
      return {...state, mostrar:xsort([...action.payload.dogs, ...action.payload.newdogs],action.payload.orden, action.payload.sentido), dogs:action.payload.dogs, newdogs:action.payload.newdogs}
    case "ORDENAR":
      return {...state, mostrar:xsort(action.payload.arr, action.payload.orden, action.payload.sentido)}
    default:
      return state
  }
}

export default todos;
