import React from 'react'
import type {StatusType, UserPage} from '../../types/apiTypes'
import client from '../utils/client'

type UserTableState = {
  pageData?: UserPage
  page: number
  previousVisitedPage: number
  nextVisitedPage: number
  status: StatusType
  error?: Error
}

type ActionType =
  | {type: 'visited_next_page'}
  | {type: 'visited_previous_page'}
  | {type: 'next_page'; payload: {page: number}}
  | {type: 'previous_page'; payload: {page: number}}
  | {type: 'specific_page'; payload: {page: number}}
  | {type: 'first_page'; payload: {page: number}}
  | {type: 'last_page'; payload: {page: number}}
  | {
      type: 'promise'
      payload: {status: StatusType; pageData?: UserPage; error?: Error}
    }

const initialState: UserTableState = {
  pageData: undefined,
  page: 0,
  status: 'idle',
  error: undefined,
  previousVisitedPage: -1,
  nextVisitedPage: -1,
}
const reducer = (state: UserTableState = initialState, action: ActionType) => {
  const {nextVisitedPage, page, previousVisitedPage} = state
  switch (action.type) {
    case 'visited_next_page':
      return {...state, page: nextVisitedPage}
    case 'visited_previous_page':
      return {
        ...state,
        nextVisitedPage: page,
        page: previousVisitedPage,
      }
    case 'next_page':
      return {
        ...state,
        previousVisitedPage: page,
        ...action.payload,
      }
    case 'previous_page':
      return {
        ...state,
        previousVisitedPage: page,
        ...action.payload,
      }
    case 'specific_page':
      return {
        ...state,
        previousVisitedPage: page,
        ...action.payload,
      }
    case 'first_page':
      return {
        ...state,
        previousVisitedPage: page,
        ...action.payload,
      }
    case 'last_page':
      return {
        ...state,
        previousVisitedPage: page,
        ...action.payload,
      }
    case 'promise':
      return {
        ...state,
        ...action.payload,
      }

    default:
      return state
  }
}
const cellStyle: React.CSSProperties = {
  display: 'table-cell',
  borderCollapse: 'collapse',
  border: `1px solid black`,
  textTransform: 'capitalize',
  padding: '5px',
}
const flexRowCentered: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '20px',
  justifyContent: 'center',
  alignItems: 'center',
}

function UsersTable() {
  const [
    {page, status, nextVisitedPage, previousVisitedPage, pageData, error},
    dispatch,
  ] = React.useReducer(reducer, initialState)
  const [numberInput, setNumberInput] = React.useState(0)

  const fetcher = React.useCallback(async (page: number) => {
    const response = await client<UserPage>(`/user?page=${page}&limit=5`)
    const {data: resData, error: resError, status: resStatus} = response

    dispatch({
      type: 'promise',
      payload: {
        pageData: resData,
        error: resError,
        status: resStatus,
      },
    })
  }, [])

  React.useEffect(() => {
    fetcher(0)
  }, [fetcher])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '25px',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '98vh',
      }}
    >
      <div style={flexRowCentered}>
        <span>Status: {status}</span>
        <span>error: {error}</span>
        <span>nextVisitedPage: {nextVisitedPage}</span>
        <span>previousVisitedPage: {previousVisitedPage}</span>
        <span>page: {page}</span>
      </div>
      <div
        style={{
          display: 'table',
          borderCollapse: 'collapse',
          tableLayout: 'auto',
          width: '50vw',
          padding: '10px',
        }}
      >
        <div
          style={{
            display: 'table-header-group',
            borderCollapse: 'collapse',
          }}
        >
          <span style={cellStyle}>id</span>
          <span style={cellStyle}>title</span>
          <span style={cellStyle}>firstName</span>
          <span style={cellStyle}>lastName</span>
          <span style={cellStyle}>email</span>
          <span style={cellStyle}>picture</span>
        </div>
        {pageData?.data.map(
          ({id, title, firstName, lastName, email, picture}) => {
            return (
              <div
                key={id}
                style={{
                  display: 'table-row-group',
                  borderCollapse: 'collapse',
                  border: `1px solid black`,
                }}
              >
                <span style={cellStyle}>{id}</span>
                <span style={cellStyle}>{title}</span>
                <span style={cellStyle}>{firstName}</span>
                <span style={cellStyle}>{lastName}</span>
                <span style={cellStyle}>{email}</span>
                <span
                  style={cellStyle}
                  aria-label={
                    picture ? 'has a picture' : "doesn't have a picture"
                  }
                >
                  {picture ? '✔' : '❌'}
                </span>
              </div>
            )
          },
        )}
      </div>
      <div style={{...flexRowCentered, fontSize: '1.4rem'}}>
        <button
          type="button"
          disabled={page === 0}
          aria-label="first page"
          onClick={() => {
            fetcher(0)
            setNumberInput(0)
            dispatch({type: 'first_page', payload: {page: 0}})
          }}
        >
          ⏮
        </button>
        <button
          type="button"
          disabled={page === 0}
          aria-label="the page before"
          onClick={() => {
            fetcher(page - 1)
            setNumberInput(page - 1)
            dispatch({type: 'previous_page', payload: {page: page - 1}})
          }}
        >
          ⏪
        </button>
        <button
          type="button"
          disabled={previousVisitedPage === -1}
          aria-label="Previous page"
          onClick={() => {
            fetcher(previousVisitedPage)
            setNumberInput(previousVisitedPage)
            dispatch({type: 'visited_previous_page'})
          }}
        >
          Prev
        </button>
        <form
          onSubmit={e => {
            e.preventDefault()
            console.log(e.currentTarget['page-number'].value)
            fetcher(e.currentTarget['page-number'].value)
            dispatch({
              type: 'specific_page',
              payload: {page: e.currentTarget['page-number'].valueAsNumber},
            })
          }}
        >
          <input
            aria-label="page-number"
            name="page-number"
            type="number"
            defaultValue={0}
            value={numberInput}
            onChange={e => {
              setNumberInput(e.target.valueAsNumber)
            }}
            min="0"
            max={999}
          />
        </form>
        <button
          type="button"
          disabled={nextVisitedPage === -1}
          aria-label="next page"
          onClick={() => {
            fetcher(nextVisitedPage)
            setNumberInput(nextVisitedPage)
            dispatch({type: 'visited_next_page'})
          }}
        >
          Next
        </button>
        <button
          type="button"
          disabled={page === 999}
          aria-label="the page after"
          onClick={() => {
            fetcher(page + 1)
            setNumberInput(page + 1)
            dispatch({type: 'next_page', payload: {page: page + 1}})
          }}
        >
          ⏩
        </button>
        <button
          type="button"
          aria-label="last page"
          disabled={page === 999}
          onClick={() => {
            fetcher(999)
            setNumberInput(999)
            dispatch({
              type: 'last_page',
              payload: {page: 999},
            })
          }}
        >
          ⏭
        </button>
      </div>
    </div>
  )
}

export default UsersTable
