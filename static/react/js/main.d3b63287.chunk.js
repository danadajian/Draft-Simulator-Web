(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{15:function(e,t,n){e.exports=n.p+"media/football.c5005feb.ico"},17:function(e,t,n){e.exports=n.p+"media/search.04c89f3b.ico"},21:function(e,t,n){},27:function(e,t,n){e.exports=n.p+"media/plus.220c44df.ico"},28:function(e,t,n){e.exports=n.p+"media/minus.5edbe473.ico"},31:function(e,t,n){e.exports=n.p+"media/football2.fac02615.svg"},37:function(e,t,n){e.exports=n(68)},43:function(e,t,n){},44:function(e,t,n){e.exports=n.p+"media/cloudy.340c3269.ico"},45:function(e,t,n){e.exports=n.p+"media/partlycloudy.a5e52894.ico"},46:function(e,t,n){e.exports=n.p+"media/rainy.dda0cf39.ico"},47:function(e,t,n){e.exports=n.p+"media/snowy.203024ab.ico"},48:function(e,t,n){e.exports=n.p+"media/stormy.ca70c957.ico"},49:function(e,t,n){e.exports=n.p+"media/sunny.a306062d.ico"},66:function(e,t,n){e.exports=n.p+"media/up.04732abf.ico"},67:function(e,t,n){e.exports=n.p+"media/down.61889039.ico"},68:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),l=n(16),o=n.n(l),i=(n(43),n(5)),c=n(6),s=n(9),u=n(7),m=n(10),p=(n(21),function(e){function t(){return Object(i.a)(this,t),Object(s.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){return r.a.createElement("div",{className:"Home"},r.a.createElement("h1",{className:"Home-header"},"Welcome to Draft Simulator!"),r.a.createElement("h3",{className:"Dfs-header"},"To start, click the link below:"),r.a.createElement("div",{className:"Home-buttons"},r.a.createElement("button",{onClick:function(){window.location.href=window.location.origin+"/simulate"},className:"Site-button"},"Simulator")),r.a.createElement("h3",{className:"Dfs-header"},"Or, check out our DFS Optimizer:"),r.a.createElement("button",{onClick:function(){window.location.href=window.location.origin+"/optimize"},className:"Dfs-button"},"DFS Optimizer"),r.a.createElement("button",{onClick:function(){window.location.href=window.location.origin+"/logout"},className:"Logout-button"},"Log Out"))}}]),t}(a.Component)),d=n(25),f=n(70),h=n(71),y=n(72);function g(e,t){return e.map(function(e){return e[t]?parseFloat(e[t]):0}).reduce(function(e,t){return e+t},0)}var E=n(44),v=n(45),b=n(46),P=n(47),k=n(48),w=n(49),S=function(e){var t=e.player.Weather.forecast?e.player.Weather.forecast.toLowerCase():null,n=e.player.Weather.forecast?t.includes("partly")?v:t.includes("cloud")||t.includes("fog")?E:t.includes("storm")||t.includes("thunder")?k:t.includes("rain")||t.includes("shower")?b:t.includes("snow")||t.includes("flurr")?P:t.includes("sun")||t.includes("clear")?w:null:null;return a.createElement("tr",{style:{backgroundColor:e.player.Name&&e.whiteList.filter(function(e){return e.Name}).map(function(e){return e.Name}).includes(e.player.Name)?"lightgreen":null}},a.createElement("td",null,e.player.Position),a.createElement("td",null,e.player.Team),a.createElement("td",{style:{fontWeight:e.player.Position?"normal":"bold"}},e.player.Name," ",a.createElement("b",{style:{color:"red"}},e.player.Status)),a.createElement("td",{style:{fontWeight:e.player.Position?"normal":"bold"}},e.player.Projected),a.createElement("td",{style:{fontWeight:e.player.Position?"normal":"bold"}},e.player.Price&&"$".concat(e.player.Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g,","))),a.createElement("td",null,e.player.Opp),a.createElement("td",{style:{display:"flex",alignItems:"center"}},e.player.Weather.forecast&&a.createElement("img",{src:n,alt:"weather",style:{height:"4vmin"}}),a.createElement("p",null,e.player.Weather.details)),a.createElement("td",null,e.player.Position&&e.player.Name&&a.createElement("button",{onClick:e.onRemove,style:{fontWeight:"bold"}},"X")))},x=function(e){return a.createElement("table",{className:"Dfs-grid"},a.createElement("tr",{style:{backgroundColor:"fd"===e.site?"dodgerblue":"black"}},a.createElement("th",null,"Position"),a.createElement("th",null,"Team"),a.createElement("th",null,"Player"),a.createElement("th",null,"Projected"),a.createElement("th",null,"Price"),a.createElement("th",null,"Opp"),a.createElement("th",null,"Weather"),a.createElement("th",null,"Remove")),e.dfsLineup.map(function(t,n){return a.createElement(S,{player:t,onRemove:function(){return e.removePlayer(n)},whiteList:e.whiteList})}),a.createElement("tr",{style:{fontWeight:"bold"}},a.createElement("td",null,null),a.createElement("td",null,null),a.createElement("td",null,"Total"),a.createElement("td",null,e.pointSum.toFixed(1)),a.createElement("td",{style:{color:e.salarySum>e.cap?"indianred":"black"}},"$".concat(e.salarySum.toString().replace(/\B(?=(\d{3})+(?!\d))/g,","))),a.createElement("td",null,null),a.createElement("td",null,null),a.createElement("td",null,null)))},C=function(e){return a.createElement("table",null,a.createElement("tr",null,a.createElement("th",null,"Position"),a.createElement("th",null,"Projected"),a.createElement("th",null,"Actual"),a.createElement("th",null,"Optimal"),a.createElement("th",null,"Expected vs Actual"),a.createElement("th",null,"Actual vs Optimal"),a.createElement("th",null,"Expected vs Optimal")),e.reportingData.map(function(e){return a.createElement("tr",{style:{fontWeight:"Total"===e.position?"bold":"normal"}},a.createElement("td",null,e.position),a.createElement("td",null,e.expected),a.createElement("td",null,e.actual),a.createElement("td",null,e.optimal),a.createElement("td",null,(100*e.expected_v_actual).toFixed(2).toString().concat("%")),a.createElement("td",null,(100*e.actual_v_optimal).toFixed(2).toString().concat("%")),a.createElement("td",null,(100*e.expected_v_optimal).toFixed(2).toString().concat("%")))}))},L=n(27),N=n(28),O=function(e){return a.createElement("tr",{style:{backgroundColor:e.whiteList.includes(e.player)?"lightgreen":e.blackList.includes(e.player)?"indianred":"white"}},a.createElement("td",null,a.createElement("tr",{style:{fontWeight:"bold"}},e.player.Name),a.createElement("tr",null,e.player.Team," ",e.player.Position)),a.createElement("td",null,e.player.Opp),a.createElement("td",{style:{color:e.salarySum+e.player.Price>e.cap?"red":"black"}},"$".concat(e.player.Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g,","))),a.createElement("td",null,a.createElement("img",{src:L,alt:"add",onClick:e.onPlusClick,style:{height:"3vmin"}})),a.createElement("td",null,a.createElement("img",{src:N,alt:"remove",onClick:e.onMinusClick,style:{height:"3vmin"}})))},j=function(e){return a.createElement("table",{style:{borderCollapse:"collapse"},className:"Draft-grid"},a.createElement("tr",{style:{backgroundColor:"lightgray"}},a.createElement("th",null,"Player"),a.createElement("th",null,"Opp"),a.createElement("th",null,"Salary"),a.createElement("th",null,"Add"),a.createElement("th",null,"Blacklist")),e.playerList.sort(function(e,t){return t.Price-e.Price}).map(function(t,n){if(!e.filterList||e.filterList.includes(t))return a.createElement(O,{player:t,onPlusClick:function(){return e.whiteListFunction(n)},onMinusClick:function(){return e.blackListFunction(n)},whiteList:e.whiteList,blackList:e.blackList,salarySum:e.salarySum,cap:e.cap})}))},D=function(e){return a.createElement("tr",null,a.createElement("td",null,a.createElement("tr",{style:{fontWeight:"bold"}},e.player.Name),a.createElement("tr",null,e.player.Team," ",e.player.Position)),a.createElement("td",null,e.player.Opp),a.createElement("td",null,"$".concat(e.player.Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g,","))))},q=function(e){return a.createElement("table",{style:{borderCollapse:"collapse"},className:"Draft-grid"},a.createElement("tr",{style:{backgroundColor:"indianred"}},a.createElement("th",null,"Player"),a.createElement("th",null,"Opp"),a.createElement("th",null,"Salary")),e.blackList.sort(function(e,t){return t.Price-e.Price}).map(function(e){return a.createElement(D,{player:e})}))},T=n(31),R=n.n(T),F=n(15),A=n.n(F),W=n(17),I=n.n(W),B=function(e){function t(e){var n;return Object(i.a)(this,t),(n=Object(s.a)(this,Object(u.a)(t).call(this,e))).generateLineup=function(e,t,a){var r=n.state,l=r.lineup,o=r.blackList,i=l.filter(function(e){return e.Name}).map(function(e){return e.Name}),c=o.filter(function(e){return e.Name}).map(function(e){return e.Name});n.setState({isOptimizing:!0,isReporting:!1,sport:e,site:t,slate:a,whiteList:l.filter(function(e){return e.Name})}),fetch(window.location.origin+"/optimize/generate/"+e+"/"+t+"/"+a,{method:"POST",body:i.toString()+"|"+c.toString()}).then(function(e){200!==e.status?alert("Error removing player."):e.json().then(function(e){n.ingestDfsLineup(e)})})},n.ingestDfsLineup=function(e){if("string"===typeof e)return n.setState({isOptimizing:!1}),void alert(e);var t="string"===typeof e?[]:e;n.setState({isOptimizing:!1,lineup:t})},n.clearLineup=function(e,t,a){e?"nba"===e?alert("Warning: \nThis sport is currently unavailable."):t&&a?(n.setState({isLoading:!0,isReporting:!1,sport:e,site:t,slate:a}),fetch(window.location.origin+"/optimize/clear/"+e+"/"+t+"/"+a).then(function(e){200!==e.status?alert("An error occurred."):e.json().then(function(e){n.setState({isLoading:!1,playerPool:e.playerPool,lineup:e.lineup,cap:e.cap,whiteList:[],blackList:[]})})})):n.setState({sport:e,site:t,slate:a}):alert("Please select a sport.")},n.fetchReportingData=function(e,t,a,r){n.setState({isLoading:!0}),fetch(window.location.origin+"/optimize/reporting/nfl/"+a+"/"+t,{method:"POST",body:r}).then(function(e){200!==e.status?alert("Failed to generate report."):e.json().then(function(e){n.setState({isLoading:!1,isReporting:!0,weeks:r,reportingData:e})})})},n.filterPlayers=function(e,t){var a=function(e,t,n){var a,r=n.playerPool,l=n.text;return"All"===t?{searchText:"",filteredPool:r}:("Name"===e?(l=t.toLowerCase(),a=r.filter(function(e){return e.Name.toLowerCase().includes(l.toLowerCase())})):a=r.filter(function(n){return n[e].includes(t)}),{searchText:l,filteredPool:a})}(e,t,n.state);n.setState(a)},n.addToLineup=function(e){var t=function(e,t){var n=t.playerPool,a=t.lineup,r=t.whiteList,l=t.blackList,o=n[e];if(a.find(function(e){return e.Id===o.Id},null))return"Player already added to lineup.";var i=a.filter(function(e){return!e.Name&&(o.Position===e.Position||e.Position.includes(o.Position)||o.Position.includes(e.Position)||!["QB","D/ST","P"].includes(o.Position)&&["FLEX","Util"].includes(e.Position))});if(0===i.length)return"Not enough positions available to add player.";r.push(o);var c=l.find(function(e){return e.Id===o.Id},null);c&&l.splice(l.indexOf(c),1);var s=i[0],u=a.indexOf(s),m=JSON.parse(JSON.stringify(o));return m.Position=s.Position,a[u]=m,{lineup:a,whiteList:r,blackList:l,filteredPool:null,searchText:""}}(e,n.state);"string"===typeof t?alert(t):n.setState(t)},n.removeFromLineup=function(e){var t=function(e,t){var n=t.lineup,a=t.whiteList,r=n[e],l=a.find(function(e){return e.Id===r.Id},null);return l&&a.splice(a.indexOf(l),1),n[e]={Position:r.Position,Team:"",Name:"",Id:"",Status:"",Projected:"",Price:"",Opp:"",Weather:""},{lineup:n,whiteList:a}}(e,n.state);n.setState(t)},n.toggleBlackList=function(e){var t=function(e,t){var n=t.playerPool,a=t.lineup,r=t.whiteList,l=t.blackList,o=n[e],i=l.find(function(e){return e.Id===o.Id},null);if(i)l.splice(l.indexOf(i),1);else{l.push(o);var c=r.find(function(e){return e.Id===o.Id},null);c&&r.splice(r.indexOf(c),1);var s=a.find(function(e){return e.Id===o.Id},null);s&&(a[a.indexOf(s)]={Position:s.Position,Team:"",Name:"",Id:"",Status:"",Projected:"",Price:"",Opp:"",Weather:""})}return{lineup:a,whiteList:r,blackList:l,filteredPool:null,searchText:""}}(e,n.state);n.setState(t)},n.toggleWeek=function(e){var t=n.state,a=t.sport,r=t.slate,l=t.site,o=t.weeks;return o.includes(e)?o.splice(o.indexOf(e),1):o.push(e),n.fetchReportingData(a,r,l,o),o},n.state={isLoading:!1,isOptimizing:!1,isReporting:!1,sport:"",site:"",slate:"",lineup:[],cap:0,playerPool:[],filteredPool:null,searchText:"",whiteList:[],blackList:[],reportingData:{},weeks:[]},n}return Object(m.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){for(var e,t=this,n=this.state,a=n.isLoading,l=n.isOptimizing,o=n.isReporting,i=n.sport,c=n.site,s=n.slate,u=n.lineup,m=n.cap,p=n.playerPool,E=n.filteredPool,v=n.searchText,b=n.whiteList,P=n.blackList,k=n.reportingData,w=n.weeks,S=[],L=1;L<=k.maxWeek;L++)S.push(L);return e=a?r.a.createElement("div",{className:"Loading"},r.a.createElement("div",null,r.a.createElement("p",{className:"Loading-text"},"Loading . . .")),r.a.createElement("div",null,r.a.createElement("img",{src:A.a,className:"App-logo",alt:"football"}))):l?r.a.createElement("div",{className:"Loading"},r.a.createElement("div",null,r.a.createElement("p",{className:"Optimizing-text"},"Optimizing . . .")),r.a.createElement("div",null,r.a.createElement("img",{src:R.a,className:"App-logo2",alt:"football2"}))):o?r.a.createElement("div",{className:"Dfs-grid-section"},r.a.createElement("div",null,r.a.createElement(C,{reportingData:k.data})),r.a.createElement("div",null,r.a.createElement("div",{className:"Dfs-sport"},r.a.createElement("h3",null,"Week"),r.a.createElement("div",{className:"Dfs-grid-section"},S.map(function(e){return r.a.createElement("button",{style:{backgroundColor:w.includes(e)?"dodgerblue":"white"},onClick:function(){return t.toggleWeek(e)}},e)}))))):r.a.createElement("div",{className:"Dfs-grid-section"},r.a.createElement("div",{className:"Player-list-box"},r.a.createElement("h2",{className:"Dfs-header"},"Blacklist"),r.a.createElement(q,{blackList:P})),r.a.createElement("div",null,r.a.createElement("h2",{className:"Dfs-header"},"Players"),r.a.createElement("div",{style:{display:"flex",flexDirection:"column"}},!E&&r.a.createElement("img",{src:I.a,style:{height:"3vmin",position:"absolute"},alt:"search"}),r.a.createElement("input",{type:"text",style:{height:"25px",width:"90%"},value:v,onChange:function(e){return t.filterPlayers("Name",e.target.value)}},null)),r.a.createElement("div",{style:{display:"flex"}},r.a.createElement("button",{onClick:function(){return t.filterPlayers("Position","All")}},"All"),Object(d.a)(new Set(p.map(function(e){return"D/ST"===e.Position?e.Position:e.Position.split("/")[0]}))).map(function(e){return r.a.createElement("button",{onClick:function(){return t.filterPlayers("Position",e)}},e)}),r.a.createElement("select",{onChange:function(e){return t.filterPlayers("Team",e.target.value)}},r.a.createElement("option",{selected:"selected",value:"All"},"All"),Object(d.a)(new Set(p.map(function(e){return e.Team}))).sort().map(function(e){return r.a.createElement("option",{value:e},e)}))),r.a.createElement("div",{className:"Player-list-box"},r.a.createElement(j,{playerList:p,filterList:E,whiteListFunction:this.addToLineup,blackListFunction:this.toggleBlackList,whiteList:b,blackList:P,salarySum:g(u,"Price"),cap:m}))),r.a.createElement("div",null,r.a.createElement("h2",{className:"Dfs-header"},"Lineup"),r.a.createElement(x,{dfsLineup:u,removePlayer:this.removeFromLineup,site:c,whiteList:b,pointSum:g(u,"Projected"),salarySum:g(u,"Price"),cap:m}))),r.a.createElement(f.a,{fluid:!0},r.a.createElement(h.a,{bg:"primary",variant:"dark"},r.a.createElement(y.a,{className:"Nav-bar"},r.a.createElement(y.a.Link,{href:"/home"},"Home"),r.a.createElement(y.a.Link,{href:"/simulate"},"Back to Draft Simulator"),r.a.createElement(y.a.Link,{href:"/logout"},"Log Out"))),r.a.createElement("h1",{className:"App-header"},"DFS Optimizer"),r.a.createElement("div",{className:"Dfs-sport"},r.a.createElement("h3",null,"Choose a sport:"),r.a.createElement("div",{style:{display:"flex"}},r.a.createElement("button",{style:{backgroundColor:"mlb"===i?"dodgerblue":"white"},onClick:function(){return t.clearLineup("mlb",c,"main")}},"MLB"),r.a.createElement("button",{style:{backgroundColor:"nfl"===i?"dodgerblue":"white"},onClick:function(){return t.clearLineup("nfl",c,s)}},"NFL"),r.a.createElement("button",{style:{backgroundColor:"nba"===i?"dodgerblue":"white"},onClick:function(){return t.clearLineup("nba",c,"main")}},"NBA")),"nfl"===i&&r.a.createElement("h3",null,"Choose a game slate:"),"nfl"===i&&r.a.createElement("div",{style:{display:"flex"}},r.a.createElement("button",{style:{backgroundColor:"thurs"===s?"dodgerblue":"white"},onClick:function(){return t.clearLineup(i,c,"thurs")}},"Thurs only"),r.a.createElement("button",{style:{backgroundColor:"thurs-mon"===s?"dodgerblue":"white"},onClick:function(){return t.clearLineup(i,c,"thurs-mon")}},"Thurs - Mon"),r.a.createElement("button",{style:{backgroundColor:"main"===s?"dodgerblue":"white"},onClick:function(){return t.clearLineup(i,c,"main")}},"Sun (Main)"),r.a.createElement("button",{style:{backgroundColor:"sun-mon"===s?"dodgerblue":"white"},onClick:function(){return t.clearLineup(i,c,"sun-mon")}},"Sun - Mon")),i&&r.a.createElement("h3",null,"Choose a site:"),i&&r.a.createElement("div",{style:{display:"flex"}},r.a.createElement("button",{style:{backgroundColor:"fd"===c?"dodgerblue":"white"},onClick:function(){return t.clearLineup(i,"fd",s)}},"Fanduel"),r.a.createElement("button",{style:{backgroundColor:"dk"===c?"dodgerblue":"white"},onClick:function(){return t.clearLineup(i,"dk",s)}},"Draftkings")),r.a.createElement("div",{style:{display:"flex",margin:"2%"}},i&&s&&c&&r.a.createElement("button",{style:{marginTop:"10px"},onClick:function(){return t.generateLineup(i,c,s)}},"Optimize Lineup"),i&&s&&c&&r.a.createElement("button",{style:{marginTop:"10px"},onClick:function(){return t.clearLineup(i,c,s)}},"Clear Lineup"),"nfl"===i&&s&&c&&r.a.createElement("button",{style:{marginTop:"10px"},onClick:function(){return t.fetchReportingData(i,s,c,S)}},"Generate Report"))),i&&s&&c&&e)}}]),t}(a.Component),z=n(35),M=(n(61),n(62),n(65),window.JQXLite),U=(window.jqx,function(e){function t(e){var n;Object(i.a)(this,t),n=Object(s.a)(this,Object(u.a)(t).call(this,e));var a="jqxPopover"+M.generateID();return n.componentSelector="#"+a,n.state={id:a},n}return Object(m.a)(t,e),Object(c.a)(t,[{key:"componentDidMount",value:function(){var e=this.manageAttributes();this.createComponent(e)}},{key:"manageAttributes",value:function(){var e=["arrowOffsetValue","animationOpenDelay","animationCloseDelay","autoClose","animationType","height","initContent","isModal","offset","position","rtl","selector","showArrow","showCloseButton","width","title","theme"],t={};for(var n in this.props)if("settings"===n)for(var a in this.props[n])t[a]=this.props[n][a];else-1!==e.indexOf(n)&&(t[n]=this.props[n]);return t}},{key:"createComponent",value:function(e){if(!this.style)for(var t in this.props.style)M(this.componentSelector).css(t,this.props.style[t]);if(void 0!==this.props.className)for(var n=this.props.className.split(" "),a=0;a<n.length;a++)M(this.componentSelector).addClass(n[a]);this.template||M(this.componentSelector).html(this.props.template),M(this.componentSelector).jqxPopover(e)}},{key:"setOptions",value:function(e){M(this.componentSelector).jqxPopover("setOptions",e)}},{key:"getOptions",value:function(){if(0===arguments.length)throw Error("At least one argument expected in getOptions()!");for(var e={},t=0;t<arguments.length;t++)e[arguments[t]]=M(this.componentSelector).jqxPopover(arguments[t]);return e}},{key:"on",value:function(e,t){M(this.componentSelector).on(e,t)}},{key:"off",value:function(e){M(this.componentSelector).off(e)}},{key:"arrowOffsetValue",value:function(e){if(void 0===e)return M(this.componentSelector).jqxPopover("arrowOffsetValue");M(this.componentSelector).jqxPopover("arrowOffsetValue",e)}},{key:"animationOpenDelay",value:function(e){if(void 0===e)return M(this.componentSelector).jqxPopover("animationOpenDelay");M(this.componentSelector).jqxPopover("animationOpenDelay",e)}},{key:"animationCloseDelay",value:function(e){if(void 0===e)return M(this.componentSelector).jqxPopover("animationCloseDelay");M(this.componentSelector).jqxPopover("animationCloseDelay",e)}},{key:"autoClose",value:function(e){if(void 0===e)return M(this.componentSelector).jqxPopover("autoClose");M(this.componentSelector).jqxPopover("autoClose",e)}},{key:"animationType",value:function(e){if(void 0===e)return M(this.componentSelector).jqxPopover("animationType");M(this.componentSelector).jqxPopover("animationType",e)}},{key:"height",value:function(e){if(void 0===e)return M(this.componentSelector).jqxPopover("height");M(this.componentSelector).jqxPopover("height",e)}},{key:"initContent",value:function(e){if(void 0===e)return M(this.componentSelector).jqxPopover("initContent");M(this.componentSelector).jqxPopover("initContent",e)}},{key:"isModal",value:function(e){if(void 0===e)return M(this.componentSelector).jqxPopover("isModal");M(this.componentSelector).jqxPopover("isModal",e)}},{key:"offset",value:function(e){if(void 0===e)return M(this.componentSelector).jqxPopover("offset");M(this.componentSelector).jqxPopover("offset",e)}},{key:"position",value:function(e){if(void 0===e)return M(this.componentSelector).jqxPopover("position");M(this.componentSelector).jqxPopover("position",e)}},{key:"rtl",value:function(e){if(void 0===e)return M(this.componentSelector).jqxPopover("rtl");M(this.componentSelector).jqxPopover("rtl",e)}},{key:"selector",value:function(e){if(void 0===e)return M(this.componentSelector).jqxPopover("selector");M(this.componentSelector).jqxPopover("selector",e)}},{key:"showArrow",value:function(e){if(void 0===e)return M(this.componentSelector).jqxPopover("showArrow");M(this.componentSelector).jqxPopover("showArrow",e)}},{key:"showCloseButton",value:function(e){if(void 0===e)return M(this.componentSelector).jqxPopover("showCloseButton");M(this.componentSelector).jqxPopover("showCloseButton",e)}},{key:"width",value:function(e){if(void 0===e)return M(this.componentSelector).jqxPopover("width");M(this.componentSelector).jqxPopover("width",e)}},{key:"title",value:function(e){if(void 0===e)return M(this.componentSelector).jqxPopover("title");M(this.componentSelector).jqxPopover("title",e)}},{key:"theme",value:function(e){if(void 0===e)return M(this.componentSelector).jqxPopover("theme");M(this.componentSelector).jqxPopover("theme",e)}},{key:"close",value:function(){M(this.componentSelector).jqxPopover("close")}},{key:"destroy",value:function(){M(this.componentSelector).jqxPopover("destroy")}},{key:"open",value:function(){M(this.componentSelector).jqxPopover("open")}},{key:"render",value:function(){return r.a.createElement("div",{id:this.state.id},this.props.value,this.props.children)}}]),t}(r.a.Component)),J=n(27),$=n(28),H=n(66),_=n(67),V=function(e){return a.createElement("tr",null,a.createElement("td",null,e.player.Rank),a.createElement("td",null,a.createElement("tr",{style:{fontWeight:"bold"}},e.player.Name),a.createElement("tr",null,e.player.Team," ",e.player.Position)),a.createElement("td",null,a.createElement("img",{src:e.isUserPlayer?$:J,alt:"add-or-remove",onClick:e.onChange,style:{height:"3vmin"}})),e.isUserPlayer&&a.createElement("td",{style:{display:"flex",flexDirection:"column"}},a.createElement("img",{src:H,alt:"up",onClick:function(){return e.onMove("up")},style:{height:"3vmin"}}),a.createElement("img",{src:_,alt:"down",onClick:function(){return e.onMove("down")},style:{height:"3vmin"}})))},X=function(e){return a.createElement("table",{style:{borderCollapse:"collapse"},className:"Draft-grid"},e.playerList.map(function(t,n){if(!e.filterList||e.filterList.includes(t))return a.createElement(V,{player:t,isUserPlayer:!1,onChange:function(){return e.addPlayer(n)},onMove:null})}))},Y=function(e){return e.userRoundList.map(function(t,n){return a.createElement("table",{style:{borderCollapse:"collapse",marginBottom:"5vmin"},className:"Draft-grid"},a.createElement("th",{colSpan:4,style:{textAlign:"center"}},"Round "+(n+1)),t.map(function(t,r){return a.createElement(V,{player:t,isUserPlayer:!0,onChange:function(){return e.removePlayer(n,r)},onMove:function(t){return e.movePlayer(n,r,t)}})}))})},G=function(e){return a.createElement("table",null,a.createElement("tr",null,a.createElement("th",null,"Player"),a.createElement("th",null,"Round"),a.createElement("th",null,"Draft Frequency")),e.frequencyData.map(function(e){return a.createElement("tr",null,a.createElement("td",null,a.createElement("tr",{style:{fontWeight:"bold"}},e.Name),a.createElement("tr",null,e.Team," ",e.Position)),a.createElement("td",null,e.Round),a.createElement("td",null,e.Frequency))}))},Q=function(e){function t(e){var n;return Object(i.a)(this,t),(n=Object(s.a)(this,Object(u.a)(t).call(this,e))).fetchPlayersForSimulator=function(e){n.setState({isLoading:!0}),fetch(window.location.origin+"/"+e+"-players").then(function(t){200!==t.status?alert("Could not load players."):t.json().then(function(t){"string"===typeof t[0]?(n.setState({isLoading:!1}),alert(t[0])):n.setState({isLoading:!1,players:t,site:e})})})},n.handleSliderChange=function(e,t){n.setState(Object(z.a)({},e,t.target.value))},n.closeAbout=function(){n.refs.about.close();var e=window.location.pathname.split("#");window.location.href=window.location.origin+e[0].toString()+"#"},n.closeInstructions=function(){n.refs.instructions.close();var e=window.location.pathname.split("#");window.location.href=window.location.origin+e[0].toString()+"#"},n.swapRankings=function(){var e="espn"===n.state.site?"yahoo":"espn";n.fetchPlayersForSimulator(e)},n.saveRankings=function(){var e=n.state,t=e.userPlayers,a=e.site;t.every(function(e){return 0===e.length})?alert("Please rank at least one player before saving."):fetch(window.location.origin+"/save-ranking/"+a,{method:"POST",body:JSON.stringify(t)}).then(function(e){200!==e.status?alert("User ranking unable to be saved."):e.json().then(function(e){alert(e[0])})})},n.loadRankings=function(){var e=n.state.site;fetch(window.location.origin+"/load-ranking/"+e).then(function(e){200!==e.status?alert("Could not load user ranking data."):e.json().then(function(e){if("string"===typeof e[0])alert(e[0]);else{var t=n.state,a=t.players,r=t.userPlayers,l=a.concat(r.flat());a=l.sort(function(e,t){return e.Rank-t.Rank});for(var o=e.flat(),i=function(e){var t=o[e].Rank,n=a.findIndex(function(e){return e.Rank===t});a.splice(n,1)},c=0;c<o.length;c++)i(c);n.setState({players:a,userPlayers:e,filteredPlayers:null})}})})},n.filterPlayers=function(e){var t=e.target.value.toLowerCase(),a=n.state.players.filter(function(e){return e.Name.toLowerCase().includes(t)||e.Position.toLowerCase().includes(t)||e.Team.toLowerCase().includes(t)});n.setState({searchText:t,filteredPlayers:a})},n.addPlayer=function(e){var t=n.state,a=t.players,r=t.userPlayers,l=a[e];a.splice(e,1),r[0].push(l),n.setState({players:a,userPlayers:r,filteredPlayers:null,searchText:""})},n.removePlayer=function(e,t){var a=n.state,r=a.players,l=a.userPlayers,o=l[e],i=o[t],c=i.Rank,s=r.find(function(e){return e.Rank>c});r.splice(r.indexOf(s),0,i),o.splice(t,1),n.setState({players:r,userPlayers:l})},n.clearPlayers=function(){var e=n.state,t=e.players,a=e.userPlayers.flat(),r=t.concat(a);n.setState({players:r.sort(function(e,t){return e.Rank-t.Rank}),userPlayers:[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],filteredPlayers:null})},n.movePlayer=function(e,t,a){var r=n.state.userPlayers,l=r[e],o=l[t];r[e].splice(t,1),"up"===a?t>0?r[e].splice(t-1,0,o):e>0?r[e-1].push(o):r[e].splice(t,0,o):"down"===a&&(t<l.length?l.splice(t+1,0,o):e<r.length-1?r[e+1].splice(0,0,o):r[e].splice(t,0,o)),n.setState({userPlayers:r})},n.determineIfRandom=function(e){n.setState({isRandom:e.target.checked})},n.simulateDrafts=function(e){if(e)n.setState({isDrafting:!1});else{var t=n.state,a=t.userPlayers,r=t.teamCount,l=t.pickOrder,o=t.roundCount,i=t.site;if(a.every(function(e){return 0===e.length}))alert("Please select at least one player to draft.");else{var c=a.map(function(e){return e.map(function(e){return e.Name})});n.setState({isDrafting:!0}),fetch(window.location.origin+"/draft-results",{method:"POST",body:JSON.stringify(c)+"|"+r+"|"+l+"|"+o+"|"+i}).then(function(e){200!==e.status?alert("Error loading draft results."):e.json().then(function(e){"string"==typeof e[0]?alert(e[0]):n.generateDraftOutput(e)})})}}},n.generateDraftOutput=function(e){e===["Draft error!"]&&alert("No players were drafted. :( \nSomething went wrong . . ."),n.setState({isDrafting:!1,userFreqs:e.UserFrequencies,allFreqs:e.AllFrequencies,expectedTeam:e.ExpectedTeam,frequencyData:e.UserFrequencies})},n.toggleFrequencyData=function(e){n.setState({frequencyData:e})},n.state={isLoading:!0,players:[],searchText:"",filteredPlayers:null,site:"espn",userPlayers:[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],teamCount:10,pickOrder:5,roundCount:16,isDrafting:!1,isRandom:!1,allFreqs:[],userFreqs:[],expectedTeam:[],frequencyData:[]},n}return Object(m.a)(t,e),Object(c.a)(t,[{key:"componentDidMount",value:function(){this.fetchPlayersForSimulator(this.state.site)}},{key:"render",value:function(){var e,t,n=this,a=this.state,l=a.isLoading,o=a.players,i=a.filteredPlayers,c=a.site,s=a.userPlayers,u=a.teamCount,m=a.pickOrder,p=a.roundCount,d=a.isDrafting,g=a.isRandom,E=a.userFreqs,v=a.allFreqs,b=a.expectedTeam,P=a.frequencyData;e=l?r.a.createElement("div",{className:"Loading"},r.a.createElement("div",null,r.a.createElement("p",{className:"Loading-text"},"Loading players . . .")),r.a.createElement("div",null,r.a.createElement("img",{src:A.a,className:"App-logo",alt:"football"}))):r.a.createElement(X,{playerList:o,filterList:i,addPlayer:this.addPlayer}),t=d?r.a.createElement("div",{className:"Loading"},r.a.createElement("div",null,r.a.createElement("p",{className:"Loading-text"},"Drafting . . .")),r.a.createElement("div",null,r.a.createElement("img",{src:A.a,className:"App-logo",alt:"football"})),r.a.createElement("div",null,r.a.createElement("button",{onClick:function(){return n.simulateDrafts(!0)},className:"Cancel-draft-button"},"Cancel"))):r.a.createElement(G,{frequencyData:P});var k="espn"===c?"Switch to Yahoo":"Switch to ESPN",w="espn"===c?"#6C00B3":"#CE0000";return r.a.createElement(f.a,{fluid:!0},r.a.createElement(h.a,{bg:"primary",variant:"dark"},r.a.createElement(y.a,{className:"Nav-bar"},r.a.createElement(y.a.Link,{href:"/home"},"Home"),r.a.createElement(y.a.Link,{href:"#about"},"About"),r.a.createElement(y.a.Link,{href:"#instructions"},"Instructions"),r.a.createElement(y.a.Link,{href:"/optimize"},"DFS Optimizer"),r.a.createElement(y.a.Link,{href:"/logout"},"Log Out"))),r.a.createElement("div",{className:"Info-buttons"},r.a.createElement(U,{ref:"about",isModal:!0,width:310,position:"bottom",title:"About Draft Simulator",selector:'a[href$="#about"]'},r.a.createElement("p",null,"Draft Simulator is a fantasy football draft preparation tool."),r.a.createElement("p",null,'More often than not, others in your league will only draft among the "top available players" in each round, which are determined by ESPN\'s preseason rankings.'),r.a.createElement("p",null,"However, Draft Simulator allows you to create and refine your own personal rankings that you can bring to your draft to get the team you've always dreamed of."),r.a.createElement("button",{onClick:this.closeAbout,style:{float:"right",marginTop:"10px",padding:"8px 12px",borderRadius:"6px"}},"Got it!")),r.a.createElement(U,{ref:"instructions",isModal:!0,width:310,position:"bottom",title:"Instructions",selector:'a[href$="#instructions"]'},r.a.createElement("ol",null,r.a.createElement("li",null,"Search for and select players from the player list. These should be players you'd feel strongly about drafting."),r.a.createElement("li",null,'Click "Add" to move them to your preferred list.'),r.a.createElement("li",null,"Drag and drop your players in order of overall preference."),r.a.createElement("li",null,'Adjust the sliders to your desired specifications, then click "Draft".'),r.a.createElement("li",null,'See how often you were able to draft each player under the "Draft Frequency" tab.'),r.a.createElement("li",null,'The "All Players" tab shows the draft frequency of all players taken, not just your preferred players.'),r.a.createElement("li",null,'The "Expected Team" tab shows your most likely fantasy team given the simulations.')),r.a.createElement("button",{onClick:this.closeInstructions,style:{float:"right",marginTop:"10px",padding:"8px 12px",borderRadius:"6px"}},"Let's draft!"))),r.a.createElement("h1",{className:"App-header"},"Draft Simulator"),r.a.createElement("div",{className:"Buttons-and-boxes"},r.a.createElement("div",{className:"Player-list-box"},r.a.createElement("div",null,!i&&r.a.createElement("img",{src:I.a,style:{height:"3vmin",position:"absolute"},alt:"search"}),r.a.createElement("input",{type:"text",style:{height:"25px",width:"90%"},value:this.state.searchText,onClick:this.filterPlayers,onChange:this.filterPlayers},null)),e),r.a.createElement("div",{className:"Player-buttons"},r.a.createElement("button",{onClick:this.clearPlayers,style:{fontSize:16},className:"Clear-button"},"Clear"),r.a.createElement("button",{id:"rankingButton",onClick:this.loadRankings,className:"Ranking-button"},"Load Saved Rankings"),r.a.createElement("button",{id:"swapButton",style:{backgroundColor:w},onClick:this.swapRankings,className:"Swap-button"},k)),r.a.createElement("div",{className:"Player-list-box"},r.a.createElement(Y,{userRoundList:s,removePlayer:this.removePlayer,movePlayer:this.movePlayer,className:"Player-list-box"})),r.a.createElement("div",{className:"Draft-buttons"},r.a.createElement("button",{onClick:this.saveRankings,style:{fontSize:16},className:"Ranking-button"},"Save Player Rankings"),r.a.createElement("button",{onClick:function(){return n.simulateDrafts(!1)},style:{fontSize:16},className:"Draft-button"},"Draft!")),r.a.createElement("div",{className:"Player-list-box"},r.a.createElement("tr",null,r.a.createElement("button",{onClick:function(){return n.toggleFrequencyData(E)},style:{borderStyle:P===E?"inset":"outset"}},"Your Players"),r.a.createElement("button",{onClick:function(){return n.toggleFrequencyData(v)},style:{borderStyle:P===v?"inset":"outset"}},"All Players"),r.a.createElement("button",{onClick:function(){return n.toggleFrequencyData(b)},style:{borderStyle:P===b?"inset":"outset"}},"Expected Team")),t)),r.a.createElement("div",{className:"Slider-row"},r.a.createElement("div",{className:"Sliders"},r.a.createElement("p",null,"Number of teams per draft:"),r.a.createElement("div",null,u),r.a.createElement("input",{type:"range",min:6,max:14,step:2,value:u,onChange:function(e){return n.handleSliderChange("teamCount",e)}})),r.a.createElement("div",{className:"Sliders"},r.a.createElement("p",null,"Your pick in the draft:"),r.a.createElement("div",null,m),r.a.createElement("input",{type:"range",min:1,max:u,value:m,onChange:function(e){return n.handleSliderChange("pickOrder",e)}}),r.a.createElement("form",null,r.a.createElement("label",null,"Randomize:",r.a.createElement("input",{type:"checkbox",checked:g,onChange:this.determineIfRandom})))),r.a.createElement("div",{className:"Sliders"},r.a.createElement("p",null,"Number of rounds per draft:"),r.a.createElement("div",null,p),r.a.createElement("input",{type:"range",min:1,max:16,value:p,onChange:function(e){return n.handleSliderChange("roundCount",e)}}))))}}]),t}(a.Component),K=function(e){function t(){return Object(i.a)(this,t),Object(s.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){return"/home"===window.location.pathname?r.a.createElement(p,null):"/simulate"===window.location.pathname?r.a.createElement(Q,null):"/optimize"===window.location.pathname?r.a.createElement(B,null):void 0}}]),t}(a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(r.a.createElement(K,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[37,1,2]]]);
//# sourceMappingURL=main.d3b63287.chunk.js.map