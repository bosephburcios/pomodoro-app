import React, { useState, useEffect } from 'react';
import audioFile from './sounds/beep.mp3';
import audioMusic from './sounds/lofi.mp3';

const Timer = () => {
    const intitialWorkTime = 1500; // 25 minutes
    const initialBreakTime = 300; // 5 minutes

    const [time, setTime] = useState(intitialWorkTime);
    const [isRunning, setIsRunning] = useState(false);
    const [cyclesCompleted, setCyclesCompleted] = useState(0);
    const [isWorkPhase, setIsWorkPhase] = useState(true); 
    const [count, setCount] = useState(0);

    const audio = new Audio(audioFile);
    const music = new Audio(audioMusic);

    useEffect(() => {
        let timerInterval: NodeJS.Timeout;

        if (isRunning) {
            timerInterval = setInterval(() => {
                setTime(prevTime => {
                    if (prevTime <= 0) {
                        if (isWorkPhase) {
                            setTime(initialBreakTime);
                            setIsWorkPhase(false);
                        } else {
                            setTime(intitialWorkTime);
                            setIsWorkPhase(true);
                            setCyclesCompleted(prevCycles => prevCycles + 1);
                        }
                        audio.play();
                        music.pause();
                    } 
                    return prevTime - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timerInterval);
    }, [isRunning, isWorkPhase, cyclesCompleted]);

    useEffect(() => {
        if (cyclesCompleted === 8) {
            setIsRunning(false);
        }
    }, [cyclesCompleted]);

    const toggleTimer = () => {
        setIsRunning(!isRunning);

        if (count === 0) {
            setCount(1);
            music.play();
        } else {
            setCount(0);
            music.pause();
        }
    };

    const resetTimer = () => {
        setTime(intitialWorkTime);
        setIsRunning(false);
        setCyclesCompleted(0);
        setIsWorkPhase(true);
        music.pause();
        setCount(0);
    };

    return (
        <div className="timer">
            <div className="time">
                {formatTime(time)}
            </div>
            <div className="controls">
                <button onClick={toggleTimer}>{isRunning ? 'Pause' : 'Start'}</button>
                <button onClick={resetTimer}>Reset</button>
            </div>
        </div>
    );
};

const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export default Timer;