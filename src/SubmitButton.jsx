export default function SubmitButton({total, recordedVideo, recordingStatus, 
    setRecordedVideo, handleSubmit}) {
  
  return (
  <div className="submit">
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
  )
}
