import { useState } from "react";
import data from "../public/Data.json"
const FileFolderExplorer = () => {
    const [listOfData, setListOfData] = useState(data) 
    // handleAddNode
    const handleAddNode = (data, parentId) => {
        if (data?.inputValue && data?.inputValue?.trim() !== "") {
            const updateTree = (list) => {
                return list.map((node) => {
                    if (node?.id === parentId) {
                        return {
                            ...node,
                            children: [
                                ...node.children,
                                {
                                    id: Date.now().toString(),
                                    name: data?.inputValue,
                                    isFolder: data?.inputCheck,
                                    children: data?.inputCheck ? [] : null
                                }
                            ]
                        }
                    }
                    if (node?.children) {
                        return {
                            ...node, children: updateTree(node?.children)
                        }
                    }
                    return node;
                })
            }
            setListOfData(prev => updateTree(prev))
        }
    }
    return (
        <>
            <div className="border-2 w-[500px] flex flex-col pb-4 rounded-md p-3 select-none">
                <h2 className="text-center text-2xl font-semibold mb-4">File/Folder Explorer!</h2>
                <ul className="">
                    <FileFolder List={listOfData}
                        handleAddNode={handleAddNode} />
                </ul>
            </div>
        </>
    )
}
export default FileFolderExplorer;

const FileFolder = ({ List, handleAddNode }) => {
    const [isCollapse, setIsCollapse] = useState({});
    const [showInputField, setShowInputField] = useState({});

    const handleCollapseList = (list) => {
        if (list?.isFolder) {
            setIsCollapse(
                prev => ({ ...prev, [list?.name]: !prev[list?.name] })
            )
        }
    }
    // handleShowAddFolderInput
    const handleShowAddFolderInput = (id) => { 
        setShowInputField((prev) => {
            return { ...prev, [id]: true }
        })
    }
    // handleHideInput
    const handleHideInput = (id) => {
        setShowInputField((prev) => {
            return { ...prev, [id]: false }
        })
    }
    return (
        <>
            {
                List?.map((list) => {
                    return <div key={list?.id} className="cursor-pointer pl-6 main">
                        <div onClick={(e) => handleCollapseList(list)} className="flex gap-2 items-center hover:bg-gray-200 w-[200px] rounded-md px-2 transition-all">
                            {list?.isFolder ? <span className="text-[12px]">{isCollapse ? "➡️" : "⬇️"}</span> : <span className="text-[12px]">🗃️</span>}
                            <li className="text-left ">
                                {list?.name}
                            </li>
                            {list?.isFolder && <div className="actionable flex items-center gap-1 opacity-0">
                                <button className="text-[12px]" onClick={(e) => handleShowAddFolderInput(list?.id)}>📂</button>
                                <button className="text-[12px]">🗑️</button>
                            </div>}
                        </div>
                        {
                            showInputField?.[list?.id] &&
                            <InputForFileAndFolder
                                handleHideInput={handleHideInput}
                                list={list}
                                handleAddNode={handleAddNode}
                                setShowInputField={setShowInputField}
                            />
                        }
                        {isCollapse?.[list?.name] && list?.children && <FileFolder List={list?.children} handleAddNode={handleAddNode} />}
                    </div>
                })
            }
        </>
    )
};
const InputForFileAndFolder = ({ handleHideInput, list, handleAddNode, setShowInputField }) => {
    const [inputValue, setInputValue] = useState("");
    const [inputCheck, setInputCheck] = useState(false);
    const handleChange = (e) => {
        setInputValue(e.target.value)
    }
    const handleCheckChange = (e) => {
        setInputCheck(e.target.checked)
    }
    const handleKeyDown = (e)=>{ 
        if(e.key === "Enter"){ 
            if(inputValue.trim() !== ""){
                handleAddNode({ inputValue, inputCheck }, list?.id)
                setShowInputField(null)
            }
        }
    }
    return (
        <>
            <div className="flex items-center gap-2 my-1 ml-10">
                <input  onKeyDown={(e)=>handleKeyDown(e)} placeholder="File or Folder!" name="fileName" onChange={handleChange} value={inputValue} type="text" className="h-[25px] w-[120px] text-[12px] p-1 outline-none border rounded-md border-black" />
                <label htmlFor="file" className="flex gap-1 items-center">
                    <span>Folder</span>
                    <input className="w-[15px] h-[15px]" type="checkbox" value={inputCheck} onChange={handleCheckChange} name="type" id="file" />
                </label>
                <button className="bg-green-600 text-[12px] py-1 px-2 rounded-md text-white"
                    onClick={() => (handleAddNode({ inputValue, inputCheck }, list?.id), setShowInputField(null))}>Go</button>
                <button className="bg-red-500 text-white py-1 px-2 rounded-md text-[12px]" onClick={() => handleHideInput(list?.id)}>Cancel</button>
            </div>
        </>
    )
}