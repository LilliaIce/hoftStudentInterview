import { useState, useRef } from 'react'
import './App.css'
import Intro from './Intro.jsx'
import Header from './Header.jsx'
import BeginnerQuestions from './BeginnerQuestions.jsx'
import IntermediateQuestions from './IntermediateQuestions.jsx'
import AdvancedQuestions from './AdvancedQuestions.jsx'

export default function App() {
  const [start, startTest] = useState(false)
  const [finish, setFinished] = useState(false)
  const [level, setLevel] = useState(null)
  const [count, setCount] = useState(1)
  let firstName = useRef("a")
  let lastName = useRef("b")
  let emailAddress = useRef(null)

  const handleSubmit = (total, recordedVideo) => {
    if (count < total) {
      setCount(count + 1)
    }
    else {
      setFinished(true)
    }
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
    let link = document.createElement("a")
    const now = new Date
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const seconds = now.getSeconds()
    const month = now.getMonth()
    const day = now.getDay()
    const year = now.getFullYear()
    let currentTime = `${month}-${day}-${year}-${hours}:${minutes}:${seconds}`
    let stringCount = toString(count)
    let fName = firstName.current
    let lName = lastName.current
    link.download = {stringCount} + "_" + {lName} + "_" + {fName}
    // + "-" + {currentTime}
    link.href = recordedVideo
    link.click()
  }

  if (!start) 
  {
    return (
      <>
        <Header/>
        <Intro
          startTest={startTest}
          setLevel={setLevel}
          firstName={firstName}
          lastName={lastName}
          emailAddress={emailAddress}
        />
      </>
    )
  }
  else if (!finish && level == "beginner") 
    {
      return (
        <>
          <Header/>
          <BeginnerQuestions
            count={count}
            handleSubmit={handleSubmit}
          />
        </>
      )
    }
  else if (!finish && level == "intermediate") 
    {
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
  else if (!finish && level == "advanced") 
    {
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
  else
  {
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
