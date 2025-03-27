import { useState, useRef } from 'react'

export default function VideoRecorder({handleSubmit, total}) {
  const [permission, setPermission] = useState(false)
  const [recordingStatus, setRecordingStatus] = useState("inactive")
  const [stream, setStream] = useState(null)
  const [videoChunks, setVideoChunks] = useState([])
  const [recordedVideo, setRecordedVideo] = useState(null)
  const mediaRecorder = useRef(null)
  const liveVideoFeed = useRef(null)
  const mimeType = "video/webm; codecs=\"opus,vp8\"";

  const getCameraPermission = async () => {
    setRecordedVideo(null)
    if ("MediaRecorder" in window) {
        try {
            const videoConstraints = {
                audio: false,
                video: {
                  width: {min: 100, ideal: 320},
                  height: {min: 100, ideal: 240},
                  frameRate: {min: 10, ideal: 10}
                }
            }
            const audioConstraints = {audio: true}
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
    window.scrollTo({
      top: 1000,
      behavior: 'smooth'
    })
  }

  const stopRecording = () => {
    setRecordingStatus("finished")
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
				{recordingStatus != "finished" ? (
					<video ref={liveVideoFeed} autoPlay className="video"/>
				) : (
						<video className="video" src={recordedVideo} controls/>
				)}
			</div>

      <div className="submit">

        {!permission ? (
          <button type="button" id="cameraButton" onClick={getCameraPermission}>
            Connect Camera
          </button>
          ) : ( null )}

        {permission && recordingStatus === "inactive" ? (
          <button type="button" onClick={startRecording}>Start question</button>
        ) : ( null )}

        {recordingStatus === "recording" ? (
          <button type="button" onClick={stopRecording}>Stop recording and upload answer</button>
        ) : ( null )}

        {recordingStatus != "finished" ? (
          <button type="button" id="noSubmit">
            Next question
          </button>
        ) : (
          <button type="button" onClick={() => {
            handleSubmit(total, recordedVideo)
            setRecordingStatus("inactive")
          }}>
            Next question
          </button>
        )}

      </div>
    </>
  )
}
