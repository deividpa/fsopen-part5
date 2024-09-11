import { useState } from 'react'
import propTypes from 'prop-types'

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    onLogin({
      username,
      password
    })
    setUsername('')
    setPassword('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        Username: <input value={username} onChange={({ target }) => setUsername(target.value)} />
      </div>
      <div>
        Password: <input type="password" value={password} onChange={({ target }) => setPassword(target.value)} />
      </div>
      <button type="submit">Login</button>
    </form>
  )
}

LoginForm.propTypes = {
  onLogin: propTypes.func.isRequired,
}

export default LoginForm