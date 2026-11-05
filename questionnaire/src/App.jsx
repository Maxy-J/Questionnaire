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

  return (
    <div>
      <h1>Questionnaire</h1>
      <p>Welcome to your survey platform!</p>

      {surveys.map((survey) => (
        <SurveyCard
          key={survey.id}
          title={survey.title}
          date={survey.date}
          deleteSurvey={() =>{
            setSurveys(surveys.filter((item) => item.id !== survey.id))
          }

          }
        />
      ))}
    </div>
  );
}


function SurveyCard(props){
  return (
    <div>
      <h2>{props.title}</h2>
      <p>Last modified: {props.date}</p>
      <button>Open Survey</button>

      <button onClick={props.deleteSurvey}>
        Delete
      </button>
    </div>
  );
}

export default App;


