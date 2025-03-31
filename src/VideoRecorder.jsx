import { useState, useRef } from 'react'

export default function VideoRecorder({handleSubmit, total}) {
  const [permission, setPermission] = useState(false)
  const [recordingStatus, setRecordingStatus] = useState("inactive")
  const [stream, setStream] = useState(null)
  const [videoChunks, setVideoChunks] = useState([])
  const [recordedVideo, setRecordedVideo] = useState(null)
  const mediaRecorder = useRef(null)
  const liveVideoFeed = useRef(null)
  const mimeType = "video/webm";

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
  }

  const stopRecording = () => {
    setRecordingStatus("inactive")
    mediaRecorder.current.stop()
    mediaRecorder.current.onstop = () => {
      const videoBlob = new Blob(videoChunks, {type: mimeType})
      const videoUrl = URL.createObjectURL(videoBlob)
      setRecordedVideo(videoUrl)
      setVideoChunks([])
    }
  }

  return (
    <>
			<div className="videoDiv">
        {recordedVideo && recordingStatus == "inactive" ? (
						<video className="video" src={recordedVideo} controls/>
				) : (
          <video ref={liveVideoFeed} autoPlay className="video"/>
        )}
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
