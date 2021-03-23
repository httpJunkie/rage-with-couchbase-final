import { gql } from '@apollo/client';

export const airlineGql = gql`
  {
    airlinesUK {
      callsign
      country
      iata
      icao
      id
      name
    }
  }
`