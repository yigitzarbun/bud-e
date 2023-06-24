import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

  useEffect(() => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.onresult = async (event) => {
      const newTranscript = event.results[0][0].transcript;
      setTranscript(newTranscript);

      // Send user's transcript to OpenAI API for a response
      const prompt = `User: ${newTranscript}\nAssistant:`;
      try {
        const response = await fetch(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + apiKey,
            },
            body: JSON.stringify({
              messages: [
                { role: "system", content: "You: " + newTranscript },
                { role: "system", content: "Assistant:" },
              ],
              model: "gpt-3.5-turbo",
              max_tokens: 50,
            }),
          }
        );

        const data = await response.json();
        if (data.choices && data.choices.length > 0) {
          const reply = data.choices[0].message.content.trim();
          setResponse(reply);
          speak(reply); // Speak the response
        }
      } catch (error) {
        console.error("Failed to generate response:", error);
      }
    };

    return () => {
      recognition.stop();
    };
  }, []);

  const handleListen = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.onresult = (event) => {
      const newTranscript = event.results[0][0].transcript;
      setTranscript(newTranscript);

      // Send user's transcript to OpenAI API for a response
      const prompt = `User: ${newTranscript}\nAssistant:`;
      axios
        .post(
          "https://api.openai.com/v1/chat/completions",
          {
            messages: [
              { role: "system", content: "You: " + newTranscript },
              { role: "system", content: "Assistant:" },
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
            speak(reply); // Speak the response
          }
        })
        .catch((error) => {
          console.error("Failed to generate response:", error);
        });
    };

    recognition.start();
  };

  const speak = (text) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <>
      <h1>Hi, this is Buddy</h1>
      <button onClick={handleListen}>Listen</button>
      <p>{transcript !== "" && transcript}</p>
      <p>{response}</p>
    </>
  );
}

export default App;
