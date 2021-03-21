import { useLazyQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthDispatch } from '../context/Auth'
import { Contact } from '../types'
import ContactComponent from './Contact'
import Pagination from './Pagination'

const Navbar: React.FC = () => {
  const [searchfield, setSearchField] = useState('')
  const [contacts, setContacts] = useState<Contact[]>([])
  const [timer, setTimer] = useState(null)
  const [start, setStart] = useState(0)
  const [end, setEnd] = useState(10)
  const [error, setError] = useState('')
  const [totalResultCount, setTotalResultCount] = useState(0)
  const [currentIndex, setcurrentIndex] = useState(1)

  const dispatch = useAuthDispatch()

  const logout = () => {
    localStorage.removeItem('token')
    dispatch('LOGOUT')
  }

  useEffect(() => {
    if (searchfield.trim() === '') {
      setcurrentIndex(1)
      setContacts([])
      return
    }
    searchSubs()
  }, [searchfield])

  const [searchContact, { loading }] = useLazyQuery(SEARCH_CONTACTS, {
    onError: (err) => {
      setError(err.graphQLErrors[0].message)
    },
    onCompleted: (data) => {
      console.log(data)
      setContacts(data.searchContact.contacts)
      setTotalResultCount(data.searchContact.contactCount)
    },
  })

  const searchSubs = () => {
    clearTimeout(timer)
    setTimer(
      setTimeout(() => {
        searchContact({
          variables: {
            searchfield,
          },
        })
      }, 250)
    )
  }

  const handlePagination = (index: number) => {
    setcurrentIndex(index)
    if (index === 1) {
      setStart(0)
    } else {
      setStart((index - 1) * 10)
    }
    setEnd(index * 10)
  }

  const contactsSearched = contacts.slice(start, end)

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-10 flex items-center justify-between h-12 px-5 bg-white border">
        {/* Logo and title */}
        <div className="flex items-center">
          <Link to="/" className="w-8 h-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="text-blue-500 fill-current"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
          <span className="hidden text-2xl font-semibold lg:block">
            <Link to="/">Contacts</Link>
          </span>
        </div>
        {/* Search Input */}
        <div className="w-48 max-w-full px-4 md:w-160">
          <div className="bg-gray-100 border rounded hover:border-blue-500 hover:bg-white">
            <input
              type="text"
              className="px-3 py-1 bg-transparent rounded focus:outline-none"
              placeholder="Search"
              value={searchfield}
              onChange={(e) => setSearchField(e.target.value)}
            />
          </div>
        </div>
        {/* Auth buttons */}
        <div className="flex">
          <button
            className="w-16 p-1 mr-4 leading-5 border rounded lg:w-32"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </nav>
      {contacts.length > 0 && (
        <div className="relative w-full px-4 mx-auto mt-12 bg-transparent md:w-160">
          <div className="absolute left-0 right-0 p-6 border rounded bg-gray-50">
            {error && <p className="font-medium text-red-600">{error}</p>}
            {contactsSearched?.map((item) => (
              <ContactComponent
                key={item.id}
                contactemail={item.contactemail}
                contactname={item.contactname}
                id={item.id}
              />
            ))}
            <Pagination
              length={totalResultCount}
              click={handlePagination}
              currentIndex={currentIndex}
            />
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar

const SEARCH_CONTACTS = gql`
  query searchContact($searchfield: String!) {
    searchContact(searchfield: $searchfield) {
      contacts {
        id
        createdAt
        username
        contactname
        contactemail
      }
      contactCount
    }
  }
`
