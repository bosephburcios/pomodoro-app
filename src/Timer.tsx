import React, { useState, useEffect } from 'react';
import audioFile from './sounds/alarm.mp3';
import song1 from './sounds/sonny.mp3';
import song2 from '.sounds/Autumn Leaves.mp3';
import song3 from './sounds/My Foolish Heart.mp3';
import song4 from './sounds/Body & Soul.mp3';
import song5 from './sounds/All The Things You Are.mp3';
import song6 from './sounds/if i am with you.mp3';

// array of songs that play during timer
const songs = [song1, song2, song3, song4, song5, song6];

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

    // Sets up the timer and checks to see if cycles have been completed.
    // Also checks to see if work time is done to switch to break and then back.
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
                        audio.play(); // timer beep when it hits 0
                    } 
                    return prevTime - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timerInterval);
    }, [isRunning, isWorkPhase, cyclesCompleted]);

    // once cycles have been completed, stop the timer
    useEffect(() => {
        if (cyclesCompleted === 8) {
            setIsRunning(false);
        }
    }, [cyclesCompleted]);

    // Once a song within the array has finished switch to the next song with delay in between.
    // Also once we reach end of the array, go back to the beginning of the array
    const handleSongEnd = () => {
        setTimeout(() => {
            const nextIndex = (currentSongIndex + 1) % songs.length;
            setCurrentSongIndex(nextIndex);
            const nextMusic = new Audio(songs[nextIndex]);
            setMusic(nextMusic);
            nextMusic.play();
        }, 1500); // 1500 milliseconds
    };
    
    // Method to call when song ends.
    useEffect(() => {
        music.addEventListener('ended', handleSongEnd);
        return () => {
            music.removeEventListener('ended', handleSongEnd);
        };
    }, [music, currentSongIndex]);

    // Adds functionality to buttons for the music and to stop timer.
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

    // Once user presses to restart, set everything to the default
    const resetTimer = () => {
        setTime(initialWorkTime);
        setIsRunning(false);
        setCyclesCompleted(0);
        setIsWorkPhase(true);
        setCurrentSongIndex(0);
        setMusic(new Audio(songs[0]));
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

// helper method to set up time in timer.
const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export default Timer;