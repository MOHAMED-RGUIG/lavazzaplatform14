import React from 'react'

function Error({error}) {
  return (
    <div>
        <div className="alert alert-danger" role="alert" style={{width:'650px',margin:'0 auto'}}>
            {error}
        </div>
    </div>
  )
}

export default Error