export default function RecordingButtons({permission, getCameraPermission,
    startRecording, stopRecording, recordedVideo, recordingStatus}) {

  return (
    <>
      {!permission ? (
        <button type="button" className="recordingButton" onClick={getCameraPermission}>
          Connect Camera
        </button>
        ) : null }
      {permission && !recordedVideo && recordingStatus == "inactive" ? (
        <button type="button" className="recordingButton" onClick={startRecording}>
          Start recording
        </button>
      ) : null }
      {permission && recordedVideo && recordingStatus == "inactive" ? (
        <button type="button" className="recordingButton" id="noSubmit">
          Start recording
        </button>
      ) : null }
      {recordingStatus == "recording" ? (
        <button type="button" id="stop" className="recordingButton" onClick={stopRecording}>
          Stop recording and upload answer
        </button>
      ) : null }
    </>
  )
}
