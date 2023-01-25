import React from 'react';
import Tilt from 'react-parallax-tilt';
import brain from './brain.png'
import './Logo.css'

const Logo = () => {
    return(
        <div className='na4 mt4'>
            <Tilt  className="parallax-effect-img" tiltMaxAngleX={20} tiltMaxAngleY={0.2} perspective={1000} transitionSpeed={1500} scale={1} gyroscope={false} style={{marginLeft: '90px'}}>
            <div className='Tilt br2 ' style={{ width:'100px',height: '100px', backgroundColor: 'transparent' }}>
                <div className='Tilt0inner pa3'><img style={{paddingTop: '5px'}}alt='brain logo' src={brain} /></div>
            </div>
            </Tilt>
        </div>
    )
}

export default Logo