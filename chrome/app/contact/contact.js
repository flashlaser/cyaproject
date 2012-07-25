$(function() {
	window.Login.testLogin(function(result) {
		if(!result) {
			
			window.Log.info("可离线用，登录后再更新",$("#tip"));
		} else
			window.Log.log("已登录，可离线与在线使用",$("#tip"));
	});

	$("#txtSearchPerson").focus();

});
var DB_NAME = "gmcc.sqlite";

var _viewstate = "";
var _cur = 0, _total = -1;
function _reset() {
	_cur = 0;
	_total = -1;
}

//将人员信息存入数据库
function sqlitePerson() {
	if(!confirm("全部人员导入数据库需要较长时间，请确认？"))
		return;

	var db = document.getElementById("dbplugin");
	// return;
	// db.sqlite(DB_NAME,"delete from person");

	var tmp, result;
	for(var str in window.localStorage) {
		if(str.indexOf("psn") == -1)
			continue;
		s = window.localStorage[str];
		tmp = s ? s.split("|") : [];
		result = db.sqlite_exec(DB_NAME, "insert into person(ID,username,name,phone,department,room,email) values('" + tmp[0] + "','" + tmp[1] + "','" + tmp[2] + "','" + tmp[3] + "','" + tmp[4] + "','" + tmp[5] + "','" + tmp[6] + "')");
		console.log(result);
	}
	alert("已完成人员导入");
}

function searchSqlitePerson() {
	var db = dbplugin;
	var key = $.trim(document.getElementById("txtSearchPerson").value);

	var keystring = "'%" + key + "%'";
	var result = db.sqlite_exec(DB_NAME, "select * from person where username like " + keystring + " or name like " + keystring + " or phone like " + keystring);
	if(result.indexOf("ERROR") == 0) {
		alert(result);
		return;
	} else {
		var data = [], item = null;
		window.eval("window._q=(" + result + ")");
		for(var i = 0, size = _q.length; i < size; ++i) {
			item = _q[i];
			data.push([item.ID, item.username, item.name, item.phone, item.department, item.room, item.email]);
		}
		showPersonData(data);
	}
}

function startLoadPerson() {
	var loadAll = $("#cbxLoadAll").prop("checked");
	if(loadAll && confirm("全部加载一个部门需要很长时间，请确认？")) {
		loadPersonByDept(0);
	} else
		loadPersonByDept(0);
}

function loadPersonByDept(cur) {
	if(_viewstate == "") {
		var url = "http://lsp2.gz.gmcc.net/OffCommunicate/AddressUserList.aspx";
		$.get(url, function(msg) {
			var str = msg;
			var result = str.match(/__VIEWSTATE\" value=\"([^\"]+)/);
			if(result) {
				_viewstate = result[1];
				window.Log.log("已获取页面状态，开始执行")
				loadPersonByDept();
			} else {
				window.Log.err("未能获取状态，请登录后刷新本页面。");
			}
		});
	}

	if( typeof (cur) == "undefined")
		cur = _cur;
	_cur = _cur + 1;

	if(_total >= 0 && _cur > _total) {
		$("#sProgress").progressBar(100);
		_reset();
		return;
	}

	if(_total == 0) {
		$("#sProgress").progressBar(100);
		return;
	} else if(_total == -1) {
		$("#sProgress").progressBar(0);
	} else
		$("#sProgress").progressBar(_cur * 100 / _total);

	var deptId = $("#txtDep").val();
	//http://lsp2.gz.gmcc.net/OffCommunicate/AddressUserList.aspx?DepartId=349204400020112
	var url = "http://lsp2.gz.gmcc.net/OffCommunicate/AddressUserList.aspx?DepartId=" + deptId;
	$.ajax({
		type : "POST",
		data : {
			"VirtualPager1$txtGoToPage" : _cur,
			"VirtualPager1$btnGoToPage" : "跳转",
			"__VIEWSTATE" : _viewstate,
			"txtTrueName" : ""
		},
		url : url,
		success : function(msg) {
			/*
			 onclick="newClick('9839')">
			 <td align="left">
			 tangxiaobo
			 </td>
			 <td align="left">xxx</td>
			 </td>
			 <td align="left">
			 <span id="serrepview_ctl04_PhoneNum">13922200699</span>
			 </td>
			 <td align="left">业务支持中心 </td>
			 <td align="left">规划建设室 </td><td align="left">tangxiaobo@gz.gd.chinamobile.com</td>
			 */
			var r = msg.match(/onclick([^/]+\/){8}/g);
			var elem, mat;
			var uid, name, label, phone, dept0, dept1, email, summary;
			var result = [];
			var f = function(m, index) {
				if(!m || index >= m.length)
					return "";

				return m[index] ? m[index].replace(/[>|<|\s]/g, "") : m[index];
			};
			for(var i = 0, len = r.length; i < len; ++i) {
				elem = r[i];
				//抽取人员ID
				mat = elem.match(/newClick\('(\d+)'\)"/);
				uid = mat[1];
				//匹配人员信息
				mat = elem.match(/>([^<]*)</g);
				//1:账号
				name = f(mat, 1);

				//3:中文名
				label = f(mat, 3);

				//7:phone
				phone = f(mat, 7);

				//10: 中心
				dep0 = f(mat, 10);

				//12:科室
				dep1 = f(mat, 12);

				//14:email
				email = f(mat, 14);

				//make a summary
				summary = [uid, name, label, phone, dep0, dep1, email].join("|");

				//save it to db
				window.localStorage["psn:" + uid] = summary;

			}

			// alert(result.join(","));

			//记录总页数
			r = msg.match(/页次:\s*(\d+)\s*\/\s*(\d+)\s*页/);
			if(r) {
				_cur = window.parseInt(r[1]);
				_total = window.parseInt(r[2]);
			}
			window.Log.log(_cur + "/" + _total);

			//更新viewstate
			r = msg.match(/__VIEWSTATE\" value=\"([^\"]+)/);
			if(result) {
				_viewstate = r[1];
			}

			// alert(msg.match(/onclick[\w\W]+chinamobile\.com/g).join(";"));
			var loadAll = $("#cbxLoadAll").prop("checked");
			if(loadAll) {
				loadPersonByDept();
			} else {
				$("#sProgress").progressBar(100);
				_reset();
			}

		},
		error : window.error
	});

}

function searchPerson() {
	var url = "http://lsp2.gz.gmcc.net/OffCommunicate/AddressUserList.aspx";
	$.ajax({
		type : "POST",
		url : url,
		data : {
			///wEPDwULLTE3OTk1MzcxNjcPZBYCAgQPZBYEAgYPFgIeC18hSXRlbUNvdW50ZmQCCA8PFgoeDEl0ZW1zUGVyUGFnZQISHgpUb3RhbFBhZ2VzZh4QVG90YWxSZWNvcmRDb3VudGYeDlBhZ2VHcm91cENvdW50Zh4QQ3VycmVudFBhZ2VJbmRleAL/////D2RkZBGaR7tAXPgv01ZwJkdVW m4uNR2
			"__VIEWSTATE" : gViewstate,
			//"__EVENTVALIDATION" : "/wEWBQLav7eRBQKD8qTNDgKx2u76BgKVuor6AQKtiv3vBiWiglRPuTY/aAUTrgKbhU5L4uHS",
			"txtTrueName" : "程曜安",
			"queryBtn" : "查询",
			"VirtualPager1$txtGoToPage" : ""
		},
		success : function(msg) {
			console.log(msg);

			//标准的结果显示：http://lsp2.gz.gmcc.net/OffCommunicate/Address_Card.aspx?UID=10097
		}
	});
	//txtTrueName:程曜安
	//queryBtn:查询
	//VirtualPager1$txtGoToPage:
}

function loadDept() {
	// var url = "http://contacts.services.gmcc.net/UserInfoSimple.aspx?nid=61ca46b7-0b76-41ae-9e1a-cd9adba8c86c&sid=11&f=app";
	// var data = {
	// "__VIEW_STATE" : "/wEPDwULLTExMTE4NjQ2NzcPFgIeEVJpZ2h0Q29udGFjdHNOb2RlMrYBAAEAAAD/////AQAAAAAAAAAMAgAAAEZHQ1AuRGF0YS5Db21tb24sIFZlcnNpb249MS4wLjAuMCwgQ3VsdHVyZT1uZXV0cmFsLCBQdWJsaWNLZXlUb2tlbj1udWxsBQEAAAAmR0NQLkRhdGEuQ29tbW9uLkNvcmUuUmlnaHRDb250YWN0c05vZGUDAAAAB19tYW5hZ2ULX2dyb3VwVmlzaXQGX3Zpc2l0AAAAAQEBAgAAAAABAQtkGAEFHl9fQ29udHJvbHNSZXF1aXJlUG9zdEJhY2tLZXlfXxYBBQhpYlNlYXJjaP13wAgoQ8PxOIwxG7hR7aPTALig",
	// "__EVENTVALIDATION" : "/wEWAwLMrLGHCgLEhISFCwLytKiXDBvNvvikkUDhcvNY7VWyxeI3WvrS",
	// "__CALLBACKID" : "__Page",
	// "__CALLBACKPARAM" : "",
	// "__EVENTTARGET" : "",
	// "__EVENTARGUMENT" : "",
	// "txtName" : ""
	// };
	//
	// $.ajax({
	// type : "POST",
	// url : url,
	// data : data,
	// success : function(msg) {
	// alert(msg);
	// }
	// });

	var url = "http://lsp2.gz.gmcc.net/OffCommunicate/adress.aspx";
	$.get(url, function(msg) {
		var str = msg;
		//<a class="Treeview1_0 Treeview1_1 Treeview1_3" href="javascript:clicknode('AddressUserList.aspx?DepartId=349204400020112')" id="Treeview1t70">业务支持中心</a>
		//var str = "<a class=\"Treeview1_0 Treeview1_1 Treeview1_3\" href=\"javascript:clicknode('AddressUserList.aspx?DepartId=349204400020112')\" id=\"Treeview1t70\">业务支持中心</a>"
		var allDept = str.match(/DepartId=[\d]+[^>]*>[^<]+/g), elem;
		for(var i = 0, size = allDept.length; i < size; ++i) {
			elem = allDept[i].match(/DepartId=([\d]+)[^>]*>([^<]+)/);
			window.localStorage["dept:" + elem[1]] = elem[2];
		}
		window.Log.log("获取" + allDept.length + "个部门的信息");
	});
}

var oLanguage = {
	"sLengthMenu" : "每页显示_MENU_  ",
	"sZeroRecords" : "没有找到数据",
	"sInfo" : "显示第 _START_ 到  _END_ 页，共  _TOTAL_ 页",
	"sInfoEmpty" : "显示 0 到 0 页，共  0 页",
	"sInfoFiltered" : "(筛选出  _MAX_ 条数据)",
	"sSearch":"查找"
	
};

function showDept() {
	$("#divDept").empty();
	var result = [];
	for(var str in window.localStorage) {
		if(str.indexOf("dept") != -1)
			result.push([str, window.localStorage[str]]);
	}

	//$('#divDept').html('<table cellpadding="0" cellspacing="0" border="0" class="display" id="example"><\/table>');
	$('#divDept').html('<table cellpadding="0" cellspacing="0" border="0" class="table table-bordered" id="example"><\/table>');
	$('#example').dataTable({
		"oLanguage" : oLanguage,
		"aaData" : result,
		"aoColumns" : [{
			"sTitle" : "ID"
		}, {
			"sTitle" : "名称"
		}]
	});
}

function showPerson() {
	var result = [], s;
	for(var str in window.localStorage) {
		if(str.indexOf("psn") == -1)
			continue;
		s = window.localStorage[str];
		result.push( s ? s.split("|") : []);
	}

	showPersonData(result);
}

//根据数据显示员工信息
function showPersonData(data) {
	$("#divPerson").empty();
	$('#divPerson').html('<table cellpadding="0" cellspacing="0" border="0" class="table table-bordered"id="example1"><\/table>');
	$('#example1').dataTable({
		"oLanguage" : oLanguage,
		"aaData" : data,
		"aoColumns" : [{
			"sTitle" : "ID"
		}, {
			"sTitle" : "账号"
		}, {
			"sTitle" : "姓名"
		}, {
			"sTitle" : "电话"
		}, {
			"sTitle" : "部门"
		}, {
			"sTitle" : "科室"
		}, {
			"sTitle" : "邮箱"
		}]
	});
}

function clearStorage() {
	if(!window.confirm("即将清除所有缓存的人员信息，请确认？"))
		return;

	window.localStorage.clear();
	alert("已清空，请刷新。");
}

/**
 * 构造表的一行
 */
function row_func(arr) {
	var row = $("<tr></tr>");
	for(var i = 0, len = arr.length; i < len; ++i) {
		row.append("<td>" + arr[i] + "</td>");
	}
	return row;
}

/**
 * 导出部门信息
 */
function exportDept() {
	if(!window.confirm("导出全部部门需要比较长的处理时间，请确认？"))
		return;

	var table = $('<table cellpadding="0" cellspacing="0" border="1"></table>');
	table.append(row_func(["ID", "部门"]));
	var s;
	for(var str in window.localStorage) {
		if(str.indexOf("dept:") == -1)
			continue;
		s = window.localStorage[str];
		table.append(row_func([str.substring(5), s]));
	}
	$("body").empty();
	$("body").append(table);
}

/**
 * 导出人员信息
 */
function exportPerson() {
	if(!window.confirm("导出全部人员需要比较长的处理时间，请确认？"))
		return;

	$("#btnExport").attr("disabled", true);

	var table = $('<table cellpadding="0" cellspacing="0" border="1"></table>');
	table.append(row_func(["ID", "账号", "姓名", "电话", "部门", "科室", "邮箱"]));
	var s;
	for(var str in window.localStorage) {
		if(str.indexOf("psn") == -1)
			continue;
		s = window.localStorage[str];
		table.append(row_func( s ? s.split("|") : []));
	}
	$("body").empty();
	$("body").append(table);

}