import React, { useEffect, useRef, useState } from 'react'
import './inputNumber.css'
import { saveAs } from 'file-saver'

export default function RoundCorners(props) {

  const [checked, setChecked] = useState('light')
  const [file, setFile] = useState();
  const imgRef = useRef();
  const imgDivRef = useRef();
  const [uploaded, setUploaded] = useState(false);
  const [maxChecked, setMaxChecked] = useState(false);
  const [cornerValues, setCornerValues] = useState({topleft: 0, topright: 0, btmleft:0, btmright: 0});
  const [url, setUrl] = useState(null);
  const [dimsns, setDimsns] = useState({width:0});

  useEffect(() => {
    if (!imgDivRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
        setDimsns({width: imgDivRef.current.offsetWidth-30});
    });
    resizeObserver.observe(imgDivRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const handleClick = () => {
    imgRef.current.click();
  }

  const handleChange = (e) => {
    setFile(e.target.files[0]);
    setUploaded(true);
  }

  const handleUpload = async () => {
    if(!file) {
        props.showAlert('No Image uploaded', 'warning');
        return;
    }
    if((cornerValues.btmleft === 0 && cornerValues.btmright === 0 && cornerValues.topleft === 0 && cornerValues.topright === 0) && !maxChecked) {
        props.showAlert('No change selected', 'warning');
        return;
    }
    let type = file.type.split('/')[1];
    let allowedTypes = ['jpg', 'jpeg', 'png']
    if(!allowedTypes.includes(type)) {
        props.showAlert('Unsupported file type', 'warning');
        return;
    }
    let formData = new FormData();
    formData.append('image', file);
    
    try {
        props.setLoader({ showLoader: true, msg: "Transforming..."});
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/image/roundcorners?setMax=${maxChecked}&tl=${cornerValues.topleft}&tr=${cornerValues.topright}&bl=${cornerValues.btmleft}&br=${cornerValues.btmright}`, {
        method: "POST", 
        headers: {
            "auth-token": localStorage.getItem('token'),
            },
        body: formData
        });
        props.setLoader({ showLoader: false });
        const json = await response.json();
        console.log(json);
        if(json.err) {
            props.showAlert(json.err, 'danger')
            return;
        }
        if(json.status) {
            props.showAlert('Image transformed success', 'success');
            setUrl(json.data.url);
        }
    } catch(err) {
        props.setLoader({ showLoader: false });
        console.log("Error**", err);
        props.showAlert("Some error Occured", 'danger');
    }
    return;
  }

  const onChange = (e) => {
    setCornerValues({...cornerValues, [e.target.name] : e.target.value});
  }

  const downloadImage = async () => {
    saveAs(url, file.name);
    props.showAlert('Image Downloaded', 'success');
  }

  return (
    <div className="row">
        <div className="col-lg-12 my-1 p-3 text-center">
            <div className="card shadow-lg p-3 d-flex flex-column">
                <h3>Use this tool to round the corners (sharpness) of the image</h3>
            </div>
        </div>
    
        <div className='col-lg my-1'>
            <div className="card shadow-lg p-3 d-flex flex-column">
                <h3 className='text-center mb-4'>Customize Corners</h3>
                <div className='p-4 border border-black rounded-4 text-center' onClick={handleClick}>
                    <i className="fa-solid fa-upload fa-3x"></i>
                    <input type="file" name="file" ref={imgRef} style={{display: 'none'}} onChange={handleChange}/>
                </div>
                <h5 className='m-0 text-center pt-3 mb-4'>{uploaded ? file.name : 'Upload (.png / .jpg / .jpeg)'}</h5>
                <div className='d-flex align-items-center my-1'>
                    <input className='me-2 arrow' type="number" name="topleft" onChange={onChange} min={0} max={200} style={{minWidth: '150px'}}/> <p className='m-0 ps-4'> : Top-left</p>
                </div>
                <div className='d-flex align-items-center my-1'>
                    <input className='me-2 arrow' type="number" name="topright" onChange={onChange} min={0} max={200} style={{minWidth: '150px'}}/><p className='m-0 ps-4'> : Top-right</p> 
                </div>
                <div className='d-flex align-items-center my-1'>
                    <input className='me-2 arrow' type="number" name="btmleft" onChange={onChange} min={0} max={200} style={{minWidth: '150px'}}/><p className='m-0 ps-4'> : Bottom-left</p>  
                </div>
                <div className='d-flex align-items-center my-1'>
                    <input className='me-2 arrow' type="number" name="btmright" onChange={onChange} min={0} max={200} style={{minWidth: '150px'}}/><p className='m-0 ps-4'> : Bottom-right</p>  
                </div>
                <div className='d-flex align-items-center my-3'>
                    <div className={`bg-${checked} rounded mx-2 border border-black text-center`} onClick={() => {setChecked( checked === 'light' ? 'success' : 'light'); setMaxChecked(checked === 'success' ? false : true); }} style={{height:'25px', width:'25px', cursor:'pointer'}}><i className="m-0 fa-xs fa-solid fa-check" style={{color: '#ffffff'}}></i></div>
                    <h6 className='m-0'>Set Max</h6>
                </div>
                <button type="submit" className="btn btn-primary mt-3 p-2" onClick={handleUpload}>Transform <i className="mx-2 fa-solid fa-money-bill-transfer"></i></button>
            </div>
        </div>
        <div className="col-lg my-1">
            <div className="card shadow-lg p-3" ref={imgDivRef}>
                <div className="text-center">
                    {url !== null ? <img src={url} alt="Failed to load image Click on translate again" width={dimsns.width} style={{maxHeight: '800px'}} /> : 'No image'}
                </div>
                {url !== null && <button type="submit" className="btn btn-success mt-3 p-3" onClick={downloadImage}>Download Image<i className="mx-2 fa-solid fa-download"></i></button>}
            </div>
        </div>
    </div>
    
  )
}
