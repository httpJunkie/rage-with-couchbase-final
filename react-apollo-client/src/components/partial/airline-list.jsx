import React from 'react'
import { Link } from "react-router-dom"
import Pagination from '../utility/pagination'

const AirlineList = ({airlines}) => {
  const [airlinesShowing, setAirlinesShowing] = React.useState(airlines.slice(0, 10))

  const onPageChanged = ({ currentPage, totalPages, pageLimit }) => {
    const offset = (currentPage - 1) * pageLimit
    const currentSlice = airlines.slice(offset, offset + pageLimit)
    setAirlinesShowing(currentSlice)
  }

  const listItems = 
    airlinesShowing.map(({ name, id }) => (
      <li key={`${name}-${id}`}>
        <Link className='menu' to={`/airlines/${id}`}>{name}</Link>
      </li>
    )
  )

  return (
    <>
      <ul className={`airline-list`}>
        {listItems}
      </ul>

      <Pagination totalRecords={airlines.length} pageLimit={10} pageSiblings={1} onPageChanged={onPageChanged} />
    </>
  )
}

export default AirlineList
