import { useState, useRef } from 'react'
import './App.css'
import Intro from './Intro.jsx'
import Header from './Header.jsx'
import Questions from './Questions.jsx'

export default function App() {
  const [start, startTest] = useState(false)
  const [finish, setFinished] = useState(false)
  const [level, setLevel] = useState(null)
  const [count, setCount] = useState(1)
  let firstName = useRef("a")
  let lastName = useRef("b")
  let emailAddress = useRef("email")

  if (testState == "starting") {
    return (
      <>
        <Header/>
        <Intro
          setTestState={setTestState}
          setLevel={setLevel}
          firstName={firstName}
          lastName={lastName}
          emailAddress={emailAddress}
        />
      </>
    )
  }
  else if (testState == "in progress") {
    return (
      <>
        <Header/>
        <Questions
          count={count}
          handleSubmit={handleSubmit}
        />
      </>
    )
  }
  else if (!finish && level == "intermediateQuestionVideos") {
    return (
      <>
        <Header/>
        <IntermediateQuestions
          count={count}
          handleSubmit={handleSubmit}
        />
      </>
    )
  }
  else if (!finish && level == "advancedQuestionVideos") {
    return (
      <>
        <Header/>
        <AdvancedQuestions
          count={count}
          handleSubmit={handleSubmit}
        />
      </>
    )
  }
  else {
    return (
      <>
        <Header/>
        <p>
          Your test has been submitted
        </p>
      </>
    )
  }
}
