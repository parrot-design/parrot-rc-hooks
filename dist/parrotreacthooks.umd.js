!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("react"),require("@parrotjs/utils")):"function"==typeof define&&define.amd?define(["exports","react","@parrotjs/utils"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).ParrotRcHooks={},e.React,e.ParrotUtils)}(this,(function(e,t,n){"use strict";function r(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}function u(e){if(e&&e.__esModule)return e;var t=Object.create(null);return e&&Object.keys(e).forEach((function(n){if("default"!==n){var r=Object.getOwnPropertyDescriptor(e,n);Object.defineProperty(t,n,r.get?r:{enumerable:!0,get:function(){return e[n]}})}})),t.default=e,Object.freeze(t)}var s=r(t),c=u(t);function i(e,t){"function"==typeof e?e(t):e&&(e.current=t)}let o=!0,a=!1,f=null;const l={text:!0,search:!0,url:!0,tel:!0,email:!0,password:!0,number:!0,date:!0,month:!0,week:!0,time:!0,datetime:!0,"datetime-local":!0};function d(e){e.metaKey||e.altKey||e.ctrlKey||(o=!0)}function h(){o=!1}function b(){"hidden"===this.visibilityState&&a&&(o=!0)}function v(e){const{target:t}=e;try{return t.matches(":focus-visible")}catch(e){}return o||function(e){const{type:t,tagName:n}=e;return!("INPUT"!==n||!l[t]||e.readOnly)||"TEXTAREA"===n&&!e.readOnly||!!e.isContentEditable}(e)}function g(e,t,r){if(!n.inBrowser)return;const{target:u=window,passive:c=!1,capture:i=!1}=r||{};let o=!1;const a=s.default.useCallback((n=>{n&&!o&&n.addEventListener(e,t,i),o=!0}),[e,t,c,i]),f=s.default.useCallback((n=>{n&&o&&(n.removeEventListener(e,t,i),o=!1)}),[e,t,c,i]);s.default.useEffect((()=>(a(u),()=>{f(u)})),[u])}e.setRef=i,e.useBoolean=function(e){const[n,r]=t.useState(e),u=t.useCallback((()=>{r(!n)}),[n]),s=t.useCallback((()=>{r(!0)}),[]),c=t.useCallback((()=>{r(!1)}),[]);return[n,{toggle:u,setTrue:s,setFalse:c}]},e.useDestory=function(e){s.default.useEffect((()=>e),[])},e.useEventListener=g,e.useForkRef=function(...e){return s.default.useMemo((()=>e.every((e=>!e))?null:t=>{for(let n of e)n&&i(n,t)}),[...e])},e.useIsFocusVisible=function(){const e=t.useCallback((e=>{var t;null!=e&&((t=e.ownerDocument).addEventListener("keydown",d,!0),t.addEventListener("mousedown",h,!0),t.addEventListener("pointerdown",h,!0),t.addEventListener("touchstart",h,!0),t.addEventListener("visibilitychange",b,!0))}),[]),n=s.default.useRef(!1);return{isFocusVisibleRef:n,onFocus:function(e){return!!v(e)&&(n.current=!0,!0)},onBlur:function(){return!!n.current&&(a=!0,window.clearTimeout(f),f=window.setTimeout((()=>{a=!1}),100),n.current=!1,!0)},ref:e}},e.usePageVisibility=function(){const[e,t]=s.default.useState("visible");return g("visibilitychange",s.default.useCallback((()=>{n.inBrowser&&t(document.hidden?"hidden":"visible")}),[])),e},e.usePrevious=function(e,n=!0){const r=t.useRef();return t.useEffect((()=>{("function"==typeof n?n(r.current,e):n)&&(r.current=e)})),r.current},e.useRect=(e=[])=>{const[n,r]=t.useState({width:0,height:0}),u=t.useRef(null),s=()=>{var e;const t=null===(e=u.current)||void 0===e?void 0:e.getBoundingClientRect();t&&r({width:t.width,height:t.height})};return t.useEffect((()=>{s()}),e),{root:u,size:n,changeSize:s}},e.useResizeObserver=function({ref:e,onResize:t,disabled:n}){const r=c.useRef(),u=c.useRef(),[s,i]=c.useState(0),[o,a]=c.useState(0),[f,l]=c.useState(0),[d,h]=c.useState(0),b=c.useCallback((()=>{r.current&&(r.current.disconnect(),r.current=null)}),[r]),v=c.useCallback((e=>{const n=e[0].target,{width:r,height:u}=n.getBoundingClientRect(),{offsetWidth:c,offsetHeight:b}=n,v=Math.floor(r),g=Math.floor(u);o===v&&s===g&&d===c&&f===b||(i(g),a(v),l(b),h(c),t&&Promise.resolve().then((()=>{t({width:v,height:g,offsetWidth:c,offsetHeight:b},n)})))}),[o,s,d,f,t]),g=c.useCallback((()=>{if(n)return void b();const t=e.current;t!==u.current&&(b(),u.current=t),!r.current&&t&&(r.current=new ResizeObserver(v),r.current.observe(t))}),[b,n,v,e]);return c.useEffect((()=>(g(),()=>{b()})),[g,b]),{width:o,height:s,offsetWidth:d,offsetHeight:f}},e.useStateCallback=function(e){const[n,r]=t.useState(e),u=t.useRef();return t.useEffect((()=>{u.current&&u.current(n)}),[n]),[n,(e,t,s)=>{"function"==typeof s&&!1===s(n,e)||(u.current="function"==typeof t?t:null,r(e))}]},e.useTouch=function(){const e=t.useRef(0),n=t.useRef(0),r=t.useRef(0),u=t.useRef(0),s=t.useRef(0),c=t.useRef(0),i=t.useRef(""),o=()=>{r.current=0,u.current=0,s.current=0,c.current=0,i.current=""};return{move:t=>{const o=t.touches[0];var a,f;r.current=o.clientX<0?0:o.clientX-e.current,u.current=o.clientY-n.current,s.current=Math.abs(r.current),c.current=Math.abs(u.current),i.current||(i.current=(a=s.current,f=c.current,a>f&&a>10?"horizontal":f>a&&f>10?"vertical":""))},start:t=>{o(),e.current=t.touches[0].clientX,n.current=t.touches[0].clientY},reset:o,startX:e,startY:n,deltaX:r,deltaY:u,offsetX:s,offsetY:c,direction:i,isVertical:()=>"vertical"===i.current,isHorizontal:()=>"horization"===i.current}},e.useUpdate=function(){const[,e]=t.useState();return t.useCallback((()=>e({})),[])},Object.defineProperty(e,"__esModule",{value:!0})}));
