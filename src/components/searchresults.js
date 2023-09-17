import React, { useEffect, useState } from "react";
import { XIcon } from '@heroicons/react/solid';

const isLocalStorageSupported = () => {
  try {
    const testKey = 'test';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

function LoadingIcon() {
  return (
<div className="flex items-center justify-center space-x-2 animate-pulse">
  <div className="w-2 h-2 sm:w-4 sm:h-4 bg-blue-400 rounded-full"></div>
  <div className="w-2 h-2 sm:w-4 sm:h-4  bg-blue-400 rounded-full"></div>
  <div className="w-2 h-2 sm:w-4 sm:h-4  bg-blue-400 rounded-full"></div>
</div>
  );
}


function Searchresults({openMenu, lnews, lvideos, showWeb, getVideos, getNews, idioma, showImages, showVideos, showNews, web, images, videos, news, open, dataText, dataImages, dataVideos, dataNews}) {


  const [clickedUrls, setClickedUrls] = useState(() => {
    const savedUrls = isLocalStorageSupported() ? localStorage.getItem('clickedUrls') : null;
    return savedUrls ? JSON.parse(savedUrls) : {};
  });

  useEffect(() => {
    if (isLocalStorageSupported()) {
      localStorage.setItem('clickedUrls', JSON.stringify(clickedUrls));
    }
  }, [clickedUrls]);


  const handleClick = (url) => {
    setClickedUrls((prevClickedUrls) => ({
      ...prevClickedUrls,
      [url]: true,
    }));
  };
  function createMarkup(html) {
    return { __html: html };
  }


  return (
    <div className="z-10">
        {openMenu && (
        <div className="fixed h-screen w-screen z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div
              className="inline-block align-bottom bg-white text-left overflow-hidden transform transition-all sm:align-middle sm:max-w-lg w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
            <div>
                {web &&
                <div className="mt-8 mx-3 mb-20">
                {(dataText?.value ?? []).slice(0,1).map((result, index) => {
        const url = result.url;
        const linkStyle = clickedUrls[url]
  ? `line-clamp-3 sm:line-clamp-1 mb-3 hover:underline text-purple-600`
  : `line-clamp-3 sm:line-clamp-1 mb-3 hover:underline text-blue-700`;

        return (
          <div className={`searchresult_list border border-gray-50 shadow-lg pr-1 rounded-lg p-2 sm:pb-3 mb-5`} key={index}>
            <div className="">
            <div className="flex items-center">
          <div>
          <div className="flex items-center">
          <p style={{ fontSize: '18px' }} className={`sm:ml-2 pt-2 pb-2 ${result?.thumbnailUrl? "ml-0" : "ml-0" } font-sans text-gray-800 `} dangerouslySetInnerHTML={{ __html: result.snippet }}></p>
{result?.thumbnailUrl? <><img src={result.thumbnailUrl} className="w-auto flex sm:hidden h-24 rounded ml-2" loading="lazy" alt={result.name} /></> : <></>}
          </div>
          </div>
{result?.thumbnailUrl? <><img src={result.thumbnailUrl} className="sm:w-auto mr-1 hidden sm:flex sm:h-24 rounded sm:ml-2" loading="lazy" alt={result.name} /></> : <></>}
            </div>
                                <span
                className={linkStyle}
                onClick={() => handleClick(url)}
              >
                <a href={url} target="_self" rel="noreferrer">
                  <p style={{ fontSize: '20px' }} className="sm:ml-2" dangerouslySetInnerHTML={{ __html: result.name }}></p>
                </a>
              </span>
            </div>
          </div>
        );
      })}
      {(dataText?.value?.slice(1) ?? []).map((result, index) => {
        const url = result.url;
        const linkStyle = clickedUrls[url]
  ? `line-clamp-3 sm:line-clamp-1 text-xl  hover:underline text-purple-600`
  : `line-clamp-3 sm:line-clamp-1 cursor-pointer text-xl hover:underline text-blue-700`;

        return (
          <div className={`searchresult_list sm:border rounded-lg shadow-lg sm:shadow-none p-2 sm:p-0 mb-5 border-white sm:hover:bg-gray-50`} key={index}>
            <div className="">
            <div className="group pt-1">
              <a dangerouslySetInnerHTML={{ __html: result.displayUrl }} href={url} className={`text-sm sm:ml-2 font-sans text-gray-500`} rel="noreferrer" target="_blank">
              </a>
              <div className="">
              </div>
            </div>
            <div className="flex items-center">
          <div>
          <span
                className={linkStyle}
                onClick={() => handleClick(url)}
              >
                <a href={url} target="_self" rel="noreferrer">
                  <p className="sm:ml-2" dangerouslySetInnerHTML={{ __html: result.name }}></p>
                </a>
              </span>
          <div className="flex items-center">
          <p  className={` sm:ml-2 pb-2 ${result?.thumbnailUrl? "ml-0" : "ml-0" } font-sans text-gray-600`} dangerouslySetInnerHTML={{ __html: result.snippet }}></p>
{result?.thumbnailUrl? <><img src={result.thumbnailUrl} className="w-auto flex sm:hidden h-24 rounded ml-2" loading="lazy" alt={result.name} /></> : <></>}
          </div>
          </div>
{result?.thumbnailUrl? <><img src={result.thumbnailUrl} className="sm:w-auto hidden sm:flex sm:h-24 rounded sm:ml-2" loading="lazy" alt={result.name} /></> : <></>}
            </div>
            </div>
          </div>
        );
      })}  
                </div>
                }
                {images &&
                <div className="mt-8 mx-3 mb-20">
                {(dataImages.value ?? []).map((result, index) => {
            return (
                <div className="pb-4" key={index}>
                    <div>
                        <a className="flex justify-center" href={result.contentUrl} target="_blank" rel="noreferrer"> 
                            <img loading="lazy" src={result.thumbnailUrl} className={`object-cover sm:border h-auto hover:shadow-lg w-full sm:rounded-lg sm:h-48 sm:w-auto sm:border-white`} alt={result.name} />                                    
                        </a>
                        <a className="group-hover:underline" target="_self" href={result.hostPageUrl}>
                            <p className={`line-clamp-2 px-2 hover:underline pt-2 text-sm font-semibold text-gray-700`}>{result.name}</p>
                        </a>
                    </div>
                </div>
            );
        })}                    
                </div>
                }
                {videos &&
                <div className="mt-8 mx-3 mb-20">
                {lvideos? 
                <div className="flex justify-center">
                    <LoadingIcon/>
                </div> : 
                <>
                {(dataVideos?.value ?? []).map((result, index) => {
                        return (
                            <div className="mx-4 mb-4 pt-3" key={index}>
                                <div className={` rounded-lg bg-black`}>
                                      <div className="flex  px-2 justify-center">
                                        <img src={result.thumbnailUrl} className="mt-6 w-full h-auto" />
                                      </div>
                                    <a target="_self" href={result.contentUrl} rel="noreferrer">
                                        <p className={`line-clamp-2 mb-3 mt-2 sm:mt-1 hover:underline font-semibold px-2 text-sm text-gray-200`}>
                                            {result.name}
                                        </p>
                                    </a>
                                    <a className="" href={result.hostPageUrl}>
                                    <div className=" mx-2">
                                    {result?.creator ? (
  <div translate="no" className="text-sm text-gray-100">
    {result.creator["name"]}{" "}
    {result.publisher.map((result, index) => (
      <a translate="no" className="text-sm text-gray-100">
        {result.name}
      </a>
    ))}
  </div>
) : null}

{result?.viewCount ? (
  <div className="pb-4">
    <a className="text-sm pb-3 text-gray-100"> Visualizaciones: {result.viewCount.toLocaleString()} <a className="text-black">---</a>  {result?.datePublished?.split("T")[0]} </a>
  </div>
) : null}

                                    </div>
                                    </a>
                                </div>
                            </div>
                        );
                    })} 
                </>
                }                   
                </div>
                }
                {news &&
                <div className="mt-8 mx-3 mb-20">
                {lnews? <div className="flex justify-center">
                <LoadingIcon/>
                </div> : 
                <>
                {(dataNews.value || []).map((result, index) => {

const formatDate = (dateString) => {
const date = new Date(dateString);
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);

if (isSameDay(date, today)) {
return 'Hoy';
} else if (isSameDay(date, yesterday)) {
return 'Ayer';
} else {
const diffTime = Math.abs(today - date);
const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
if (diffDays === 1) {
return `${diffDays} dia atrás`;
} else if (diffDays <= 7) {
return `${diffDays} dias atrás`;
} else {
return date.toLocaleDateString(); 
}
}
};


const isSameDay = (date1, date2) => {
return (
date1.getDate() === date2.getDate() &&
date1.getMonth() === date2.getMonth() &&
date1.getFullYear() === date2.getFullYear()
);
};


return (
<>
<div key={index} className="mt-6 mx-4 sm:hidden">
<div className="sm:mb-0">
<div className="flex items-center">
{result.image?.thumbnail?.contentUrl ? (
<img src={result.image?.thumbnail?.contentUrl} alt={result.name} loading="lazy" className=" rounded-lg mr-1 h-auto w-44"/>
) : (
<></>
)}
<span >
<a className="" href={result.url} rel="noreferrer" target="_self">
<p className="text-blue-700 text-lg">{result.name}</p>
</a>
</span>
</div>
<div className="">
<div className="flex items-center text-gray-500 text-base">
<p className={`text-lg font-medium pb-1 text-gray-700`}>{result.provider[0].name}</p>
<span className="mx-2">&#183;</span>
<p className={`text-base font-base text-gray-500`}>{formatDate(result.datePublished.split("T")[0])}</p>
</div>
</div>
</div>
<div>
<p className={`text-base mb-10 py-1 text-gray-600`}>{result.description}</p>
</div>
</div>

</>
);
})} 
                </>
                }                   
                </div>
                }
            </div>
        </div>
      </div>
      <div className="bg-gray-50 w-full fixed bottom-0 z-20 px-4 mt-6 sm:mt-0 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <div className="grid py-4 grid-cols-5 items-center">
                <div className="flex justify-center text-sm items-center cursor-pointer hover:bg-gray-200 p-2 rounded">
                <XIcon onClick={open} className="w-6 text-blue-700"/>
                </div>
                <div onClick={showWeb} className={`flex justify-center text-sm cursor-pointer ${web? "text-blue-700 bg-gray-100" : "text-gray-700 " } p-2 rounded`}>
                    <p className="font-semibold">Web</p>
                </div>
                <div onClick={() => {showImages()}} className={`flex justify-center text-sm cursor-pointer ${images? "text-blue-700 bg-gray-100" : "text-gray-700 " } p-2 rounded`}>
                    <p className="font-semibold">{idioma === "es" ? "Imágenes" : "Images"}</p>
                </div>
                <div onClick={() => {showVideos(); getVideos();}}
                 className={`flex justify-center text-sm cursor-pointer ${videos? "text-blue-700 bg-gray-100" : "text-gray-700 " } p-2 rounded`}>
                    <p className="font-semibold">Videos</p>
                </div>
                <div onClick={()=>{showNews(); getNews();}} 
                className={`flex justify-center text-sm cursor-pointer ${news? "text-blue-700 bg-gray-100" : "text-gray-700 " } p-2 rounded`}>
                    <p className="font-semibold">{idioma === "es" ? "Noticias" : "News"}</p>
                </div>
            </div>
          </div>
    </div>
    
  )}
</div>
)
}

export default Searchresults;