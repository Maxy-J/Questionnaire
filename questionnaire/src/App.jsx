import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import './App.css'

const EXAMPLE_SURVEYS = [
  {
    id: 'example-favorite-subject',
    title: 'Favorite school subject',
    date: 'November 13, 2026',
    question: 'Which subject do you enjoy the most?',
    options: ['Science', 'Math', 'English', 'History'],
    isExample: true,
  },
  {
    id: 'example-weekend-activity',
    title: 'Best weekend activity',
    date: 'November 12, 2026',
    question: 'How do you most like to spend your weekend?',
    options: ['Playing sports', 'Reading', 'Gaming', 'Spending time with friends'],
    isExample: true,
  },
  {
    id: 'example-school-lunch',
    title: 'Favorite school lunch',
    date: 'November 11, 2026',
    question: 'Which lunch would you choose?',
    options: ['Pizza', 'Pasta', 'Tacos', 'Salad'],
    isExample: true,
  },
]

function getErrorMessage(error) {
  return error instanceof Error ? error.message : String(error)
}

function App() {
  const [surveys, setSurveys] = useState(EXAMPLE_SURVEYS)
  const [newSurveyTitle, setNewSurveyTitle] = useState('')
  const [selectedSurvey, setSelectedSurvey] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    let isActive = true

    async function loadSurveys() {
      try {
        const { data, error: loadError } = await supabase
          .from('polls')
          .select('id, title, created_at, poll_date')
          .order('created_at', { ascending: false })

        if (loadError) throw loadError
        if (!isActive) return

        setSurveys([
          ...(data ?? []).map((poll) => ({
            id: poll.id,
            title: poll.title,
            date:
              poll.poll_date ??
              new Date(poll.created_at).toLocaleDateString(),
            isExample: false,
          })),
          ...EXAMPLE_SURVEYS,
        ])
      } catch (loadError) {
        if (isActive) setError(getErrorMessage(loadError))
      } finally {
        if (isActive) setIsLoading(false)
      }
    }

    loadSurveys()

    return () => {
      isActive = false
    }
  }, [])

  async function createSurvey() {
    setIsCreating(true)
    setError('')

    let unnamedNumber = 1
    while (
      surveys.some(
        (survey) => survey.title === `Unnamed Survey ${unnamedNumber}`
      )
    ) {
      unnamedNumber++
    }

    const title =
      newSurveyTitle.trim() || `Unnamed Survey ${unnamedNumber}`

    try {
      const { data, error: insertError } = await supabase
        .from('polls')
        .insert({ title })
        .select('id, title, created_at, poll_date')
        .single()

      if (insertError) throw insertError

      const createdSurvey = {
        id: data.id,
        title: data.title,
        date:
          data.poll_date ?? new Date(data.created_at).toLocaleDateString(),
        isExample: false,
      }

      setSurveys((currentSurveys) => [createdSurvey, ...currentSurveys])
      setNewSurveyTitle('')
      setSelectedSurvey(createdSurvey)
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setIsCreating(false)
    }
  }

  async function deleteSurvey(id) {
    setError('')

    try {
      const { error: deleteError } = await supabase
        .from('polls')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      setSurveys((currentSurveys) =>
        currentSurveys.filter((survey) => survey.id !== id)
      )
    } catch (deleteError) {
      setError(getErrorMessage(deleteError))
    }
  }

  const normalizedSearchTerm = searchTerm.trim().toLowerCase()
  const filteredSurveys = surveys.filter((survey) =>
    survey.title.toLowerCase().includes(normalizedSearchTerm)
  )

  return (
    <div className="app">
      {selectedSurvey ? (
        <div className="build-page">
          <button onClick={() => setSelectedSurvey(null)}>
            Back to Survey Library
          </button>

          <h1>{selectedSurvey.title}</h1>
          <p>Last modified: {selectedSurvey.date}</p>

          {selectedSurvey.question ? (
            <>
              <h2>{selectedSurvey.question}</h2>
              <ul>
                {selectedSurvey.options.map((option) => (
                  <li key={option}>{option}</li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <h2>Survey Builder</h2>
              <p>Your survey editing workspace will go here.</p>
            </>
          )}
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
            <button onClick={createSurvey} disabled={isCreating}>
              {isCreating ? 'Creating...' : 'Create Survey'}
            </button>
          </div>

          {error && <p role="alert">{error}</p>}
          {isLoading && <p>Loading saved polls...</p>}

          <div className="survey-list">
            <div className="search-surveys">
              <input
                type="search"
                aria-label="Search surveys"
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
                  isExample={survey.isExample}
                  deleteSurvey={() => deleteSurvey(survey.id)}
                  openSurvey={() => setSelectedSurvey(survey)}
                />
              ))}
            </div>
            {!isLoading && filteredSurveys.length === 0 && (
              <p>No surveys match your search.</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}

function SurveyCard({ title, date, isExample, deleteSurvey, openSurvey }) {
  function handleDelete() {
    if (window.confirm('Are you sure you want to delete this survey?')) {
      deleteSurvey()
    }
  }

  return (
    <div className="survey-card">
      <h2>{title}</h2>
      {isExample && <p>Example poll</p>}
      <p>Last modified: {date}</p>
      <button className="open-button" onClick={openSurvey}>
        Open Survey
      </button>
      {!isExample && (
        <button className="delete-button" onClick={handleDelete}>
          Delete
        </button>
      )}
    </div>
  )
}

export default App
