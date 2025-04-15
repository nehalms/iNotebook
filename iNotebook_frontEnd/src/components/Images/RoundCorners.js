import React, { useEffect, useRef, useState } from 'react'
import './inputNumber.css'
import { saveAs } from 'file-saver'
import Roundcorners from './StaticImages/Roundcorners.png';
import TryIt from './TryIt';

export default function RoundCorners(props) {
  const [file, setFile] = useState();
  const [preview, setPreview] = useState();
  const imgRef = useRef();
  const divRef = useRef();
  const [uploaded, setUploaded] = useState(false);
  const [maxChecked, setMaxChecked] = useState(false);
  const [cornerValues, setCornerValues] = useState({topleft: 0, topright: 0, btmleft:0, btmright: 0});
  const [url, setUrl] = useState(null);
  const [dimsns, setDimsns] = useState({width:0});
  const [selectedOption, setOption] = useState();
  const [loadingImg, setLoading] = useState(true);
  const [tryIt, setTryIt] = useState(true);

  useEffect(() => {
    if (!divRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
        setDimsns({width: divRef.current.offsetWidth-30});
    });
    resizeObserver.observe(divRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const handleClick = () => {
    imgRef.current.click();
  }

  const handleChange = (e) => {
    if(!e.target.files[0]) {
        return;
    }
    setUrl(null);
    setFile(e.target.files[0]);
    setUploaded(true);
    setPreview(URL.createObjectURL(e.target.files[0]));
  }

  const handleUpload = async () => {
    if(!file) {
        props.showAlert('No Image uploaded', 'warning', 10026);
        return;
    }
    if((cornerValues.btmleft === 0 && cornerValues.btmright === 0 && cornerValues.topleft === 0 && cornerValues.topright === 0) && !maxChecked) {
        props.showAlert('No option selected', 'warning', 10027);
        return;
    }
    let type = file.type.split('/')[1];
    let allowedTypes = ['jpg', 'jpeg', 'png']
    if(!allowedTypes.includes(type)) {
        props.showAlert('Unsupported file type', 'warning', 10028);
        return;
    }
    let formData = new FormData();
    formData.append('image', file);
    setLoading(true);
    try {
        props.setLoader({ showLoader: true, msg: "Transforming..."});
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/image/roundcorners?setMax=${maxChecked}&tl=${cornerValues.topleft}&tr=${cornerValues.topright}&bl=${cornerValues.btmleft}&br=${cornerValues.btmright}`, {
        method: "POST", 
        credentials: 'include',
        body: formData
        });
        props.setLoader({ showLoader: false });
        const json = await response.json();
        // console.log(json);
        if(json.error) {
            props.showAlert(json.error, 'danger', 10135)
            return;
        }
        if(json.success) {
            props.showAlert('Image transformed success', 'success', 10029);
            setUrl(json.data.url);
        }
    } catch(err) {
        props.setLoader({ showLoader: false });
        console.log("Error**", err);
        props.showAlert("Some error Occured", 'danger', 10030);
    }
    return;
  }

  const onChange = (e) => {
    if(selectedOption === 'single') {
        setCornerValues({
            topleft: e.target.value,
            topright: e.target.value,
            btmleft: e.target.value,
            btmright: e.target.value,
        });
    } else if (selectedOption === 'custom') {
        setCornerValues({...cornerValues, [e.target.name] : e.target.value});
    }
  }

  const downloadImage = async () => {
    saveAs(url, file.name);
    props.showAlert('Image Downloaded', 'success', 10136);
  }

  const handleOptionselection = (event) => {
    if(event.target.value === 'maximum') {
        setMaxChecked(true);
    } else {
        setMaxChecked(false);
    }
    setOption(event.target.value);
  }

   const handleImageLoading = () => {
      setLoading(false);
   }

  return (
    <div className="row">
        <div className="col-lg-12 my-1 p-3 text-center">
            <div className="card shadow-lg p-3 d-flex flex-column">
                <h3>Use this tool to round the corners of the image</h3>
            </div>
        </div>

        { tryIt ?
          <TryIt img={Roundcorners} setTryIt={setTryIt} width={'80%'}/> 
          :
          <>
            <div className='col-lg-5 my-1' >
                <div className="card shadow-lg p-3 d-flex flex-column" ref={divRef}>
                    <h3 className='text-center mb-4'>Customize Corners</h3>
                    <div className='p-4 border border-black rounded-4 text-center' onClick={handleClick}>
                        <i className="fa-solid fa-upload fa-3x"></i>
                        <input type="file" name="file" ref={imgRef} style={{display: 'none'}} onChange={handleChange}/>
                    </div>
                    <h5 className='m-0 text-center pt-3 mb-4'>{uploaded ? file.name : 'Upload (.png / .jpg / .jpeg)'}</h5>
                    
                    <div className='mx-3'>
                        <div>
                            <div className="form-check">
                                <input className="form-check-input" value="single" type="radio" name="flexRadioDefault" id="flexRadioDefault1" onClick={handleOptionselection}/>
                                <label className="form-check-label" htmlFor="flexRadioDefault1">Single radius {selectedOption === 'single' && '(Max value: 200)'} </label>
                            </div>
                            { selectedOption === 'single' && 
                                <div className='d-flex align-items-center my-1 ms-4'>
                                    <input className='me-2 arrow' type="number" name="topleft" onChange={onChange} min={0} max={200} style={{minWidth: '150px'}}/> <p className='m-0 ps-4'> : corners</p>  
                                </div>
                            }
                        </div>

                        <div>
                            <div className='d-flex align-items-center my-1'>
                                <div className="form-check">
                                    <input className="form-check-input" value="custom" type="radio" name="flexRadioDefault" id="flexRadioDefault2" onClick={handleOptionselection}/>
                                    <label className="form-check-label" htmlFor="flexRadioDefault">Custom radius {selectedOption === 'custom' && '(Max value: 200)'} </label>
                                </div>
                            </div>
                            { selectedOption === 'custom' &&
                                <>
                                    <div className='d-flex align-items-center my-1 ms-4'>
                                        <input className='me-2 arrow' type="number" name="topleft" onChange={onChange} min={0} max={200} style={{minWidth: '150px'}}/> <p className='m-0 ps-4'> : Top-left</p>
                                    </div>
                                    <div className='d-flex align-items-center my-1 ms-4'>
                                        <input className='me-2 arrow' type="number" name="topright" onChange={onChange} min={0} max={200} style={{minWidth: '150px'}}/><p className='m-0 ps-4'> : Top-right</p> 
                                    </div>
                                    <div className='d-flex align-items-center my-1 ms-4'>
                                        <input className='me-2 arrow' type="number" name="btmleft" onChange={onChange} min={0} max={200} style={{minWidth: '150px'}}/><p className='m-0 ps-4'> : Bottom-left</p>  
                                    </div>
                                    <div className='d-flex align-items-center my-1 ms-4'>
                                        <input className='me-2 arrow' type="number" name="btmright" onChange={onChange} min={0} max={200} style={{minWidth: '150px'}}/><p className='m-0 ps-4'> : Bottom-right</p>  
                                    </div>
                                </>
                            }
                        </div>

                        <div>
                            <div className="form-check">
                                <input className="form-check-input" value="maximum" type="radio" name="flexRadioDefault" id="flexRadioDefault3" onClick={handleOptionselection}/>
                                <label className="form-check-label" htmlFor="flexRadioDefault">Maximum radius</label>
                            </div>
                        </div>
                    </div>
                    
                    <button type="submit" className="btn btn-primary mt-3 p-2" onClick={handleUpload}>Transform <i className="mx-2 fa-solid fa-money-bill-transfer"></i></button>
                </div>
            </div>
            <div className="col-lg my-1">
                <div className="card shadow-lg p-3">
                    <div className="text-center">
                        { url !== null ? 
                            <img src={url} alt="Failed to load image Click on translate again" width={dimsns.width ? dimsns.width : '90%'} style={{maxHeight: '800px'}} loading='lazy' onLoad={handleImageLoading}/> 
                            : preview ? 
                            <img src={preview} alt="Failed to load preview" width={dimsns.width ? dimsns.width : '90%'} style={{maxHeight: '800px'}} loading='lazy'/> 
                            : 'No image'
                        }
                    </div>
                    {url !== null && <button type="submit" className="btn btn-success mt-3 p-3" onClick={downloadImage} disabled={loadingImg} >{loadingImg && url ? 'Loading image, Please wait...' : 'Download Image'}<i className="mx-2 fa-solid fa-download"></i></button>}
                </div>
            </div>
          </>
        }
    </div>
    
  )
}
