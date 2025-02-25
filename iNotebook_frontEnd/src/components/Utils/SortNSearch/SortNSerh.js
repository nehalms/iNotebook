import React from 'react'
import './NestedDropdown.css'

function SortNSerh(props) {
    const { sortingList, sort, search } = props;

    const boxStyle = {
        cursor: 'pointer',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        MsUserSelect: 'none',
    }

  return (
    <div className='col-md-6 my-1 p-1 d-flex align-items-center justify-content-end'>
        <div className='mx-2'>
            <form className="form-inline">
                <div className="input-group">
                    <div className="input-group-append border rounded-start d-flex align-items-center justify-content-center px-2">
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </div>
                    <input 
                        type="text" 
                        className="form-control border rounded-end" 
                        placeholder="Search..."
                        aria-label="Username" 
                        aria-describedby="basic-addon1"
                        onChange={(event) => { event.preventDefault(); search(event.target.value) }}
                    />
                </div>
            </form>
        </div>
        <div className="dropdown me-2">
            <button
                className="btn btn-primary dropdown-toggle"
                type="button"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                <span className="m-0 mx-1">Sort By</span>
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ minWidth: '140px' }}>
                {sortingList.map((func, index) => (
                func.nested.length === 1 ? (
                    <li key={index}>
                        <a
                            className="dropdown-item"
                            style={boxStyle}
                            onClick={() => sort(func.nested[0].type)}
                        >
                            {func.name}
                        </a>
                    </li>
                ) : (
                    <li className="dropdown-submenu" key={index}>
                    <a className="dropdown-item dropdown-toggle" style={boxStyle}>
                        {func.name}
                    </a>
                    <ul className="dropdown-menu submenu">
                        {func.nested.map((subFunc, subIndex) => (
                        <li key={subIndex}>
                            <a
                            className="dropdown-item"
                            style={boxStyle}
                            onClick={() => sort(subFunc.type)}
                            >
                            {subFunc.name}
                            </a>
                        </li>
                        ))}
                    </ul>
                    </li>
                )
                ))}
            </ul>
        </div>
    </div>
  )
}

export default SortNSerh;