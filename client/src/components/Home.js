import React from 'react';
import { Link } from 'react-router-dom';


export function Home() {
  return (
    <div>
        <Link to="/data/1">data</Link>
        <br/>
        <Link to="/addDog">add</Link>
        <h1>aca se muestran los perros</h1>
    </div>
  )
};

export default Home;
