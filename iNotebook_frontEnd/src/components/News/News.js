import React, { useEffect, useState, useContext } from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from "react-infinite-scroll-component";
import ScrollToTopButton from '../Utils/ScrollToTop';
import AuthContext from '../../context/auth_state/authContext';
import { history } from '../History';

const News = (props)=>{
    history.navigate = useNavigate();
    const { userState, handleSessionExpiry } = useContext(AuthContext);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState('');
    const [totalResults, setTotalResults] = useState(0);
    const [country, setCountry] = useState('in');
    const [category, setCategory] = useState('top');
    const [selectedCountry, setSelectedCountry] = useState('India');
    const [selectedCategory, setSelectedCategory] = useState('Top');
    const countries = {
        "India": "in",
        "World": "wo",
        "United States": "us",
        "Australia":	"au",
        "Brazil":	"br",
        "China":	"cn",
        "France":	"fr",
        "Germany":	"de",
        "Iran":	"ir",
        "Japan":	"jp",
        "Malaysia":	"my",
        "Maldives":	"mv",
        "New zealand":	"nz",
        "North korea":	"kp",
        "Pakistan":	"pk",
        "Russia":	"ru",
        "South africa":	"za",
        "South korea":	"kr",
        "Sri Lanka":	"lk",
        "United arab emirates":	"ae",
        "United kingdom":	"gb",
    }

    const categories = {
        "Business": "business",
        "Crime": "crime",
        "Domestic": "domestic",
        "Education": "education",
        "Entertainment": "entertainment",
        "Environment": "environment",
        "Food": "food",
        "Health": "health",
        "Lifestyle": "lifestyle",
        "Other": "other",
        "Politics": "politics",
        "Science": "science",
        "Sports": "sports",
        "Technology": "technology",
        "Top": "top",
        "Tourism": "tourism",
        "World": "world",
    }
    
    const caps = (str)=> {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const updateNews = async (code = null, ctgry = null, nxtPage = false)=> {
        try {
            props.setLoader({ showLoader: true, msg: 'Fetching news...' });
            let response = await fetch(`${process.env.REACT_APP_BASE_URL}/news/top?country=${code ? code : country}&category=${ctgry ? ctgry : category}&page=${nxtPage ? page : ''}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
            });
            let data = await response.json();
            if(data.error) {
                handleSessionExpiry(data);
                props.showAlert(data.error, 'info', 10324);
                return;
            }
            if (data && data.status === 1) {
                let parsedData = data.data;
                setPage(parsedData.nextPage);
                setArticles(nxtPage ? articles.concat(parsedData.results) : parsedData.results);
                setTotalResults(parsedData.totalResults);
            }
            setLoading(false);
        } catch (err) {
            console.log('Error***', err);
            props.showAlert("Internal server Error", 'danger', 10102);
        } finally {
            props.setLoader({ showLoader: false });
        }
    }

    useEffect(() => {
        if (!userState.loggedIn) {
            history.navigate("/");
            return;
        } else {
            updateNews();
        }
    }, [userState])

    const fetchMoreData = ()=> {
        updateNews(country, category, true);
    }

    const handleCountryChange = (country, code) => {
        setCountry(code);
        setSelectedCountry(country);
        updateNews(code, category, false);
    }

    const handleCatogoryChange = (category, cat) => {
        setCategory(cat);
        setSelectedCategory(category);
        updateNews(country, cat, false);
    }

    const boxStyle = {
        cursor: 'pointer',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        MsUserSelect: 'none',
    };

    return (
    <>
        <ScrollToTopButton/>
        <div className='d-flex align-items-center justify-content-between'>
            <div className='d-flex align-items-center justify-content-start'>
                <h2 className='text-center' style={{margin:'5px 0px 15px 0px'}}>News - {caps(selectedCountry)} {caps(selectedCategory)} HeadLines</h2>
            </div>
            <div className='d-flex align-items-center justify-content-end'>
                <div className="dropdown me-2">
                    <button
                        className="btn btn-info dropdown-toggle"
                        type="button"
                        id="dropdownMenuButton"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <span className="m-0 mx-1">{selectedCountry}</span>
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ minWidth: '140px' }}>
                        {Object.keys(countries).map((code, index) => (
                            <li key={index}>
                                <a
                                    className="dropdown-item"
                                    style={boxStyle}
                                    onClick={(e) => handleCountryChange(code, countries[code])}
                                >
                                    {code}
                                </a>
                            </li>
                            
                        ))}
                    </ul>
                </div>
                <div className="dropdown me-2">
                    <button
                        className="btn btn-dark dropdown-toggle"
                        type="button"
                        id="dropdownMenuButton"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <span className="m-0 mx-1">{selectedCategory}</span>
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ minWidth: '140px' }}>
                        {Object.keys(categories).map((code, index) => (
                            <li key={index}>
                                <a
                                    className="dropdown-item"
                                    style={boxStyle}
                                    onClick={(e) => handleCatogoryChange(code, categories[code])}
                                >
                                    {code}
                                </a>
                            </li>
                            
                        ))}
                    </ul>
                </div>
            </div>
        </div>
        {loading && <Spinner/>}
        <InfiniteScroll
            dataLength={articles.length}
            next={fetchMoreData}
            hasMore={articles.length !== totalResults}
            loader={<Spinner/>}>
            <div className="container">
                <div className="row">
                    {articles.map((element) => {
                        return <div className="col-md-4 p-1" key ={element.article_id}>
                            <NewsItem title={element.title ? element.title : " "} description={element.description ? element.description : " "} imageUrl={element.image_url} newsUrl={element.link} date={element.pubDate} source={element.source_name}/>
                        </div>
                    })}
                </div>
            </div>
        </InfiniteScroll>
    </>
    )
}

News.defaultProps = {
    pageSize: 6,
    category: "general",
    country: "in"
}

News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string
}

export default News;