import React, { useRef, useState, useEffect } from 'react'
import { saveAs } from 'file-saver'

export default function RoundCorners(props) {

  const [file, setFile] = useState();
  const imgRef = useRef();
  const divRef = useRef();
  const imgDivRef = useRef();
  const [uploaded, setUploaded] = useState(false);
  const [url, setUrl] = useState(null);
  const [preview, setPreview] = useState();
  const [dimsns, setDimsns] = useState({width:0, height: 0, spcWidth: 0});

  useEffect(() => {
    if (!divRef.current || !imgDivRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
        setDimsns({width: imgDivRef.current.offsetWidth-30, height: divRef.current.offsetHeight-1000, spcWidth: divRef.current.offsetWidth-30});
    });
    resizeObserver.observe(divRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const handleClick = () => {
    imgRef.current.click();
  }

  const handleChange = (e) => {
    setFile(e.target.files[0]);
    setUploaded(true);
    setPreview(URL.createObjectURL(e.target.files[0]));
  }

  const handleUpload = async () => {
    if(!file) {
        props.showAlert('No Image uploaded', 'warning', 10022);
        return;
    }
    let type = file.type.split('/')[1];
    let allowedTypes = ['jpg', 'jpeg', 'png']
    if(!allowedTypes.includes(type)) {
        props.showAlert('Unsupported file type', 'warning', 10023);
        return;
    }
    let formData = new FormData();
    formData.append('image', file);
    
    try {
      props.setLoader({ showLoader: true, msg: "Transforming..."});
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/image/enhance`, {
        method: "POST", 
        headers: {
            "auth-token": localStorage.getItem('token'),
          },
        body: formData
      });
      props.setLoader({ showLoader: false });
      const json = await response.json();
      // console.log(json);
      if(json.error) {
          props.showAlert(json.error, 'danger', 10128);
          return;
      }
      if(json.success) {
          props.showAlert('Image transformed success', 'success', 10024);
          setUrl(json.data.url);
      } else {
          props.showAlert(json.msg, 'info', 10129);
      }
      return;
    } catch(err) {
      props.setLoader({ showLoader: false });
      console.log("Error**", err);
      props.showAlert("Some error Occured", 'danger', 10130);
    }
  }

  const downloadImage = async () => {
    saveAs(url, file.name);
    props.showAlert('Image Downloaded', 'success', 10025);
  }

  return (
    <div className="row">
        <div className="col-lg-12 my-1 p-3 text-center">
            <div className="card shadow-lg p-3 d-flex flex-column">
                <h3>Enhance the image look using AI</h3>
            </div>
        </div>

        <div className='col-lg my-1'>
            <div className="card shadow-lg p-3 d-flex flex-column" ref={divRef}>
                <div className='p-4 border border-black rounded-4 text-center mt-5' onClick={handleClick}>
                    <i className="fa-solid fa-upload fa-3x"></i>
                    <input type="file" name="file" ref={imgRef} style={{display: 'none'}} onChange={handleChange}/>
                </div>
                <h5 className='m-0 text-center pt-3 mb-4'>{uploaded ? file.name : 'Upload (.png / .jpg / .jpeg)'}</h5>
                <div className="text-center" >
                    {preview && <img src={preview} style={{maxHeight: '600px', maxWidth: dimsns.spcWidth}} alt="Upload the image" />}
                </div>
                <button type="submit" className="btn btn-primary mt-3" onClick={handleUpload}>Enhance <i className="mx-2 fa-solid fa-money-bill-transfer"></i></button>
            </div>
        </div>
        <div className="col-lg my-1">
            <div className="card shadow-lg p-3" ref={imgDivRef}>
                <div className="text-center">
                    {url !== null ? <img src={url} alt="Failed to load image Click on translate again" width={dimsns.width} height={dimsns.height}/> : 'No image'}
                </div>
                {url !== null && <button type="submit" className="btn btn-success mt-3 p-3" onClick={downloadImage}>Download Image<i className="mx-2 fa-solid fa-download"></i></button>}
            </div>
        </div>
    </div>
    
  )
}
