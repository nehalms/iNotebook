import React, { useState, useEffect, useContext } from 'react';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { colors, Tooltip } from '@mui/material';
import { history } from '../History';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/auth_state/authContext';

export default function GameStats(props) {
  const [rows, setRows] = useState([]);
  history.navigate = useNavigate();
  const { userState, handleSessionExpiry } = useContext(AuthContext);

  useEffect(() => {
    if(!userState.loggedIn || !userState.isAdminUser ) {
      return;
    }
    fetchData();
  }, [userState]);

  const fetchData = async () => {
    try {
      if(!(userState.loggedIn) || !(userState.isAdminUser)) {
        return;
      }
      props.setLoader({ showLoader: true, msg: 'Loading...' });
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getData/gamestats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      props.setLoader({ showLoader: false });
      const data = await response.json();
      if(data.error) {
        props.showAlert(data.error, 'danger', 10122);
        handleSessionExpiry(data);
        return;
      }
      if (data.status === 'success') {
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
            };
            stats.push(Stat);
          })
        );
        setRows(stats);
      }
      data.stats.sort((ob1, ob2) => ob1.id - ob2.id);
    } catch (err) {
      props.setLoader({ showLoader: false });
      console.log('Error**', err);
      props.showAlert('Some error occurred', 'danger', 10009);
    }
  };

  function CustomToolbar() {
    return (
      <GridToolbarContainer style={styles.toolbar}>
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
      headerClassName: 'custom-header',
      flex: 1,
    },
    {
      field: 'name',
      headerName: 'User Name',
      minWidth: 190,
      headerAlign: 'center',
      headerClassName: 'custom-header',
      cellClassName: 'ps-5',
      flex: 1,
    },
    {
      field: 'ttt_played',
      headerName: 'Games Played',
      minWidth: 120,
      headerAlign: 'center',
      headerClassName: 'game-header ttt-header',
      cellClassName: 'text-center',
      flex: 1,
    },
    {
      field: 'ttt_won',
      headerName: 'Games Won',
      minWidth: 80,
      headerAlign: 'center',
      headerClassName: 'game-header ttt-header',
      cellClassName: 'text-center',
      flex: 1,
    },
    {
      field: 'ttt_lost',
      headerName: 'Games Lost',
      minWidth: 80,
      headerAlign: 'center',
      headerClassName: 'game-header ttt-header',
      cellClassName: 'text-center',
      flex: 1,
    },
    {
      field: 'con4_played',
      headerName: 'Games Played',
      minWidth: 120,
      headerAlign: 'center',
      headerClassName: 'game-header con4-header',
      cellClassName: 'text-center',
      flex: 1,
    },
    {
      field: 'con4_won',
      headerName: 'Games Won',
      minWidth: 80,
      headerAlign: 'center',
      headerClassName: 'game-header con4-header',
      cellClassName: 'text-center',
      flex: 1,
    },
    {
      field: 'con4_lost',
      headerName: 'Games Lost',
      minWidth: 80,
      headerAlign: 'center',
      headerClassName: 'game-header con4-header',
      cellClassName: 'text-center',
      flex: 1,
    },
    {
      field: 'delete',
      headerName: 'Delete',
      minWidth: 70,
      headerAlign: 'center',
      headerClassName: 'custom-header',
      cellClassName: 'text-center',
      renderCell: (params) => (
        <Tooltip title="Delete">
          <span>
            <i
              className="fa-solid fa-trash-can fa-lg"
              style={styles.deleteIcon}
              onClick={() => handleDelete(params.row)}
            ></i>
          </span>
        </Tooltip>
      ),
      flex: 1,
    },
  ];

  const columnGroupingModel = [
    {
      groupId: 'tttStats',
      headerName: 'Tic-Tac-Toe',
      headerAlign: 'center',
      children: [{ field: 'ttt_played' }, { field: 'ttt_won' }, { field: 'ttt_lost' }],
    },
    {
      groupId: 'connect4Stats',
      headerName: 'Connect Four',
      headerAlign: 'center',
      children: [{ field: 'con4_played' }, { field: 'con4_won' }, { field: 'con4_lost' }],
    },
  ];

  const handleDelete = async (row) => {
    props.setDialog(true, 'Delete Stats', () => onConfirm(row), onClose);
  };

  const onConfirm = async (row) => {
    props.setDialog(false, '', () => {}, () => {});
    if (!row.userId) return;

    try {
      props.setLoader({ showLoader: true, msg: 'Deleting...' });
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getData/delstats/${row.statsId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success === false) {
        props.showAlert(data.msg, 'info');
        return;
      }
      if (data) {
        props.showAlert('Stats deleted successfully', 'success', 10010);
        fetchData();
      }
    } catch (err) {
      console.log('Error**', err);
      props.showAlert('Some error occurred', 'danger', 10011);
    } finally {
      props.setLoader({ showLoader: false });
    }
  };

  const onClose = () => {
    props.setDialog(false, '', () => {}, () => {});
  };

  return (
    <>
      <DataGrid
        rows={rows}
        columns={columns}
        columnGroupingModel={columnGroupingModel}
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
        sx={styles.dataGrid}
      />
    </>
  );
}

const styles = {
  container: {
    height: 'auto',
    width: '100%',
    marginTop: '20px',
    padding: '10px',
    borderRadius: '15px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
    backgroundColor: '#f9f9f9',
  },
  toolbar: {
    backgroundColor: '#e3f2fd',
    padding: '10px',
    borderRadius: '5px',
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '10px',
  },
  deleteIcon: {
    color: '#ff4d4d',
    cursor: 'pointer',
  },
  dataGrid: {
    '& .MuiDataGrid-footerContainer': {
      backgroundColor: '#1976d2',
    },
    '& .MuiTablePagination-root': {
      color: 'white',
    },
    '& .MuiDataGrid-columnHeader--group': {
      fontSize: '1.1rem',
      fontWeight: 'bold',
      color: '#fff',
      backgroundColor: '#6c757d',
      borderRadius: '5px',
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
    '& .MuiDataGrid-columnHeader': {
      backgroundColor: '#1976d2',
      color: '#fff'
    },
    '& .MuiDataGrid-sortIcon': {
      color: '#fff'
    },
    '& .MuiDataGrid-menuIcon': {
      color: '#fff'
    }
  },
};
