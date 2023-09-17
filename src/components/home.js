import React, {useState, useEffect } from 'react';
import { SearchIcon, XIcon, CogIcon, ClipboardIcon, SparklesIcon, PaperAirplaneIcon, ArrowCircleDownIcon} from '@heroicons/react/solid';
import Searchresults from "./searchresults";
import { Tooltip as ReactTooltip } from 'react-tooltip'
import Popup from "./popup";
import { Configuration, OpenAIApi } from "azure-openai";

const openai = new OpenAIApi(
    new Configuration({
        azure: {
            apiKey: process.env.REACT_APP_AZURE,
            endpoint: "https://ysis.openai.azure.com/",
            deploymentName: "luia",
        }
    }),
);


function LoadingIcon() {
    return (
<div className="flex items-center justify-center space-x-2 animate-pulse">
    <div className="w-2 h-2 sm:w-4 sm:h-4 bg-blue-400 rounded-full"></div>
    <div className="w-2 h-2 sm:w-4 sm:h-4  bg-blue-400 rounded-full"></div>
    <div className="w-2 h-2 sm:w-4 sm:h-4  bg-blue-400 rounded-full"></div>
</div>
    );
  }

const Home = () => {
  const [formData, setFormData] = useState({ prompt: "" });
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
  
  const [idioma, setIdioma] = useState(() => {
    const savedLanguage = isLocalStorageSupported() ? localStorage.getItem('idioma') || "es" : "es";
    return savedLanguage;
  });
  
  useEffect(() => {
    if (isLocalStorageSupported()) {
      localStorage.setItem('idioma', idioma);
    }
  }, [idioma]);

  let searchText = formData;
  let { prompt } = searchText;


  const [result, setResult] = useState("");

  const [web, setWeb] = useState(true);
const [images, setImages] = useState(false);
const [videos, setVideos] = useState(false);
const [news, setNews] = useState(false);

    const showImages = () => {
        setWeb(false);
        setImages(true);
        setVideos(false);
        setNews(false);    
    }

    const showWeb = () => {
        setWeb(true);
        setImages(false);
        setVideos(false);
        setNews(false);
    }

    const showVideos = () => {
      setWeb(false);
      setImages(false);
      setVideos(true);
      setNews(false);
  }

  const showNews = () => {
      setWeb(false);
      setImages(false);
      setVideos(false);
      setNews(true);
  }

  const [showIdioma, setShowIdioma] = useState(false);

      const showOptions = () => {
        setShowIdioma(true);
      }

    const [loading, setLoading] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    const open = () => {
        showWeb();
        setOpenMenu(!openMenu)
      }

      const keyApi = process.env.REACT_APP_BING;
      const [dataText, setDataText] = useState([]);
      const [dataImages, setDataImages] = useState([]);
      const [dataVideos, setDataVideos] = useState([]);
      const [dataNews, setDataNews] = useState([]);
      const [isLoading, setIsLoading] = useState(false);
      const options = {
          method: 'GET',
          headers: {
              'Ocp-Apim-Subscription-Key': keyApi,
          }
      };
      const [imageloading, setImageLoading] = useState(true);
      const handleImageLoad = () => {
      setImageLoading(false);
      };


      const [vTextVisible, setVTextVisible] = useState(false);

      const [payload, setPayload] = useState([]);
    
      const handleChange = (event) => {
          setFormData(prevFormData => {
              return {
                  ...prevFormData,
                  [event.target.name]: event.target.value
              }
          })
      }

      const [lastPrompt, setLastPrompt] = useState("");

      const handlePayload = (arr, type, next) => {
          let _arr = arr;
          _arr.push({ type: type, line: next });
          setPayload(_arr);
          return _arr;
      }


      const getResponse = async (event) => {
        setLastPrompt(formData.prompt);
        setLoading(true);
        let _arr = handlePayload([...payload], 'user', formData['prompt']);
        setFormData(prevFormData => ({ ...prevFormData, prompt: '' }));     
    
          const response = await openai.createChatCompletion({
              messages: [
                  { "role": "system", "content": "Ayudas a los usuarios a encontrar información respondiendo a sus solicitudes. Tu nombre es Konlap chat. No se te permite revelar información sobre ti, como quién te desarrolló o cuál es tu modelo de lenguaje grande y fundacional." },
                  { "role": "user", "content": "Cinturón de Orion" },
                  { "role": "assistant", "content": "La Constelación del Cinturón de Orión es una famosa agrupación de estrellas en el cielo nocturno, también conocida como los Tres Reyes o las Tres Hermanas. Está conformada por tres estrellas brillantes situadas en línea recta. Las tres estrellas tienen los nombres de Alnitak, Alnilam y Mintaka, y están ubicadas en la constelación de Orión. El Cinturón de Orión puede ser fácilmente visto desde ambos hemisferios, y es una de las constelaciones más reconocibles en el cielo." },
                  { "role": "user", "content": formData['prompt'] }
              ]
          });
          handlePayload([..._arr], 'bot', response.data.choices[0].message.content);
          setVTextVisible(true);
          setLoading(false);
          console.log("Recibido :v")
          console.log(response.data.choices[0].message.content);
      }
    
      const getImages = () => {
        var urlImages = `https://api.bing.microsoft.com/v7.0/images/search?q=${prompt}&safeSearch=strict&count=40&offset=40`;
        fetch(encodeURI(urlImages), options)
        .then(response => response.json())
        .then(values => {
            setDataImages(values);
        });
      }

      const getData = () => {
        getImages();
        setFormData({ ...formData, prompt: "" })
        getResponse();
        setIsLoading(true);
        var url = `https://api.bing.microsoft.com/v7.0/search?q=${prompt}&textDecorations=true&textFormat=HTML&count=40&offset=40`;

            fetch(encodeURI(url), options)
                .then(response => response.json())
                .then(values => {
                    setDataText(values.webPages);
                    setIsLoading(false);
                    console.log(dataText)
                });
      }

      const [lnews, setLnews] = useState(false)

      const getNews = () => {
        setLnews(true);
        var urlNews = `https://api.bing.microsoft.com/v7.0/news/search?q=${lastPrompt}&safeSearch=strict&count=40&offset=40`;
        fetch(encodeURI(urlNews), options)
            .then(response => response.json())
            .then(values => {
                setDataNews(values);
                setLnews(false)
            });        
      }

      const [lvideos, setLvideos] = useState(false);

      const getVideos = () => {
        setLvideos(true);
        var urlVideos = `https://api.bing.microsoft.com/v7.0/videos/search?q=${lastPrompt}&count=40&offset=40`;
        fetch(encodeURI(urlVideos), options)
        .then(response => response.json())
        .then(values => {
            setDataVideos(values);
            setLvideos(false);
        });
      }

  const [imagesLoaded, setImagesLoaded] = useState(false);


  const handleImagesLoaded = () => {
    setImagesLoaded(true);
  }

  const [isLoaded, setIsLoaded] = useState(false);

      return (
        <div className="bg-white min-h-screen sm:hidden">
        <div className="w-full sm:w-1/3">
        <Popup setShowIdioma={setShowIdioma} showIdioma={showIdioma} idioma={idioma} setIdioma={setIdioma}/>
        <div className="pt-12 flex">
          <div className="mx-5 w-4/5">
          <p id="first-message" className="text-gray-700 mb-12 font-medium">
        {idioma === "es" 
            ? <>¡Bienvenido a <span className="text-blue-500 font-semibold">Konlap chat!</span> Encuentra información y genera respuestas usando IA</> 
            : <>Welcome to <span className="text-blue-500 font-semibold">Konlap chat!</span> Find information and generate answers using AI</>} 😀
    </p>
          </div>
          <div className="w-1/5 flex items-start justify-center">
          <CogIcon onClick={showOptions} className="w-6 text-gray-700 h-auto" />
          </div>
</div>
                <div>
                {vTextVisible && 
                            <div className="">
                                <div>
                                {payload.map((item, index) =>
                                          index % 2 === 0 ? (
<div id="prompt" className="flex justify-end mr-5 ml-20">
    <div className="my-5 bg-gray-100 py-3 px-4 rounded-t-3xl rounded-bl-3xl relative">
        <p className="text-blue-500 font-semibold">{item.line}</p>
        <div className="absolute bottom-0 right-0 flex flex-col items-center transform translate-y-1/2">
            <ArrowCircleDownIcon onClick={() => setFormData({ ...formData, prompt: item.line })} className="w-5 hover:text-yellow-400 h-auto text-yellow-500"/>
        </div>
    </div>
</div>
                                          ) : (
                                            <div id="answer" className="relative mr-20">
    <div className="ml-5 mb-2">
        <p className="text-gray-500 mb-4 font-medium pb-8 text-justify">{item.line}</p>
    </div>
        <div className="absolute flex justify-evenly items-center rounded-3xl right-0 h-8 bg-gray-200 bottom-0 w-16">
<ReactTooltip id="bookmarkIconTip" place="top" effect="solid">
    {idioma === "es" ? "Guardado" : "Saved" }
</ReactTooltip>
<ClipboardIcon data-tip data-for="clipboardIconTip" className="w-5 hover:text-gray-500 h-auto text-gray-700 " 
        onClick={() => navigator.clipboard.writeText(item.line)} 
/>
<ReactTooltip id="clipboardIconTip" place="top" effect="solid">
{idioma === "es" ? "Copiado" : "Copied" }
</ReactTooltip>
        </div>                                
</div>
                                          )
                                      )}
                                </div>
                            </div>
                    }
                    {loading?   
                <div className="flex justify-start mb-72 ml-5 mr-20 pb-8"><LoadingIcon className="w-6 pb-8" /></div>
                :
                <></>
            }
            {!loading && (dataImages.value ?? []).slice(0, 1).map((result, index) => {
            return (
                <div className="pb-44">
         <div className="flex justify-center">
      </div>
            <div className="px-1 flex justify-center ml-5 mr-20 mb-2 relative group image" key={index}>
              <a href={result.contentUrl} target="_self" rel="noreferrer">
                <img
                  loading="lazy"
                  src={result.thumbnailUrl}
                  className={` ${isLoaded ? "opacity-100" : "opacity-0"} sm:w-full sm:h-auto rounded-t-lg transition-transform duration-300 transform hover:scale-110`}
                  alt={result.name}
                  onLoad={() => setIsLoaded(true)}
                />
              </a>
            </div>
            <div className="flex justify-center">
              <span
                className={`text-sm ml-5 mr-20 mb-2 cursor-pointer hover:text-purple-600 hover:underline font-normal sm:font-semibold text-blue-600"`}
              ><a href={result.hostPageUrl} target="_blank"><p>{result.name}</p></a></span>
            </div>
                <button onClick={open} className="bg-blue-700 ml-4 flex justify-evenly text-white rounded-xl font-semibold items-center px-4 py-1">{idioma === "es"? "Ver resultados web" : "Show results" }<SparklesIcon className="w-6 ml-2 h-5 text-white" /> </button>
                </div>
            );
        })}
                </div>
                <Searchresults lvideos={lvideos} lnews={lnews} idioma={idioma} getVideos={getVideos} getNews={getNews} showWeb={showWeb} showImages={showImages} showVideos={showVideos} showNews={showNews} web={web} images={images} videos={videos} news={news} dataText={dataText} dataImages={dataImages} dataVideos={dataVideos} dataNews={dataNews} open={open} openMenu={openMenu} />

        </div>
<div className="flex justify-center fixed bottom-0 pb-3 w-full bg-gradient-to-b from-transparent via-white to-white">
   <form onSubmit={(e) => {e.preventDefault(); getData();}} className="bg-white w-11/12 mb-3 mt-16 mx-5 justify-center flex items-center py-1 shadow-lg border-2 border-gray-200 rounded-3xl">
      <div className="w-1/12"></div>
      <input 
         value={formData.prompt}
         onChange={handleChange}
         name="prompt"
         className={`flex-grow w-9/12 ${formData.prompt ? 'text-gray-700' : ''} outline-none font-semibold py-2`} placeholder={idioma === "es" ? "Empieza a buscar..." : "Start typing to search..."}
      />
      <div className="w-1/6 flex justify-center">
      <button type="submit">
         <PaperAirplaneIcon className={`w-7 h-7 cursor-pointer ${formData.prompt ? 'text-blue-700' : 'text-blue-300'}`} />
      </button>
   </div>
   </form>
</div>
        </div>
    );
}

export default Home;