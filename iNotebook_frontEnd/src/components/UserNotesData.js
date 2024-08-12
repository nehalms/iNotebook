import React, { useEffect, useState } from 'react'
import { DataGrid, GridActionsCellItem ,GridToolbarContainer, GridToolbarExport, renderActionsCell, renderEditDateCell, renderEditInputCell } from '@mui/x-data-grid';
import { Tooltip, tooltipClasses } from '@mui/material';
import moment from 'moment'
import { jwtDecode } from 'jwt-decode';
import { history } from '../History';

export default function UserNotesData(props) {
    
    const [rows, setRows] = useState([]);
    const [totalcount, setTotalCount] = useState({usersCount: 0, notesCount: 0});

    useEffect(() => {
      if(jwtDecode(sessionStorage.getItem('adminToken')).exp < Date.now() / 1000) {
        props.showAlert("Session expired Login again", 'danger');
        history.navigate("/login");
        return;
      }
      if(sessionStorage.getItem('adminToken'))
        fetchData();
    }, [])

    function CustomToolbar() {
        return (
          <GridToolbarContainer className='ps-4 bg-light'>
            <GridToolbarExport />
          </GridToolbarContainer>
        );
    }

    const fetchData = async () => {
        try {
            props.setLoader({ showLoader: true, msg: "Loading..."});
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getData/users`, {
                method: "GET", 
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": sessionStorage.getItem('adminToken')
                }
            });
            props.setLoader({ showLoader: false });
            const data = await response.json();
            setRows(data.users);
            data.users.sort((ob1, ob2) => {return ob1.id-ob2.id});
            setTotalCount({
              usersCount: data.usersCount,
              notesCount: data.notesCount,
            });
        } catch (err) {
            console.log('Error**', err);
            props.showAlert("Some Error occured", 'danger');
        }
    }

    const columns = [
        { 
            field: 'id', 
            headerName: 'SL.No', 
            minWidth: 90,
            headerAlign: 'center',
            cellClassName: 'text-center',
            headerClassName: 'bg-primary text-light',
        },
        {
          field: 'name',
          headerName: 'User Name',
          minWidth: 190,
          headerAlign: 'center',
          headerClassName: 'bg-primary text-light',
          cellClassName: 'ps-5',
          flex: 1,
        },
        {
          field: 'email',
          headerName: 'Email',
          minWidth: 280,
          headerAlign: 'center',
          headerClassName: 'bg-primary text-light',
          cellClassName: 'ps-5',
          valueGetter: (email) => {return email.split("__")[0]},
          flex: 1,
        },
        {
            field: 'date',
            headerName: 'Created On',
            minWidth: 250,
            headerAlign: 'center',
            headerClassName: 'bg-primary text-light',
            cellClassName: 'text-center',
            valueGetter: (date) => {return moment(new Date(date)).format('LLL')},
            flex: 1,
        },
        {
            field: 'count',
            headerName: 'Notes Count',
            minWidth: 100,
            headerAlign: 'center',
            headerClassName: 'bg-primary text-light',
            cellClassName: 'text-center',
            flex: 1,
        },
        {
            field: 'isActive',
            headerName: 'Account Status',
            minWidth: 150,
            headerAlign: 'center',
            headerClassName: 'bg-primary text-light',
            cellClassName: 'text-center',
            renderCell: (params) => {
              return(<Tooltip title={params.row.isActive == true ? 'Active' : 'Inactive'}>  
                <span><i className="fa-solid fa-circle" style={{color: `${params.row.isActive == true ? '#63E6BE' : '#fe3434'}`}}></i></span>
              </Tooltip>)
            },
            flex: 1,
        },
        {
          field: 'lastLoggedOn',
          headerName: 'Last Login',
          minWidth: 250,
          headerAlign: 'center',
          headerClassName: 'bg-primary text-light',
          cellClassName: 'text-center',
          valueGetter: (date) => {return moment(new Date(date)).format('LLL')},
          flex: 1,
      },
    ] 

  return (
    <>
      <div className="row align-items-center justify-content-center">
        <div className='col-md-3'>
            <div className="card my-3 py-2" style={{backgroundColor: '#facb89'}}>
                <div className="card-body">
                  <h5 className="card-title my-0 text-center">Total Users : {totalcount.usersCount}</h5>
                </div>
            </div>
        </div>
        <div className='col-md-3'>
            <div className="card my-3 py-2" style={{backgroundColor: '#89faba'}}>
                <div className="card-body">
                  <h5 className="card-title my-0 text-center">No. of Notes : {totalcount.notesCount}</h5>
                </div>
            </div>
        </div>
      </div>
      <div style={{ height: 600, width: '100%' }}>
        <DataGrid
          disableColumnResize
          disableColumnMenu
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              color: 'blue',
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[5, 10]}
          disableRowSelectionOnClick
          slots={{
              toolbar: CustomToolbar,
          }}
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? 'bg-body-tertiary' : 'bg-body-secondary'
          }
        />
      </div>
    </>
  )
}
