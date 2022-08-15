import React,{ useState,useCallback } from 'react';
import { Button } from 'antd';

import "./style.scss"

export default function Details(){




    const [clickCount, increaseCount] = useState(0);

    // 使用`useCallback`，但也每次渲染都会重新创建内部函数作为`useCallback`的实参
    const handleClick = useCallback(() => {
        console.log('handleClick');
        increaseCount(clickCount + 1);
         // eslint-disable-next-line
    },[])
    return (
        <div>
            <p>{clickCount}</p>
            <Button onClick={handleClick}>Click</Button>
        </div>
    )
}