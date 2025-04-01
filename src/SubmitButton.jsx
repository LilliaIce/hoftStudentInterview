export default function SubmitButton({total, recordedVideo, recordingStatus, handleSubmit}) {
  
  return (
  <div className="submit">
    {recordingStatus == "inactive" && recordedVideo ? (
            <button type="button" onClick={() => {
              handleSubmit(total, recordedVideo)
            }}>
              Next question
            </button>
    ) : null }
    {recordingStatus == "inactive" && !recordedVideo ? (
      <button type="button" id="noSubmit">
        Next question
      </button>
    ) : null }
  </div>
  )
}
