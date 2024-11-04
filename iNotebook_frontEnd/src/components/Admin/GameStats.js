import React, { useState, useEffect } from 'react'
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { history } from '../History';
import { jwtDecode } from 'jwt-decode';

export default function GameStats(props) {

  const [rows, setRows] = useState([]);

  useEffect(() => {
    if(sessionStorage.getItem('adminToken') && jwtDecode(sessionStorage.getItem('adminToken')).exp < Date.now() / 1000) {
      props.showAlert("Session expired Login again", 'danger');
      history.navigate("/login");
      return;
    }
    if(sessionStorage.getItem('adminToken'))
      fetchData();
  }, [])

  const fetchData = async () => {
    try {
      props.setLoader({ showLoader: true, msg: "Loading..."});
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getData/gamestats`, {
        method: "GET", 
        headers: {
            "Content-Type": "application/json",
            "auth-token": sessionStorage.getItem('adminToken')
        }
      });
      props.setLoader({ showLoader: false });
      const data = await response.json();
      if(data.status === 'success') {
        let stats = [];
        await Promise.all(
          data.stats.map((stat) => {
            let Stat = {
              ...stat,
              played: stat.tttStats.played,
              won: stat.tttStats.won,
              lost: stat.tttStats.lost,
            }
            stats.push(Stat);
          })
        );
        setRows(stats);
        console.log(rows);
      }
      data.stats.sort((ob1, ob2) => {return ob1.id-ob2.id});
    } catch (err) {
      props.setLoader({ showLoader: false });
      console.log('Error**', err);
      props.showAlert("Some Error occured", 'danger');
    }
  }

  function CustomToolbar() {
    return (
      <GridToolbarContainer className='ps-4 bg-light d-flex align-items-center justify-content-end'>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

  const columns = [
    { 
      field: 'id', 
      headerName: 'SL.No', 
      minWidth: 70,
      headerAlign: 'center',
      cellClassName: 'text-center',
      headerClassName: 'bg-success bg-gradient text-light',
      flex: 1,
    },
    {
      field: 'name',
      headerName: 'User Name',
      minWidth: 190,
      headerAlign: 'center',
      headerClassName: 'bg-success bg-gradient text-light',
      cellClassName: 'ps-5',
      flex: 1,
    },
    {
      field: 'played',
      headerName: 'Games played',
      minWidth: 280,
      headerAlign: 'center',
      headerClassName: 'bg-success bg-gradient text-light',
      cellClassName: 'text-center',
      flex: 1,
    },
    {
      field: 'won',
      headerName: 'Games won',
      minWidth: 250,
      headerAlign: 'center',
      headerClassName: 'bg-success bg-gradient text-light',
      cellClassName: 'text-center',
      flex: 1,
    },
    {
      field: 'lost',
      headerName: 'Games lost',
      minWidth: 100,
      headerAlign: 'center',
      headerClassName: 'bg-success bg-gradient text-light',
      cellClassName: 'text-center',
      flex: 1,
    }
  ]

  return (
    <div style={{ height: 'auto', width: '100%' }}>
      <DataGrid
        disableColumnResize
        disableColumnMenu
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[5, 10, 25, 50]}
        disableRowSelectionOnClick
        slots={{
            toolbar: CustomToolbar,
        }}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? 'bg-body-tertiary' : 'bg-body-secondary'
        }
        sx={{
          '& .MuiDataGrid-footerContainer': {
            backgroundColor: '#198754',
          },
          '& .MuiTablePagination-root': {
            color: 'white',
          },
          '& .MuiTablePagination-selectLabel': {
            fontSize: '1rem',
            margin: '0px',
            color: 'white'
          },
          '& .MuiTablePagination-displayedRows': {
            fontWeight: 'bold',
            margin: '0px',
            color: 'white'
          },
          '& .MuiTablePagination-selectIcon': {
            color: 'white',
          },
        }}
      />
    </div>
  )
}