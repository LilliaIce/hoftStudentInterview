import { useState } from 'react'
import './App.css'

export default function Intro({setTestState, setLevel, firstName, lastName, emailAddress}) {
  const [message, setMessage] = useState("")

  // Makes sure that all input fields contain data
  // If they don't, refuses to advance to the test and
  // notifies the user of what info is needed
  const handleClick = () => {
    let fName = document.getElementById("fName").value
    let lName = document.getElementById("lName")
    let email = document.getElementById("email").value
    let beginner = document.getElementById("beginner").checked
    let intermediate = document.getElementById("intermediate").checked
    let advanced = document.getElementById("advanced").checked
    if ((lName.value != null && lName.value != "") || lName.disabled === true
        && (fName != null && fName != "")) {
      // tests for [characters]@[characters].[characters]
      if (email != null && email != "" && /\w+\@\w+\.\w+/.test(email)) {
        firstName.current = fName
        lastName.current = lName.value
        if (lastName.current == null || lastName.current == "") {
          lastName.current = "NONE"
        }
        emailAddress.current = email
        if (beginner === true) {
          setTestState("in progress")
          setLevel("beginner")
        }
        else if (intermediate === true) {
          setTestState("in progress")
          setLevel("intermediate")
        }
        else if (advanced === true) {
          setTestState("in progress")
          setLevel("advanced")
        }
        else {
          setMessage("Please select a level before proceeding")
        }  
      }
      else {
        setMessage("Please enter a valid email address.")
      }
    }
    else {
      setMessage("Please fill all fields before proceeding")
    }
  }

  // Enables or disables lName when the check is checked/unchecked
  const handleCheck = () => {
    let check = document.getElementById("nameCheckBox")
    let lName = document.getElementById("lName")
    if (check.checked) {
      lName.disabled = true
    }
    else {
      lName.disabled = false
    }
  }

  return (
    <>
      <div id="inputDiv">
        <div id="userInfoDiv">
          <h2>
            Student Info
          </h2>
          <div className="checkBox">
            <label>Only one name</label>
            <input type="checkbox" id="nameCheckBox" onClick={handleCheck}/>
          </div>
          <div className="inputField">
            <label>First name:</label>
            <input id="fName" type="text"/>
          </div>
          <div className="inputField">
            <label>Last name:</label>
            <input id="lName" type="text"/>
          </div>
          <div className="inputField">
            <label>Email:</label>
            <input id="email" type="text"/>
          </div>
        </div>
        <div id="levelDiv">
          <h2>
            Exam level
          </h2>
          <div>
            <label htmlFor="beginner">Beginner</label>
            <input type="radio" id="beginner" name="levelButtons" value="beginner" />
          </div>
          <div>
            <label htmlFor="intermediate">Intermediate</label>
            <input type="radio" id="intermediate" name="levelButtons" value="intermediate" />
          </div>
          <div>
            <label htmlFor="advanced">Advanced</label>
            <input type="radio" id="advanced" name="levelButtons" value="advanced" />
          </div>
        </div>
      </div>
      <p>
        {message}
      </p>
      <div className="submit">
        <button type="button" onClick={handleClick}>
          Submit
        </button>
      </div>
    </>
  )
}
