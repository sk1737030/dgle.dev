import React, {useEffect, useRef} from 'react';

function Comment() {
    // const {isDarkTheme} = useThemeContext();
    // const utterancesTheme = isDarkTheme ? 'github-dark' : 'github-light';

    const containerRef = useRef(null);
    useEffect(() => {
        const createUtterancesEl = () => {
            const script = document.createElement('script');
            script.src = 'https://utteranc.es/client.js';
            script.setAttribute('repo', 'sk1737030/dgle.dev');
            script.setAttribute('issue-term', 'title');
            script.setAttribute('label', 'comment');
            // script.setAttribute('theme', utterancesTheme);
            script.crossOrigin = 'anonymous';
            script.async = true;
            containerRef.current.appendChild(script);
        };
        const postThemeMessage = () => {
            const message = {
                type: 'set-theme',
                theme: utterancesTheme,
            };
            utterancesEl.contentWindow.postMessage(message, 'https://utteranc.es');
        };

        createUtterancesEl();
    }, [/*utterancesEl*/]);
    return <div ref={containerRef}/>;
}

export default Comment;
