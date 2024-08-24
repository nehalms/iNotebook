import React, { useRef, useState } from 'react'
import { saveAs } from 'file-saver'

export default function RoundCorners(props) {

  const [file, setFile] = useState();
  const imgRef = useRef();
  const [uploaded, setUploaded] = useState(false);
  const [url, setUrl] = useState(null);
  const [preview, setPreview] = useState();

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
        props.showAlert('No Image uploaded', 'warning');
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
    console.log(json);
    if(json.error) {
        props.showAlert(json.error, 'danger')
        return;
    }
    if(json.status) {
        props.showAlert('Image transformed success', 'success');
        setUrl(json.data.url);
    } else {
        props.showAlert(json.msg, 'info');
    }
    return;
  }

  const downloadImage = async () => {
    saveAs(url, file.name);
    props.showAlert('Image Downloaded', 'success');
  }

  return (
    <div className="row">
        <div className="col-lg-12 my-1 p-3 text-center">
            <div className="card p-3 d-flex flex-column">
                <h3>Enhance the image look using AI</h3>
            </div>
        </div>

        <div className='col my-1'>
            <div className="card p-3 d-flex flex-column">
                <div className='p-4 border border-black rounded-4 text-center mt-5' onClick={handleClick}>
                    <i className="fa-solid fa-upload fa-3x"></i>
                    <input type="file" name="file" ref={imgRef} style={{display: 'none'}} onChange={handleChange}/>
                </div>
                <h5 className='m-0 text-center pt-3 mb-4'>{uploaded ? file.name : 'Upload (.png / .jpg / .jpeg)'}</h5>
                <div className="text-center" >
                    {preview && <img src={preview} alt="Upload the image" />}
                </div>
                <button type="submit" className="btn btn-primary mt-3" onClick={handleUpload}>Enhance <i class="mx-2 fa-solid fa-money-bill-transfer"></i></button>
            </div>
        </div>
        <div className="col my-1">
            <div className="card p-3">
                <div className="text-center">
                    {url !== null ? <img src={url} alt="Failed to load image Click on translate again" /> : 'No image'}
                </div>
                {url !== null && <button type="submit" className="btn btn-success mt-3 p-3" onClick={downloadImage}>Download New Image<i class="mx-2 fa-solid fa-download"></i></button>}
            </div>
        </div>
    </div>
    
  )
}