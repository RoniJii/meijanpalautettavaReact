import './App.css';
import axios from 'axios';
import React,{useState, useEffect} from 'react';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const url = 'http://localhost/imdb/index.php';
  const genreurl = 'http://localhost/imdb/selectgenre.php'; //ryhmän valinta
  const [eka, setEka] = useState("120"); //pituus minuutteita
  const [toka, setToka] = useState("5"); //keskimääränen arvio
  const [kolmas, setKolmas] = useState("2000"); //Teko vuosi
  let [nelkku, setNelkku] = useState("Action"); //titles
  const [genre, setGenre] = useState([]); //genret
  const [data, setData] = useState([]); //kaikki data

  useEffect(() => {
       loadcategories()
},[]) 

function loadcategories() { //haetaan categoriat kaikki muuttujaan 
  axios.get(genreurl)
  .then((response) => {
    const json = response.data;
    setGenre(json);
  }).catch (error => {
    if (error.response === undefined) {
      alert(error);
    } else {
      alert(error.response.data.error);
    }
  })
}

  function submit(e) {
    e.preventDefault();
   const combined = {runtime:eka, avrating:toka, year:kolmas, genre:nelkku}
    const json = JSON.stringify(combined, null, '  ').replace("\\r", "") //senkin laiskimus mutta poistetaan carriage returnit reactissa
    console.log(json)
    axios.post(url, json, {
      headers: {
        'Content-Type' : 'application/json',
      }, withCredentials: true
    }).then ((response) => {
      console.log(response)
      setData(response.data);
    }).catch ((error) => {
      console.log(error.response.data.error)
    })
  }
    
  return (
    <div className="App">
      <form onSubmit={submit}>

        <div style={{marginTop : '50px'}}>
         Elokuvan minipituus minuutteina ja siitä ylöspäin: <input style={{width: '50px'}} type="number" step="1" min="20" value={eka} onChange={(e => setEka(e.target.value))}/>
        </div>

        <div style={{marginTop : '10px'}}>
          Keskimääränen arvio: <input style={{width: '40px'}} type="number" step="0.1" min="1" value={toka} onChange={(e => setToka(e.target.value))}/>
        </div>
        
        <div style={{marginTop : '10px'}}>
       Ensimmäinen vuosi tekovuosi ja siitä kaikki tähän päivään asti:
          <input value={kolmas} style={{width: '70px'}} type="number" step="1" min="1970" onChange={(e => setKolmas(e.target.value))}/>
        </div>       

        <div style={{marginTop : '10px'}}>
        Genre:          
          <select value={nelkku} onChange={(e => setNelkku(e.target.value))}>
         {genre.map(genr => (
            <option value={genr.genre} key={uuidv4()}>
              {genr.genre}
            </option>
          ))}   
          </select>
          
        </div>  

        <div style={{marginTop : '10px'}}>
          <button>Submit</button>
        </div>
      </form>

      <div> 
        <div style={{marginTop: '10px'}}>
        <h3>Haun tulokset:</h3>
        {data.map(dat => (
            <ul key={uuidv4()}>
              <li>{dat.title}</li>
            </ul>
        ))}  
        </div>
      </div>
    </div>
  );
}

export default App;




/* SELECT N.name_id, N.name_, COUNT(*) AS number_of_films
FROM Names_, Had_role AS H, Titles AS T
WHERE H.role_ LIKE 'James Bond'
AND T.title_type LIKE 'movie'
AND T.title_id = H.title_id
AND N.name_id = H.name_id
GROUP BY N.name_id; */
/* 
SELECT writers.name_id
FROM ((name_worked_as 
       inner join names_ on name_worked_as.name_id = names_.name_id)
       inner join writers on names_.name_id = writers.name_id)
limit 5 */


/* 
SELECT titles.primary_title
from titles inner join directors
on titles.title_id = directors.title_id 
inner join names_
on directors.name_id = directors.name_id
where names_.name_ = "Fred Astaire"
limit 1  */


/* SELECT titles.primary_title
from titles inner join directors
on titles.title_id = directors.title_id 
inner join names_
on directors.name_id = directors.name_id
where titles.title_id = directors.title_id AND directors.name_id = names_.name_id AND names_.name_ = "Clint Eastwood" 
limit 1 */


/* 
UPDATE title_genres SET title_genres.genre = REPLACE(title_genres.genre, '\r', ''); */
/* UPDATE task SET description = REPLACE(description, 'asdasda', 'hellouuu'); */