"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[7775],{3905:function(e,t,r){r.d(t,{Zo:function(){return p},kt:function(){return m}});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function u(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var l=n.createContext({}),c=function(e){var t=n.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},p=function(e){var t=c(e.components);return n.createElement(l.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},g=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,p=u(e,["components","mdxType","originalType","parentName"]),g=c(r),m=a,f=g["".concat(l,".").concat(m)]||g[m]||s[m]||o;return r?n.createElement(f,i(i({ref:t},p),{},{components:r})):n.createElement(f,i({ref:t},p))}));function m(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,i=new Array(o);i[0]=g;var u={};for(var l in t)hasOwnProperty.call(t,l)&&(u[l]=t[l]);u.originalType=e,u.mdxType="string"==typeof e?e:a,i[1]=u;for(var c=2;c<o;c++)i[c]=r[c];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}g.displayName="MDXCreateElement"},7786:function(e,t,r){r.r(t),r.d(t,{assets:function(){return p},contentTitle:function(){return l},default:function(){return m},frontMatter:function(){return u},metadata:function(){return c},toc:function(){return s}});var n=r(7462),a=r(3366),o=(r(7294),r(3905)),i=["components"],u={title:"Spring Cloud Gateway Route \uc124\uc815\ud574\ubcf4\uae30",description:"\uc2a4\ud504\ub9c1 \uac8c\uc774\ud2b8\uc6e8\uc774 Route \uae4c\ubcf4\uae30",slug:"gateway",authors:"dongle",tags:["SCG","Spring Cloud Gateway","Route"],image:"https://i.imgur.com/mErPwqL.png",hide_table_of_contents:!1},l=void 0,c={permalink:"/gateway",editUrl:"https://github.com/facebook/docusaurus/edit/main/website/blog/2022-05-08-Spring-Cloud-Gateway-Route.md",source:"@site/blog/2022-05-08-Spring-Cloud-Gateway-Route.md",title:"Spring Cloud Gateway Route \uc124\uc815\ud574\ubcf4\uae30",description:"\uc2a4\ud504\ub9c1 \uac8c\uc774\ud2b8\uc6e8\uc774 Route \uae4c\ubcf4\uae30",date:"2022-05-08T00:00:00.000Z",formattedDate:"May 8, 2022",tags:[{label:"SCG",permalink:"/tags/scg"},{label:"Spring Cloud Gateway",permalink:"/tags/spring-cloud-gateway"},{label:"Route",permalink:"/tags/route"}],readingTime:6.135,truncated:!0,authors:[{name:"Dongle",title:"Junior Backend Developer",url:"https://github.com/sk1737030",imageURL:"https://github.com/sk1737030.png",key:"dongle"}],frontMatter:{title:"Spring Cloud Gateway Route \uc124\uc815\ud574\ubcf4\uae30",description:"\uc2a4\ud504\ub9c1 \uac8c\uc774\ud2b8\uc6e8\uc774 Route \uae4c\ubcf4\uae30",slug:"gateway",authors:"dongle",tags:["SCG","Spring Cloud Gateway","Route"],image:"https://i.imgur.com/mErPwqL.png",hide_table_of_contents:!1},prevItem:{title:"Spring Kafka Rebalancing \ucc98\ub9ac \ud574\ubcf4\uae30",permalink:"/rebalnace"},nextItem:{title:"\uae4c\uba39\uc5b4\uc11c \ub2e4\uc2dc \ubcf4\ub294 Generic",permalink:"/generic"}},p={authorsImageUrls:[void 0]},s=[{value:"Spring Gateway Route",id:"spring-gateway-route",level:2}],g={toc:s};function m(e){var t=e.components,r=(0,a.Z)(e,i);return(0,o.kt)("wrapper",(0,n.Z)({},g,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"\ubaa8\ub4e0 \uc18c\uc2a4\ub294 ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/sk1737030/til/tree/master/spring-cloud-gateway"},"\uc774\uacf3"),"\uc5d0\uc11c \ud655\uc778 \uac00\ub2a5\ud569\ub2c8\ub2e4:)"),(0,o.kt)("h2",{id:"spring-gateway-route"},"Spring Gateway Route"),(0,o.kt)("p",null,"Spring gateway\uc744 \uc0ac\uc6a9\ud560 \ub54c \uc77c\ubc18\uc801\uc73c\ub85c 2\uac00\uc9c0 \ubc29\uc2dd\uc73c\ub85c route \uc124\uc815\uc744 \ud560 \uc218 \uc788\ub2e4."))}m.isMDXComponent=!0}}]);