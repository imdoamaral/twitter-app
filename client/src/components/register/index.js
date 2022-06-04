import React, {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

import Layout from "../../components/layout";
import {Container, Content, Input, Button,ErrorWarning} from "./styles";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState();
  
  const navigation = useNavigate();

  console.log({username, password});
  const handleRegister = async event => {
  event.preventDefault();

    if (!username || !password) return;

    try {
        await axios.post("http://localhost:3333/register", {
        username,
        password
      });
      
      
      return navigation("../");
    } catch (e) {
      console.error(e); 
      setError("Nome de usuário já usado ou conexão instável.");
      setUsername("");
      setPassword("");
    }
  };

  console.log(username,password);
  return (
    <Layout>
      <Container>
        <Content>
          {error && <ErrorWarning>{error}</ErrorWarning>}
          <div>
            <label>Informe o Nome do Usuário</label>
            <Input
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
              type="text"
            />
          </div>
          <div>
            <label>Informe a Senha</label>
            <Input
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              type="Password"
            />
          </div>
          <div>
            <a href="/">Cancelar</a>
            <Button onClick={handleRegister} type="submit">Register</Button>
          </div>
        </Content>
      </Container>
    </Layout>
  );
}