import { useState, useRef } from 'react'
import './App.css'
import Intro from './Intro.jsx'
import Header from './Header.jsx'
import Questions from './Questions.jsx'
import Footer from './Footer.jsx'

export default function App() {
  const [testState, setTestState] = useState("starting")
  const [level, setLevel] = useState(null)
  const [count, setCount] = useState(1)
  let firstName = useRef("a")
  let lastName = useRef("b")
  let emailAddress = useRef("email")

  if (testState == "starting") {
    return (
      <>
        <div className="header">
          <Header/>
        </div>
        <div className="bodyContent">
          <Intro
            setTestState={setTestState}
            setLevel={setLevel}
            firstName={firstName}
            lastName={lastName}
            emailAddress={emailAddress}
          />
        </div>
        <div className="footer">
          <Footer/>
        </div>
      </>
    )
  }
  else if (testState == "in progress") {
    return (
      <>
        <div className="header">
          <Header/>
        </div>
        <div className="bodyContent">
          <Questions
            count={count}
            setTestState={setTestState}
            setCount={setCount}
            level={level}
            firstName={firstName}
            lastName={lastName}
            email={emailAddress}
          />
        </div>
        <div className="footer">
          <Footer/>
        </div>
      </>
    )
  }
  else {
    return (
      <>
        <div className="header">
          <Header/>
        </div>
        <p className="bodyContent">
          Your test has been submitted
        </p>
        <div className="footer">
          <Footer/>
        </div>
      </>
    )
  }
}
