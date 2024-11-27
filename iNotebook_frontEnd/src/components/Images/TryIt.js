import React from 'react'

export default function TryIt({img, setTryIt, width}) {
  return (
    <div className='col-lg-12 my-1'>
        <div className="card shadow-lg p-3 d-flex flex-column" >
            <div className="text-center" >
                <img src={img} style={{maxHeight: '600px', width: width ? width : '60%'}} alt="Image" />
            </div>
            <div className="text-center">
                <button type="submit" className="btn btn-success mt-3" style={{width: '40%'}} onClick={() => {setTryIt(false)}}>Try it<i className="mx-2 fa-solid fa-money-bill-transfer"></i></button>
            </div>
        </div>
    </div>
  )
}
