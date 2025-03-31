import { useState } from 'react'
import './App.css'
import QuestionVideo from './QuestionVideo.jsx'
import VideoRecorder from './VideoRecorder.jsx'

const answerDurationMap = [
  6,
  31,
  31,
  16,
  31,
  31,
  31,
  31,
  61,
  0
]

const questionVideoMap = [
  "aqv1.mp4",
  "aqv2.MOV",
  "aqv3.MOV",
  "aqv4.MOV",
  "aqv5.MOV",
  "aqv6.MOV",
  "aqv7.MOV",
  "aqv8.MOV",
  "aqv9.MOV",
  "endofInterview.MOV"
]

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

const extraContentMap = {
  1: "question 1",
  2: "question 2",
  3: "question 3",
  4: "question 4"
}

export default function AdvancedQuestions({count, handleSubmit}) {
  const total = 10

  return (
    <>
      <h2>Advanced Test</h2>
      <p>Question {count} of {total}</p>
      <QuestionVideo
      videoLink={questionVideoMap[count-1]}
      />
      <p>Extra content</p>
      <VideoRecorder
        handleSubmit={handleSubmit}
        total={total}
      />
    </>
  )
}
