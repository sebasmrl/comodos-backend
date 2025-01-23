
interface City{
  name:string,
}

interface State{
  name:string,
  cities: City[]
}

interface Country{
  name:string,
  states: State[]
}

interface LocationData{
  countries: Country[]
}

export { City, State, Country, LocationData}