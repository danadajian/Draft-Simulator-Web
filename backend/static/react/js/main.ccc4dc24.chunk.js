(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{10:function(e,t,o){e.exports=o(27)},16:function(e,t,o){},17:function(e,t,o){e.exports=o.p+"media/logo.5d5d9eef.svg"},18:function(e,t,o){},27:function(e,t,o){"use strict";o.r(t);var n=o(0),i=o.n(n),c=o(8),r=o.n(c),l=(o(16),o(1)),s=o(2),a=o(4),u=o(3),x=o(5),m=(o(17),o(18),o(19),o(20),o(22),o(23),o(24),o(25),o(26),window.JQXLite),h=(window.jqx,function(e){function t(e){var o;Object(l.a)(this,t),o=Object(a.a)(this,Object(u.a)(t).call(this,e));var n="jqxListBox"+m.generateID();return o.componentSelector="#"+n,o.state={id:n},o}return Object(x.a)(t,e),Object(s.a)(t,[{key:"componentDidMount",value:function(){var e=this.manageAttributes();this.createComponent(e)}},{key:"manageAttributes",value:function(){var e=["autoHeight","allowDrag","allowDrop","checkboxes","disabled","displayMember","dropAction","dragStart","dragEnd","enableHover","enableSelection","equalItemsWidth","filterable","filterHeight","filterDelay","filterPlaceHolder","height","hasThreeStates","itemHeight","incrementalSearch","incrementalSearchDelay","multiple","multipleextended","renderer","rendered","rtl","selectedIndex","selectedIndexes","source","scrollBarSize","searchMode","theme","valueMember","width"],t={};for(var o in this.props)if("settings"===o)for(var n in this.props[o])t[n]=this.props[o][n];else-1!==e.indexOf(o)&&(t[o]=this.props[o]);return t}},{key:"createComponent",value:function(e){if(!this.style)for(var t in this.props.style)m(this.componentSelector).css(t,this.props.style[t]);if(void 0!==this.props.className)for(var o=this.props.className.split(" "),n=0;n<o.length;n++)m(this.componentSelector).addClass(o[n]);this.template||m(this.componentSelector).html(this.props.template),m(this.componentSelector).jqxListBox(e)}},{key:"setOptions",value:function(e){m(this.componentSelector).jqxListBox("setOptions",e)}},{key:"getOptions",value:function(){if(0===arguments.length)throw Error("At least one argument expected in getOptions()!");for(var e={},t=0;t<arguments.length;t++)e[arguments[t]]=m(this.componentSelector).jqxListBox(arguments[t]);return e}},{key:"on",value:function(e,t){m(this.componentSelector).on(e,t)}},{key:"off",value:function(e){m(this.componentSelector).off(e)}},{key:"autoHeight",value:function(e){if(void 0===e)return m(this.componentSelector).jqxListBox("autoHeight");m(this.componentSelector).jqxListBox("autoHeight",e)}},{key:"allowDrag",value:function(e){if(void 0===e)return m(this.componentSelector).jqxListBox("allowDrag");m(this.componentSelector).jqxListBox("allowDrag",e)}},{key:"allowDrop",value:function(e){if(void 0===e)return m(this.componentSelector).jqxListBox("allowDrop");m(this.componentSelector).jqxListBox("allowDrop",e)}},{key:"checkboxes",value:function(e){if(void 0===e)return m(this.componentSelector).jqxListBox("checkboxes");m(this.componentSelector).jqxListBox("checkboxes",e)}},{key:"disabled",value:function(e){if(void 0===e)return m(this.componentSelector).jqxListBox("disabled");m(this.componentSelector).jqxListBox("disabled",e)}},{key:"displayMember",value:function(e){if(void 0===e)return m(this.componentSelector).jqxListBox("displayMember");m(this.componentSelector).jqxListBox("displayMember",e)}},{key:"dropAction",value:function(e){if(void 0===e)return m(this.componentSelector).jqxListBox("dropAction");m(this.componentSelector).jqxListBox("dropAction",e)}},{key:"dragStart",value:function(e){if(void 0===e)return m(this.componentSelector).jqxListBox("dragStart");m(this.componentSelector).jqxListBox("dragStart",e)}},{key:"dragEnd",value:function(e){if(void 0===e)return m(this.componentSelector).jqxListBox("dragEnd");m(this.componentSelector).jqxListBox("dragEnd",e)}},{key:"enableHover",value:function(e){if(void 0===e)return m(this.componentSelector).jqxListBox("enableHover");m(this.componentSelector).jqxListBox("enableHover",e)}},{key:"enableSelection",value:function(e){if(void 0===e)return m(this.componentSelector).jqxListBox("enableSelection");m(this.componentSelector).jqxListBox("enableSelection",e)}},{key:"equalItemsWidth",value:function(e){if(void 0===e)return m(this.componentSelector).jqxListBox("equalItemsWidth");m(this.componentSelector).jqxListBox("equalItemsWidth",e)}},{key:"filterable",value:function(e){if(void 0===e)return m(this.componentSelector).jqxListBox("filterable");m(this.componentSelector).jqxListBox("filterable",e)}},{key:"filterHeight",value:function(e){if(void 0===e)return m(this.componentSelector).jqxListBox("filterHeight");m(this.componentSelector).jqxListBox("filterHeight",e)}},{key:"filterDelay",value:function(e){if(void 0===e)return m(this.componentSelector).jqxListBox("filterDelay");m(this.componentSelector).jqxListBox("filterDelay",e)}},{key:"filterPlaceHolder",value:function(e){if(void 0===e)return m(this.componentSelector).jqxListBox("filterPlaceHolder");m(this.componentSelector).jqxListBox("filterPlaceHolder",e)}},{key:"height",value:function(e){if(void 0===e)return m(this.componentSelector).jqxListBox("height");m(this.componentSelector).jqxListBox("height",e)}},{key:"hasThreeStates",value:function(e){if(void 0===e)return m(this.componentSelector).jqxListBox("hasThreeStates");m(this.componentSelector).jqxListBox("hasThreeStates",e)}},{key:"itemHeight",value:function(e){if(void 0===e)return m(this.componentSelector).jqxListBox("itemHeight");m(this.componentSelector).jqxListBox("itemHeight",e)}},{key:"incrementalSearch",value:function(e){if(void 0===e)return m(this.componentSelector).jqxListBox("incrementalSearch");m(this.componentSelector).jqxListBox("incrementalSearch",e)}},{key:"incrementalSearchDelay",value:function(e){if(void 0===e)return m(this.componentSelector).jqxListBox("incrementalSearchDelay");m(this.componentSelector).jqxListBox("incrementalSearchDelay",e)}},{key:"multiple",value:function(e){if(void 0===e)return m(this.componentSelector).jqxListBox("multiple");m(this.componentSelector).jqxListBox("multiple",e)}},{key:"multipleextended",value:function(e){if(void 0===e)return m(this.componentSelector).jqxListBox("multipleextended");m(this.componentSelector).jqxListBox("multipleextended",e)}},{key:"renderer",value:function(e){if(void 0===e)return m(this.componentSelector).jqxListBox("renderer");m(this.componentSelector).jqxListBox("renderer",e)}},{key:"rendered",value:function(e){if(void 0===e)return m(this.componentSelector).jqxListBox("rendered");m(this.componentSelector).jqxListBox("rendered",e)}},{key:"rtl",value:function(e){if(void 0===e)return m(this.componentSelector).jqxListBox("rtl");m(this.componentSelector).jqxListBox("rtl",e)}},{key:"selectedIndex",value:function(e){if(void 0===e)return m(this.componentSelector).jqxListBox("selectedIndex");m(this.componentSelector).jqxListBox("selectedIndex",e)}},{key:"selectedIndexes",value:function(e){if(void 0===e)return m(this.componentSelector).jqxListBox("selectedIndexes");m(this.componentSelector).jqxListBox("selectedIndexes",e)}},{key:"source",value:function(e){if(void 0===e)return m(this.componentSelector).jqxListBox("source");m(this.componentSelector).jqxListBox("source",e)}},{key:"scrollBarSize",value:function(e){if(void 0===e)return m(this.componentSelector).jqxListBox("scrollBarSize");m(this.componentSelector).jqxListBox("scrollBarSize",e)}},{key:"searchMode",value:function(e){if(void 0===e)return m(this.componentSelector).jqxListBox("searchMode");m(this.componentSelector).jqxListBox("searchMode",e)}},{key:"theme",value:function(e){if(void 0===e)return m(this.componentSelector).jqxListBox("theme");m(this.componentSelector).jqxListBox("theme",e)}},{key:"valueMember",value:function(e){if(void 0===e)return m(this.componentSelector).jqxListBox("valueMember");m(this.componentSelector).jqxListBox("valueMember",e)}},{key:"width",value:function(e){if(void 0===e)return m(this.componentSelector).jqxListBox("width");m(this.componentSelector).jqxListBox("width",e)}},{key:"addItem",value:function(e){return m(this.componentSelector).jqxListBox("addItem",e)}},{key:"beginUpdate",value:function(){m(this.componentSelector).jqxListBox("beginUpdate")}},{key:"clear",value:function(){m(this.componentSelector).jqxListBox("clear")}},{key:"clearSelection",value:function(){m(this.componentSelector).jqxListBox("clearSelection")}},{key:"checkIndex",value:function(e){m(this.componentSelector).jqxListBox("checkIndex",e)}},{key:"checkItem",value:function(e){m(this.componentSelector).jqxListBox("checkItem",e)}},{key:"checkAll",value:function(){m(this.componentSelector).jqxListBox("checkAll")}},{key:"clearFilter",value:function(){m(this.componentSelector).jqxListBox("clearFilter")}},{key:"destroy",value:function(){m(this.componentSelector).jqxListBox("destroy")}},{key:"disableItem",value:function(e){m(this.componentSelector).jqxListBox("disableItem",e)}},{key:"disableAt",value:function(e){m(this.componentSelector).jqxListBox("disableAt",e)}},{key:"enableItem",value:function(e){m(this.componentSelector).jqxListBox("enableItem",e)}},{key:"enableAt",value:function(e){m(this.componentSelector).jqxListBox("enableAt",e)}},{key:"ensureVisible",value:function(e){m(this.componentSelector).jqxListBox("ensureVisible",e)}},{key:"endUpdate",value:function(){m(this.componentSelector).jqxListBox("endUpdate")}},{key:"focus",value:function(){m(this.componentSelector).jqxListBox("focus")}},{key:"getItems",value:function(){return m(this.componentSelector).jqxListBox("getItems")}},{key:"getSelectedItems",value:function(){return m(this.componentSelector).jqxListBox("getSelectedItems")}},{key:"getCheckedItems",value:function(){return m(this.componentSelector).jqxListBox("getCheckedItems")}},{key:"getItem",value:function(e){return m(this.componentSelector).jqxListBox("getItem",e)}},{key:"getItemByValue",value:function(e){return m(this.componentSelector).jqxListBox("getItemByValue",e)}},{key:"getSelectedItem",value:function(){return m(this.componentSelector).jqxListBox("getSelectedItem")}},{key:"getSelectedIndex",value:function(){return m(this.componentSelector).jqxListBox("getSelectedIndex")}},{key:"insertAt",value:function(e,t){m(this.componentSelector).jqxListBox("insertAt",e,t)}},{key:"invalidate",value:function(){m(this.componentSelector).jqxListBox("invalidate")}},{key:"indeterminateItem",value:function(e){m(this.componentSelector).jqxListBox("indeterminateItem",e)}},{key:"indeterminateIndex",value:function(e){m(this.componentSelector).jqxListBox("indeterminateIndex",e)}},{key:"loadFromSelect",value:function(e){m(this.componentSelector).jqxListBox("loadFromSelect",e)}},{key:"removeItem",value:function(e){m(this.componentSelector).jqxListBox("removeItem",e)}},{key:"removeAt",value:function(e){m(this.componentSelector).jqxListBox("removeAt",e)}},{key:"performRender",value:function(){m(this.componentSelector).jqxListBox("render")}},{key:"refresh",value:function(){m(this.componentSelector).jqxListBox("refresh")}},{key:"selectItem",value:function(e){m(this.componentSelector).jqxListBox("selectItem",e)}},{key:"selectIndex",value:function(e){m(this.componentSelector).jqxListBox("selectIndex",e)}},{key:"updateItem",value:function(e,t){m(this.componentSelector).jqxListBox("updateItem",e,t)}},{key:"updateAt",value:function(e,t){m(this.componentSelector).jqxListBox("updateAt",e,t)}},{key:"unselectIndex",value:function(e){m(this.componentSelector).jqxListBox("unselectIndex",e)}},{key:"unselectItem",value:function(e){m(this.componentSelector).jqxListBox("unselectItem",e)}},{key:"uncheckIndex",value:function(e){m(this.componentSelector).jqxListBox("uncheckIndex",e)}},{key:"uncheckItem",value:function(e){m(this.componentSelector).jqxListBox("uncheckItem",e)}},{key:"uncheckAll",value:function(){m(this.componentSelector).jqxListBox("uncheckAll")}},{key:"val",value:function(e){if(void 0===e)return m(this.componentSelector).jqxListBox("val");m(this.componentSelector).jqxListBox("val",e)}},{key:"render",value:function(){return i.a.createElement("div",{id:this.state.id},this.props.value,this.props.children)}}]),t}(i.a.Component)),d=o(9),p=o.n(d),f=function(e){function t(e){var o;return Object(l.a)(this,t),(o=Object(a.a)(this,Object(u.a)(t).call(this,e))).state={players:[],isLoading:!0},o}return Object(x.a)(t,e),Object(s.a)(t,[{key:"componentDidMount",value:function(){var e=this;this.setState({isLoading:!0}),p.a.get(window.location.href+"players",function(t){var o=t.substring(2,t.length-2).split(/', '|", '|', "/);e.setState({players:o,isLoading:!1})})}},{key:"displaySelectedItems",value:function(){for(var e=this.refs.playerListbox.getSelectedItems(),t="Selected Items: ",o=0;o<e.length;o++)t+=e[o].label+(o<e.length-1?", ":"");document.getElementById("selectionLog").innerHTML=t}},{key:"render",value:function(){var e=this.state,t=e.players,o=e.isLoading;return console.log(t),o?i.a.createElement("p",null,"Loading players from ESPN . . ."):i.a.createElement("div",null,i.a.createElement(h,{ref:"playerListbox",width:250,height:250,source:t,multiple:!0,className:"Player-list-box"}),i.a.createElement("div",{style:{marginTop:30,fontSize:13,fontFamily:"Verdana"},id:"selectionLog"}),i.a.createElement(h,{ref:"userListbox",width:250,height:250,multiple:!0,className:"User-list-box"}),i.a.createElement("div",{style:{marginTop:30,fontSize:13,fontFamily:"Verdana"},id:"selectionLog2"}))}}]),t}(i.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));r.a.render(i.a.createElement(f,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[10,1,2]]]);
//# sourceMappingURL=main.ccc4dc24.chunk.js.map