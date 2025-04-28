 

const Suggetion = ({data,handleSelect,activeIndex,index,highLightMatch,searchQuery})=>{   
    return (
         <li 
         onClick={()=>handleSelect(data?.userName)} 
         className={` ${activeIndex === index ? "bg-slate-200" :""} w-full p-1 hover:bg-slate-200 cursor-pointer text-black capitalize `}
         >{highLightMatch(data?.userName,searchQuery)}</li>
    )
}
export default Suggetion;