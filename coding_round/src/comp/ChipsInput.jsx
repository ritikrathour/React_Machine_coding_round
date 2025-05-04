import { useState } from "react";

const ChipsInput = () => {
    const [chips, setChips] = useState([]);
    const [input, setInput] = useState("");
    const handleChange = (value) => {
        setInput(value)
    }

    const handleKeyDown = (event) => {
        if (event.key === "Enter" && input?.trim() !== "" && input?.trim()?.length >= 3) {
            setInput("")
            setChips((prev) => {
                return [...prev, { value: input }]
            })
        }
    }
    const handleDeletChip = (index) => {
        // let filterdChips = chips.filter((value) => value.index !== index)
        const newArr = [...chips];
        newArr.splice(index, 1)
        setChips(newArr)
    }
    return (
        <>
            <div className="border-2 w-[500px] flex flex-col justify-center items-center pb-4 rounded-md">
                <h2 className="text-center text-2xl font-semibold mb-4">Chips Input</h2>
                <input className="h-[40px] w-[300px] p-1 outline-none border rounded-md border-black"
                    type="text"
                    onChange={(e) => handleChange(e.target.value)}
                    value={input}
                    onKeyDown={(e) => handleKeyDown(e)}
                    placeholder="Type a chip and press Enter" />
                <ul className="flex mt-2 gap-2 justify-center items-center flex-wrap">
                    {
                        chips?.length < 1 ? <p className="text-[12px]">You don't have any chips right now!</p> :
                            chips?.map((chip, index) => {
                                return <li key={index} className="capitalize bg-gray-300 px-3 flex items-center gap-2 py-1 rounded-full">
                                    {chip.value} <span onClick={() => handleDeletChip(index)} className="h-[20px] text-[12px] leading-[20px] w-[20px] bg-red-700 inline-block rounded-full text-center text-white cursor-pointer">X</span>
                                </li>
                            })
                    }

                </ul>
            </div>
        </>
    )
}
export default ChipsInput;