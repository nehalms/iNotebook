import React, { useEffect, useState } from 'react';
import moment from 'moment';
import './UserHistorytable.css';

export default function UserHistoryTable(props) {
  const [data, setData] = useState([]);
  const [visibleRows, setVisibleRows] = useState(10);

  useEffect(() => {
    setData(props.data || []);
  }, [props.data]);

  const handleLoadMore = () => {
    setVisibleRows((prevVisibleRows) => prevVisibleRows + 10);
  };

  return (
    <div className="table-container">
      <table className="styled-table">
        <thead>
          <tr>
            <th scope="col">Sl. No</th>
            <th scope="col">Action</th>
            <th scope="col">Date</th>
            <th scope="col">Time</th>
          </tr>
        </thead>
        <tbody>
          {data.slice(0, visibleRows).map((row, idx) => (
            <tr key={idx}>
              <th scope="row" className='text-black'>{data.length - idx}</th>
              <td>{row.action}</td>
              <td>{moment(new Date(row.date)).format('DD-MM-YYYY')}</td>
              <td>{moment(new Date(row.date)).format('h:mm a')}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {visibleRows < data.length && (
        <div className="load-more-container">
          <button className="load-more-btn" onClick={handleLoadMore}>
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
