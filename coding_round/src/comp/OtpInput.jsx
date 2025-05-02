import { useEffect, useRef, useState } from "react";

const OTP_input = () => {
    const OTP_NUM_COUNT = 4;
    const otp_input_ref = useRef([]);
    const [inputArr, setInputArr] = useState(new Array(OTP_NUM_COUNT).fill(""));
    const [inputType, setInputType] = useState(new Array(OTP_NUM_COUNT).fill("text"));
    useEffect(() => {
        otp_input_ref.current[0]?.focus()
    }, [])
    const handleChange = (val, index) => {
        if (isNaN(val)) return;
        const newValue = val.trim();
        setInputArr((prev) => {
            const newArr = [...prev]
            newArr[index] = newValue.slice(-1)
            return newArr
        })
        newValue && otp_input_ref.current[index + 1]?.focus();
        // change input type 

        const newInputType = [...inputType]
        newInputType[index] = "text";
        setInputType(newInputType);

        if (newValue) {
            setTimeout(() => {
                setInputType((prev => {
                    const copy = [...prev];
                    copy[index] = "password"
                    return copy;
                }))
            }, 500)
        }
    }
    const handleKeyDown = (e, index) => {
        if (!e.target.value && e.key === "Backspace") {
            otp_input_ref.current[index - 1]?.focus();
        }
    };
    return (
        <>
        <div>
            <h2 className="text-center text-2xl font-semibold mb-4">OTP Input</h2>        
            <div className="flex gap-4">
                {
                    inputArr?.map((otp, index) => {
                        return <input
                            value={otp}
                            className="border border-black w-[40px] h-[40px] rounded-md text-center text-[25px]"
                            key={index}
                            type={inputType[index]}
                            ref={(val) => otp_input_ref.current[index] = val}
                            onChange={(e) => handleChange(e.target.value, index)}
                            maxLength={1}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                        />
                    })
                }
            </div>
            </div>
        </>
    )
}
export default OTP_input;