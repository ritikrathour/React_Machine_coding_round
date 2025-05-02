import { useEffect, useRef, useState } from "react"
import Suggetion from "./comp/Suggetion"; 
import OTP_input from "./comp/OtpInput";
import ChipsInput from "./comp/ChipsInput";

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestionData, setSuggestionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuggetion, setShowSuggetion] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null);
  const useDebounce = (value, delay = 300) => {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
      const timer = setTimeout(() => {
        setDebounced(value)
      }, delay);
      return () => clearTimeout(timer);
    }, [value, delay])
    return debounced
  }
  const useClickOutSide = (ref, callback) => {
    useEffect(() => {
      const handler = (e) => {
        if (ref.current && !ref.current.contains(e.target)) {
          callback();
        }
      }
      document.addEventListener("mousedown", handler);
      return () => removeEventListener("mousedown", handler)
    }, [ref, callback])
  }
  const handleSelect = (value) => {
    setSearchQuery(value);
    setShowSuggetion(false)
  } 
  
  const [cache, setCache] = useState(new Map());
  const debouncedValue = useDebounce(searchQuery);
  useClickOutSide(containerRef, () => setShowSuggetion(false))
  const searchHandleChange = (e) => {
    setSearchQuery(e.target.value)
    setShowSuggetion(true)
    setActiveIndex(-1)
  }
  useEffect(() => {
    const callApi = async (searchQ) => { 
      try { 
        if (cache.has(searchQ)) {
          setSuggestionData(cache.get(searchQ));
          return
        }
        setLoading(true)
        const res = await fetch(`http://localhost:9000/api/v1/search_user?q=${searchQ || ""}`); //Please use your api for users
        const json = await res.json();
        let newCache = new Map(cache);
        if (newCache.size >= 15) {
          const oldestKey = newCache.keys().next().value;
          newCache.delete(oldestKey);
        }
        newCache.set(searchQ, json?.data);
        setCache(newCache)
        setSuggestionData(json?.data);
        setError(null)
      } catch (error) {
        console.log(error);
        setError(error)
      } finally {
        setLoading(false)
      }
    }
    callApi(debouncedValue)
  }, [debouncedValue]);

  const handelKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setActiveIndex((prev) => (prev + 1) % suggestionData?.length)
    } else if (e.key === "ArrowUp") {
      setActiveIndex((prev) => (prev - 1 + suggestionData?.length) % suggestionData?.length)
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSelect(suggestionData[activeIndex]?.userName)
    } else if (e.key === "Escape") {
      setShowSuggetion(false);
    }
  }
  const highLightMatch = (text, query) => {  
    const idx = text?.toLowerCase() && text?.toLowerCase().indexOf(query?.toLowerCase());
    if (idx === -1) { 
      return text
    };  
    return (
      <>
        {text.substring(0, idx)}
        <span className="font-semibold bg-yellow-200">
          {text.substring(idx, idx + query.length)}
        </span>
        {text.substring(idx + query.length)}
      </>
    )
  }
  return (
    <>
    <div className="h-[200vh]">
      <div className="mt-10 flex justify-center flex-col items-center">
        <div className="w-[400px]">
          <h1 className="text-center font-bold text-[25px]">AutoComplete</h1>
          {/* search field  */}
          <div>
            <div className="flex justify-center items-center border-2  mt-10 p-2 rounded-md ">
              <div className="w-full">
                <form>
                  <input
                    onChange={(e) => searchHandleChange(e)}
                    onFocus={() => {
                      suggestionData?.length > 0 && setShowSuggetion(true)
                    }}
                    className="w-full border-none outline-none"
                    value={searchQuery || ""}
                    type="search"
                    onKeyDown={(e) => handelKeyDown(e)}
                    placeholder="Search Something" />
                </form>
              </div>
            </div>
            {/* suggestion List*/}
            {
              error && <h3 className="text-center text-red-600">{error.message}</h3>
            }
            <div className="w-full" ref={containerRef}>
              {
                showSuggetion &&
                (
                  loading ? <span className="text-center block">
                    <i className="fas fa-spinner fa-spin"></i> loading...</span> :
                    suggestionData?.length > 0 ?
                      <ul className="border p-2 max-h-[200px] overflow-auto">
                        {
                          suggestionData?.map((item, index) => {
                            return (
                              <Suggetion searchQuery={searchQuery} highLightMatch={highLightMatch} index={index} activeIndex={activeIndex} handleSelect={handleSelect} key={item?._id} data={item} />
                            )
                          })
                        }
                      </ul>
                      : <h3 className="capitalize text-center text-[14px]">No Data Found With your query!</h3>
                )
              }
            </div>
          </div>
        </div>
      </div >
      <div className="mt-64 flex justify-center">
        <OTP_input/>
      </div>
      <div className="mt-28 flex justify-center">
        <ChipsInput/>
      </div>
      </div>
    </>
  )
}

export default App