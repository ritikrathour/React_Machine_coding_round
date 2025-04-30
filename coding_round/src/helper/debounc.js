const Debounce = (func, delay = 500) => {
    let timerId;
    return (...args) => { 
        clearInterval(timerId)
        timerId = setTimeout(() => {
            func(...args)
        }, [delay])
    }
}
export default Debounce;