export default function RecordingButtons({permission, getCameraPermission,
    startRecording, stopRecording, recordedVideo, recordingStatus}) {

  return (
    <div className="recording">
      {!permission ? (
        <button type="button" id="cameraButton" onClick={getCameraPermission}>
          Connect Camera
        </button>
        ) : ( null )}
      {permission && !recordedVideo && recordingStatus === "inactive" ? (
        <button type="button" onClick={startRecording}>
          Start recording
        </button>
      ) : null }
      {permission && recordedVideo && recordingStatus === "inactive" ? (
        <button type="button" id="noSubmit">
          Start recording
        </button>
      ) : null }
      {recordingStatus === "recording" ? (
        <button type="button" onClick={stopRecording}>
          Stop recording and upload answer
        </button>
      ) : ( null )}
    </div>
  )
}
