import { useState } from 'react'
import './App.css'
import QuestionVideo from './QuestionVideo.jsx'
import VideoRecorder from './VideoRecorder.jsx'

const answerDurationMap = [
  16,
  11,
  31,
  31,
  31,
  11,
  11,
  61,
  0
]

const questionVideoMap = [
  "iqv3.MOV",
  "iqv4.MOV",
  "iqv5.MOV",
  "iqv6.MOV",
  "iqv7.MOV",
  "iqv9.MOV",
  "iqv10.MOV",
  "iqv11.MOV",
  "endofInterview.MOV"
]

const extraContentMap = {
  1: "question 1",
  2: "question 2",
  3: "question 3",
  4: "question 4"
}

AWS.config.update({
  accessKeyId: "DO00JV9GL7CYLW8G8E3D",
  secretAccessKey: "A+h2NgptkKly2VYNZxz7sRX/bfTWDDQkl1MWVMzwTFU",
})

const spacesEndpoint = new AWS.Endpoint("nyc3.digitaloceanspaces.com")
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
})

const videoSources = questionVideoMap.map((key) => {
  const params = {
    Bucket: "hoftfiles",
    Key: `questionVideos/beginnerQuestionVideos/${key}`,
    Expires: 60 * 30,
  }
  return s3.getSignedUrl("getObject", params)
})
console.log(videoSources)

export default function IntermediateQuestions({count, handleSubmit}) {
  const total = 9

  return (
    <>
      <h2>Intermediate Test</h2>
      <p>Question {count} of {total}</p>
      <QuestionVideo
      videoLink={questionVideoMap[count-1]}
      />
      <p>{extraContentMap[count]}</p>
      <VideoRecorder
        handleSubmit={handleSubmit}
        total={total}
        answerDuration={answerDurationMap[count-1]}
      />    
    </>
  )
}
