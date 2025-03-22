import React, { useContext, useEffect, useState } from 'react';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { Button, Checkbox, Tooltip } from '@mui/material';
import AuthContext from '../../context/auth_state/authContext';

export default function Permissions(props) {
    const PERMISSIONS = {
      'notes': 1,
      'tasks': 2,
      'images': 3,
      'games': 4,
      'messages': 5,
      'news': 6,
      'calendar': 7,
    }
  const { userState, handleSessionExpiry } = useContext(AuthContext);
  const [rows, setRows] = useState([]);

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
      if(!(userState.loggedIn) || !(userState.isAdminUser)) {
        return;
      }
      props.setLoader({ showLoader: true, msg: 'Loading...' });
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/perm/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      const data = await response.json();
      if (data.error) {
        props.showAlert(data.error, 'danger', 10038);
        handleSessionExpiry(data);
        return;
      }
      setRows(data.users);
      data.users && data.users.length && data.users.sort((ob1, ob2) => ob1.id - ob2.id);
    } catch (err) {
      console.log('Error**', err);
      props.showAlert('Some error occurred', 'danger', 10013);
    } finally {
      props.setLoader({ showLoader: false });
    }
  };

    const handlePermissionToggle = async(field, userId, value) => {
        try {
            let idx = PERMISSIONS[field];
            let type = value == true ? 'reset' : 'set';
            props.setLoader({ showLoader: true, msg: 'Changing permissions...' });
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/perm/${type}/${userId}/${idx}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });
            const data = await response.json();
            if (data && data.error) {
                props.showAlert(data.msg, 'info');
                handleSessionExpiry(data);
                return;
            }
            if (data.status === 1) {
              props.showAlert(data.msg, 'success', 10014);
              await fetchData();
            }
        } catch (err) {
            console.log('Error**', err);
            props.showAlert('Some error occurred', 'danger', 10015);
        } finally {
            props.setLoader({ showLoader: false });
        }
    }

    const handleSetReset = (field, userId) => {
        props.setDialog(true, `${field.charAt(0).toUpperCase() + field.slice(1)} all permissions`, () => onConfirm(field, userId), onClose, 'success');
    }

    const onConfirm = async (field, userId) => {
        props.setDialog(false, '', () => {}, () => {});
        try {
            props.setLoader({ showLoader: true, msg: 'Changing permissions...' });
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/perm/${field}all/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });
            const data = await response.json();
            if (data && data.error) {
                props.showAlert(data.msg, 'info');
                handleSessionExpiry(data);
                return;
            }
            if (data.status === 1) {
              props.showAlert(data.msg, 'success', 10014);
              await fetchData();
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
        field: 'notes',
        headerName: 'Notes',
        minWidth: 80,
        headerAlign: 'center',
        headerClassName: 'custom-header',
        cellClassName: 'text-center',
        flex: 1,
        renderCell: (params) => (
            <Checkbox
            checked={params.value || false}
            onChange={() => handlePermissionToggle('notes', params.row.userId, params.value)}
            color="primary"
            />
        ),
    },
    {
        field: 'tasks',
        headerName: 'Tasks',
        minWidth: 80,
        headerAlign: 'center',
        headerClassName: 'custom-header',
        cellClassName: 'text-center',
        flex: 1,
        renderCell: (params) => (
            <Checkbox
              checked={params.value || false}
              onChange={() => handlePermissionToggle('tasks', params.row.userId, params.value)}
              color="primary"
            />
        ),
    },
    {
        field: 'images',
        headerName: 'Images',
        minWidth: 80,
        headerAlign: 'center',
        headerClassName: 'custom-header',
        cellClassName: 'text-center',
        flex: 1,
        renderCell: (params) => (
            <Checkbox
              checked={params.value || false}
              onChange={() => handlePermissionToggle('images', params.row.userId, params.value)}
              color="primary"
            />
        ),
    },
    {
        field: 'games',
        headerName: 'Games',
        minWidth: 80,
        headerAlign: 'center',
        headerClassName: 'custom-header',
        cellClassName: 'text-center',
        flex: 1,
        renderCell: (params) => (
            <Checkbox
              checked={params.value || false}
              onChange={() => handlePermissionToggle('games', params.row.userId, params.value)}
              color="primary"
            />
        ),
    },
    {
        field: 'messages',
        headerName: 'Messages',
        minWidth: 90,
        headerAlign: 'center',
        headerClassName: 'custom-header',
        cellClassName: 'text-center',
        flex: 1,
        renderCell: (params) => (
            <Checkbox
              checked={params.value || false}
              onChange={() => handlePermissionToggle('messages', params.row.userId, params.value)}
              color="primary"
            />
        ),
    },
    {
      field: 'news',
      headerName: 'News',
      minWidth: 80,
      headerAlign: 'center',
      headerClassName: 'custom-header',
      cellClassName: 'text-center',
      flex: 1,
      renderCell: (params) => (
          <Checkbox
            checked={params.value || false}
            onChange={() => handlePermissionToggle('news', params.row.userId, params.value)}
            color="primary"
          />
      ),
    },
    {
      field: 'calendar',
      headerName: 'Calendar',
      minWidth: 80,
      headerAlign: 'center',
      headerClassName: 'custom-header',
      cellClassName: 'text-center',
      flex: 1,
      renderCell: (params) => (
          <Checkbox
            checked={params.value || false}
            onChange={() => handlePermissionToggle('calendar', params.row.userId, params.value)}
            color="primary"
          />
      ),
    },
    {
        field: 'give all',
        headerName: 'Give All',
        minWidth: 100,
        headerAlign: 'center',
        headerClassName: 'custom-header',
        cellClassName: 'text-center',
        flex: 1,
        renderCell: (params) => (
            <Button
                size="small"
                className='border rounded bg-success text-white'
                onClick={() => handleSetReset('set', params.row.userId,)}
                sx={{ minWidth: '30px', padding: '8px 8px' }}
            >
            {<i className="fa-solid fa-check"></i>}
            </Button>
        ),
    },
    {
        field: 'remove all',
        headerName: 'Remove All',
        minWidth: 100,
        headerAlign: 'center',
        headerClassName: 'custom-header',
        cellClassName: 'text-center',
        flex: 1,
        renderCell: (params) => (
            <Button
                size="small"
                className='border rounded bg-danger text-white'
                onClick={() => handleSetReset('reset', params.row.userId,)}
                sx={{ minWidth: '30px', padding: '8px 8px' }}
            >
            {<i className="fa-solid fa-xmark"></i>}
            </Button>
        ),
    },
    
  ];

    const columnGroupingModel = [
        {
          groupId: 'permissions',
          headerName: 'Permissions',
          headerAlign: 'center',
          children: [{ field: 'notes' }, { field: 'tasks' }, { field: 'games' }, { field: 'images' }, { field: 'messages' }, { field: 'news' }, { field: 'calendar' }, { field: 'give all' }, { field: 'remove all' }],
        },
    ];

  return (
    <>
      <div style={{ height: 'auto', width: '100%' }}>
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
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? 'bg-body-tertiary' : 'bg-body-secondary'
          }
          sx={{
            '& .MuiDataGrid-footerContainer': {
              backgroundColor: '#f2b738',
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
              backgroundColor: '#f2b738',
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
    backgroundColor: '#e0e0e0',
    padding: '10px',
    borderRadius: '5px',
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '10px',
  },
}