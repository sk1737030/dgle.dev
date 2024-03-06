"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[4852],{3905:(e,t,r)=>{r.d(t,{Zo:()=>p,kt:()=>m});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var u=n.createContext({}),c=function(e){var t=n.useContext(u),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},p=function(e){var t=c(e.components);return n.createElement(u.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},f=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,u=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),f=c(r),m=a,g=f["".concat(u,".").concat(m)]||f[m]||s[m]||o;return r?n.createElement(g,i(i({ref:t},p),{},{components:r})):n.createElement(g,i({ref:t},p))}));function m(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,i=new Array(o);i[0]=f;var l={};for(var u in t)hasOwnProperty.call(t,u)&&(l[u]=t[u]);l.originalType=e,l.mdxType="string"==typeof e?e:a,i[1]=l;for(var c=2;c<o;c++)i[c]=r[c];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}f.displayName="MDXCreateElement"},1935:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>u,contentTitle:()=>i,default:()=>s,frontMatter:()=>o,metadata:()=>l,toc:()=>c});var n=r(7462),a=(r(7294),r(3905));const o={title:"Spring Kafka Graceful Shutdown",description:"Spring kafka\ub294 Graceful shutdown\ud558\uac8c \uc798 \uc8fd\uc744\uae4c?",slug:"kafkashutodwn",authors:"dongle",tags:["SpringBoot","Kafka","Graceful","Shutdown"],image:"https://i.imgur.com/mErPwqL.png",hide_table_of_contents:!1},i=void 0,l={permalink:"/kafkashutodwn",source:"@site/blog/2022-06-20-spring-kafka-graceful-shutdown.md",title:"Spring Kafka Graceful Shutdown",description:"Spring kafka\ub294 Graceful shutdown\ud558\uac8c \uc798 \uc8fd\uc744\uae4c?",date:"2022-06-20T00:00:00.000Z",formattedDate:"June 20, 2022",tags:[{label:"SpringBoot",permalink:"/tags/spring-boot"},{label:"Kafka",permalink:"/tags/kafka"},{label:"Graceful",permalink:"/tags/graceful"},{label:"Shutdown",permalink:"/tags/shutdown"}],readingTime:5.815,hasTruncateMarker:!0,authors:[{name:"Dongle",title:"Junior Backend Developer",url:"https://github.com/sk1737030",imageURL:"https://github.com/sk1737030.png",key:"dongle"}],frontMatter:{title:"Spring Kafka Graceful Shutdown",description:"Spring kafka\ub294 Graceful shutdown\ud558\uac8c \uc798 \uc8fd\uc744\uae4c?",slug:"kafkashutodwn",authors:"dongle",tags:["SpringBoot","Kafka","Graceful","Shutdown"],image:"https://i.imgur.com/mErPwqL.png",hide_table_of_contents:!1},prevItem:{title:"\ub9cc\ub4e4\uba74\uc11c \ubc30\uc6b0\ub294 \ud074\ub9b0 \uc544\ud0a4\ud14d\ucc98 \uc815\ub9ac - 1",permalink:"/clean-arch-1"},nextItem:{title:"\ub0b4\uac00 \uacaa\uc740 N + 1 \ubb38\uc81c",permalink:"/my_n+1"}},u={authorsImageUrls:[void 0]},c=[],p={toc:c};function s(e){let{components:t,...r}=e;return(0,a.kt)("wrapper",(0,n.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Consumer\uac00 \uba54\uc138\uc9c0\ub97c \ucc98\ub9ac\uc911\uc5d0 Spring Boot \uc5b4\ud50c\ub9ac\ucf00\uc774\uc158\uc5d0\uc11c shutdown event\uac00 \uc77c\uc5b4 \ub0ac\uc744 \ub54c \uacfc\uc5f0 \uc798 Shutdown Graceful\ud558\uac8c  \uc885\ub8cc\uac00 \ub418\ub294\uc9c0\uac00 \uad81\uae08\ud574\uc11c \ud574\ubcf4\ub294 \uc2e4\ud5d8."))}s.isMDXComponent=!0}}]);