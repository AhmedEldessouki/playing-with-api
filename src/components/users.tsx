import React from 'react'
import type {AppResponse, UserPage} from '../../types/apiTypes'
import client from '../utils/client'
import './user.css'

function Users() {
  const [state, setState] = React.useState<AppResponse<UserPage>>({
    status: 'idle',
    data: undefined,
    error: undefined,
  })

  const fetcher = React.useCallback(async () => {
    const response = await client<UserPage>('/user?limit=7')
    setState({...response})
  }, [])

  React.useEffect(() => {
    if (state.status === 'resolved') return
    fetcher()
  }, [fetcher, state.status])

  return (
    <section
      style={{
        background: '#000',
        color: 'white',
      }}
    >
      <span>Cards</span>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '2px',
            padding: '10px',
            margin: '10px',
            justifyContent: 'flex-start',
            alignItems: 'center',
            overflowX: 'scroll',
          }}
        >
          {state.status === 'pending'
            ? 'loading'
            : state?.data?.data.map((item, i) => {
                return (
                  <article key={item.id} className="card">
                    <div className="center author-avatar ">
                      <img width={100} height={100} src={item.picture} alt="" />
                      <svg className="half-circle" viewBox="0 0 106 57">
                        <path d="M102 4c0 27.1-21.9 49-49 49S4 31.1 4 4" />
                      </svg>
                    </div>
                    <span style={{textTransform: 'capitalize'}}>
                      {item.title}.{item.firstName} {item.lastName}
                    </span>
                    <span>{item.email}</span>
                  </article>
                )
              })}
        </div>
      </div>
    </section>
  )
}

export default Users
