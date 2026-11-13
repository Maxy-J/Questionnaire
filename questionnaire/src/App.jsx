import { useState } from 'react'
import './App.css'

function App() {
  const [surveys, setSurveys] = useState([
    {
      id: 1,
      title: "Research on Space Exploration",
      date: "November 5, 2026"
    },
    {
      id: 2,
      title: "Effects of Music on Studying",
      date: "November 3, 2026"
    },
    {
      id: 3,
      title: "Impact of Social Media on Mental Health",
      date: "October 30, 2026"
    },
    {
      id: 4,
      title: "My own survey",
      date: "October 28, 2026"
    },
    
  ]);
  const [newSurveyTitle, setNewSurveyTitle] = useState("");
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const filteredSurveys = surveys.filter((survey) =>
  survey.title.toLowerCase().includes(searchTerm.toLowerCase())
);
  return (
    <div className="app">
    {/* this might be temporary depending on how are approiach goes with the survey builder screen */}
      {selectedSurvey ? (
  <div className="build-page">
    <button onClick={() => setSelectedSurvey(null)}>
      
      Back to Survey Library
    </button>

    <h1>{selectedSurvey.title}</h1>
    <p>Last modified: {selectedSurvey.date}</p>

    <h2>Survey Builder</h2>
    <p>Your survey editing workspace will go here.</p>
  </div>
) : (
  <>
    <h1>Questionnaire?!</h1>
    <p>Welcome to your survey platform!</p>
    <div className="create-survey">
      <input
        type="text"
        placeholder="Enter survey title"
        value={newSurveyTitle}
        onChange={(event) => setNewSurveyTitle(event.target.value)}
      />
      <button onClick={createSurvey}>Create Survey</button>
    </div>
    <div className="survey-list">
      <div className="search-surveys">
        <input
          type="text"
          placeholder="Search your surveys..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>
      <div className="survey-grid">
        {filteredSurveys.map((survey) => (
          <SurveyCard
            key={survey.id}
            title={survey.title}
            date={survey.date}
            deleteSurvey={() => {
              setSurveys(surveys.filter((item) => item.id !== survey.id))
            }}
            openSurvey={() => setSelectedSurvey(survey)}
          />
        ))}
      </div>
    </div>
  </>
)}
    </div>
  );
  function createSurvey() {
    let unnamedNumber = 1;

    while (surveys.some((survey) =>
        survey.title === `Unnamed Survey ${unnamedNumber}`
    )) {
        unnamedNumber++;
      }

    const title = newSurveyTitle.trim() || `Unnamed Survey ${unnamedNumber}`;
    
  
    const newSurvey ={ 
      id: Date.now(),
      title: title,
      date: "november 9, 2026"
    };
    setSurveys([...surveys, newSurvey]); 
    setSelectedSurvey(newSurvey);
    setNewSurveyTitle("");
  }
}


function SurveyCard(props){
  return (
    <div className="survey-card">
      <h2>{props.title}</h2>
      <p>Last modified: {props.date}</p>
      <button className="open-button" onClick={props.openSurvey}>Open Survey</button>
    {/* <button>Edit</button> */}
      <button className="delete-button" onClick ={()=> {
        if(window.confirm("Are you sure you want to delete this survey?")) {
          props.deleteSurvey();
        }
      }}>
        Delete
      </button>
    </div>
  );
}



export default App;

