import React from 'react'
import {useManualQuery} from 'graphql-hooks'

const LOCALSTORAGE_KEY = 'countries'

const Query = `
{
    countries {
        code
        name
        emoji
        native
        phone
        currency
        capital
        continent {
          name
        }
      }
    }
   `

type Countries = Array<{
  code: string
  name: string
  emoji: string
  native: string
  phone: string
  capital: string
  continent: {
    name: string
  }
  currency: string
}>

type StateType = {
  displayData?: Countries
  countries?: Countries
  range: number
  index: number
  min: number
  max: number
}

type ActionType =
  | {
      type: 'load_next_items'
      // payload: {index: number}
    }
  | {
      type: 'load_prev_items'
      // payload: {index: number}
    }
  | {
      type: 'set_display_data'
      payload: {countries: Countries}
    }

const initialState: StateType = {
  displayData: undefined,
  countries: undefined,
  range: 60,
  index: 0,
  min: 0,
  max: 0,
}

function modifyDisplayData(
  arr: Countries,
  options: {
    start?: number
    end?: number
    operator: 'add' | 'sub'
  },
): {displayData: Countries; min: number; max: number} {
  const start = options?.start ?? 0
  const end = options?.end ?? 60

  return {
    displayData: arr.filter((item: any, i: number) => start < i && i < end),
    min: start,
    max: end,
  }
}

const graphQlReducer = (state = initialState, action: ActionType) => {
  switch (action.type) {
    case 'load_next_items': {
      if (!state?.countries) return state
      const newMax = state.min + 15 + state.range + 1
      if (state.max + 1 === state.countries.length) return {...state}
      const {displayData, max, min} = modifyDisplayData(state.countries, {
        operator: 'add',
        start:
          newMax < state.countries.length
            ? newMax - state.range
            : state.countries.length - state.range - 1,
        end:
          newMax < state.countries.length ? newMax : state.countries.length - 1,
      })
      return {
        ...state,
        displayData: [...displayData],
        min,
        max,
      }
    }
    case 'load_prev_items': {
      if (!state?.countries) return state
      const newMin = state.min - 15
      if (state.min === 0) return {...state}

      const {displayData, max, min} = modifyDisplayData(state.countries, {
        operator: 'sub',
        start: newMin <= 0 ? 0 : newMin,
        end: newMin <= 0 ? state.range + 1 : newMin + state.range,
      })
      return {
        ...state,
        displayData: [...displayData],
        min,
        max,
      }
    }

    default:
      return state
  }
}

function GraphQl() {
  const [countries, setCountries] = React.useState<Countries | undefined>(
    () => {
      const data = window.localStorage.getItem(LOCALSTORAGE_KEY)
      if (!data) return undefined
      return JSON.parse(data)
    },
  )
  const scrollYRef = React.useRef(0)
  const [fetchCountries, {loading, error, data}] = useManualQuery<{
    countries: Countries
  }>(Query)
  const [state, dispatch] = React.useReducer(
    graphQlReducer,
    initialState,
    () => {
      const data = window.localStorage.getItem(LOCALSTORAGE_KEY)
      if (!data) return initialState

      return {
        ...initialState,
        countries: JSON.parse(data),
        displayData: JSON.parse(data)?.filter(
          (item: any, i: number) => i < initialState.range,
        ),
        max: initialState.range,
      }
    },
  )
  const isDispatching = React.useRef(false)

  const safeDispatch = React.useCallback((arg: ActionType) => {
    isDispatching.current = true
    dispatch(arg)
    isDispatching.current = false
  }, [])

  React.useEffect(() => {
    if (data) {
      window.localStorage.setItem(
        LOCALSTORAGE_KEY,
        JSON.stringify(data.countries),
      )
      setCountries([...data.countries])
      dispatch({
        type: 'set_display_data',
        payload: {countries: data.countries},
      })
    }
  }, [data])

  React.useEffect(() => {
    if (window.localStorage.getItem(LOCALSTORAGE_KEY)) return
    fetchCountries()
  }, [fetchCountries])

  return (
    <div>
      <span>asdasdasddd</span>
      <span>{loading && 'loading...'}</span>
      <div style={{}}>
        <div
          onScroll={e => {
            e.preventDefault()
            e.nativeEvent.stopImmediatePropagation()
            if (isDispatching.current) return
            const scrollBottomPart =
              (e.currentTarget.scrollHeight - e.currentTarget.offsetHeight) *
              0.84
            const scrollTopPart =
              (e.currentTarget.scrollHeight - e.currentTarget.offsetHeight) *
              0.16
            const scrollTop = e.currentTarget.scrollTop
            if (
              scrollTop <= scrollTopPart &&
              scrollYRef.current > e.currentTarget.scrollTop &&
              state.min !== 0
            ) {
              safeDispatch({type: 'load_prev_items'})
            } else if (
              e.currentTarget.scrollTop >= scrollBottomPart &&
              scrollYRef.current < e.currentTarget.scrollTop &&
              state.max + 1 !== state.countries?.length
            ) {
              safeDispatch({type: 'load_next_items'})
            }
            scrollYRef.current = e.currentTarget.scrollTop
          }}
          style={{
            height: '300px',
            width: '300px',
            overflowY: 'scroll',
            overflowX: 'hidden',
          }}
        >
          {state.displayData?.map((item, i) => {
            return (
              <React.Fragment key={item.name}>
                <span>{item.name}</span>
                <br />
              </React.Fragment>
            )
          })}
          {/* {state.countries?.map((item, i) => {
            if (state.min <= i && i >= state.max)
              return (
                <React.Fragment key={item.name}>
                  <span>{item.name}</span>
                  <br />
                </React.Fragment>
              )
            return <span key={item.name}>loading</span>
          })} */}
        </div>
      </div>
      <p>{JSON.stringify(countries)}</p>
      <p>{JSON.stringify(error)}</p>
    </div>
  )
}

export default GraphQl
