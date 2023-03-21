function App() {

    const [displayTime, setDisplayTime] = React.useState(25 * 60)
    const [breakTime, setBreakTime] = React.useState(5 * 60)
    const [sessionTime, setSessionTime] = React.useState(25 * 60)
    const [timeOn, setTimeOn] = React.useState(false)
    const [onBreak, setOnBreak] = React.useState(false)
    const [breakAudio, setBreakAudio] = React.useState(new Audio('./sound/alert.mp3'))

    const playBreakSound = () => {
        breakAudio.currentTime = 0;
        breakAudio.play()
    }

    const formatTime = (time) => {
        let minutes = Math.floor(time / 60)
        let seconds = time % 60
        return (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds)
    }

    const changeTime = (amount, type) => {
        if (type == 'break') {
            if (breakTime <= 60 && amount < 0 || breakTime >= 3600) {
                return
            }
            setBreakTime(prev => prev + amount)
        } else {
            if (sessionTime <= 60 && amount < 0 || sessionTime >= 3600) {
                return
            }
            setSessionTime(prev => prev + amount)
            if (!timeOn) {
                setDisplayTime(sessionTime + amount)
            }
        }
    }

    const controlTime = () => {
        let second = 1000;
        let date = new Date().getTime();
        let nextDate = new Date().getTime() + second
        let onBreakVariable = onBreak
        if (!timeOn) {
            let interval = setInterval(() => {
                date = new Date().getTime()
                if (date > nextDate) {
                    setDisplayTime((prev) => {
                        if (prev <= 0 && !onBreakVariable) {
                            playBreakSound()
                            onBreakVariable = true
                            setOnBreak(true)
                            return breakTime
                        } else if (prev <= 0 && onBreakVariable) {
                            playBreakSound()
                            onBreakVariable = false
                            setOnBreak(false)
                            return sessionTime
                        }
                        return prev - 1
                    })
                    nextDate += second
                }

            }, 30)
            localStorage.clear()
            localStorage.setItem('interval-id', interval)
        }
        if (timeOn) {
            clearInterval(localStorage.getItem('interval-id'))
        }
        setTimeOn(!timeOn)
    }



    const resetTime = () => {
        setDisplayTime(25 * 60)
        setBreakTime(5 * 60)
        setSessionTime(25 * 60)
    }

    return (
        <div className="main">
            <div className="header">
                <img src="./photos/tomato.png" id="photo"></img>
                <h1>Pomodoro Timer</h1>
            </div>
            <div className="dual-container">
                <Length title={'Session Length'} changeTime={changeTime} type={'session'} time={sessionTime} formatTime={formatTime} />
                <div></div>
                <Length title={'Break Length'} changeTime={changeTime} type={'break'} time={breakTime} formatTime={formatTime} />
            </div>
            <div className="displayer">
                <h3>{onBreak ? "Break" : "Session"}</h3>
                <h1>{formatTime(displayTime)}</h1>
            </div>
            <div id="btns">
                <button className="btnpads btnsOnce" onClick={controlTime}>
                    {timeOn ? <i className="bi bi-pause-fill"></i> : <i className="bi bi-play-fill"></i>}
                </button>

                <button className="btnpads btnsOnce" onClick={resetTime}>
                    <i className="bi bi-arrow-clockwise"></i>
                </button>
            </div>
        </div>

    )
}

function Length({ title, changeTime, type, time, formatTime }) {
    return (
        <div>
            <h3>{title}</h3>
            <div className="time-sets">
                <button className="btnpads"
                    onClick={() => changeTime(-60, type)}>
                    <i className="bi bi-arrow-down"></i>
                </button>
                <h3>{formatTime(time)}</h3>
                <button className="btnpads"
                    onClick={() => changeTime(60, type)}>
                    <i className="bi bi-arrow-up"></i>
                </button>
            </div>
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById("root"))