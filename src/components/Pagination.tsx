import classNames from 'classnames'

interface Props {
  length: number
  currentIndex: number
  click: (index: number) => void
}

const Pagination: React.FC<Props> = ({ length, click, currentIndex }) => {
  const indexes = length / 10

  const indexArray = []

  for (let i = 0; i < indexes; i++) {
    indexArray.push(i + 1)
  }

  return (
    <div className="flex flex-wrap justify-center my-6">
      {indexArray.map((index) => (
        <button
          key={index}
          className={classNames(
            'px-4 py-2 mr-2 text-center  border  rounded text-xs my-1',
            { 'bg-gray-300': index === currentIndex }
          )}
          onClick={() => click(index)}
          disabled={index === currentIndex}
        >
          {index}
        </button>
      ))}
    </div>
  )
}

export default Pagination
