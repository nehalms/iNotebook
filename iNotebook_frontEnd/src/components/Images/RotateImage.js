import React, { useEffect, useRef, useState } from 'react'
import { saveAs } from 'file-saver'
import TryIt from './TryIt';
import Rotate from './StaticImages/Rotate.png'

export default function RotateImage(props) {
    const [file, setFile] = useState();
    const [preview, setPreview] = useState();
    const [angle, setAngle] = useState(0);
    const imgRef = useRef();
    const divRef = useRef();
    const [uploaded, setUploaded] = useState(false);
    const [url, setUrl] = useState(null);
    const [dimsns, setDimsns] = useState({width:0});
    const [loadingImg, setLoading] = useState(true);
    const [tryIt, setTryIt] = useState(true);
    const [hflip, sethflip] = useState(false);
    const [vflip, setvflip] = useState(false);
  
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
        props.setLoader({ showLoader: true, msg: "Rotating..."});
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/image/rotate?angle=${angle}&hflip=${hflip}&vflip=${vflip}`, {
          method: "POST", 
          credentials: 'include',
          body: formData
        });
        props.setLoader({ showLoader: false });
        const json = await response.json();
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
      setAngle(e.target.value);
    }
  
    const downloadImage = async () => {
      saveAs(url, file.name);
      props.showAlert('Image Downloaded', 'success', 10136);
    }
  
    const handleImageLoading = () => {
      setLoading(false);
    }

    const handleFlip = (event) => {
      if(event.target.value === "hflip") {
        sethflip(event.target.checked);
      }
      if(event.target.value === "vflip") {
        setvflip(event.target.checked);
      }
    }
  
    return (
        <div className="row">
          <div className="col-lg-12 my-1 p-3 text-center">
              <div className="card shadow-lg p-3 d-flex flex-column">
                  <h3>Use this tool to rotate an image</h3>
              </div>
          </div>
  
          { tryIt ?
            <TryIt img={Rotate} setTryIt={setTryIt} width={'60%'}/> 
            :
            <>
              <div className='col-lg-5 my-1' >
                  <div className="card shadow-lg p-3 d-flex flex-column" ref={divRef}>
                      <h3 className='text-center mb-4'>Rotate Image</h3>
                      <div className='p-4 border border-black rounded-4 text-center' onClick={handleClick}>
                          <i className="fa-solid fa-upload fa-3x"></i>
                          <input type="file" name="file" ref={imgRef} style={{display: 'none'}} onChange={handleChange} />
                      </div>
                      <h5 className='m-0 text-center pt-3 mb-4'>{uploaded ? file.name : 'Upload (.png / .jpg / .jpeg)'}</h5>
                      
                      <div className='mx-3'>
                        <div className="mb-3">
                            <label htmlFor="angle" className="form-label">Angle (Max value: 359)</label>
                            <input
                              type="number"
                              className="form-control"
                              max={359}
                              min={0}
                              id="angle"
                              name="angle"
                              onChange={onChange}
                              placeholder='Degree'
                            />
                        </div>
                        <div className="mb-3 d-flex align-items-center justify-content-around">
                          <div className="form-check">
                            <input className="form-check-input" type="checkbox" value="hflip" id="flexCheckDefault" onChange={handleFlip}/>
                            <label className="form-check-label" htmlFor="flexCheckDefault">Horizantal flip</label>
                          </div>
                          <div className="form-check">
                            <input className="form-check-input" type="checkbox" value="vflip" id="flexCheckDefault1" onChange={handleFlip}/>
                            <label className="form-check-label" htmlFor="flexCheckDefault">Vertical flip</label>
                          </div>
                        </div>
                      </div>
                  
                      <button type="submit" className="btn btn-primary mt-3 p-2" onClick={handleUpload}>Generate <i className="mx-2 fa-solid fa-money-bill-transfer"></i></button>
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
