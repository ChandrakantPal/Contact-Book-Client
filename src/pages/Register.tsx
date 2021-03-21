import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import { FormEvent, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'

import InputGroup from '../components/InputGroup'
import Layout from '../components/Layout'
import { useAuthDispatch, useAuthState } from '../context/Auth'

const Register = () => {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<any | undefined>({})
  const history = useHistory()

  const dispatch = useAuthDispatch()
  const { authenticated } = useAuthState()

  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    update: (_, { data: { register: userData } }) => {
      localStorage.setItem('token', userData.token)
      dispatch('LOGIN', userData)
      history.push('/')
    },
    onError: (err) => {
      console.log(err.graphQLErrors[0].extensions.exception.errors)
      setErrors(err.graphQLErrors[0].extensions.exception.errors)
    },
  })

  const submitHandler = (event: FormEvent) => {
    event.preventDefault()
    registerUser({ variables: { username, email, password, confirmPassword } })
  }

  if (authenticated) history.push('/')

  return (
    <Layout>
      <h1 className="text-3xl font-semibold text-center md:text-4xl">
        Create Account
      </h1>
      <p className="my-2 text-base text-center text-gray-600 md:text-xl">
        Already have an account?{' '}
        <Link to="/signin" className="text-blue-500 hover:underline">
          Sign in
        </Link>
      </p>
      <form className="w-full mx-auto md:w-2/3" onSubmit={submitHandler}>
        <InputGroup
          value={email}
          type="email"
          setValue={setEmail}
          placeholder="Email"
          error={errors.email}
        />
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
        <InputGroup
          type="password"
          value={confirmPassword}
          setValue={setConfirmPassword}
          placeholder="Confirm Password"
          error={errors.confirmPassword}
        />
        <button
          className="w-full p-3 mb-4 text-base font-bold text-white uppercase bg-blue-500 border border-blue-500 rounded-xl"
          type="submit"
        >
          Sign up
        </button>
      </form>
    </Layout>
  )
}

export default Register

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      email
      token
      username
      createdAt
    }
  }
`
