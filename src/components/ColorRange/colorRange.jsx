import React from "react";
import {Col} from 'react-bootstrap';

function ColorRange(props){
    const min = props.min ?? 0;
    const max = (props.max+24) ?? 360;

    function hsv2rgb(h,s,v) 
    {    
        h = h % 360;
        h =  h > 0 ? h : h + 360;
        let f= (n,k=(n+h/60)%6) => v - v*s*Math.max( Math.min(k,4-k,1), 0);     
        let r = (Math.round(f(5)*255)).toString(16);
        let g = (Math.round(f(3)*255)).toString(16);
        let b = (Math.round(f(1)*255)).toString(16);
        r = r.length === 2 ? r : "0" + r; 
        b = b.length === 2 ? b : "0" + b; 
        g = g.length === 2 ? g : "0" + g; 
        return `#${r}${g}${b}`;
    }


    const resolution = 16;
    /*idk if this one works
    const size = max - min;
    const hueColors = Array(resolution).fill().map((_,i) => hsv2rgb((((i)/(resolution-1))*size)+ min - (size * .5), 1, 1) );
    */
    const hueColors = Array(resolution).fill().map((_,i) => hsv2rgb((((i)/(resolution))*(max)) + min , 1, 1) );
    const bgimg = `linear-gradient(to right, ${hueColors.join(",")})`;

    return <Col
            style={{backgroundImage : bgimg, minHeight:60, margin: 10}}
            colors={hueColors}
          ></Col>
}

export default ColorRange;