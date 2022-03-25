import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';
import './Metronome.scss';


const osc = new Tone.Oscillator().toDestination();
let clickHistory = []



const Metronome = () => {
    const [bpm, setBpm] = useState(122);
    const [playing, setPlaying] = useState(false);
    let prevClick = 0

    useEffect(() => {
        if (playing) {
            Tone.start();
            Tone.Transport.bpm.value = bpm;
            Tone.Transport.stop().start();
            Tone.Transport.scheduleRepeat((time) => {
                osc.start(time).stop(time + 0.1);
            }, "4n");
            Tone.Transport.stop().start();
        } else {
            Tone.Transport.stop();
        }
    }, [playing, bpm]);

    return (
        <div className="d-flex flex-column metronome-container">
            <h2 className="tempo-display">{`${bpm}bpm`}</h2>
            <button className="tap-tempo-button" onClick={() => {
                if (clickHistory.length > 3) clickHistory.splice(0, 1)
                prevClick = new Date().getTime()
                clickHistory.push(prevClick)
                if (clickHistory.length === 4) {
                    let firstClickTime = clickHistory[1] - clickHistory[0];
                    let secondClickTime = clickHistory[2] - clickHistory[1];
                    let thirdClickTime = clickHistory[3] - clickHistory[2];
                    let averageClickTime = (firstClickTime + secondClickTime + thirdClickTime) / 4
                    clickHistory = []
                        setBpm(Math.round(60000/averageClickTime))
                }
            }}>{`Tap Tempo`}</button>
            <div className="controls-container">
                <button className="play-button" onClick={() => { setPlaying(!playing) }}>
                    {playing ? 'stop' : 'start'}
                </button>
            </div>
        </div>
    );
};

export default Metronome;
