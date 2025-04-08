import { useState, useRef } from 'react'
import RecordingButtons from './RecordingButtons.jsx'
import RecorderText from './RecorderText.jsx'

export default function VideoRecorder({answerDuration, recordingStatus, 
    setVideoBlob, setRecordingStatus, setRecordedVideo, recordedVideo}) {
  const [permission, setPermission] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(null)
  const [stream, setStream] = useState(null)
  const [videoChunks, setVideoChunks] = useState([])
  const mediaRecorder = useRef(null)
  const liveVideoFeed = useRef(null)
  const intervalRef = useRef(null)
  const secondsPassed = useRef(0)
  const mimeType = "video/webm";
  let startTime = null

  // Gets audio and video permissions from the user
  // and formats the streams
  async function getCameraPermission() {
    // Checks for the MediaRecorder API
    if ("MediaRecorder" in window) {
        try {
          const audioConstraints = {audio: true}
          const videoConstraints = {
            audio: false,
            video: {
              width: {min: 100, ideal: 320},
              height: {min: 100, ideal: 240},
              frameRate: {min: 10, ideal: 10}
            }
          }
          // Creates audio stream
          const audioStream = await navigator.mediaDevices.getUserMedia(audioConstraints)
          // Creates video stream
          const videoStream = await navigator.mediaDevices.getUserMedia(videoConstraints)
          setPermission(true)
          // Combines audio and video streams
          const combinedStream = new MediaStream([
            ...videoStream.getVideoTracks(),
            ...audioStream.getAudioTracks()
          ])
          // Sets stream to the combinedStream
          setStream(combinedStream)
          // Connects liveVideoFeed to the videoStream
          liveVideoFeed.current.srcObject = videoStream
        } catch (err) {
          alert(err.message)
        }
    } else {
        alert("The MediaRecorder API is not supported in your browser.")
    }
  }

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
