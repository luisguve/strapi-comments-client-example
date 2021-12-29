import { useState, useContext } from "react"

import { STRAPI } from "../lib/urls"
import AuthContext from "../context/AuthContext"

const StrapiLogin = () => {
  return (
    <div className="d-flex flex-column">
      <RegisterForm />
      <LoginForm />
    </div>
  )
}

export default StrapiLogin

const RegisterForm = () => {
  const { loginUser } = useContext(AuthContext)
  const [username, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [password2, setPassword2] = useState("")
  const [mostrar, setMostrar] = useState(false)
  const validInputs = () => {
    return username !== "" && email !== "" && password !== "" && password2 !== ""
  }
  const handleName = (e: React.FormEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value)
  }
  const handleEmail = (e: React.FormEvent<HTMLInputElement>) => {
    setEmail(e.currentTarget.value)
  }
  const handlePassword = (e: React.FormEvent<HTMLInputElement>) => {
    setPassword(e.currentTarget.value)
  }
  const handlePassword2 = (e: React.FormEvent<HTMLInputElement>) => {
    setPassword2(e.currentTarget.value)
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validInputs()) {
      return
    }
    if (!(password === password2)) {
      console.log("Ambas contraseñas deben coincidir")
      return
    }
    const url = `${STRAPI}/api/auth/local/register`
    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        username,
        email,
        password
      })
    })
    .then(res => {
      if (!(res.status >= 200 && res.status < 300)) {
        console.log("error:", res.status)
        throw res
      }
      return res.json()
    })
    .then((data) => {
      loginUser({
        username,
        email,
        id: data.user.id,
        token: data.jwt
      })
      console.log('Registrado exitosamente')
    })
    .catch(error => {
      console.log(error);
    });
  }
  let extraProps = {}
  if (!validInputs()) {
    extraProps = {
      disabled: "disabled"
    }
  }
  return (
    <div className="d-flex flex-column border rounded p-1 p-md-3">
      <h4 className="fs-5 text-center">Registrate</h4>
      <form className="d-flex flex-column" onSubmit={handleSubmit}>
        <label className="d-flex flex-column mb-2">
          Nombre completo
          <input className="form-control" type="text" value={username} onChange={handleName} required />
        </label>
        <label className="d-flex flex-column mb-2">
          Correo electrónico
          <input className="form-control" type="email" value={email} onChange={handleEmail} required />
        </label>
        <label className="d-flex flex-column mb-2">
          Contraseña
          <input className="form-control"
            type={mostrar ? "text" : "password"}
            value={password}
            onChange={handlePassword}
            required
          />
        </label>
        <label className="d-flex flex-column mb-2">
          Confirmar contraseña
          <input className="form-control"
            type={mostrar ? "text" : "password"}
            value={password2}
            onChange={handlePassword2}
            required
          />
        </label>
        <label className="d-flex">
          <input
            className="form-check me-1"
            type="checkbox"
            value={mostrar ? "checked" : undefined}
            onChange={() => setMostrar(!mostrar)}
          />
          Ver contraseña
        </label>
        <button
          type="submit"
          className="btn btn-secondary"
          disabled={!validInputs() ? true : false}
        >Registrarse</button>
      </form>
    </div>
  )
}
const LoginForm = () => {
  const { loginUser } = useContext(AuthContext)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const validInputs = () => {
    return email !== "" && password !== ""
  }
  const handleEmail = (e: React.FormEvent<HTMLInputElement>) => {
    setEmail(e.currentTarget.value)
  }
  const handlePassword = (e: React.FormEvent<HTMLInputElement>) => {
    setPassword(e.currentTarget.value)
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validInputs) {
      return
    }
    const url = `${STRAPI}/api/auth/local`
    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        identifier: email,
        password
      })
    })
    .then(async res => {
      const body = await res.json()
      if (!res.ok) {
        throw body
      }
      return body
    })
    .then((data) => {
      loginUser({
        username: data.user.username,
        email: data.user.email,
        id: data.user.id,
        token: data.jwt
      })
    })
    .catch(error => {
      console.log(error);
      console.log('Correo o contraseña inválidos')
    });
  }
  return (
    <div className="d-flex flex-column mt-3 border rounded p-1 p-md-3">
      <h4 className="fs-5 text-center">Inicia sesión</h4>
      <form className="d-flex flex-column" onSubmit={handleSubmit}>
        <label className="d-flex flex-column mb-2">
          Correo electrónico
          <input className="form-control" type="email" value={email} onChange={handleEmail} required />
        </label>
        <label className="d-flex flex-column mb-2">
          Contraseña
          <input className="form-control" type="password" value={password} onChange={handlePassword} required />
        </label>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!validInputs() ? true : false}
        >Iniciar sesión</button>
      </form>
    </div>
  )
}