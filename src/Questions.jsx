import { useState } from 'react'
import BeginnerQuestions from './BeginnerQuestions.jsx'
import IntermediateQuestions from './IntermediateQuestions.jsx'
import AdvancedQuestions from './AdvancedQuestions.jsx'

export default function Questions({count, setTestState, setCount, level, firstName, lastName, email}) {
  const [recordingStatus, setRecordingStatus] = useState("inactive")
  const [recordedVideo, setRecordedVideo] = useState(null)

  function getCurrentTime() {
    const now = new Date
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const seconds = now.getSeconds()
    const month = now.getMonth()
    const day = now.getDay()
    const year = now.getFullYear()
    return `${month}-${day}-${year}_${hours}-${minutes}-${seconds}`
  }

  function handleSubmit(total, recordedVideo) {
    setRecordingStatus("inactive")
    setRecordedVideo(null)
    window.scrollTo(0, 0)
    if (count < total) {
      setCount(count + 1)
    }
    else {
      setTestState("finished")
    }
    let link = document.createElement("a")
    let currentTime = getCurrentTime()
    link.download = "question" + count + "_" + lastName.current + "_" + 
      firstName.current + "_" + currentTime
    link.href = recordedVideo
    link.click()
  }

  if (level == "beginnerQuestionVideos") {
    return (
      <>
        <BeginnerQuestions
          count={count}
          handleSubmit={handleSubmit}
          recordedVideo={recordedVideo}
          setRecordedVideo={setRecordedVideo}
          recordingStatus={recordingStatus}
          setRecordingStatus={setRecordingStatus}
        />
      </>
    )
  }
  else if (level == "intermediateQuestionVideos") {
    return (
      <>
        <IntermediateQuestions
          count={count}
          handleSubmit={handleSubmit}
          recordedVideo={recordedVideo}
          setRecordedVideo={setRecordedVideo}
          recordingStatus={recordingStatus}
          setRecordingStatus={setRecordingStatus}
        />
      </>
    )
  }
  else {
    return (
      <>
        <AdvancedQuestions
          count={count}
          handleSubmit={handleSubmit}
          recordedVideo={recordedVideo}
          setRecordedVideo={setRecordedVideo}
          recordingStatus={recordingStatus}
          setRecordingStatus={setRecordingStatus}
        />
      </>
    )
  }
}
