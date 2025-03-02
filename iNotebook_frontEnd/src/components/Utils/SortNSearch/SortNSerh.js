import React, { useState } from 'react';
import './NestedDropdown.css';

function SortNSerh(props) {
    const { sortingList, sort, search } = props;
    const [openSubmenu, setOpenSubmenu] = useState(null);

    const toggleSubmenu = (index, event) => {
        event.stopPropagation();
        setOpenSubmenu(openSubmenu === index ? null : index);
    };

    const handleSubmenuItemClick = (type, event) => {
        event.stopPropagation(); 
        sort(type); 
        setOpenSubmenu(null);
        document.body.click();
    };

    const boxStyle = {
        cursor: 'pointer',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        MsUserSelect: 'none',
    };

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
                                    onClick={(e) => handleSubmenuItemClick(func.nested[0].type, e)}
                                >
                                    {func.name}
                                </a>
                            </li>
                        ) : (
                            <li key={index} className="dropdown-submenu">
                                <a
                                    className="dropdown-item dropdown-toggle"
                                    style={boxStyle}
                                    onClick={(e) => toggleSubmenu(index, e)}
                                >
                                    {func.name}
                                </a>
                                <ul 
                                    className={`dropdown-menu submenu ${openSubmenu === index ? 'show' : ''}`}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {func.nested.map((subFunc, subIndex) => (
                                        <li key={subIndex}>
                                            <a
                                                className="dropdown-item"
                                                style={boxStyle}
                                                onClick={(e) => handleSubmenuItemClick(subFunc.type, e)}
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
    );
}

export default SortNSerh;