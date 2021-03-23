import React from "react"
import PropTypes from 'prop-types'

const AirlineDetails = ({airline}) => {
  return (airline
    ? (<>
        <div className="airline-details">{airline.name}</div>
        <p>
          <strong>Call sign:</strong> {airline.callsign ? airline.callsign : 'N/A'} <br />
          <strong>IATA number:</strong> {airline.iata ? airline.iata : 'N/A'} <br />
          <strong>ICAO code:</strong> {airline.icao}
        </p>
      </>)
    : (<>
        <div className="airline-details">Select an airline</div>
      </>)
  )
}

export default AirlineDetails

AirlineDetails.propTypes = {
  airlineData: PropTypes.object
};
