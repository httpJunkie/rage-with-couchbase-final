require('dotenv').config()
const { cbUser, cbPass } = process.env
const express = require('express')
const cors = require('cors')
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')
  
const couchbase = require('couchbase')
  
const app = express()
app.use(cors())
const cluster = new couchbase.Cluster('couchbase://localhost', { 
  username: cbUser, password: cbPass 
})
const bucket = cluster.bucket('travel-sample')
var collection = bucket.defaultCollection();

const schema = buildSchema(`
  type Airline {
    id: Int,
    callsign: String,
    country: String,
    iata: String,
    icao: String,
    name: String,
    type: String
  }
  input AirlineInput {
    callsign: String,
    country: String,
    iata: String,
    icao: String,
    name: String,
    type: String
  }
  type Query {
    airlinesUK: [Airline],
    airlineByKey(id: Int!): Airline
    airlinesByRegion(region: String!): [Airline]
  }
  type Mutation {
    updateAirline(id: Int!, input: AirlineInput): Airline
  }
`)

// Define N1QL Queries
const airlinesUkQuery = `
  SELECT airline.* 
  FROM \`travel-sample\` AS airline 
  WHERE airline.type = 'airline'
  AND airline.country = 'United Kingdom'
`
const airlinesByRegionQuery = `
  SELECT airline.* 
  FROM \`travel-sample\` AS airline 
  WHERE airline.type = 'airline'
    AND airline.country = $REGION
`

// Define Resolvers
const root = {
  airlinesUK: async () => {
    const result = await cluster.query(airlinesUkQuery)
    return result.rows
  },
  /*
    query getAirlinesUK {
      airlinesUK {
        id
        name
        callsign
        country
        iata
        icao
      }
    }
  */
  airlinesByRegion: async ({region}) => {
    const options = { parameters: { REGION: region } }
    const result = await cluster.query(airlinesByRegionQuery, options)
    return result.rows
  },
  /*
    query getAirlinesByRegion($region: String!) {
      airlinesByRegion(region:$region) {
        id
        name
        callsign
        country
        iata
        icao
      }
    }
    {
      "region": "{{country}}"
    }
  */
  airlineByKey: async ({id}) => {
    const result = await collection.get(`airline_${id}`)
    return result.value
  },
  /*
    query getAirlineByKey($id: Int!) {
      airlineByKey(id:$id) {
        id
        name
        callsign
        country
        iata
        icao
      }
    }
    {
      "id": {{id}}
    }
  */
  updateAirline: async ({id, input}) => {
    const result = await collection.get(`airline_${id}`)

    const newDocument = {
      ...result.content, 
      callsign: input.callsign ? input.callsign : result.value.callsign,
      country: input.country ? input.country : result.value.country,
      iata: input.iata ? input.iata : result.value.iata,
      icao: input.icao ? input.icao : result.value.icao,
      name: input.name ? input.name : result.value.name,
    };

    console.log(newDocument)

    await collection.upsert(`airline_${id}`, newDocument)
    return newDocument
  }
  /*
    mutation updateExistingAirline($id:Int!, $input:AirlineInput) {
      updateAirline(id:$id, input:$input){
        callsign
        country
        iata
      }
    }
    {
      "id": 112,
      "input": {
        "callsign": "FLYSTAR",
        "country": "United Kingdom"
      }
    }
  */
}

// the graphqlHTTP function accepts a schema, rootValue and graphiql 
// among other options for configuring our GraphQL Server
const serverPort = 4000
const serverUrl = '/graphql'
app.use(serverUrl, graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}))

app.listen(
  serverPort, 
  () => console.log(`GraphQL server running: http://localhost:${serverPort}${serverUrl}`)
)
