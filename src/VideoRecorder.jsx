import { useState, useRef } from 'react'
import RecordingButtons from './RecordingButtons.jsx'
import RecorderText from './RecorderText.jsx'

export default function VideoRecorder({answerDuration, recordingStatus, 
    setRecordedVideo, recordedVideo, setRecordingStatus}) {
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

  async function getCameraPermission() {
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
          const audioStream = await navigator.mediaDevices.getUserMedia(audioConstraints)
          const videoStream = await navigator.mediaDevices.getUserMedia(videoConstraints)
          setPermission(true)
          const combinedStream = new MediaStream([
            ...videoStream.getVideoTracks(),
            ...audioStream.getAudioTracks()
          ])
          setStream(combinedStream)
          liveVideoFeed.current.srcObject = videoStream
        } catch (err) {
          alert(err.message)
        }
    } else {
        alert("The MediaRecorder API is not supported in your browser.")
    }
  }
  
  async function startRecording() {
    setRecordingStatus("recording")
    const media = new MediaRecorder(stream, {mimeType})
    mediaRecorder.current = media
    mediaRecorder.current.start()
    let localVideoChunks = []
    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === "undefined") return
      if (event.data.size === 0) return
      localVideoChunks.push(event.data)
    }
    setVideoChunks(localVideoChunks)
  
    startTime = Date.now()
    secondsPassed.current = 0
    setSecondsLeft(answerDuration)
    clearInterval(intervalRef.current)
    
    intervalRef.current = setInterval(() => {
      if (startTime != null) {
        secondsPassed.current = secondsPassed.current + 1
        setSecondsLeft(answerDuration - secondsPassed.current)
        if (secondsPassed.current == answerDuration) {
          stopRecording()
        }
      }
    }, 1000)
  }

  function stopRecording() {
    setRecordingStatus("inactive")
    startTime = null
    secondsPassed.current = 0
    mediaRecorder.current.stop()
    mediaRecorder.current.onstop = () => {
      const videoBlob = new Blob(videoChunks, {type: mimeType})
      const videoUrl = URL.createObjectURL(videoBlob)
      setRecordedVideo(videoUrl)
      setVideoChunks([])
    }
    clearInterval(intervalRef.current)
    intervalRef.current = null
  }

  return (
    <>
			<div className="videoDiv">
        {recordedVideo && recordingStatus == "inactive" ? (
          <video src={recordedVideo} controls/>
				) : ( 
          <video ref={liveVideoFeed} autoPlay/> 
        )}
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
