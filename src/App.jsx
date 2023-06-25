import React, { useState } from "react";
import "tailwindcss/tailwind.css";
import axios from "axios";

import SpeechCircle from "./components/SpeechCircle";
import Transcript from "./components/Transcript";

function App() {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [bgColor, setBgColor] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [click, setClick] = useState(true);

  const colors = [
    "bg-gradient-to-r from-cyan-500 to-blue-500",
    "bg-gradient-to-r from-sky-500 to-indigo-500",
    "bg-gradient-to-r from-violet-500 to-fuchsia-500",
    "bg-gradient-to-r from-purple-500 to-pink-500",
  ];

  const speakResponse = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
      utterance.onend = () => {
        setSpeaking(false);
        setClick(true);
      };
    }
  };

  const handleListen = () => {
    setBgColor((bgColor + 1) % colors.length);
    setClick(false);
    const recognition = new window.webkitSpeechRecognition();
    recognition.onresult = (event) => {
      const newTranscript = event.results[0][0].transcript;
      setTranscript(newTranscript);
      recognition.interimResults = true;
      recognition.continuous = true;
      axios
        .post(
          "https://api.openai.com/v1/chat/completions",
          {
            messages: [
              {
                role: "system",
                content:
                  "You: " +
                  newTranscript +
                  "Respond in a kind manner and keep your response less than 255 characters.",
              },
              { role: "system", content: "Bud-e:" },
            ],
            model: "gpt-3.5-turbo",
            max_tokens: 50,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
          }
        )
        .then((response) => {
          const data = response.data;
          if (data.choices && data.choices.length > 0) {
            const reply = data.choices[0].message.content.trim();
            setResponse(reply);
            speakResponse(reply);
            setSpeaking(true);
          }
        })
        .catch((error) => {
          console.error("Failed to generate response:", error);
        });
    };
    recognition.start();
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <SpeechCircle
        handleListen={handleListen}
        colors={colors}
        bgColor={bgColor}
        speaking={speaking}
        click={click}
      />
      {transcript || response ? (
        <Transcript transcript={transcript} response={response} />
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
