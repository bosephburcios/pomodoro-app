import React, { useState, useEffect } from 'react';
import audioFile from './sounds/alarm.mp3';
import song1 from './sounds/sonny.mp3';
import song2 from './sounds/body-and-soul.mp3';
import song3 from './sounds/lofi.mp3';

const songs = [song1, song2, song3];

const Timer: React.FC = () => {
    const initialWorkTime = 1500; // 25 minutes
    const initialBreakTime = 300; // 5 minutes

    const [time, setTime] = useState(initialWorkTime);
    const [isRunning, setIsRunning] = useState(false);
    const [cyclesCompleted, setCyclesCompleted] = useState(0);
    const [isWorkPhase, setIsWorkPhase] = useState(true); 
    const [currentSongIndex, setCurrentSongIndex] = useState(0);

    const audio = new Audio(audioFile);
    const [music, setMusic] = useState(new Audio(songs[currentSongIndex]));

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
                            setTime(initialWorkTime);
                            setIsWorkPhase(true);
                            setCyclesCompleted(prevCycles => prevCycles + 1);
                            setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
                        }
                        audio.play();
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

    const handleSongEnd = () => {
        const nextIndex = (currentSongIndex + 1) % songs.length;
        setCurrentSongIndex(nextIndex);
        setMusic(new Audio(songs[nextIndex]));
        music.play();
    };

    const toggleTimer = () => {
        if (!isRunning) {
            if (music.paused) {
                // If the music is paused, resume from the current position
                music.play();
            } else {
                // If the music is not paused, start from the beginning
                const musicToPlay = new Audio(songs[currentSongIndex]);
                musicToPlay.addEventListener('ended', handleSongEnd);
                setMusic(musicToPlay);
                musicToPlay.currentTime = music.currentTime; // Set current time to resume from where it left off
                musicToPlay.play();
            }
            setIsRunning(true);
        } else {
            music.pause();
            setIsRunning(false);
        }
    };

    const resetTimer = () => {
        setTime(initialWorkTime);
        setIsRunning(false);
        setCyclesCompleted(0);
        setIsWorkPhase(true);
        setCurrentSongIndex(0);
        music.pause();
        music.currentTime = 0;
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