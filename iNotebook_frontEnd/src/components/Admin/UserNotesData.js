import React, { useContext, useEffect, useState } from 'react';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { Tooltip } from '@mui/material';
import moment from 'moment';
import { history } from '../History';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/auth_state/authContext';

export default function UserNotesData(props) {
  history.navigate = useNavigate();
  const { userState, handleSessionExpiry } = useContext(AuthContext);
  const [rows, setRows] = useState([]);
  const [totalcount, setTotalCount] = useState({ 
    usersCount: 0, 
    notesCount: 0, 
    tasksCount: 0,
    userHistoryCount: 0,
    loginHistoryCount: 0,
  });

  useEffect(() => {
    if(!userState.loggedIn || !userState.isAdminUser ) {
      return;
    }
    fetchData();
  }, [userState]);

  function CustomToolbar() {
    return (
      <GridToolbarContainer style={styles.toolbar}>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

  const fetchData = async () => {
    try {
      props.setLoader({ showLoader: true, msg: 'Loading...' });
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getData/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      props.setLoader({ showLoader: false });
      const data = await response.json();
      if (data.error) {
        props.showAlert(data.error, 'danger', 10038);
        handleSessionExpiry(data);
        return;
      }
      setRows(data.users);
      data.users.sort((ob1, ob2) => ob1.id - ob2.id);
      setTotalCount({
        usersCount: data.usersCount,
        notesCount: data.notesCount,
        tasksCount: data.tasksCount,
        loginHistoryCount: data.loginHistoryCount,
        userHistoryCount: data.userHistoryCount,
      });
    } catch (err) {
      props.setLoader({ showLoader: false });
      console.log('Error**', err);
      props.showAlert('Some error occurred', 'danger', 10013);
    }
  };

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
      field: 'email',
      headerName: 'Email',
      minWidth: 270,
      headerAlign: 'center',
      headerClassName: 'custom-header',
      cellClassName: 'ps-5',
      valueGetter: (params) => params.split('__')[0],
      flex: 1,
    },
    {
      field: 'date',
      headerName: 'Created On',
      minWidth: 210,
      headerAlign: 'center',
      headerClassName: 'custom-header',
      cellClassName: 'text-center',
      valueGetter: (params) => moment(new Date(params)).format('lll'),
      sortComparator: (v1, v2) => moment(v1).diff(moment(v2)),
      flex: 1,
    },
    {
      field: 'notesCount',
      headerName: 'Notes Count',
      minWidth: 100,
      headerAlign: 'center',
      headerClassName: 'custom-header',
      cellClassName: 'text-center',
      flex: 1,
    },
    {
      field: 'tasksCount',
      headerName: 'Tasks Count',
      minWidth: 100,
      headerAlign: 'center',
      headerClassName: 'custom-header',
      cellClassName: 'text-center',
      flex: 1,
    },
    {
      field: 'isActive',
      headerName: 'Account Status',
      minWidth: 140,
      headerAlign: 'center',
      headerClassName: 'custom-header',
      cellClassName: 'text-center',
      renderCell: (params) => (
        <Tooltip title={params.row.isActive ? 'Active' : 'Inactive'}>
          <span>
            <i
              className="fa-solid fa-circle"
              style={{ color: params.row.isActive ? '#63E6BE' : '#fe3434' }}
            ></i>
          </span>
        </Tooltip>
      ),
      flex: 1,
    },
    {
      field: 'lastLoggedOn',
      headerName: 'Last Login',
      minWidth: 210,
      headerAlign: 'center',
      headerClassName: 'custom-header',
      cellClassName: 'text-center',
      valueGetter: (params) => moment(new Date(params)).format('lll'),
      sortComparator: (v1, v2) => moment(v1).diff(moment(v2)),
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
              className="fa-solid fa-trash-can mx-2 fa-lg"
              style={{ color: '#ff0000' }}
              onClick={() => handleDelete(params.row)}
            ></i>
          </span>
        </Tooltip>
      ),
      flex: 1,
    },
  ];

  const handleDelete = async (row) => {
    props.setDialog(true, 'Delete User', () => onConfirm(row), onClose);
  };

  const onConfirm = async (row) => {
    props.setDialog(false, '', () => {}, () => {});
    if (!row.userId) return;
    try {
      props.setLoader({ showLoader: true, msg: 'Deleting...' });
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getData/deluser/${row.userId}`, {
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
        props.showAlert('User deleted successfully', 'success', 10014);
        fetchData();
      }
    } catch (err) {
      console.log('Error**', err);
      props.showAlert('Some error occurred', 'danger', 10015);
    } finally {
      props.setLoader({ showLoader: false });
    }
  };

  const onClose = () => {
    props.setDialog(false, '', () => {}, () => {});
  };

  return (
    <>
      <div className="row align-items-center justify-content-center">
        <div className="col-md-3">
          <div className="card shadow-lg my-3 py-2" style={{ backgroundColor: '#facb89' }}>
            <div className="card-body">
              <h5 className="card-title my-0 text-center">Total Users: {totalcount.usersCount}</h5>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-lg my-3 py-2" style={{ backgroundColor: '#89e0fa' }}>
            <div className="card-body">
              <h5 className="card-title my-0 text-center">No. of Notes: {totalcount.notesCount}</h5>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-lg my-3 py-2" style={{ backgroundColor: '#89faba' }}>
            <div className="card-body">
              <h5 className="card-title my-0 text-center">No. of Taks: {totalcount.tasksCount}</h5>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-lg my-3 py-2" style={{ backgroundColor: '#fa8989' }}>
            <div className="card-body">
              <h5 className="card-title my-0 text-center">Users History: {totalcount.userHistoryCount}</h5>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-lg my-3 py-2" style={{ backgroundColor: '#c789fa' }}>
            <div className="card-body">
              <h5 className="card-title my-0 text-center">Login History: {totalcount.loginHistoryCount}</h5>
            </div>
          </div>
        </div>
      </div>
      <div style={{ height: 'auto', width: '100%' }}>
        <DataGrid
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
              backgroundColor: '#19d26f',
            },
            '& .MuiTablePagination-root': {
              color: 'black',
            },
            '& .MuiTablePagination-selectLabel': {
              fontSize: '1rem',
              margin: '0px',
              color: 'black',
            },
            '& .MuiTablePagination-displayedRows': {
              fontWeight: 'bold',
              margin: '0px',
              color: 'black',
            },
            '& .MuiTablePagination-selectIcon': {
              color: 'black',
            },
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: '#19d26f',
              color: 'black'
            },
            '& .MuiDataGrid-sortIcon': {
              color: 'black'
            }
          }}
        />
      </div>
    </>
  );
}

const styles = {
  toolbar: {
    backgroundColor: '#e3f2fd',
    padding: '10px',
    borderRadius: '5px',
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '10px',
  },
}