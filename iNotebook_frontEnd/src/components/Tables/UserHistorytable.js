import React, { useEffect, useState } from 'react'
import moment from 'moment'

export default function UserHistorytable(props) {

  const [data, setData] = useState();

  useEffect(()=> {
    setData(props.data);
  }, [])

  return (
    <div>
      <table class="table table-striped">
        <thead>
          <tr className='table-primary'>
            <th scope="col">Sl. No</th>
            <th scope="col">Action</th>
            <th scope="col">Date</th>
            <th scope="col">Time</th>
          </tr>
        </thead>
        <tbody>
          { data && 
            data.map((row, idx) => {
              return (<tr>
                <th scope="row">{idx + 1}</th>
                <td>{row.action}</td>
                <td>{moment(new Date(row.date)).format('DD-MM-YYYY')}</td>
                <td>{moment(new Date(row.date)).format('h:mm a')}</td>
              </tr>)
            })
          }
        </tbody>
      </table>
    </div>
  )
}
