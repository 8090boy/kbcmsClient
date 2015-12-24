var KBCMS = {};
var ajax = {
	GET : function (url, fn,o) {
		this._getXMLHttpRequest();//1.建立xmlHttp
		var xht = this.xmlHttp;
		xht.onreadystatechange = this._forwordFunInIndex.bind(xht, fn); //2.设置回调函数
		xht.withCredentials = true;
		//xht.responseType = o ? o.type : "application/json";
		xht.open("GET", url, true); //3.初始化xmlHttp
		xht.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xht.send(null); //4.发送请求
	},

	POST:function (url, data, fn, o) {
		this._getXMLHttpRequest();//1.建立xmlHttp
		var xht = this.xmlHttp;		
		xht.abort();
		xht.onreadystatechange = this._forwordFunInIndex.bind(xht, fn); //2.设置回调函数
		xht.withCredentials = true;
		// xht.responseType = o ? o.type : "application/json";
		xht.open("POST", url, true); //3.初始化xmlHttp
		xht.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xht.send(data); //4.发送请求
	},

	//XMLHTTP回调
	_forwordFunInIndex:function (fn) {		 
		if (this.readyState === 4 && this.status === 200) {	
			
			var msg = eval( this.responseText );
			if(!msg) return;		
			fn(msg);			
		}
	},

	///////////////////
	_getXMLHttpRequest : function () {
		
		if (this.xmlHttp) this.xmlHttp = null;
		if (window.XMLHttpRequest) {
			this.xmlHttp = new XMLHttpRequest();
			if (this.xmlHttp.overrideMimeType)
				this.xmlHttp.overrideMimeType('text/xml');
		} else if (window.ActiveXObject) {
			try {
				this.xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
			} catch (e) {
				try {
					this.xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
				} catch (e) {
				}
			}
		}
		return this.xmlHttp;
	}	
}


/**
 * cms 对象包含data,extend,tree的CRUD操作
 **/

KBCMS.Data = {
	ById : function (id) {
		var url = '/api/v1/d/get/' + id;
		ajax.GET(url, this._showById);
	},
	Del : function (id) {
		var url = '/api/v1/d/del/' + id;
		ajax.GET(url, this._showById);
	},
	All : function (startId,count) {
		var url = '/api/v1/d/all/'+startId+'/'+count ;
		ajax.GET(url, this._successAll);
	},
	Add : function () {
		var url = '/api/v1/d/add';
		var data = this._dataComp("addui");
		ajax.POST(url, data, this._addSuccess);
	},


	_successAll: function (msg) {
		if(!msg.length) return;
		var strArr = [];
		for(var i=0;i<msg.length;i++){
			var o = msg[i];	
			 if(o.Id)
		   strArr.push('<li ref='+o.Id +' ExtendId='+ o.ExtendId +' TreeId='+ o.TreeId +'>'
		   +'<a onclick="KBCMS.Data.Del('+o.Id+')">Delete</a><a>Edit</a><a>To Parent</a>'
		   +'<a >'+o.Id +'|'+ o.Title +'</a>'
		   +'</li>');
		}
		msg = strArr.join('');
		if(!msg)  return;
		msg = '<ul>'+msg+'</ul>' ;
		document.querySelector("#viewDatas").innerHTML = msg;
	},
	_showById: function (msg) {
		document.querySelector("#viewDatas").innerText = JSON.stringify(msg)
	},

	_addSuccess: function (msg) {
		document.querySelector("#viewDatas").innerText = JSON.stringify(msg);
	},
	_dataComp: function (id) {
		var inputs = document.querySelectorAll("#" + id + " input,#" + id + " textarea");
		var arg = [];
		for (var n = 0; n < inputs.length; n++) {
			if (inputs[n].type === 'number') {
				arg.push('\"' + inputs[n].name + '\":' + (inputs[n].value || 0));
			} else {

				if (inputs[n].name.toLowerCase() === 'content') {
					var tmp = UE.getEditor('editor').getContent();
					arg.push('\"content\":\"' + tmp + '\"');
					continue
				}
				arg.push('\"' + inputs[n].name + '\":\"' + inputs[n].value + '\"');
			}
		}
		var str = arg.join(",");
		return '{' + str + '}';
	}
}
//////////////////////////////////////////////
KBCMS.Extend = {
	ById: function (id) {
		var url = '/api/v1/e/get/' + id;
		ajax.GET(url, this._showById);
	},
	Del: function (id) {
		var url = '/api/v1/e/del/' + id;
		ajax.GET(url, this._showById.bind(this,id));
	},
	All: function (startId,count) {		 
		var url = '/api/v1/e/all/'+startId+'/'+count ;
		ajax.GET(url, this._successAll);
	},
	ADD: function () {
		var url = '/api/v1/e/add';
		var data = this._dataComp("addui");
		ajax.POST(url, data, this._addSuccess);
	},


	_successAll: function (msg) {
		if(!msg.length) return;
		var strArr = [];
		for(var i=0;i<msg.length;i++){
			var o = msg[i];	
			 if(o.Id)
		   strArr.push('<li id="'+o.Id +'" ref='+o.Id +' DataId='+ o.DataId +' TreeId='+ o.TreeId +'>'
		   +'<a onclick="KBCMS.Extend.Del('+o.Id+')">Delete</a><a>Edit</a><a>To Parent</a>'
		   +'<a >'+o.Id +'|'+ o.IsTop+'|'+ o.Recommend+'|'+ o.Visible+'|'+ o.Content  +'</a>'
		   +'</li>');
		}
		msg = strArr.join('');
		if(!msg)  return;
		msg = '<ul>'+msg+'</ul>' ;
		document.querySelector("#viewDatas").innerHTML = msg;
	},
	_showById: function (id,msg) {
		if(msg){
			var el = document.getElementById(id );
			el.parentNode.removeChild(el );
		}
	},

	_addSuccess: function (msg) {
		document.querySelector("#viewDatas").innerText = JSON.stringify(msg);
	},
	_dataComp: function (id) {
		var inputs = document.querySelectorAll("#" + id + " input,#" + id + " textarea");
		var arg = [];
		for (var n = 0; n < inputs.length; n++) {
			if (inputs[n].type === 'number') {
				arg.push('\"' + inputs[n].name + '\":' + (inputs[n].value || 0));
			} else if( inputs[n].type === 'radio') {				 
				if( inputs[n].checked ){
				    arg.push('\"' + inputs[n].name + '\":' + inputs[n].value );
				}
			}else{
				arg.push('\"' + inputs[n].name + '\":\"' + inputs[n].value + '\"');
			}
		}
		var str = arg.join(",");
		return '{' + str + '}';
	}
}
//////////////////////////////////////////////
KBCMS.Tree = {
	ById: function (id) {
		var url = '/api/v1/t/get/' + id;
		ajax.GET(url, this._showById);
	},
	Del: function (id) {
		var url = '/api/v1/t/del/' + id;
		ajax.GET(url, this._showById);
	},
	All: function (startId,count) {
		var url = '/api/v1/t/all/'+startId+'/'+count ;
		ajax.GET(url, this._successAll);
	},
	ADD: function () {
		var url = '/api/v1/t/add'; 
		var data = this._dataComp("addui");
		ajax.POST(url, data, this._addSuccess);
	},


	_successAll: function (msg) {
 
		if(!msg.length) return;
		var strArr = [];
		for(var i=0;i<msg.length;i++){
			var o = msg[i];	
			 if(o.Id)
		   strArr.push('<li ref='+o.Id
	       +' parentId='+ o.ParentId +'><a onclick="KBCMS.Tree.Del('+o.Id+')">Delete</a><a>Edit</a><a>To Parent</a><a >'+o.Id 
		   +'|'+ o.Name+'|'+ o.ParentId+'|'+ o.RefInfo  +'</a></li>');
		}
		msg = strArr.join('');
		if(!msg)  return;
		msg = '<ul>'+msg+'</ul>' ;
		document.querySelector("#viewDatas").innerHTML = msg;
	},
	_showById: function (msg) {
			
		if(msg)
		 alert('OK');
	},

	_addSuccess: function (msg) {
		document.querySelector("#viewDatas").innerText = JSON.stringify(msg);
	},
	_dataComp: function (id) {
		var inputs = document.querySelectorAll("#" + id + " input,#" + id + " textarea");
		var arg = [];
		for (var n = 0; n < inputs.length; n++) {
			if (inputs[n].type === 'number') {
				arg.push('\"' + inputs[n].name + '\":' + (inputs[n].value || 0));
			} else if( inputs[n].type === 'radio') {				 
				if( inputs[n].checked ){
				    arg.push('\"' + inputs[n].name + '\":' + inputs[n].value );
				}
			}else{
				arg.push('\"' + inputs[n].name + '\":\"' + inputs[n].value + '\"');
			}
		}
		var str = arg.join(",");
		return '{' + str + '}';
	}
}
KBCMS.Com = {
  EXC : function(){
	  var url = '/api/v1/cc';
		var data = this._dataComp("addui");
		ajax.POST(url, data, this._addSuccess);
  },
  _dataComp: function (id) {
		var inputs = document.querySelectorAll("#" + id + " input,#" + id + " textarea");
		var arg = [];
		for (var n = 0; n < inputs.length; n++) {
			if (inputs[n].type === 'number') {
				arg.push('\"' + inputs[n].name + '\":' + (inputs[n].value || 0));
			} else if( inputs[n].type === 'radio') {				 
				if( inputs[n].checked ){
				    arg.push('\"' + inputs[n].name + '\":' + inputs[n].value );
				}
			}else{
				arg.push('\"' + inputs[n].name + '\":\"' + inputs[n].value + '\"');
			}
		}
		var str = arg.join(",");
		return '{' + str + '}';
	}
  
}
//////////////////////////////////////////////
window.onload = function () {
	var ue = UE.getEditor('editor');
}

//////////////////////////////////////////////

