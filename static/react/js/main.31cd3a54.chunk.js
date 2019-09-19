(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{19:function(e,t,n){},23:function(e,t,n){e.exports=n.p+"media/football.c5005feb.ico"},27:function(e,t,n){e.exports=n.p+"media/football2.fac02615.svg"},32:function(e,t,n){e.exports=n.p+"media/search.04c89f3b.ico"},34:function(e,t,n){e.exports=n(67)},40:function(e,t,n){},41:function(e,t,n){e.exports=n.p+"media/cloudy.340c3269.ico"},42:function(e,t,n){e.exports=n.p+"media/partlycloudy.a5e52894.ico"},43:function(e,t,n){e.exports=n.p+"media/rainy.dda0cf39.ico"},44:function(e,t,n){e.exports=n.p+"media/snowy.203024ab.ico"},45:function(e,t,n){e.exports=n.p+"media/stormy.ca70c957.ico"},46:function(e,t,n){e.exports=n.p+"media/sunny.a306062d.ico"},63:function(e,t,n){e.exports=n.p+"media/plus.220c44df.ico"},64:function(e,t,n){e.exports=n.p+"media/minus.5edbe473.ico"},65:function(e,t,n){e.exports=n.p+"media/up.04732abf.ico"},66:function(e,t,n){e.exports=n.p+"media/down.61889039.ico"},67:function(e,t,n){"use strict";n.r(t);var a=n(0),o=n.n(a),r=n(15),l=n.n(r),i=(n(40),n(5)),s=n(6),c=n(9),u=n(7),m=n(10),p=(n(19),function(e){function t(){return Object(i.a)(this,t),Object(c.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(s.a)(t,[{key:"render",value:function(){return o.a.createElement("div",{className:"Home"},o.a.createElement("h1",{className:"Home-header"},"Welcome to Draft Simulator!"),o.a.createElement("h3",{className:"Dfs-header"},"To start, click the link below:"),o.a.createElement("div",{className:"Home-buttons"},o.a.createElement("button",{onClick:function(){window.location.href=window.location.origin+"/simulate"},className:"Site-button"},"Simulator")),o.a.createElement("h3",{className:"Dfs-header"},"Or, check out our DFS Optimizer:"),o.a.createElement("button",{onClick:function(){window.location.href=window.location.origin+"/optimize"},className:"Dfs-button"},"DFS Optimizer"),o.a.createElement("button",{onClick:function(){window.location.href=window.location.origin+"/logout"},className:"Logout-button"},"Log Out"))}}]),t}(a.Component)),f=n(69),d=n(70),h=n(71),y=n(41),v=n(42),g=n(43),E=n(44),b=n(45),P=n(46),k=function(e){var t=e.player.Weather.forecast?e.player.Weather.forecast.toLowerCase():null,n=e.player.Weather.forecast?t.includes("partly")?v:t.includes("cloud")||t.includes("fog")?y:t.includes("storm")||t.includes("thunder")?b:t.includes("rain")||t.includes("shower")?g:t.includes("snow")||t.includes("flurr")?E:t.includes("sun")||t.includes("clear")?P:null:null;return a.createElement("tr",null,a.createElement("td",null,e.player.Position&&a.createElement("button",{onClick:e.onRemove,style:{fontWeight:"bold"}},"X")),a.createElement("td",null,e.player.Position),a.createElement("td",null,e.player.Team),a.createElement("td",{style:{fontWeight:e.player.Position?"normal":"bold"}},e.player.Name," ",a.createElement("b",{style:{color:"red"}},e.player.Status)),a.createElement("td",{style:{fontWeight:e.player.Position?"normal":"bold"}},e.player.Projected),a.createElement("td",{style:{fontWeight:e.player.Position?"normal":"bold"}},e.player.Price),a.createElement("td",null,e.player.Opp),a.createElement("td",{style:{display:"flex",alignItems:"center"}},e.player.Weather.forecast&&a.createElement("img",{src:n,alt:"weather",style:{height:"4vmin"}}),a.createElement("p",null,e.player.Weather.details)))},w=function(e){return a.createElement("table",{className:"Dfs-grid"},a.createElement("tr",{style:{backgroundColor:"fd"===e.site?"dodgerblue":"black"}},a.createElement("th",null,"Exclude"),a.createElement("th",null,"Position"),a.createElement("th",null,"Team"),a.createElement("th",null,"Player"),a.createElement("th",null,"Projected"),a.createElement("th",null,"Price"),a.createElement("th",null,"Opp"),a.createElement("th",null,"Weather")),e.dfsLineup.map(function(t,n){return a.createElement(k,{player:t,onRemove:function(){return e.removePlayer(n,e.site)}})}))},S=n(27),x=n.n(S),C=function(e){function t(e){var n;return Object(i.a)(this,t),(n=Object(c.a)(this,Object(u.a)(t).call(this,e))).dfsSportChange=function(e){var t=e.target.value;"none"!==t&&n.fetchOptimalLineups(t,n.state.slate)},n.slateChange=function(e){var t=e.target.value;n.fetchOptimalLineups(n.state.sport,t)},n.fetchOptimalLineups=function(e,t){if(e){var a=n.state.sport;n.setState({isLoading:!0,sport:e,slate:t}),fetch(window.location.origin+"/optimized-lineup/"+e+"/"+t).then(function(t){200!==t.status?alert("Failed to generate lineups."):t.json().then(function(t){n.ingestDfsLineup(t,e,a,!1)})})}else alert("Please select a sport.")},n.ingestDfsLineup=function(e,t,a,o){if(!o){if(1===e.length)return n.setState({isLoading:!1,sport:a}),void alert(e[0]);"string"===typeof e[0]?alert(e[0]):2===e.length&&"string"===e[1]&&alert(e[1])}var r="string"===typeof e[0]?[]:e[0],l="string"===typeof e[1]?[]:e[1];n.setState({isLoading:!1,fdLineup:r,dkLineup:l})},n.removePlayerFromDfsLineup=function(e,t){var a=n.state,o=a.sport,r=a.slate,l="fd"===t?n.state.fdLineup[e].Name:n.state.dkLineup[e].Name;fetch(window.location.origin+"/optimized-lineup/"+o+"/"+r,{method:"POST",body:l+"|"+t}).then(function(e){200!==e.status?alert("Error removing player."):e.json().then(function(e){n.ingestDfsLineup(e,o,o,!0),alert("You have removed "+l+("fd"===t?" from your Fanduel lineup.":" from your Draftkings lineup."))})})},n.fetchReportingData=function(e,t){if(e){n.state.sport;n.setState({isLoading:!0,sport:e,slate:t}),fetch(window.location.origin+"/optimize/reporting/"+e+"/"+t).then(function(e){200!==e.status?alert("Failed to generate report."):e.json().then(function(e){console.log(e)})})}else alert("Please select a sport.")},n.state={isLoading:!1,sport:"",slate:"main",fdLineup:[],dkLineup:[]},n}return Object(m.a)(t,e),Object(s.a)(t,[{key:"render",value:function(){var e,t=this,n=this.state,a=n.isLoading,r=n.sport,l=n.slate,i=n.fdLineup,s=n.dkLineup;return e=a?o.a.createElement("div",{className:"Loading"},o.a.createElement("div",null,o.a.createElement("p",{className:"Optimizing-text"},"Optimizing . . .")),o.a.createElement("div",null,o.a.createElement("img",{src:x.a,className:"App-logo2",alt:"football2"}))):o.a.createElement("div",{className:"Dfs-grid-section"},o.a.createElement("div",null,o.a.createElement("h2",{className:"Dfs-header"},"Fanduel"),o.a.createElement(w,{dfsLineup:i,removePlayer:this.removePlayerFromDfsLineup,site:"fd"})),o.a.createElement("div",null,o.a.createElement("h2",{className:"Dfs-header"},"Draftkings"),o.a.createElement(w,{dfsLineup:s,removePlayer:this.removePlayerFromDfsLineup,site:"dk"}))),o.a.createElement(f.a,{fluid:!0},o.a.createElement(d.a,{bg:"primary",variant:"dark"},o.a.createElement(h.a,{className:"Nav-bar"},o.a.createElement(h.a.Link,{href:"/home"},"Home"),o.a.createElement(h.a.Link,{href:"/simulate"},"Back to Draft Simulator"),o.a.createElement(h.a.Link,{href:"/logout"},"Logout"))),o.a.createElement("h1",{className:"App-header"},"DFS Optimizer"),o.a.createElement("div",{className:"Dfs-sport"},o.a.createElement("h3",null,"Choose a sport:"),o.a.createElement("select",{className:"Drop-down",onChange:this.dfsSportChange,value:r},o.a.createElement("option",{value:"none"}," "),o.a.createElement("option",{value:"mlb"},"MLB"),o.a.createElement("option",{value:"nfl"},"NFL"),o.a.createElement("option",{value:"nba"},"NBA")),"nfl"===r&&o.a.createElement("h3",null,"Choose a game slate:"),"nfl"===r&&o.a.createElement("select",{className:"Drop-down",onChange:this.slateChange,value:l},o.a.createElement("option",{value:"thurs"},"Thurs only"),o.a.createElement("option",{value:"thurs-mon"},"Thurs - Mon"),o.a.createElement("option",{value:"main"},"Sun (Main)"),o.a.createElement("option",{value:"sun-mon"},"Sun - Mon")),o.a.createElement("button",{style:{marginTop:"10px"},onClick:function(){return t.fetchOptimalLineups(r,l)}},"Reset"),o.a.createElement("button",{style:{marginTop:"10px"},onClick:function(){return t.fetchReportingData(r,l)}},"Report")),e)}}]),t}(a.Component),j=n(31),D=(n(58),n(59),n(62),window.JQXLite),N=(window.jqx,function(e){function t(e){var n;Object(i.a)(this,t),n=Object(c.a)(this,Object(u.a)(t).call(this,e));var a="jqxPopover"+D.generateID();return n.componentSelector="#"+a,n.state={id:a},n}return Object(m.a)(t,e),Object(s.a)(t,[{key:"componentDidMount",value:function(){var e=this.manageAttributes();this.createComponent(e)}},{key:"manageAttributes",value:function(){var e=["arrowOffsetValue","animationOpenDelay","animationCloseDelay","autoClose","animationType","height","initContent","isModal","offset","position","rtl","selector","showArrow","showCloseButton","width","title","theme"],t={};for(var n in this.props)if("settings"===n)for(var a in this.props[n])t[a]=this.props[n][a];else-1!==e.indexOf(n)&&(t[n]=this.props[n]);return t}},{key:"createComponent",value:function(e){if(!this.style)for(var t in this.props.style)D(this.componentSelector).css(t,this.props.style[t]);if(void 0!==this.props.className)for(var n=this.props.className.split(" "),a=0;a<n.length;a++)D(this.componentSelector).addClass(n[a]);this.template||D(this.componentSelector).html(this.props.template),D(this.componentSelector).jqxPopover(e)}},{key:"setOptions",value:function(e){D(this.componentSelector).jqxPopover("setOptions",e)}},{key:"getOptions",value:function(){if(0===arguments.length)throw Error("At least one argument expected in getOptions()!");for(var e={},t=0;t<arguments.length;t++)e[arguments[t]]=D(this.componentSelector).jqxPopover(arguments[t]);return e}},{key:"on",value:function(e,t){D(this.componentSelector).on(e,t)}},{key:"off",value:function(e){D(this.componentSelector).off(e)}},{key:"arrowOffsetValue",value:function(e){if(void 0===e)return D(this.componentSelector).jqxPopover("arrowOffsetValue");D(this.componentSelector).jqxPopover("arrowOffsetValue",e)}},{key:"animationOpenDelay",value:function(e){if(void 0===e)return D(this.componentSelector).jqxPopover("animationOpenDelay");D(this.componentSelector).jqxPopover("animationOpenDelay",e)}},{key:"animationCloseDelay",value:function(e){if(void 0===e)return D(this.componentSelector).jqxPopover("animationCloseDelay");D(this.componentSelector).jqxPopover("animationCloseDelay",e)}},{key:"autoClose",value:function(e){if(void 0===e)return D(this.componentSelector).jqxPopover("autoClose");D(this.componentSelector).jqxPopover("autoClose",e)}},{key:"animationType",value:function(e){if(void 0===e)return D(this.componentSelector).jqxPopover("animationType");D(this.componentSelector).jqxPopover("animationType",e)}},{key:"height",value:function(e){if(void 0===e)return D(this.componentSelector).jqxPopover("height");D(this.componentSelector).jqxPopover("height",e)}},{key:"initContent",value:function(e){if(void 0===e)return D(this.componentSelector).jqxPopover("initContent");D(this.componentSelector).jqxPopover("initContent",e)}},{key:"isModal",value:function(e){if(void 0===e)return D(this.componentSelector).jqxPopover("isModal");D(this.componentSelector).jqxPopover("isModal",e)}},{key:"offset",value:function(e){if(void 0===e)return D(this.componentSelector).jqxPopover("offset");D(this.componentSelector).jqxPopover("offset",e)}},{key:"position",value:function(e){if(void 0===e)return D(this.componentSelector).jqxPopover("position");D(this.componentSelector).jqxPopover("position",e)}},{key:"rtl",value:function(e){if(void 0===e)return D(this.componentSelector).jqxPopover("rtl");D(this.componentSelector).jqxPopover("rtl",e)}},{key:"selector",value:function(e){if(void 0===e)return D(this.componentSelector).jqxPopover("selector");D(this.componentSelector).jqxPopover("selector",e)}},{key:"showArrow",value:function(e){if(void 0===e)return D(this.componentSelector).jqxPopover("showArrow");D(this.componentSelector).jqxPopover("showArrow",e)}},{key:"showCloseButton",value:function(e){if(void 0===e)return D(this.componentSelector).jqxPopover("showCloseButton");D(this.componentSelector).jqxPopover("showCloseButton",e)}},{key:"width",value:function(e){if(void 0===e)return D(this.componentSelector).jqxPopover("width");D(this.componentSelector).jqxPopover("width",e)}},{key:"title",value:function(e){if(void 0===e)return D(this.componentSelector).jqxPopover("title");D(this.componentSelector).jqxPopover("title",e)}},{key:"theme",value:function(e){if(void 0===e)return D(this.componentSelector).jqxPopover("theme");D(this.componentSelector).jqxPopover("theme",e)}},{key:"close",value:function(){D(this.componentSelector).jqxPopover("close")}},{key:"destroy",value:function(){D(this.componentSelector).jqxPopover("destroy")}},{key:"open",value:function(){D(this.componentSelector).jqxPopover("open")}},{key:"render",value:function(){return o.a.createElement("div",{id:this.state.id},this.props.value,this.props.children)}}]),t}(o.a.Component)),L=n(63),q=n(64),O=n(65),R=n(66),T=function(e){return a.createElement("tr",null,a.createElement("td",null,e.player.Rank),a.createElement("td",null,a.createElement("tr",{style:{fontWeight:"bold"}},e.player.Name),a.createElement("tr",null,e.player.Team," ",e.player.Position)),a.createElement("td",null,a.createElement("img",{src:e.isUserPlayer?q:L,alt:"add-or-remove",onClick:e.onChange,style:{height:"3vmin"}})),e.isUserPlayer&&a.createElement("td",{style:{display:"flex",flexDirection:"column"}},a.createElement("img",{src:O,alt:"up",onClick:function(){return e.onMove("up")},style:{height:"3vmin"}}),a.createElement("img",{src:R,alt:"down",onClick:function(){return e.onMove("down")},style:{height:"3vmin"}})))},F=function(e){return a.createElement("table",{style:{borderCollapse:"collapse"},className:"Draft-grid"},e.playerList.map(function(t,n){if(!e.filterList||e.filterList.includes(t))return a.createElement(T,{player:t,isUserPlayer:!1,onChange:function(){return e.addPlayer(n)},onMove:null})}))},A=function(e){return e.userRoundList.map(function(t,n){return a.createElement("table",{style:{borderCollapse:"collapse",marginBottom:"5vmin"},className:"Draft-grid"},a.createElement("th",{colSpan:4,style:{textAlign:"center"}},"Round "+(n+1)),t.map(function(t,o){return a.createElement(T,{player:t,isUserPlayer:!0,onChange:function(){return e.removePlayer(n,o)},onMove:function(t){return e.movePlayer(n,o,t)}})}))})},M=function(e){return a.createElement("table",null,a.createElement("tr",null,a.createElement("th",null,"Player"),a.createElement("th",null,"Round"),a.createElement("th",null,"Draft Frequency")),e.frequencyData.map(function(e){return a.createElement("tr",null,a.createElement("td",null,a.createElement("tr",{style:{fontWeight:"bold"}},e.Name),a.createElement("tr",null,e.Team," ",e.Position)),a.createElement("td",null,e.Round),a.createElement("td",null,e.Frequency))}))},z=n(23),W=n.n(z),B=n(32),I=n.n(B),U=function(e){function t(e){var n;return Object(i.a)(this,t),(n=Object(c.a)(this,Object(u.a)(t).call(this,e))).fetchPlayersForSimulator=function(e){n.setState({isLoading:!0}),fetch(window.location.origin+"/"+e+"-players").then(function(t){200!==t.status?alert("Could not load players."):t.json().then(function(t){n.setState({isLoading:!1,players:t,site:e})})})},n.handleSliderChange=function(e,t){n.setState(Object(j.a)({},e,t.target.value))},n.closeAbout=function(){n.refs.about.close();var e=window.location.pathname.split("#");window.location.href=window.location.origin+e[0].toString()+"#"},n.closeInstructions=function(){n.refs.instructions.close();var e=window.location.pathname.split("#");window.location.href=window.location.origin+e[0].toString()+"#"},n.swapRankings=function(){var e="espn"===n.state.site?"yahoo":"espn";n.fetchPlayersForSimulator(e)},n.saveRankings=function(){var e=n.state,t=e.userPlayers,a=e.site;t.every(function(e){return 0===e.length})?alert("Please rank at least one player before saving."):fetch(window.location.origin+"/save-ranking/"+a,{method:"POST",body:JSON.stringify(t)}).then(function(e){200===e.status?alert("User ranking saved successfully."):alert("User ranking unable to be saved.")})},n.loadRankings=function(){var e=n.state.site;fetch(window.location.origin+"/load-ranking/"+e).then(function(e){200!==e.status?alert("Could not load user ranking data."):e.json().then(function(e){if("No ranking specified."===e[0])alert(e[0]);else{var t=n.state,a=t.players,o=t.userPlayers,r=a.concat(o.flat());a=r.sort(function(e,t){return e.Rank-t.Rank});for(var l=e.flat(),i=function(e){var t=l[e].Rank,n=a.findIndex(function(e){return e.Rank===t});a.splice(n,1)},s=0;s<l.length;s++)i(s);n.setState({players:a,userPlayers:e,filteredPlayers:null})}})})},n.filterPlayers=function(e){var t=e.target.value.toLowerCase(),a=n.state.players.filter(function(e){return e.Name.toLowerCase().includes(t)||e.Position.toLowerCase().includes(t)||e.Team.toLowerCase().includes(t)});n.setState({searchText:t,filteredPlayers:a})},n.addPlayer=function(e){var t=n.state,a=t.players,o=t.userPlayers,r=a[e];a.splice(e,1),o[0].push(r),n.setState({players:a,userPlayers:o,filteredPlayers:null,searchText:""})},n.removePlayer=function(e,t){var a=n.state,o=a.players,r=a.userPlayers,l=r[e],i=l[t],s=i.Rank,c=o.find(function(e){return e.Rank>s});o.splice(o.indexOf(c),0,i),l.splice(t,1),n.setState({players:o,userPlayers:r})},n.clearPlayers=function(){var e=n.state,t=e.players,a=e.userPlayers.flat(),o=t.concat(a);n.setState({players:o.sort(function(e,t){return e.Rank-t.Rank}),userPlayers:[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],filteredPlayers:null})},n.movePlayer=function(e,t,a){var o=n.state.userPlayers,r=o[e],l=r[t];o[e].splice(t,1),"up"===a?t>0?o[e].splice(t-1,0,l):e>0?o[e-1].push(l):o[e].splice(t,0,l):"down"===a&&(t<r.length?r.splice(t+1,0,l):e<o.length-1?o[e+1].splice(0,0,l):o[e].splice(t,0,l)),n.setState({userPlayers:o})},n.determineIfRandom=function(e){n.setState({isRandom:e.target.checked})},n.simulateDrafts=function(e){if(e)n.setState({isDrafting:!1});else{var t=n.state,a=t.userPlayers,o=t.teamCount,r=t.pickOrder,l=t.roundCount,i=t.site;if(a.every(function(e){return 0===e.length}))alert("Please select at least one player to draft.");else{var s=a.map(function(e){return e.map(function(e){return e.Name})});n.setState({isDrafting:!0}),fetch(window.location.origin+"/draft-results",{method:"POST",body:JSON.stringify(s)+"|"+o+"|"+r+"|"+l+"|"+i}).then(function(e){200!==e.status?alert("Error loading draft results."):e.json().then(function(e){"string"==typeof e[0]?alert(e[0]):n.generateDraftOutput(e)})})}}},n.generateDraftOutput=function(e){e===["Draft error!"]&&alert("No players were drafted. :( \nSomething went wrong . . ."),n.setState({isDrafting:!1,userFreqs:e.UserFrequencies,allFreqs:e.AllFrequencies,expectedTeam:e.ExpectedTeam,frequencyData:e.UserFrequencies})},n.toggleFrequencyData=function(e){n.setState({frequencyData:e})},n.state={isLoading:!0,players:[],searchText:"",filteredPlayers:null,site:"espn",userPlayers:[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],teamCount:10,pickOrder:5,roundCount:16,isDrafting:!1,isRandom:!1,allFreqs:[],userFreqs:[],expectedTeam:[],frequencyData:[]},n}return Object(m.a)(t,e),Object(s.a)(t,[{key:"componentDidMount",value:function(){this.fetchPlayersForSimulator(this.state.site)}},{key:"render",value:function(){var e,t,n=this,a=this.state,r=a.isLoading,l=a.players,i=a.filteredPlayers,s=a.site,c=a.userPlayers,u=a.teamCount,m=a.pickOrder,p=a.roundCount,y=a.isDrafting,v=a.isRandom,g=a.userFreqs,E=a.allFreqs,b=a.expectedTeam,P=a.frequencyData;e=r?o.a.createElement("div",{className:"Loading"},o.a.createElement("div",null,o.a.createElement("p",{className:"Loading-text"},"Loading players . . .")),o.a.createElement("div",null,o.a.createElement("img",{src:W.a,className:"App-logo",alt:"football"}))):o.a.createElement(F,{playerList:l,filterList:i,addPlayer:this.addPlayer}),t=y?o.a.createElement("div",{className:"Loading"},o.a.createElement("div",null,o.a.createElement("p",{className:"Loading-text"},"Drafting . . .")),o.a.createElement("div",null,o.a.createElement("img",{src:W.a,className:"App-logo",alt:"football"})),o.a.createElement("div",null,o.a.createElement("button",{onClick:function(){return n.simulateDrafts(!0)},className:"Cancel-draft-button"},"Cancel"))):o.a.createElement(M,{frequencyData:P});var k="espn"===s?"Switch to Yahoo":"Switch to ESPN",w="espn"===s?"#6C00B3":"#CE0000";return o.a.createElement(f.a,{fluid:!0},o.a.createElement(d.a,{bg:"primary",variant:"dark"},o.a.createElement(h.a,{className:"Nav-bar"},o.a.createElement(h.a.Link,{href:"/"},"Home"),o.a.createElement(h.a.Link,{href:"#about"},"About"),o.a.createElement(h.a.Link,{href:"#instructions"},"Instructions"),o.a.createElement(h.a.Link,{href:"/optimize"},"DFS Optimizer"),o.a.createElement(h.a.Link,{href:"/logout"},"Logout"))),o.a.createElement("div",{className:"Info-buttons"},o.a.createElement(N,{ref:"about",isModal:!0,width:310,position:"bottom",title:"About Draft Simulator",selector:'a[href$="#about"]'},o.a.createElement("p",null,"Draft Simulator is a fantasy football draft preparation tool."),o.a.createElement("p",null,'More often than not, others in your league will only draft among the "top available players" in each round, which are determined by ESPN\'s preseason rankings.'),o.a.createElement("p",null,"However, Draft Simulator allows you to create and refine your own personal rankings that you can bring to your draft to get the team you've always dreamed of."),o.a.createElement("button",{onClick:this.closeAbout,style:{float:"right",marginTop:"10px",padding:"8px 12px",borderRadius:"6px"}},"Got it!")),o.a.createElement(N,{ref:"instructions",isModal:!0,width:310,position:"bottom",title:"Instructions",selector:'a[href$="#instructions"]'},o.a.createElement("ol",null,o.a.createElement("li",null,"Search for and select players from the player list. These should be players you'd feel strongly about drafting."),o.a.createElement("li",null,'Click "Add" to move them to your preferred list.'),o.a.createElement("li",null,"Drag and drop your players in order of overall preference."),o.a.createElement("li",null,'Adjust the sliders to your desired specifications, then click "Draft".'),o.a.createElement("li",null,'See how often you were able to draft each player under the "Draft Frequency" tab.'),o.a.createElement("li",null,'The "All Players" tab shows the draft frequency of all players taken, not just your preferred players.'),o.a.createElement("li",null,'The "Expected Team" tab shows your most likely fantasy team given the simulations.')),o.a.createElement("button",{onClick:this.closeInstructions,style:{float:"right",marginTop:"10px",padding:"8px 12px",borderRadius:"6px"}},"Let's draft!"))),o.a.createElement("h1",{className:"App-header"},"Draft Simulator"),o.a.createElement("div",{className:"Buttons-and-boxes"},o.a.createElement("div",{className:"Player-list-box"},o.a.createElement("div",null,!i&&o.a.createElement("img",{src:I.a,style:{height:"3vmin",position:"absolute"},alt:"search"}),o.a.createElement("input",{type:"text",style:{height:"25px",width:"90%"},value:this.state.searchText,onClick:this.filterPlayers,onChange:this.filterPlayers},null)),e),o.a.createElement("div",{className:"Player-buttons"},o.a.createElement("button",{onClick:this.clearPlayers,style:{fontSize:16},className:"Clear-button"},"Clear"),o.a.createElement("button",{id:"rankingButton",onClick:this.loadRankings,className:"Ranking-button"},"Load Saved Rankings"),o.a.createElement("button",{id:"swapButton",style:{backgroundColor:w},onClick:this.swapRankings,className:"Swap-button"},k)),o.a.createElement("div",{className:"Player-list-box"},o.a.createElement(A,{userRoundList:c,removePlayer:this.removePlayer,movePlayer:this.movePlayer,className:"Player-list-box"})),o.a.createElement("div",{className:"Draft-buttons"},o.a.createElement("button",{onClick:this.saveRankings,style:{fontSize:16},className:"Ranking-button"},"Save Player Rankings"),o.a.createElement("button",{onClick:function(){return n.simulateDrafts(!1)},style:{fontSize:16},className:"Draft-button"},"Draft!")),o.a.createElement("div",{className:"Player-list-box"},o.a.createElement("tr",null,o.a.createElement("button",{onClick:function(){return n.toggleFrequencyData(g)},style:{borderStyle:P===g?"inset":"outset"}},"Your Players"),o.a.createElement("button",{onClick:function(){return n.toggleFrequencyData(E)},style:{borderStyle:P===E?"inset":"outset"}},"All Players"),o.a.createElement("button",{onClick:function(){return n.toggleFrequencyData(b)},style:{borderStyle:P===b?"inset":"outset"}},"Expected Team")),t)),o.a.createElement("div",{className:"Slider-row"},o.a.createElement("div",{className:"Sliders"},o.a.createElement("p",null,"Number of teams per draft:"),o.a.createElement("div",null,u),o.a.createElement("input",{type:"range",min:6,max:14,step:2,value:u,onChange:function(e){return n.handleSliderChange("teamCount",e)}})),o.a.createElement("div",{className:"Sliders"},o.a.createElement("p",null,"Your pick in the draft:"),o.a.createElement("div",null,m),o.a.createElement("input",{type:"range",min:1,max:u,value:m,onChange:function(e){return n.handleSliderChange("pickOrder",e)}}),o.a.createElement("form",null,o.a.createElement("label",null,"Randomize:",o.a.createElement("input",{type:"checkbox",checked:v,onChange:this.determineIfRandom})))),o.a.createElement("div",{className:"Sliders"},o.a.createElement("p",null,"Number of rounds per draft:"),o.a.createElement("div",null,p),o.a.createElement("input",{type:"range",min:1,max:16,value:p,onChange:function(e){return n.handleSliderChange("roundCount",e)}}))))}}]),t}(a.Component),H=function(e){function t(){return Object(i.a)(this,t),Object(c.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(s.a)(t,[{key:"render",value:function(){return"/home"===window.location.pathname?o.a.createElement(p,null):"/simulate"===window.location.pathname?o.a.createElement(U,null):"/optimize"===window.location.pathname?o.a.createElement(C,null):void 0}}]),t}(a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));l.a.render(o.a.createElement(H,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[34,1,2]]]);
//# sourceMappingURL=main.31cd3a54.chunk.js.map