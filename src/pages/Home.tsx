import { useMutation, useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { FormEvent, useState } from 'react'
import { Redirect } from 'react-router'
import ContactComponent from '../components/Contact'
import InputGroup from '../components/InputGroup'
import Modal from '../components/Modal'
import Navbar from '../components/Navbar'
import { useAuthState } from '../context/Auth'
import { Contact } from '../types'

const Home = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [id, setId] = useState('')
  const [openEditModal, setOpenEditModal] = useState(false)
  const [openAddModal, setOpenAddModal] = useState(false)
  const [errors, setErrors] = useState('')

  const { authenticated } = useAuthState()

  const { data, loading, error, refetch } = useQuery(GET_CONTACTS)

  const [createContact] = useMutation(CREATE_CONTACT, {
    update: (_, data) => {
      console.log(data)
      refetch()
      setOpenAddModal(false)
      setName('')
      setEmail('')
    },
    onError: (err) => {
      console.log(err.graphQLErrors[0].message)
      setErrors(err.graphQLErrors[0].message)
    },
  })

  const createContactSubmitHandler = (event: FormEvent) => {
    event.preventDefault()
    createContact({
      variables: { contactname: name, contactemail: email },
    })
  }

  const [updateContact] = useMutation(UPDATE_CONTACT, {
    update: (_, data) => {
      console.log(data)
      refetch()
      setOpenEditModal(false)
      setName('')
      setEmail('')
      setId('')
    },
    onError: (err) => {
      console.log(err.graphQLErrors[0].message)
      setErrors(err.graphQLErrors[0].message)
    },
  })

  const updateContactSubmitHandler = (event: FormEvent) => {
    event.preventDefault()
    updateContact({
      variables: { contactId: id, contactname: name, contactemail: email },
    })
  }

  const [deleteContact] = useMutation(DELETE_CONTACT, {
    update: (_, data) => {
      console.log(data)
      refetch()
    },
    onError: (err) => {
      console.log(err.graphQLErrors[0].message)
      setErrors(err.graphQLErrors[0].message)
    },
  })

  const editContact = (
    contactname: string,
    contactemail: string,
    id: string
  ) => {
    setId(id)
    setEmail(contactemail)
    setName(contactname)
    setOpenEditModal(true)
  }

  const deleteContactHandler = (contactId: string) => {
    deleteContact({
      variables: { contactId },
    })
  }

  if (loading) return <h1 className="text-center">Loading...</h1>

  if (error) {
    localStorage.removeItem('token')
    return <Redirect to="/signin" />
  }

  if (!authenticated) {
    return <Redirect to="/signin" />
  }

  return (
    <>
      <Navbar />
      <div className="container h-full py-2 mt-12">
        <div className="w-full p-4 mx-auto md:w-160 md:p-0">
          <button
            className="block h-10 px-4 py-2 mx-auto my-2 text-base font-semibold text-center text-gray-700 border rounded-full shadow-lg"
            onClick={() => setOpenAddModal(true)}
          >
            Create Contact
          </button>
          {data.getContacts.map((item: Contact) => (
            <ContactComponent
              key={item.id}
              contactemail={item.contactemail}
              contactname={item.contactname}
              id={item.id}
              editContact={editContact}
              deleteContact={deleteContactHandler}
            />
          ))}
        </div>
      </div>
      {openEditModal && (
        <Modal close={() => setOpenEditModal(false)}>
          <div
            className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <div className="w-full px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
              <div className="justify-center sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3
                    className="text-lg font-medium leading-6 text-gray-900"
                    id="modal-headline"
                  >
                    Update Contact
                  </h3>
                  <form onSubmit={updateContactSubmitHandler}>
                    <InputGroup
                      type="text"
                      value={name}
                      placeholder="Contact Name"
                      setValue={setName}
                      error={errors}
                    />
                    <InputGroup
                      type="email"
                      value={email}
                      placeholder="Contact Email"
                      setValue={setEmail}
                      error={errors}
                    />
                    <div className="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
                      <button
                        type="submit"
                        className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-blue-500 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => setOpenEditModal(false)}
                        className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
      {openAddModal && (
        <Modal close={() => setOpenAddModal(false)}>
          <div
            className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <div className="w-full px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
              <div className="justify-center sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3
                    className="text-lg font-medium leading-6 text-gray-900"
                    id="modal-headline"
                  >
                    Create Contact
                  </h3>
                  <form onSubmit={createContactSubmitHandler}>
                    <InputGroup
                      type="text"
                      value={name}
                      placeholder="Contact Name"
                      setValue={setName}
                      error={errors}
                    />
                    <InputGroup
                      type="email"
                      value={email}
                      placeholder="Contact Email"
                      setValue={setEmail}
                      error={errors}
                    />
                    <div className="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
                      <button
                        type="submit"
                        className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-blue-500 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setOpenAddModal(false)}
                        className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}

export default Home

const GET_CONTACTS = gql`
  {
    getContacts {
      id
      createdAt
      username
      contactname
      contactemail
    }
  }
`
const UPDATE_CONTACT = gql`
  mutation updateContact(
    $contactId: ID!
    $contactname: String!
    $contactemail: String!
  ) {
    updateContact(
      contactId: $contactId
      contactname: $contactname
      contactemail: $contactemail
    ) {
      id
      createdAt
      username
      contactemail
      contactname
    }
  }
`
const DELETE_CONTACT = gql`
  mutation deleteContact($contactId: ID!) {
    deleteContact(contactId: $contactId)
  }
`

const CREATE_CONTACT = gql`
  mutation createContact($contactname: String!, $contactemail: String!) {
    createContact(contactname: $contactname, contactemail: $contactemail) {
      id
      createdAt
      username
      contactname
      contactemail
    }
  }
`
