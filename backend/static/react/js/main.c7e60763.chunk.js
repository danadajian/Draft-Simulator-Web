(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{16:function(e,t,n){e.exports=n.p+"media/football.c5005feb.ico"},20:function(e,t,n){},37:function(e,t,n){e.exports=n.p+"media/search.04c89f3b.ico"},39:function(e,t,n){e.exports=n(71)},45:function(e,t,n){},46:function(e,t,n){e.exports=n.p+"media/cloudy.340c3269.ico"},47:function(e,t,n){e.exports=n.p+"media/partlycloudy.a5e52894.ico"},48:function(e,t,n){e.exports=n.p+"media/rainy.dda0cf39.ico"},49:function(e,t,n){e.exports=n.p+"media/snowy.203024ab.ico"},50:function(e,t,n){e.exports=n.p+"media/stormy.ca70c957.ico"},51:function(e,t,n){e.exports=n.p+"media/sunny.a306062d.ico"},67:function(e,t,n){e.exports=n.p+"media/plus.220c44df.ico"},68:function(e,t,n){e.exports=n.p+"media/minus.5edbe473.ico"},69:function(e,t,n){e.exports=n.p+"media/up.04732abf.ico"},70:function(e,t,n){e.exports=n.p+"media/down.61889039.ico"},71:function(e,t,n){"use strict";n.r(t);var o=n(0),r=n.n(o),i=n(17),a=n.n(i),l=(n(45),n(5)),c=n(6),s=n(8),u=n(7),m=n(9),p=(n(20),function(e){function t(){return Object(l.a)(this,t),Object(s.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){return r.a.createElement("div",{className:"Home"},r.a.createElement("h1",{className:"Home-header"},"Welcome to Draft Simulator!"),r.a.createElement("h3",{className:"Dfs-header"},"To start, choose a draft site:"),r.a.createElement("div",{className:"Home-buttons"},r.a.createElement("button",{onClick:function(){window.location.href=window.location.origin+"/espn"},className:"Site-button"},"ESPN"),r.a.createElement("button",{onClick:function(){window.location.href=window.location.origin+"/yahoo"},className:"Site-button"},"Yahoo")),r.a.createElement("h3",{className:"Dfs-header"},"Or, check out our DFS Optimizer:"),r.a.createElement("button",{onClick:function(){window.location.href=window.location.origin+"/dfs-optimizer"},className:"Dfs-button"},"DFS Optimizer"),r.a.createElement("button",{onClick:function(){window.location.href=window.location.origin+"/logout"},className:"Logout-button"},"Log Out"))}}]),t}(o.Component)),d=n(15),f=n(73),h=n(74),y=n(75),v=n(46),S=n(47),k=n(48),g=n(49),x=n(50),w=n(51),E=function(e){var t=e.player.Weather.forecast.toLowerCase(),n=t.includes("partly")?S:t.includes("cloud")?v:t.includes("rain")?k:t.includes("snow")?g:t.includes("storm")?x:t.includes("sun")?w:null;return o.createElement("tr",null,o.createElement("td",null,e.player.Position&&o.createElement("button",{onClick:e.onRemove,style:{fontWeight:"bold"}},"X")),o.createElement("td",null,e.player.Position),o.createElement("td",null,e.player.Team),o.createElement("td",{style:{fontWeight:e.player.Position?"normal":"bold"}},e.player.Name),o.createElement("td",{style:{fontWeight:e.player.Position?"normal":"bold"}},e.player.Projected),o.createElement("td",{style:{fontWeight:e.player.Position?"normal":"bold"}},e.player.Price),o.createElement("td",null,e.player.Opp),o.createElement("td",{style:{display:"flex",alignItems:"center"}},e.player.Weather.forecast&&o.createElement("img",{src:n,alt:"weather",style:{height:"4vmin"}}),o.createElement("p",null,e.player.Weather.details)))},b=function(e){return o.createElement("table",{className:"Dfs-grid"},o.createElement("tr",{style:{backgroundColor:"fd"===e.site?"dodgerblue":"black"}},o.createElement("th",null,"Exclude"),o.createElement("th",null,"Position"),o.createElement("th",null,"Team"),o.createElement("th",null,"Player"),o.createElement("th",null,"Projected"),o.createElement("th",null,"Price"),o.createElement("th",null,"Opp"),o.createElement("th",null,"Weather")),e.dfsLineup.map(function(t,n){return o.createElement(E,{player:t,onRemove:function(){return e.removePlayer(n,e.site)}})}))},j=n(16),q=n.n(j),P=function(e){function t(e){var n;return Object(l.a)(this,t),(n=Object(s.a)(this,Object(u.a)(t).call(this,e))).fetchPlayersForOptimizer=function(){fetch(window.location.origin+"/dfs-optimizer/projections",{method:"POST"}).then(function(e){200!==e.status&&alert("Projections data failed to load."),n.setState({isLoading:!1})})},n.dfsSportChange=function(e){var t=e.target.value;"none"!==t&&n.fetchOptimalLineups(t)},n.fetchOptimalLineups=function(e){e?fetch(window.location.origin+"/optimized-lineup/"+e).then(function(t){200!==t.status?alert("Failed to generate lineups."):t.json().then(function(t){n.ingestDfsLineup(t,e,!1)})}):alert("Please select a sport.")},n.ingestDfsLineup=function(e,t,o){if(!o){if(1===e.length)return void alert(e[0]);"string"===typeof e[0]?alert(e[0]):2===e.length&&"string"===e[1]&&alert(e[1])}var r="string"===typeof e[0]?n.state.fdLineup:e[0],i="string"===typeof e[1]?n.state.dkLineup:e[1];n.setState({sport:t,fdLineup:r,dkLineup:i})},n.removePlayerFromDfsLineup=function(e,t){var o=n.state.sport,r="fd"===t?n.state.fdLineup[e].Name:n.state.dkLineup[e].Name;fetch(window.location.origin+"/optimized-lineup/"+o,{method:"POST",body:r+"|"+t}).then(function(e){200!==e.status?alert("Error removing player."):e.json().then(function(e){n.ingestDfsLineup(e,o,!0),alert("You have removed "+r+("fd"===t?" from your Fanduel lineup.":" from your Draftkings lineup."))})})},n.state={isLoading:!0,sport:"",fdLineup:[],dkLineup:[]},n.removePlayerFromDfsLineup=n.removePlayerFromDfsLineup.bind(Object(d.a)(Object(d.a)(n))),n}return Object(m.a)(t,e),Object(c.a)(t,[{key:"componentDidMount",value:function(){this.fetchPlayersForOptimizer()}},{key:"render",value:function(){var e=this,t=this.state,n=t.isLoading,o=t.sport,i=t.fdLineup,a=t.dkLineup;return n?r.a.createElement("div",{className:"Loading"},r.a.createElement("div",null,r.a.createElement("p",{className:"Loading-text"},"Loading . . .")),r.a.createElement("div",null,r.a.createElement("img",{src:q.a,className:"App-logo",alt:"football"}))):r.a.createElement(f.a,{fluid:!0},r.a.createElement(h.a,{bg:"primary",variant:"dark"},r.a.createElement(y.a,{className:"Nav-bar"},r.a.createElement(y.a.Link,{href:"/home"},"Home"),r.a.createElement(y.a.Link,{href:"/espn"},"Back to Draft Simulator"),r.a.createElement(y.a.Link,{href:"/logout"},"Logout"))),r.a.createElement("h1",{className:"App-header"},"DFS Optimizer"),r.a.createElement("div",{className:"Dfs-sport"},r.a.createElement("h3",null,"Choose a sport:"),r.a.createElement("select",{ref:"dropDown",className:"Drop-down",onChange:this.dfsSportChange,value:o},r.a.createElement("option",{value:"none"}," "),r.a.createElement("option",{value:"mlb"},"MLB"),r.a.createElement("option",{value:"nfl"},"NFL"),r.a.createElement("option",{value:"nba"},"NBA")),r.a.createElement("button",{style:{marginTop:"10px"},onClick:function(){return e.fetchOptimalLineups(o)}},"Reset")),r.a.createElement("div",{className:"Dfs-grid-section"},r.a.createElement("div",null,r.a.createElement("h2",{className:"Dfs-header"},"Fanduel"),r.a.createElement(b,{dfsLineup:i,removePlayer:this.removePlayerFromDfsLineup,site:"fd"})),r.a.createElement("div",null,r.a.createElement("h2",{className:"Dfs-header"},"Draftkings"),r.a.createElement(b,{dfsLineup:a,removePlayer:this.removePlayerFromDfsLineup,site:"dk"}))))}}]),t}(o.Component),C=(n(29),n(30),n(64),window.JQXLite),D=(window.jqx,function(e){function t(e){var n;Object(l.a)(this,t),n=Object(s.a)(this,Object(u.a)(t).call(this,e));var o="jqxPopover"+C.generateID();return n.componentSelector="#"+o,n.state={id:o},n}return Object(m.a)(t,e),Object(c.a)(t,[{key:"componentDidMount",value:function(){var e=this.manageAttributes();this.createComponent(e)}},{key:"manageAttributes",value:function(){var e=["arrowOffsetValue","animationOpenDelay","animationCloseDelay","autoClose","animationType","height","initContent","isModal","offset","position","rtl","selector","showArrow","showCloseButton","width","title","theme"],t={};for(var n in this.props)if("settings"===n)for(var o in this.props[n])t[o]=this.props[n][o];else-1!==e.indexOf(n)&&(t[n]=this.props[n]);return t}},{key:"createComponent",value:function(e){if(!this.style)for(var t in this.props.style)C(this.componentSelector).css(t,this.props.style[t]);if(void 0!==this.props.className)for(var n=this.props.className.split(" "),o=0;o<n.length;o++)C(this.componentSelector).addClass(n[o]);this.template||C(this.componentSelector).html(this.props.template),C(this.componentSelector).jqxPopover(e)}},{key:"setOptions",value:function(e){C(this.componentSelector).jqxPopover("setOptions",e)}},{key:"getOptions",value:function(){if(0===arguments.length)throw Error("At least one argument expected in getOptions()!");for(var e={},t=0;t<arguments.length;t++)e[arguments[t]]=C(this.componentSelector).jqxPopover(arguments[t]);return e}},{key:"on",value:function(e,t){C(this.componentSelector).on(e,t)}},{key:"off",value:function(e){C(this.componentSelector).off(e)}},{key:"arrowOffsetValue",value:function(e){if(void 0===e)return C(this.componentSelector).jqxPopover("arrowOffsetValue");C(this.componentSelector).jqxPopover("arrowOffsetValue",e)}},{key:"animationOpenDelay",value:function(e){if(void 0===e)return C(this.componentSelector).jqxPopover("animationOpenDelay");C(this.componentSelector).jqxPopover("animationOpenDelay",e)}},{key:"animationCloseDelay",value:function(e){if(void 0===e)return C(this.componentSelector).jqxPopover("animationCloseDelay");C(this.componentSelector).jqxPopover("animationCloseDelay",e)}},{key:"autoClose",value:function(e){if(void 0===e)return C(this.componentSelector).jqxPopover("autoClose");C(this.componentSelector).jqxPopover("autoClose",e)}},{key:"animationType",value:function(e){if(void 0===e)return C(this.componentSelector).jqxPopover("animationType");C(this.componentSelector).jqxPopover("animationType",e)}},{key:"height",value:function(e){if(void 0===e)return C(this.componentSelector).jqxPopover("height");C(this.componentSelector).jqxPopover("height",e)}},{key:"initContent",value:function(e){if(void 0===e)return C(this.componentSelector).jqxPopover("initContent");C(this.componentSelector).jqxPopover("initContent",e)}},{key:"isModal",value:function(e){if(void 0===e)return C(this.componentSelector).jqxPopover("isModal");C(this.componentSelector).jqxPopover("isModal",e)}},{key:"offset",value:function(e){if(void 0===e)return C(this.componentSelector).jqxPopover("offset");C(this.componentSelector).jqxPopover("offset",e)}},{key:"position",value:function(e){if(void 0===e)return C(this.componentSelector).jqxPopover("position");C(this.componentSelector).jqxPopover("position",e)}},{key:"rtl",value:function(e){if(void 0===e)return C(this.componentSelector).jqxPopover("rtl");C(this.componentSelector).jqxPopover("rtl",e)}},{key:"selector",value:function(e){if(void 0===e)return C(this.componentSelector).jqxPopover("selector");C(this.componentSelector).jqxPopover("selector",e)}},{key:"showArrow",value:function(e){if(void 0===e)return C(this.componentSelector).jqxPopover("showArrow");C(this.componentSelector).jqxPopover("showArrow",e)}},{key:"showCloseButton",value:function(e){if(void 0===e)return C(this.componentSelector).jqxPopover("showCloseButton");C(this.componentSelector).jqxPopover("showCloseButton",e)}},{key:"width",value:function(e){if(void 0===e)return C(this.componentSelector).jqxPopover("width");C(this.componentSelector).jqxPopover("width",e)}},{key:"title",value:function(e){if(void 0===e)return C(this.componentSelector).jqxPopover("title");C(this.componentSelector).jqxPopover("title",e)}},{key:"theme",value:function(e){if(void 0===e)return C(this.componentSelector).jqxPopover("theme");C(this.componentSelector).jqxPopover("theme",e)}},{key:"close",value:function(){C(this.componentSelector).jqxPopover("close")}},{key:"destroy",value:function(){C(this.componentSelector).jqxPopover("destroy")}},{key:"open",value:function(){C(this.componentSelector).jqxPopover("open")}},{key:"render",value:function(){return r.a.createElement("div",{id:this.state.id},this.props.value,this.props.children)}}]),t}(r.a.Component)),L=(n(65),n(66),window.JQXLite),O=(window.jqx,function(e){function t(e){var n;Object(l.a)(this,t),n=Object(s.a)(this,Object(u.a)(t).call(this,e));var o="jqxSlider"+L.generateID();return n.componentSelector="#"+o,n.state={id:o},n}return Object(m.a)(t,e),Object(c.a)(t,[{key:"componentDidMount",value:function(){var e=this.manageAttributes();this.createComponent(e)}},{key:"manageAttributes",value:function(){var e=["buttonsPosition","disabled","height","layout","mode","minorTicksFrequency","minorTickSize","max","min","orientation","rangeSlider","rtl","step","showTicks","showMinorTicks","showTickLabels","showButtons","showRange","template","theme","ticksPosition","ticksFrequency","tickSize","tickLabelFormatFunction","tooltip","tooltipHideDelay","tooltipPosition","tooltipFormatFunction","value","values","width"],t={};for(var n in this.props)if("settings"===n)for(var o in this.props[n])t[o]=this.props[n][o];else-1!==e.indexOf(n)&&(t[n]=this.props[n]);return t}},{key:"createComponent",value:function(e){if(!this.style)for(var t in this.props.style)L(this.componentSelector).css(t,this.props.style[t]);if(void 0!==this.props.className)for(var n=this.props.className.split(" "),o=0;o<n.length;o++)L(this.componentSelector).addClass(n[o]);this.template||L(this.componentSelector).html(this.props.template),L(this.componentSelector).jqxSlider(e)}},{key:"setOptions",value:function(e){L(this.componentSelector).jqxSlider("setOptions",e)}},{key:"getOptions",value:function(){if(0===arguments.length)throw Error("At least one argument expected in getOptions()!");for(var e={},t=0;t<arguments.length;t++)e[arguments[t]]=L(this.componentSelector).jqxSlider(arguments[t]);return e}},{key:"on",value:function(e,t){L(this.componentSelector).on(e,t)}},{key:"off",value:function(e){L(this.componentSelector).off(e)}},{key:"buttonsPosition",value:function(e){if(void 0===e)return L(this.componentSelector).jqxSlider("buttonsPosition");L(this.componentSelector).jqxSlider("buttonsPosition",e)}},{key:"disabled",value:function(e){if(void 0===e)return L(this.componentSelector).jqxSlider("disabled");L(this.componentSelector).jqxSlider("disabled",e)}},{key:"height",value:function(e){if(void 0===e)return L(this.componentSelector).jqxSlider("height");L(this.componentSelector).jqxSlider("height",e)}},{key:"layout",value:function(e){if(void 0===e)return L(this.componentSelector).jqxSlider("layout");L(this.componentSelector).jqxSlider("layout",e)}},{key:"mode",value:function(e){if(void 0===e)return L(this.componentSelector).jqxSlider("mode");L(this.componentSelector).jqxSlider("mode",e)}},{key:"minorTicksFrequency",value:function(e){if(void 0===e)return L(this.componentSelector).jqxSlider("minorTicksFrequency");L(this.componentSelector).jqxSlider("minorTicksFrequency",e)}},{key:"minorTickSize",value:function(e){if(void 0===e)return L(this.componentSelector).jqxSlider("minorTickSize");L(this.componentSelector).jqxSlider("minorTickSize",e)}},{key:"max",value:function(e){if(void 0===e)return L(this.componentSelector).jqxSlider("max");L(this.componentSelector).jqxSlider("max",e)}},{key:"min",value:function(e){if(void 0===e)return L(this.componentSelector).jqxSlider("min");L(this.componentSelector).jqxSlider("min",e)}},{key:"orientation",value:function(e){if(void 0===e)return L(this.componentSelector).jqxSlider("orientation");L(this.componentSelector).jqxSlider("orientation",e)}},{key:"rangeSlider",value:function(e){if(void 0===e)return L(this.componentSelector).jqxSlider("rangeSlider");L(this.componentSelector).jqxSlider("rangeSlider",e)}},{key:"rtl",value:function(e){if(void 0===e)return L(this.componentSelector).jqxSlider("rtl");L(this.componentSelector).jqxSlider("rtl",e)}},{key:"step",value:function(e){if(void 0===e)return L(this.componentSelector).jqxSlider("step");L(this.componentSelector).jqxSlider("step",e)}},{key:"showTicks",value:function(e){if(void 0===e)return L(this.componentSelector).jqxSlider("showTicks");L(this.componentSelector).jqxSlider("showTicks",e)}},{key:"showMinorTicks",value:function(e){if(void 0===e)return L(this.componentSelector).jqxSlider("showMinorTicks");L(this.componentSelector).jqxSlider("showMinorTicks",e)}},{key:"showTickLabels",value:function(e){if(void 0===e)return L(this.componentSelector).jqxSlider("showTickLabels");L(this.componentSelector).jqxSlider("showTickLabels",e)}},{key:"showButtons",value:function(e){if(void 0===e)return L(this.componentSelector).jqxSlider("showButtons");L(this.componentSelector).jqxSlider("showButtons",e)}},{key:"showRange",value:function(e){if(void 0===e)return L(this.componentSelector).jqxSlider("showRange");L(this.componentSelector).jqxSlider("showRange",e)}},{key:"template",value:function(e){if(void 0===e)return L(this.componentSelector).jqxSlider("template");L(this.componentSelector).jqxSlider("template",e)}},{key:"theme",value:function(e){if(void 0===e)return L(this.componentSelector).jqxSlider("theme");L(this.componentSelector).jqxSlider("theme",e)}},{key:"ticksPosition",value:function(e){if(void 0===e)return L(this.componentSelector).jqxSlider("ticksPosition");L(this.componentSelector).jqxSlider("ticksPosition",e)}},{key:"ticksFrequency",value:function(e){if(void 0===e)return L(this.componentSelector).jqxSlider("ticksFrequency");L(this.componentSelector).jqxSlider("ticksFrequency",e)}},{key:"tickSize",value:function(e){if(void 0===e)return L(this.componentSelector).jqxSlider("tickSize");L(this.componentSelector).jqxSlider("tickSize",e)}},{key:"tickLabelFormatFunction",value:function(e){if(void 0===e)return L(this.componentSelector).jqxSlider("tickLabelFormatFunction");L(this.componentSelector).jqxSlider("tickLabelFormatFunction",e)}},{key:"tooltip",value:function(e){if(void 0===e)return L(this.componentSelector).jqxSlider("tooltip");L(this.componentSelector).jqxSlider("tooltip",e)}},{key:"tooltipHideDelay",value:function(e){if(void 0===e)return L(this.componentSelector).jqxSlider("tooltipHideDelay");L(this.componentSelector).jqxSlider("tooltipHideDelay",e)}},{key:"tooltipPosition",value:function(e){if(void 0===e)return L(this.componentSelector).jqxSlider("tooltipPosition");L(this.componentSelector).jqxSlider("tooltipPosition",e)}},{key:"tooltipFormatFunction",value:function(e){if(void 0===e)return L(this.componentSelector).jqxSlider("tooltipFormatFunction");L(this.componentSelector).jqxSlider("tooltipFormatFunction",e)}},{key:"value",value:function(e){if(void 0===e)return L(this.componentSelector).jqxSlider("value");L(this.componentSelector).jqxSlider("value",e)}},{key:"values",value:function(e){if(void 0===e)return L(this.componentSelector).jqxSlider("values");L(this.componentSelector).jqxSlider("values",e)}},{key:"width",value:function(e){if(void 0===e)return L(this.componentSelector).jqxSlider("width");L(this.componentSelector).jqxSlider("width",e)}},{key:"destroy",value:function(){L(this.componentSelector).jqxSlider("destroy")}},{key:"decrementValue",value:function(){L(this.componentSelector).jqxSlider("decrementValue")}},{key:"disable",value:function(){L(this.componentSelector).jqxSlider("disable")}},{key:"enable",value:function(){L(this.componentSelector).jqxSlider("enable")}},{key:"focus",value:function(){L(this.componentSelector).jqxSlider("focus")}},{key:"getValue",value:function(){return L(this.componentSelector).jqxSlider("getValue")}},{key:"incrementValue",value:function(){L(this.componentSelector).jqxSlider("incrementValue")}},{key:"setValue",value:function(e){L(this.componentSelector).jqxSlider("setValue",e)}},{key:"val",value:function(e){if(void 0===e)return L(this.componentSelector).jqxSlider("val");L(this.componentSelector).jqxSlider("val",e)}},{key:"render",value:function(){return r.a.createElement("div",{id:this.state.id},this.props.value,this.props.children)}}]),t}(r.a.Component)),N=n(67),F=n(68),T=n(69),R=n(70),A=function(e){return o.createElement("tr",null,o.createElement("td",null,e.player.Rank),o.createElement("td",null,o.createElement("tr",{style:{fontWeight:"bold"}},e.player.Name),o.createElement("tr",null,e.player.Team," ",e.player.Position)),o.createElement("td",null,o.createElement("img",{src:e.isUserPlayer?F:N,alt:"add-or-remove",onClick:e.onChange,style:{height:"3vmin"}})),e.isUserPlayer&&o.createElement("td",{style:{display:"flex",flexDirection:"column"}},o.createElement("img",{src:T,alt:"up",onClick:function(){return e.onMove("up")},style:{height:"3vmin"}}),o.createElement("img",{src:R,alt:"down",onClick:function(){return e.onMove("down")},style:{height:"3vmin"}})))},z=function(e){return o.createElement("table",{style:{borderCollapse:"collapse"},className:"Draft-grid"},e.playerList.map(function(t,n){if(!e.filterList||e.filterList.includes(t))return o.createElement(A,{player:t,isUserPlayer:!1,onChange:function(){return e.addPlayer(n)},onMove:null})}))},M=function(e){return e.userRoundList.map(function(t,n){return o.createElement("table",{style:{borderCollapse:"collapse",marginBottom:"5vmin"},className:"Draft-grid"},o.createElement("th",{colSpan:4,style:{textAlign:"center"}},"Round "+(n+1)),t.map(function(t,r){return o.createElement(A,{player:t,isUserPlayer:!0,onChange:function(){return e.removePlayer(n,r)},onMove:function(t){return e.movePlayer(n,r,t)}})}))})},B=function(e){return o.createElement("table",null,o.createElement("tr",null,o.createElement("th",null,"Player"),o.createElement("th",null,"Round"),o.createElement("th",null,"Draft Frequency")),e.frequencyData.map(function(e){return o.createElement("tr",null,o.createElement("td",null,o.createElement("tr",{style:{fontWeight:"bold"}},e.Name),o.createElement("tr",null,e.Team," ",e.Position)),o.createElement("td",null,e.Round),o.createElement("td",null,e.Frequency))}))},W=n(37),V=n.n(W),I=function(e){function t(e){var n;return Object(l.a)(this,t),(n=Object(s.a)(this,Object(u.a)(t).call(this,e))).fetchPlayersForSimulator=function(e){fetch(window.location.origin+e+"-players").then(function(e){200!==e.status?alert("Could not load players."):e.json().then(function(e){n.setState({isLoading:!1,players:e}),n.bindSlidersToChangeEvent()})})},n.bindSlidersToChangeEvent=function(){n.refs.teamCountSlider.on("change",function(e){var t=e.args.value;n.refs.pickOrderSlider.setOptions({max:t})})},n.closeAbout=function(){n.refs.about.close();var e=window.location.pathname.split("#");window.location.href=window.location.origin+e[0].toString()+"#"},n.closeInstructions=function(){n.refs.instructions.close();var e=window.location.pathname.split("#");window.location.href=window.location.origin+e[0].toString()+"#"},n.swapRankings=function(){window.location.pathname.startsWith("/yahoo")?window.location.href=window.location.href.replace("yahoo","espn"):window.location.pathname.startsWith("/espn")&&(window.location.href=window.location.href.replace("espn","yahoo"))},n.saveRankings=function(){var e=n.state.userPlayers,t=window.location.pathname;e.every(function(e){return 0===e.length})?alert("Please rank at least one player before saving."):fetch(window.location.origin+"/save-ranking"+t,{method:"POST",body:JSON.stringify(e)}).then(function(e){200===e.status?alert("User ranking saved successfully."):alert("User ranking unable to be saved.")})},n.loadRankings=function(){var e=window.location.pathname;fetch(window.location.origin+"/load-ranking"+e).then(function(e){200!==e.status?alert("Could not load user ranking data."):e.json().then(function(e){if("No ranking specified."===e[0])alert(e[0]);else{var t=n.state.players,o=n.state.userPlayers,r=t.concat(o.flat());t=r.sort(function(e,t){return e.Rank-t.Rank});for(var i=e.flat(),a=function(e){var n=i[e].Rank,o=t.findIndex(function(e){return e.Rank===n});t.splice(o,1)},l=0;l<i.length;l++)a(l);n.setState({players:t,userPlayers:e,filteredPlayers:null})}})})},n.filterPlayers=function(e){var t=e.target.value.toLowerCase(),o=n.state.players.filter(function(e){return e.Name.toLowerCase().includes(t)||e.Position.toLowerCase().includes(t)||e.Team.toLowerCase().includes(t)});n.setState({searchText:t,filteredPlayers:o})},n.addPlayer=function(e){var t=n.state.players,o=n.state.userPlayers,r=t[e];t.splice(e,1),o[0].push(r),n.setState({players:t,userPlayers:o,filteredPlayers:null,searchText:""})},n.removePlayer=function(e,t){var o=n.state.players,r=n.state.userPlayers,i=r[e],a=i[t],l=a.Rank,c=o.find(function(e){return e.Rank>l});o.splice(o.indexOf(c),0,a),i.splice(t,1),n.setState({players:o,userPlayers:r})},n.clearPlayers=function(){var e=n.state.players,t=n.state.userPlayers.flat(),o=e.concat(t);n.setState({players:o.sort(function(e,t){return e.Rank-t.Rank}),userPlayers:[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],filteredPlayers:null})},n.movePlayer=function(e,t,o){var r=n.state.userPlayers,i=r[e],a=i[t];r[e].splice(t,1),"up"===o?t>0?r[e].splice(t-1,0,a):e>0?r[e-1].push(a):r[e].splice(t,0,a):"down"===o&&(t<i.length?i.splice(t+1,0,a):e<r.length-1?r[e+1].splice(0,0,a):r[e].splice(t,0,a)),n.setState({userPlayers:r})},n.determineIfRandom=function(e){n.setState({isRandom:e.target.checked})},n.simulateDrafts=function(e){if(e)n.setState({isDrafting:!1});else{var t=n.state.userPlayers;if(t.every(function(e){return 0===e.length}))alert("Please select at least one player to draft.");else{var o=t.map(function(e){return e.map(function(e){return e.Name})}),r=n.refs.teamCountSlider.getValue(),i=n.refs.roundCountSlider.getValue(),a=n.refs.pickOrderSlider.getValue(),l=n.state.isRandom?0:a;n.setState({isDrafting:!0,teamCount:r,pickOrder:a,roundCount:i}),fetch(window.location.origin+"/draft-results",{method:"POST",body:JSON.stringify(o)+"|"+r+"|"+l+"|"+i+"|"+window.location.pathname}).then(function(e){200!==e.status?alert("Error loading draft results."):e.json().then(function(e){"string"==typeof e[0]?alert(e[0]):n.generateDraftOutput(e)})})}}},n.generateDraftOutput=function(e){"Draft error!"===e&&alert("No players were drafted. :( \nSomething went wrong . . ."),n.setState({isDrafting:!1,userFreqs:e.UserFrequencies,allFreqs:e.AllFrequencies,expectedTeam:e.ExpectedTeam,frequencyData:e.UserFrequencies}),n.bindSlidersToChangeEvent()},n.toggleFrequencyData=function(e){n.setState({frequencyData:e})},n.state={isLoading:!0,players:[],searchText:"",filteredPlayers:null,userPlayers:[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],teamCount:10,pickOrder:5,roundCount:16,isDrafting:!1,isRandom:!1,allFreqs:[],userFreqs:[],expectedTeam:[],frequencyData:[]},n}return Object(m.a)(t,e),Object(c.a)(t,[{key:"componentDidMount",value:function(){this.fetchPlayersForSimulator(window.location.pathname)}},{key:"render",value:function(){var e=this,t=this.state,n=t.isLoading,o=t.players,i=t.filteredPlayers,a=t.userPlayers,l=t.teamCount,c=t.pickOrder,s=t.roundCount,u=t.isDrafting,m=t.isRandom,p=t.userFreqs,d=t.allFreqs,v=t.expectedTeam,S=t.frequencyData;if(n)return r.a.createElement("div",{className:"Loading"},r.a.createElement("div",null,r.a.createElement("p",{className:"Loading-text"},"Loading . . .")),r.a.createElement("div",null,r.a.createElement("img",{src:q.a,className:"App-logo",alt:"football"})));if(u)return r.a.createElement("div",{className:"Loading"},r.a.createElement("div",null,r.a.createElement("p",{className:"Loading-text"},"Drafting . . .")),r.a.createElement("div",null,r.a.createElement("img",{src:q.a,className:"App-logo",alt:"football"})),r.a.createElement("div",null,r.a.createElement("button",{onClick:function(){return e.simulateDrafts(!0)},className:"Cancel-draft-button"},"Cancel")));var k=window.location.pathname.startsWith("/espn")?"Switch to Yahoo":"Switch to ESPN",g=window.location.pathname.startsWith("/espn")?"#6C00B3":"#CE0000";return r.a.createElement(f.a,{fluid:!0},r.a.createElement(h.a,{bg:"primary",variant:"dark"},r.a.createElement(y.a,{className:"Nav-bar"},r.a.createElement(y.a.Link,{href:"/"},"Home"),r.a.createElement(y.a.Link,{href:"#about"},"About"),r.a.createElement(y.a.Link,{href:"#instructions"},"Instructions"),r.a.createElement(y.a.Link,{href:"/dfs-optimizer"},"DFS Optimizer"),r.a.createElement(y.a.Link,{href:"/logout"},"Logout"))),r.a.createElement("div",{className:"Info-buttons"},r.a.createElement(D,{ref:"about",isModal:!0,width:310,position:"bottom",title:"About Draft Simulator",selector:'a[href$="#about"]'},r.a.createElement("p",null,"Draft Simulator is a fantasy football draft preparation tool."),r.a.createElement("p",null,'More often than not, others in your league will only draft among the "top available players" in each round, which are determined by ESPN\'s preseason rankings.'),r.a.createElement("p",null,"However, Draft Simulator allows you to create and refine your own personal rankings that you can bring to your draft to get the team you've always dreamed of."),r.a.createElement("button",{onClick:this.closeAbout,style:{float:"right",marginTop:"10px",padding:"8px 12px",borderRadius:"6px"}},"Got it!")),r.a.createElement(D,{ref:"instructions",isModal:!0,width:310,position:"bottom",title:"Instructions",selector:'a[href$="#instructions"]'},r.a.createElement("ol",null,r.a.createElement("li",null,"Search for and select players from the player list. These should be players you'd feel strongly about drafting."),r.a.createElement("li",null,'Click "Add" to move them to your preferred list.'),r.a.createElement("li",null,"Drag and drop your players in order of overall preference."),r.a.createElement("li",null,'Adjust the sliders to your desired specifications, then click "Draft".'),r.a.createElement("li",null,'See how often you were able to draft each player under the "Draft Frequency" tab.'),r.a.createElement("li",null,'The "All Players" tab shows the draft frequency of all players taken, not just your preferred players.'),r.a.createElement("li",null,'The "Expected Team" tab shows your most likely fantasy team given the simulations.')),r.a.createElement("button",{onClick:this.closeInstructions,style:{float:"right",marginTop:"10px",padding:"8px 12px",borderRadius:"6px"}},"Let's draft!"))),r.a.createElement("h1",{className:"App-header"},"Draft Simulator"),r.a.createElement("div",{className:"Buttons-and-boxes"},r.a.createElement("div",{className:"Player-list-box"},r.a.createElement("div",null,!i&&r.a.createElement("img",{src:V.a,style:{height:"3vmin",position:"absolute"},alt:"search"}),r.a.createElement("input",{type:"text",style:{height:"25px",width:"90%"},value:this.state.searchText,onClick:this.filterPlayers,onChange:this.filterPlayers},null)),r.a.createElement(z,{playerList:o,filterList:i,addPlayer:this.addPlayer})),r.a.createElement("div",{className:"Player-buttons"},r.a.createElement("button",{onClick:this.clearPlayers,style:{fontSize:16},className:"Clear-button"},"Clear"),r.a.createElement("button",{id:"rankingButton",onClick:this.loadRankings,className:"Ranking-button"},"Load Saved Rankings"),r.a.createElement("button",{id:"swapButton",style:{backgroundColor:g},onClick:this.swapRankings,className:"Swap-button"},k)),r.a.createElement("div",{className:"Player-list-box"},r.a.createElement(M,{userRoundList:a,removePlayer:this.removePlayer,movePlayer:this.movePlayer,className:"Player-list-box"})),r.a.createElement("div",{className:"Draft-buttons"},r.a.createElement("button",{onClick:this.saveRankings,style:{fontSize:16},className:"Ranking-button"},"Save Player Rankings"),r.a.createElement("button",{onClick:function(){return e.simulateDrafts(!1)},style:{fontSize:16},className:"Draft-button"},"Draft!")),r.a.createElement("div",{className:"Player-list-box"},r.a.createElement("tr",null,r.a.createElement("button",{onClick:function(){return e.toggleFrequencyData(p)},style:{borderStyle:S===p?"inset":"outset"}},"Your Players"),r.a.createElement("button",{onClick:function(){return e.toggleFrequencyData(d)},style:{borderStyle:S===d?"inset":"outset"}},"All Players"),r.a.createElement("button",{onClick:function(){return e.toggleFrequencyData(v)},style:{borderStyle:S===v?"inset":"outset"}},"Expected Team")),r.a.createElement(B,{frequencyData:S}))),r.a.createElement("div",{className:"Slider-row"},r.a.createElement("div",{className:"Sliders"},r.a.createElement("p",null,"Number of teams per draft:"),r.a.createElement(O,{ref:"teamCountSlider",height:55,width:350,value:l,min:6,max:14,showTickLabels:!0,step:2,ticksFrequency:2,tooltip:!0,mode:"fixed"})),r.a.createElement("div",{className:"Sliders"},r.a.createElement("p",null,"Your pick in the draft:"),r.a.createElement(O,{ref:"pickOrderSlider",height:55,width:350,value:c,min:1,max:l,showTickLabels:!0,ticksFrequency:1,tooltip:!0,mode:"fixed"}),r.a.createElement("form",null,r.a.createElement("label",null,"Randomize:",r.a.createElement("input",{type:"checkbox",checked:m,onChange:this.determineIfRandom})))),r.a.createElement("div",{className:"Sliders"},r.a.createElement("p",null,"Number of rounds per draft:"),r.a.createElement(O,{ref:"roundCountSlider",height:55,width:350,value:s,min:1,max:16,showTickLabels:!0,ticksFrequency:15,showMinorTicks:!0,minorTicksFrequency:1,tooltip:!0,mode:"fixed"}))))}}]),t}(o.Component),H=function(e){function t(){return Object(l.a)(this,t),Object(s.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){return"/home"===window.location.pathname?r.a.createElement(p,null):["/espn","/yahoo"].includes(window.location.pathname)?r.a.createElement(I,null):"/dfs-optimizer"===window.location.pathname?r.a.createElement(P,null):void 0}}]),t}(o.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));a.a.render(r.a.createElement(H,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[39,1,2]]]);
//# sourceMappingURL=main.c7e60763.chunk.js.map