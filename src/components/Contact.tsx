interface ContactProps {
  contactname: string
  contactemail: string
  id: string
  editContact?: (contactname: string, contactemail: string, id: string) => void
  deleteContact?: (contactId: string) => void
}

const Contact: React.FC<ContactProps> = ({
  contactname,
  contactemail,
  id,
  deleteContact,
  editContact,
}) => {
  return (
    <div className="flex items-center justify-between w-full px-4 py-2 border rounded hover:bg-gray-200">
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 py-2 text-center text-white bg-blue-500 border rounded-full">
          {contactname.split('')[0].toLocaleUpperCase()}
        </div>
        <p className="ml-4 text-gray-700 capitalize">{contactname}</p>
      </div>
      <p className="text-gray-700">{contactemail}</p>
      <div className="flex">
        {editContact && deleteContact && (
          <>
            <button
              className="w-5 h-5 mx-2"
              onClick={() => editContact(contactname, contactemail, id)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="text-gray-500 fill-current"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            <button className="w-5 h-5 mx-2" onClick={() => deleteContact(id)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="text-gray-500 fill-current"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default Contact
