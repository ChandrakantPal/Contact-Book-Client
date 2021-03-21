import { useLazyQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { FormEvent, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import InputGroup from '../components/InputGroup'

import Layout from '../components/Layout'
import { useAuthDispatch, useAuthState } from '../context/Auth'

const Signin = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<any>({})
  const history = useHistory()

  const dispatch = useAuthDispatch()
  const { authenticated } = useAuthState()

  const [loginUser] = useLazyQuery(LOGIN_USER, {
    onError: (err) => {
      setErrors(err.graphQLErrors[0].extensions.errors)
    },
    onCompleted: (data) => {
      localStorage.setItem('token', data.login.token)
      dispatch('LOGIN', data.login)
      history.push('/')
    },
  })

  const submitHandler = (event: FormEvent) => {
    event.preventDefault()
    loginUser({ variables: { username, password } })
  }

  if (authenticated) history.push('/')

  return (
    <Layout>
      <h1 className="text-3xl font-semibold text-center md:text-4xl">
        Sign In
      </h1>
      <p className="my-2 text-base text-center text-gray-600 md:text-xl">
        Do not have an account?{' '}
        <Link to="register" className="text-blue-500 hover:underline">
          Sign up
        </Link>
      </p>
      <form className="w-full mx-auto md:w-2/3" onSubmit={submitHandler}>
        <InputGroup
          value={username}
          type="text"
          setValue={setUsername}
          placeholder="Username"
          error={errors.username}
        />
        <InputGroup
          type="password"
          value={password}
          setValue={setPassword}
          placeholder="Password"
          error={errors.password}
        />
        <button
          className="w-full p-3 mb-4 text-base font-bold text-white uppercase bg-blue-500 border border-blue-500 rounded-xl"
          type="submit"
        >
          Sign in
        </button>
      </form>
    </Layout>
  )
}

export default Signin

const LOGIN_USER = gql`
  query login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      username
      email
      createdAt
      token
    }
  }
`
