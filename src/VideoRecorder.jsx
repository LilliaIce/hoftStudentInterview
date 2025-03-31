import { useState, useRef, useEffect } from 'react'

export default function VideoRecorder({handleSubmit, total, answerDuration}) {
  const [permission, setPermission] = useState(false)
  const [recordingStatus, setRecordingStatus] = useState("inactive")
  const [stream, setStream] = useState(null)
  const [videoChunks, setVideoChunks] = useState([])
  const [recordedVideo, setRecordedVideo] = useState(null)
  const now = useRef(null)
  let startTime = null
  const [secondsPassed, setSecondsPassed] = useState(0)
  const intervalRef = useRef(null)
  const mediaRecorder = useRef(null)
  const liveVideoFeed = useRef(null)
  const mimeType = "video/webm";
  let recordingText = `Recording ${answerDuration-secondsPassed} seconds left.`
  let uploadText = `Recording stopped. Answer video is being uploaded.\n` +
  `Please do not leave this page until the upload is finished.`

  const getCameraPermission = async () => {
    setRecordedVideo(null)
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

  const increment = () => {
    if (startTime != null) {
      setSecondsPassed(secondsPassed + 1)
      console.log(`${secondsPassed}`)
      if (secondsPassed === answerDuration) {
        stopRecording()
      }
    }
    return () => clearInterval(intervalRef.current)
  }

  const startRecording = async () => {
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
    setSecondsPassed(0)
    clearInterval(intervalRef.current)
    intervalRef.current = setInterval(increment, 1000)
  }

  const stopRecording = () => {
    setRecordingStatus("inactive")
    startTime = null
    now.current = null
    setSecondsPassed(0)
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
          <video className="video" src={recordedVideo} controls/>
				) : (
          <video ref={liveVideoFeed} autoPlay className="video"/>
        )}
        {recordedVideo && recordingStatus == "inactive" ? (
          <p>{uploadText}</p>
				) : null }            
        {recordingStatus == "recording" ? (
          <p>{recordingText}\n{answerDuration}\n{secondsPassed}</p>
        ) : null }        
			</div>
      <div className="submit">
        {!permission ? (
          <button type="button" id="cameraButton" onClick={getCameraPermission}>
            Connect Camera
          </button>
          ) : ( null )}
        {permission && !recordedVideo && recordingStatus === "inactive" ? (
          <button type="button" onClick={startRecording}>
            Start question
          </button>
        ) : null }
        {permission && recordedVideo && recordingStatus === "inactive" ? (
          <button type="button" id="noSubmit">
            Start question
          </button>
        ) : null }
        {recordingStatus === "recording" ? (
          <button type="button" onClick={stopRecording}>
            Stop recording and upload answer
          </button>
        ) : ( null )}
        {recordingStatus != "inactive" ? (
          <button type="button" id="noSubmit">
            Next question
          </button>
        ) : (
          <button type="button" onClick={() => {
            handleSubmit(total, recordedVideo)
            setRecordedVideo(null)
          }}>
            Next question
          </button>
        )}
      </div>
    </>
  )
}
