import React from 'react'
import {ClientContext, GraphQLClient} from 'graphql-hooks'
import Users from './components/users'
import GraphQl from './components/graphQl'
import UsersTable from './components/usersTable'
import './App.css'

const client = new GraphQLClient({
  url: 'https://countries.trevorblades.com',
})
function App() {
  return (
    <div className="App">
      <ClientContext.Provider value={client}>
        <GraphQl />
      </ClientContext.Provider>
      <Users />
      <UsersTable />
    </div>
  )
}

export default App
