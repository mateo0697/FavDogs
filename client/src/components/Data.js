import React from 'react';
import { Link } from 'react-router-dom';

export function Detail(props) {
  var num = props.match.params.id
  return (
    <div>
        <h1>aca se muestran los detalles {num}</h1>
    </div>
  )
};

export default Detail;
