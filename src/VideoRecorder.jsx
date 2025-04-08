import { useState, useRef } from 'react'
import RecordingButtons from './RecordingButtons.jsx'
import RecorderText from './RecorderText.jsx'

export default function VideoRecorder({recordingStatus, setRecordingStatus, 
  answerDuration, setVideoBlob, setRecordedVideo, recordedVideo, getCameraPermission, 
  permission, stream, liveVideoFeed}) {
  const [secondsLeft, setSecondsLeft] = useState(null)
  const [videoChunks, setVideoChunks] = useState([])
  const mediaRecorder = useRef(null)
  const intervalRef = useRef(null)
  const secondsPassed = useRef(0)
  const mimeType = "video/webm";
  let startTime = null

  // Starts recording
  async function startRecording() {
    setRecordingStatus("recording")
    // creates a MediaRecorder
    const media = new MediaRecorder(stream, {mimeType})
    // connects media to the mediaRecorder ref
    mediaRecorder.current = media
    // starts the mediaRecorder
    mediaRecorder.current.start()
    let localVideoChunks = []
    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === "undefined") return
      if (event.data.size === 0) return
      // adds event.data to the localVideoChunks array
      localVideoChunks.push(event.data)
    }
    // sets videoChunks to localVideoChunks once
    // the user is done recording
    setVideoChunks(localVideoChunks)
  
    // gets the time recording started
    // sets secondsLeft to the required answer duration
    startTime = Date.now()
    secondsPassed.current = 0
    setSecondsLeft(answerDuration)

    clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      if (startTime != null) {
        // advances secondsPassed and displays the amount
        // of seconds the student has to answer
        secondsPassed.current = secondsPassed.current + 1
        setSecondsLeft(answerDuration - secondsPassed.current)
        // if secondsPassed exceeds the required answer duration,
        // the recording will be stopped
        if (secondsPassed.current == answerDuration) {
          stopRecording()
        }
      }
    }, 1000)
  }

  // Stops recording
  function stopRecording() {
    setRecordingStatus("inactive")
    // resets recording-related states and refs
    mediaRecorder.current.stop()
    mediaRecorder.current.onstop = () => {
      const videoBlob = new Blob(videoChunks, {type: mimeType})
      setVideoBlob(videoBlob)
      const videoUrl = URL.createObjectURL(videoBlob)
      setRecordedVideo(videoUrl)
      setVideoChunks([])
      startTime = null
      secondsPassed.current = 0
    }
    // clears the interval
    clearInterval(intervalRef.current)
    intervalRef.current = null
  }

  return (
    <>
			<div className="videoDiv">
        {recordedVideo ? (
          <video src={recordedVideo} controls/>
				) : null }
        {!recordedVideo ? (
        <video ref={liveVideoFeed} autoPlay/> 
        ) : null }
			</div>
      <div className="videoText" id="recorderText">
        <RecorderText
            answerDuration={answerDuration}
            secondsLeft={secondsLeft}
            recordingStatus={recordingStatus}
            recordedVideo={recordedVideo}
        />
      </div>
      <div id="recordingButtons">
        <RecordingButtons
          recordedVideo={recordedVideo}
          recordingStatus={recordingStatus}
          permission={permission}
          getCameraPermission={getCameraPermission}
          startRecording={startRecording}
          stopRecording={stopRecording}
        />
      </div>
    </>
  )
}
