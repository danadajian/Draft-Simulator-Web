(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{12:function(e,t,o){e.exports=o(30)},18:function(e,t,o){},21:function(e,t,o){},30:function(e,t,o){"use strict";o.r(t);var n=o(0),i=o.n(n),r=o(11),c=o.n(r),s=(o(18),o(1)),l=o.n(s),a=o(2),u=o(3),x=o(4),h=o(6),f=o(5),m=o(7),p=(o(21),o(22),o(23),o(25),o(26),o(27),o(28),o(29),window.JQXLite),d=(window.jqx,function(e){function t(e){var o;Object(u.a)(this,t),o=Object(h.a)(this,Object(f.a)(t).call(this,e));var n="jqxListBox"+p.generateID();return o.componentSelector="#"+n,o.state={id:n},o}return Object(m.a)(t,e),Object(x.a)(t,[{key:"componentDidMount",value:function(){var e=this.manageAttributes();this.createComponent(e)}},{key:"manageAttributes",value:function(){var e=["autoHeight","allowDrag","allowDrop","checkboxes","disabled","displayMember","dropAction","dragStart","dragEnd","enableHover","enableSelection","equalItemsWidth","filterable","filterHeight","filterDelay","filterPlaceHolder","height","hasThreeStates","itemHeight","incrementalSearch","incrementalSearchDelay","multiple","multipleextended","renderer","rendered","rtl","selectedIndex","selectedIndexes","source","scrollBarSize","searchMode","theme","valueMember","width"],t={};for(var o in this.props)if("settings"===o)for(var n in this.props[o])t[n]=this.props[o][n];else-1!==e.indexOf(o)&&(t[o]=this.props[o]);return t}},{key:"createComponent",value:function(e){if(!this.style)for(var t in this.props.style)p(this.componentSelector).css(t,this.props.style[t]);if(void 0!==this.props.className)for(var o=this.props.className.split(" "),n=0;n<o.length;n++)p(this.componentSelector).addClass(o[n]);this.template||p(this.componentSelector).html(this.props.template),p(this.componentSelector).jqxListBox(e)}},{key:"setOptions",value:function(e){p(this.componentSelector).jqxListBox("setOptions",e)}},{key:"getOptions",value:function(){if(0===arguments.length)throw Error("At least one argument expected in getOptions()!");for(var e={},t=0;t<arguments.length;t++)e[arguments[t]]=p(this.componentSelector).jqxListBox(arguments[t]);return e}},{key:"on",value:function(e,t){p(this.componentSelector).on(e,t)}},{key:"off",value:function(e){p(this.componentSelector).off(e)}},{key:"autoHeight",value:function(e){if(void 0===e)return p(this.componentSelector).jqxListBox("autoHeight");p(this.componentSelector).jqxListBox("autoHeight",e)}},{key:"allowDrag",value:function(e){if(void 0===e)return p(this.componentSelector).jqxListBox("allowDrag");p(this.componentSelector).jqxListBox("allowDrag",e)}},{key:"allowDrop",value:function(e){if(void 0===e)return p(this.componentSelector).jqxListBox("allowDrop");p(this.componentSelector).jqxListBox("allowDrop",e)}},{key:"checkboxes",value:function(e){if(void 0===e)return p(this.componentSelector).jqxListBox("checkboxes");p(this.componentSelector).jqxListBox("checkboxes",e)}},{key:"disabled",value:function(e){if(void 0===e)return p(this.componentSelector).jqxListBox("disabled");p(this.componentSelector).jqxListBox("disabled",e)}},{key:"displayMember",value:function(e){if(void 0===e)return p(this.componentSelector).jqxListBox("displayMember");p(this.componentSelector).jqxListBox("displayMember",e)}},{key:"dropAction",value:function(e){if(void 0===e)return p(this.componentSelector).jqxListBox("dropAction");p(this.componentSelector).jqxListBox("dropAction",e)}},{key:"dragStart",value:function(e){if(void 0===e)return p(this.componentSelector).jqxListBox("dragStart");p(this.componentSelector).jqxListBox("dragStart",e)}},{key:"dragEnd",value:function(e){if(void 0===e)return p(this.componentSelector).jqxListBox("dragEnd");p(this.componentSelector).jqxListBox("dragEnd",e)}},{key:"enableHover",value:function(e){if(void 0===e)return p(this.componentSelector).jqxListBox("enableHover");p(this.componentSelector).jqxListBox("enableHover",e)}},{key:"enableSelection",value:function(e){if(void 0===e)return p(this.componentSelector).jqxListBox("enableSelection");p(this.componentSelector).jqxListBox("enableSelection",e)}},{key:"equalItemsWidth",value:function(e){if(void 0===e)return p(this.componentSelector).jqxListBox("equalItemsWidth");p(this.componentSelector).jqxListBox("equalItemsWidth",e)}},{key:"filterable",value:function(e){if(void 0===e)return p(this.componentSelector).jqxListBox("filterable");p(this.componentSelector).jqxListBox("filterable",e)}},{key:"filterHeight",value:function(e){if(void 0===e)return p(this.componentSelector).jqxListBox("filterHeight");p(this.componentSelector).jqxListBox("filterHeight",e)}},{key:"filterDelay",value:function(e){if(void 0===e)return p(this.componentSelector).jqxListBox("filterDelay");p(this.componentSelector).jqxListBox("filterDelay",e)}},{key:"filterPlaceHolder",value:function(e){if(void 0===e)return p(this.componentSelector).jqxListBox("filterPlaceHolder");p(this.componentSelector).jqxListBox("filterPlaceHolder",e)}},{key:"height",value:function(e){if(void 0===e)return p(this.componentSelector).jqxListBox("height");p(this.componentSelector).jqxListBox("height",e)}},{key:"hasThreeStates",value:function(e){if(void 0===e)return p(this.componentSelector).jqxListBox("hasThreeStates");p(this.componentSelector).jqxListBox("hasThreeStates",e)}},{key:"itemHeight",value:function(e){if(void 0===e)return p(this.componentSelector).jqxListBox("itemHeight");p(this.componentSelector).jqxListBox("itemHeight",e)}},{key:"incrementalSearch",value:function(e){if(void 0===e)return p(this.componentSelector).jqxListBox("incrementalSearch");p(this.componentSelector).jqxListBox("incrementalSearch",e)}},{key:"incrementalSearchDelay",value:function(e){if(void 0===e)return p(this.componentSelector).jqxListBox("incrementalSearchDelay");p(this.componentSelector).jqxListBox("incrementalSearchDelay",e)}},{key:"multiple",value:function(e){if(void 0===e)return p(this.componentSelector).jqxListBox("multiple");p(this.componentSelector).jqxListBox("multiple",e)}},{key:"multipleextended",value:function(e){if(void 0===e)return p(this.componentSelector).jqxListBox("multipleextended");p(this.componentSelector).jqxListBox("multipleextended",e)}},{key:"renderer",value:function(e){if(void 0===e)return p(this.componentSelector).jqxListBox("renderer");p(this.componentSelector).jqxListBox("renderer",e)}},{key:"rendered",value:function(e){if(void 0===e)return p(this.componentSelector).jqxListBox("rendered");p(this.componentSelector).jqxListBox("rendered",e)}},{key:"rtl",value:function(e){if(void 0===e)return p(this.componentSelector).jqxListBox("rtl");p(this.componentSelector).jqxListBox("rtl",e)}},{key:"selectedIndex",value:function(e){if(void 0===e)return p(this.componentSelector).jqxListBox("selectedIndex");p(this.componentSelector).jqxListBox("selectedIndex",e)}},{key:"selectedIndexes",value:function(e){if(void 0===e)return p(this.componentSelector).jqxListBox("selectedIndexes");p(this.componentSelector).jqxListBox("selectedIndexes",e)}},{key:"source",value:function(e){if(void 0===e)return p(this.componentSelector).jqxListBox("source");p(this.componentSelector).jqxListBox("source",e)}},{key:"scrollBarSize",value:function(e){if(void 0===e)return p(this.componentSelector).jqxListBox("scrollBarSize");p(this.componentSelector).jqxListBox("scrollBarSize",e)}},{key:"searchMode",value:function(e){if(void 0===e)return p(this.componentSelector).jqxListBox("searchMode");p(this.componentSelector).jqxListBox("searchMode",e)}},{key:"theme",value:function(e){if(void 0===e)return p(this.componentSelector).jqxListBox("theme");p(this.componentSelector).jqxListBox("theme",e)}},{key:"valueMember",value:function(e){if(void 0===e)return p(this.componentSelector).jqxListBox("valueMember");p(this.componentSelector).jqxListBox("valueMember",e)}},{key:"width",value:function(e){if(void 0===e)return p(this.componentSelector).jqxListBox("width");p(this.componentSelector).jqxListBox("width",e)}},{key:"addItem",value:function(e){return p(this.componentSelector).jqxListBox("addItem",e)}},{key:"beginUpdate",value:function(){p(this.componentSelector).jqxListBox("beginUpdate")}},{key:"clear",value:function(){p(this.componentSelector).jqxListBox("clear")}},{key:"clearSelection",value:function(){p(this.componentSelector).jqxListBox("clearSelection")}},{key:"checkIndex",value:function(e){p(this.componentSelector).jqxListBox("checkIndex",e)}},{key:"checkItem",value:function(e){p(this.componentSelector).jqxListBox("checkItem",e)}},{key:"checkAll",value:function(){p(this.componentSelector).jqxListBox("checkAll")}},{key:"clearFilter",value:function(){p(this.componentSelector).jqxListBox("clearFilter")}},{key:"destroy",value:function(){p(this.componentSelector).jqxListBox("destroy")}},{key:"disableItem",value:function(e){p(this.componentSelector).jqxListBox("disableItem",e)}},{key:"disableAt",value:function(e){p(this.componentSelector).jqxListBox("disableAt",e)}},{key:"enableItem",value:function(e){p(this.componentSelector).jqxListBox("enableItem",e)}},{key:"enableAt",value:function(e){p(this.componentSelector).jqxListBox("enableAt",e)}},{key:"ensureVisible",value:function(e){p(this.componentSelector).jqxListBox("ensureVisible",e)}},{key:"endUpdate",value:function(){p(this.componentSelector).jqxListBox("endUpdate")}},{key:"focus",value:function(){p(this.componentSelector).jqxListBox("focus")}},{key:"getItems",value:function(){return p(this.componentSelector).jqxListBox("getItems")}},{key:"getSelectedItems",value:function(){return p(this.componentSelector).jqxListBox("getSelectedItems")}},{key:"getCheckedItems",value:function(){return p(this.componentSelector).jqxListBox("getCheckedItems")}},{key:"getItem",value:function(e){return p(this.componentSelector).jqxListBox("getItem",e)}},{key:"getItemByValue",value:function(e){return p(this.componentSelector).jqxListBox("getItemByValue",e)}},{key:"getSelectedItem",value:function(){return p(this.componentSelector).jqxListBox("getSelectedItem")}},{key:"getSelectedIndex",value:function(){return p(this.componentSelector).jqxListBox("getSelectedIndex")}},{key:"insertAt",value:function(e,t){p(this.componentSelector).jqxListBox("insertAt",e,t)}},{key:"invalidate",value:function(){p(this.componentSelector).jqxListBox("invalidate")}},{key:"indeterminateItem",value:function(e){p(this.componentSelector).jqxListBox("indeterminateItem",e)}},{key:"indeterminateIndex",value:function(e){p(this.componentSelector).jqxListBox("indeterminateIndex",e)}},{key:"loadFromSelect",value:function(e){p(this.componentSelector).jqxListBox("loadFromSelect",e)}},{key:"removeItem",value:function(e){p(this.componentSelector).jqxListBox("removeItem",e)}},{key:"removeAt",value:function(e){p(this.componentSelector).jqxListBox("removeAt",e)}},{key:"performRender",value:function(){p(this.componentSelector).jqxListBox("render")}},{key:"refresh",value:function(){p(this.componentSelector).jqxListBox("refresh")}},{key:"selectItem",value:function(e){p(this.componentSelector).jqxListBox("selectItem",e)}},{key:"selectIndex",value:function(e){p(this.componentSelector).jqxListBox("selectIndex",e)}},{key:"updateItem",value:function(e,t){p(this.componentSelector).jqxListBox("updateItem",e,t)}},{key:"updateAt",value:function(e,t){p(this.componentSelector).jqxListBox("updateAt",e,t)}},{key:"unselectIndex",value:function(e){p(this.componentSelector).jqxListBox("unselectIndex",e)}},{key:"unselectItem",value:function(e){p(this.componentSelector).jqxListBox("unselectItem",e)}},{key:"uncheckIndex",value:function(e){p(this.componentSelector).jqxListBox("uncheckIndex",e)}},{key:"uncheckItem",value:function(e){p(this.componentSelector).jqxListBox("uncheckItem",e)}},{key:"uncheckAll",value:function(){p(this.componentSelector).jqxListBox("uncheckAll")}},{key:"val",value:function(e){if(void 0===e)return p(this.componentSelector).jqxListBox("val");p(this.componentSelector).jqxListBox("val",e)}},{key:"render",value:function(){return i.a.createElement("div",{id:this.state.id},this.props.value,this.props.children)}}]),t}(i.a.Component)),v=o(8),S=o.n(v),y=function(e){function t(e){var o;return Object(u.a)(this,t),(o=Object(h.a)(this,Object(f.a)(t).call(this,e))).addPlayers=function(){for(var e=o.state.userPlayers,t=o.refs.playerListbox.getSelectedItems(),n=[],i=0;i<t.length;i++)e.includes(t[i].label)||n.push(t[i].label);for(var r=0;r<n.length;r++)o.refs.userListbox.addItem(n[r]);var c=e.length>0?e+","+n:e+n;o.setState({userPlayers:c}),o.refs.playerListbox.clearSelection(),o.refs.userListbox.clearSelection()},o.removePlayers=function(){var e=o.state.userPlayers,t=o.refs.userListbox.getSelectedItems(),n=[];if(t.length>0)for(var i=0;i<t.length;i++)o.refs.userListbox.removeItem(t[i].label),n.push(t[i].label);for(var r=[],c=0;c<e.length;c++)n.includes(e[c])||r.push(e[c]);o.setState({userPlayers:r}),o.refs.userListbox.clearSelection()},o.clearPlayers=function(){o.refs.userListbox.clear(),o.setState({userPlayers:[]}),o.refs.userListbox.clearSelection()},o.simulateDraft=function(){o.refs.draftListbox.clear();var e=[],t=o.refs.userListbox.getItems();if(t&&0!==t.length){for(var n=0;n<t.length;n++)e.push(t[n].label);var i=function(){var e=Object(a.a)(l.a.mark(function e(){return l.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,S.a.post(window.location.href+"draft-results",o.state.userPlayers);case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}},e)}));return function(){return e.apply(this,arguments)}}(),r=function(){var e=Object(a.a)(l.a.mark(function e(){return l.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,i();case 2:e.sent;case 3:case"end":return e.stop()}},e)}));return function(){return e.apply(this,arguments)}}(),c=function(){var e=Object(a.a)(l.a.mark(function e(){return l.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,S.a.get(window.location.href+"draft-results",function(e){if(o.refs.draftListbox.clear(),"[]"===e)o.refs.draftListbox.addItem("No players were drafted. :(");else for(var t=e.substring(3,e.length-3).split(/', '|", '|', "/),n=0;n<t.length;n++)o.refs.draftListbox.addItem(t[n])});case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}},e)}));return function(){return e.apply(this,arguments)}}(),s=function(){var e=Object(a.a)(l.a.mark(function e(){return l.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,c();case 2:e.sent;case 3:case"end":return e.stop()}},e)}));return function(){return e.apply(this,arguments)}}();o.refs.draftListbox.clear(),o.setState({userPlayers:e.toString()},function(){this.refs.draftListbox.addItem("Drafting...");var e=function(){var e=Object(a.a)(l.a.mark(function e(){return l.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,r();case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}},e)}));return function(){return e.apply(this,arguments)}}();(function(){var t=Object(a.a)(l.a.mark(function t(){return l.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e();case 2:t.sent,s();case 4:case"end":return t.stop()}},t)}));return function(){return t.apply(this,arguments)}})()()}),o.refs.playerListbox.clearSelection(),o.refs.userListbox.clearSelection()}else o.refs.draftListbox.addItem("Please select at least one player to draft.")},o.state={players:[],userPlayers:[],isLoading:!0},o}return Object(m.a)(t,e),Object(x.a)(t,[{key:"componentDidMount",value:function(){var e=this;this.setState({isLoading:!0}),S.a.get(window.location.href.endsWith("draft-results")?window.location.href.slice(0,-13)+"players":window.location.href+"players",function(t){var o=t.substring(2,t.length-2).split(/', '|", '|', "/);e.setState({players:o,isLoading:!1})})}},{key:"render",value:function(){var e=this.state,t=e.players,o=e.userPlayers;return e.isLoading?i.a.createElement("p",null,"Loading players from ESPN . . ."):i.a.createElement("div",null,i.a.createElement(d,{ref:"playerListbox",width:250,height:300,source:t,multiple:!0,className:"Player-list-box"}),i.a.createElement("button",{onClick:this.addPlayers,style:{fontSize:16},className:"Add-button"},"Add"),i.a.createElement("button",{onClick:this.removePlayers,style:{fontSize:16},className:"Remove-button"},"Remove"),i.a.createElement("button",{onClick:this.clearPlayers,style:{fontSize:16},className:"Clear-button"},"Clear"),i.a.createElement(d,{ref:"userListbox",width:250,height:300,source:o,multiple:!0,allowDrag:!0,allowDrop:!0,className:"User-list-box"}),i.a.createElement("button",{onClick:this.simulateDraft,style:{fontSize:16},className:"Draft-button"},"Draft"),i.a.createElement(d,{ref:"draftListbox",width:300,height:300,source:["Draft Results appear here!"],className:"Draft-list-box"}))}}]),t}(i.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(i.a.createElement(y,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[12,1,2]]]);
//# sourceMappingURL=main.b8971ae9.chunk.js.map