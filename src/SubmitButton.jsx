export default function SubmitButton({total, recordedVideo, recordingStatus, handleSubmit}) {
  
  return (
  <div id="submit">
    {recordedVideo ? (
            <button type="button" onClick={() => handleSubmit(total)}>
              Next question
            </button>
    ) : null }
    {!recordedVideo ? (
      <button type="button" id="noSubmit">
        Next question
      </button>
    ) : null }
  </div>
  )
}
