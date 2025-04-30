import { useEffect, useRef, useState } from "react";

const OTP_input = () => {
    const OTP_NUM_COUNT = 4;
    const otp_input_ref = useRef([]);
    const [inputArr, setInputArr] = useState(new Array(OTP_NUM_COUNT).fill(""))
    useEffect(() => {
        otp_input_ref.current[0]?.focus()
    }, [])   
    const handleChange = (val, index) => {
        if (isNaN(val)) return;
        const newValue = val.trim();
        const newArr = [...inputArr];         
        newArr[index] = newValue.slice(-1);
        setInputArr(newArr)
        newValue && otp_input_ref.current[index + 1]?.focus()
    }
    const handleKeyDown = (e, index) => { 
        if(!e.target.value && e.key === "Backspace") { 
            otp_input_ref.current[index - 1]?.focus()
        }
    }
    return (
        <>
            <div className="flex gap-4">
                {
                    inputArr?.map((otp, index) => {
                        return <input
                            value={otp}
                            className="border border-black w-[40px] h-[40px] rounded-md text-center text-[25px]"
                            key={index}
                            type="text"
                            ref={(val) => otp_input_ref.current[index] = val}
                            onChange={(e) => handleChange(e.target.value, index)}
                            maxLength={1}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                        />
                    })
                }
            </div>
        </>
    )
}
export default OTP_input;