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

  async function startRecording() {
    setRecordingStatus("recording")
    let localVideoChunks = []
    setVideoChunks(localVideoChunks)
    mediaRecorder.current = new MediaRecorder(stream, {mimeType})
    mediaRecorder.current.start()
    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === "undefined") return
      if (event.data.size === 0) return
      // adds event.data to the localVideoChunks array
      localVideoChunks.push(event.data)
      alert(localVideoChunks)
    }
    // gets the time the recording started and
    // sets secondsLeft to the required answer duration
    startTime = Date.now()
    secondsPassed.current = 0
    setSecondsLeft(answerDuration)

    intervalRef.current = setInterval(() => {
      if (startTime != null) {
        // advances secondsPassed and displays the amount
        // of seconds the student has to answer
        secondsPassed.current = secondsPassed.current + 1
        setSecondsLeft(answerDuration - secondsPassed.current)

        // if secondsPassed exceeds the required answer duration,
        // the recording will be stopped
        if (secondsPassed.current == answerDuration) {
          document.getElementById("stop").click()
        }
      }
    }, 1000)
  }

  function stopRecording() {
    setRecordingStatus("inactive")
    // resets recording-related states and refs
    mediaRecorder.current.stop()
    mediaRecorder.current.onstop = () => {
      const blob = new Blob(videoChunks, {type: mimeType})
      setVideoBlob(blob)
      const videoUrl = URL.createObjectURL(blob)
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
