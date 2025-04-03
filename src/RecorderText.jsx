export default function RecorderText({answerDuration, secondsLeft, recordingStatus, recordedVideo}) {
  if (!recordedVideo && recordingStatus == "inactive") {
    return (<><p>Record a {answerDuration} seconds long video.</p></>)
  }
  else if (recordedVideo && recordingStatus == "inactive") {
    return (<>
              <p>Recording stopped. Answer video is being uploaded.</p>
              <p>Please do not leave this page until the upload is finished.</p>
            </>
            )
  }
  else if (recordingStatus == "recording") {
    return (<><p>Recording {secondsLeft} seconds left.</p></>)
  }
}
