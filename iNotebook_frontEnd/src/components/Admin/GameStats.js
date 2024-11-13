import React, { useState, useEffect } from 'react'
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { Tooltip } from '@mui/material';
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
              ttt_played: stat.tttStats.played,
              ttt_won: stat.tttStats.won,
              ttt_lost: stat.tttStats.lost,
              con4_played: stat.con4Stats.played,
              con4_won: stat.con4Stats.won,
              con4_lost: stat.con4Stats.lost,
            }
            stats.push(Stat);
          })
        );
        setRows(stats);
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
      field: 'ttt_played',
      headerName: 'Games played',
      minWidth: 120,
      headerAlign: 'center',
      headerClassName: 'bg-danger bg-gradient text-light',
      cellClassName: 'text-center',
      flex: 1,
    },
    {
      field: 'ttt_won',
      headerName: 'Games won',
      minWidth: 80,
      headerAlign: 'center',
      headerClassName: 'bg-danger bg-gradient text-light',
      cellClassName: 'text-center',
      flex: 1,
    },
    {
      field: 'ttt_lost',
      headerName: 'Games lost',
      minWidth: 80,
      headerAlign: 'center',
      headerClassName: 'bg-danger bg-gradient text-light',
      cellClassName: 'text-center',
      flex: 1,
    },{
      field: 'con4_played',
      headerName: 'Games played',
      minWidth: 120,
      headerAlign: 'center',
      headerClassName: 'bg-info bg-gradient',
      cellClassName: 'text-center',
      flex: 1,
    },
    {
      field: 'con4_won',
      headerName: 'Games won',
      minWidth: 80,
      headerAlign: 'center',
      headerClassName: 'bg-info bg-gradient',
      cellClassName: 'text-center',
      flex: 1,
    },
    {
      field: 'con4_lost',
      headerName: 'Games lost',
      minWidth: 80,
      headerAlign: 'center',
      headerClassName: 'bg-info bg-gradient',
      cellClassName: 'text-center',
      flex: 1,
    },
    {
      field: 'delete',
      headerName: 'Delete',
      minWidth: 70,
      headerAlign: 'center',
      headerClassName: 'bg-success bg-gradient text-light',
      cellClassName: 'text-center',
      renderCell: (params) => {
        return (
          <Tooltip title={'delete'}> 
            <span><i className="fa-solid fa-trash-can mx-2 fa-lg" style={{color: '#ff0000'}} onClick={() => {handleDelete(params.row)}}></i></span>
          </Tooltip>
        )
      },
      flex: 1,
    }
  ]

  const columnGroupingModel = [
    {
      groupId: 'tttStats',
      headerName: 'Tic - Tac - Toe',
      headerAlign: 'center',
      headerClassName: 'bg-danger bg-gradient text-light',
      children: [{ field: 'ttt_played' }, { field: 'ttt_won' }, { field: 'ttt_lost' }],
    },
    {
      groupId: 'connect4Stats',
      headerName: 'Four in a row (Connect 4)',
      headerAlign: 'center',
      headerClassName: 'bg-info bg-gradient',
      children: [{ field: 'con4_played' }, { field: 'con4_won' }, { field: 'con4_lost' }],
    },
  ];

  const onConfirm = async (row) => {
    props.setDialog(false, '', () => {}, () => {});
    if(!row.userId) {
      return;
    }
    try {
      props.setLoader({ showLoader: true, msg: "Deleting..."});
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getData/delstats/${row.statsId}`, {
          method: "GET", 
          headers: {
            "Content-Type": "application/json",
            "auth-token": sessionStorage.getItem('adminToken')
          }
      });
      const data = await response.json();
      if(data.success === false) {
        props.showAlert(data.msg, 'info');
        return;
      }
      if(data) {
        props.showAlert('User deleted successfully', 'success');
        fetchData();
      }
    } catch (err) {
      console.log('Error**', err);
      props.showAlert("Some Error occured", 'danger');
    } finally {
      props.setLoader({ showLoader: false });
    }
  }
  
  const onClose = () => {
    props.setDialog(false, '', () => {}, () => {});
    return;
  }
  
  const handleDelete = async (row) => {
    props.setDialog(true, 'Delete Stats', () => {onConfirm(row);}, onClose);
  }

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
        columnGroupingModel={columnGroupingModel}
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
