import React,{ useState } from "react";
import axios from "axios";

import { Container } from "./styles";

export default function TweetForm() {
  const [text, setText] = useState("");

  const handleTweet = async event => {
    event.preventDefault();

    try {
      const token = localStorage.getItem("SESSION_TOKEN");

      const response = await axios.post("http://localhost:3333/tweets",
        {
          content: text
        },
        {
          headers: { "auth-token": token }
        }
      );

      setText("");
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <textarea
        required
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Quais são seus pensamentos hoje?"
        rows={4}
      />
      <div>
        <a href="/">Voltar</a>
        <button onClick={handleTweet}>Enviar</button>
      </div>
    </Container>
  );
}
