import React from 'react'

const NewsItem = (props)=> {
    let {title, description, imageUrl, newsUrl, date, source} = props;
    return (
    <div className='mx-2 my-3'>
        <div className="card">
            <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                position: 'absolute',
                right: 0,
            }}>
                <span className="badge rounded bg-primary">{source}</span>
            </div>
            <img src={imageUrl ? imageUrl : "https://plus.unsplash.com/premium_photo-1707080369554-359143c6aa0b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8bmV3c3xlbnwwfHwwfHx8MA%3D%3D"} className="card-img-top" alt="..."/>
            <div className="card-body">
                <h5 className="card-title"> {title} </h5>
                <p className="card-text"> {description.substring(0, 300)}... </p>
                <p className="card-text"><small className="text-primary">{new Date(date).toGMTString()}</small></p>
                <div className='text-center'>
                    <a rel='noreferrer' href={newsUrl} target='_blank' className="btn btn-sm btn-dark">Read More<i className="fa-solid fa-up-right-from-square mx-2"></i></a>
                </div>
            </div>
        </div>
    </div>
    )
}

export default NewsItem;
