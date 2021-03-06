var app = new Vue({
	el: '#app',
	data: {
/*------------------查詢條件-----------------------*/
		project_id: '', // 專案id
		project_name: '', // 專案名稱
		model_name: '', // 機種名稱
		bill_no: '', // 執行單編號
		theme: '', // 主旨
		creator: '', // 創建人
		create_date: '', // 創建時間
/*------------------其它數據-----------------------*/		
		swr_main_list: [], // table中顯示的swr list
		pageSize: 10, // 分頁中的每頁的條數
		modal_au_record_list: [], // 模態框中的審核記錄list
		userid: '' // 登錄人工號
	},
	methods: {
		// 獲取url參數
		getUrlParam: function(param) {
			var reg = new RegExp("(^|&)" + param + "=([^&]*)(&|$)");
			var r = window.location.search.substr(1).match(reg);
			if (r != null) return decodeURI(r[2]);
			return null;
		},
		// 打開新增
		open_add: function() {
			var _self = this;
			window.location.href = 'ERX_SWR_Edit.html?page_type=add&project_id=' + _self.project_id
								+ '&project_name=' + _self.project_name;
		},
		// 產品評估報告list查詢
		query_SWR_Main_list: function(pageIndex) {
			var _self = this;
			axios({
				  method: 'post',
				  url: '/ePDMWeb/ERX_SWR/query_SWR_Main_list.x',
				  data: {
					  	'project_name': _self.project_name,
					  	'model_name': _self.model_name,
						'bill_no': _self.bill_no,
						'theme': _self.theme,
						'creator': _self.creator,
						'create_date': _self.create_date,
						'pageIndex': pageIndex,
						'pageSize': _self.pageSize
				  }
				}).then(function(response) {
					var data = response.data;
					_self.swr_main_list = data.swr_main_list;
					var row_total = data.row_total;
					var page_total = data.page_total;
					
					myPagi = new myPagination({
					    id: 'pagination',
					    curPage: pageIndex, //初始页码
					    pageTotal: page_total, //总页数
					    pageAmount: _self.pageSize, //每页多少条
					    dataTotal: row_total, //总共多少条数据
					    pageSize: 5, //可选,分页个数
					    showPageTotalFlag: true, //是否显示数据统计
					    showSkipInputFlag: true, //是否支持跳转
					    getPage: function(pageIndex) {
					    	// 点击分页按钮请求数据
					    	_self.query_SWR_Main_list(pageIndex);
					    }
					});
				});
		},
		// 打開修改
		open_edit: function(pkid) {
			var _self = this;
			window.location.href = 'ERX_SWR_Edit.html?page_type=edit&pkid='+ pkid +'&project_id=' + _self.project_id
								+ '&project_name=' + _self.project_name;
		},
		// 打開展示
		open_show: function(pkid) {
			var _self = this;
			window.location.href = 'ERX_SWR_Show.html?page_type=show&pkid='+ pkid +'&project_id=' + _self.project_id
								+ '&project_name=' + _self.project_name;
		},
		// 查詢審核記錄
		query_au_record: function(pkid) {
			var _self = this;
			_self.modal_au_record_list = [];
			
			axios({
				  method: 'post',
				  url: '/ePDMWeb/ERX/query_au_record.x',
				  data: {
					  'rpt_id': pkid
				  }
				}).then(function(response) {
					var data = response.data;
					_self.modal_au_record_list = data;
					$("#au_record_modal").modal("show");
				});
		},
		// 查詢登錄人工號
		query_userid: function() {
			var _self = this;
			
			axios({
				  method: 'post',
				  url: '/ePDMWeb/ERX/query_userid.x',
				  data: ''
				}).then(function(response) {
					var data = response.data;
					_self.userid = data;
				});
		},
		// 刪除報告數據
		delete_rpt: function(pkid) {
			var _self = this;
			var confirm_flag = confirm("確定刪除？");
			if(!confirm_flag) {
				return;
			}
			
			axios({
				  method: 'post',
				  url: '/ePDMWeb/ERX/delete_rpt.x',
				  data: {
					  'rpt_type_no': 'SWR',
					  'pkid': pkid
				  }
				}).then(function(response) {
					var data = response.data;
					
					if(data == "1") {
						alert("刪除成功");
						_self.query_SWR_Main_list(1);
					} else if(data == "0") {
						alert("刪除失敗");
					}
				});
		}
	},
	created: function() {
		var _self = this;
		_self.project_id = _self.getUrlParam("projectId");
		_self.project_name = _self.getUrlParam("projectName");
		_self.query_userid();
	}
});

// 加載laydate插件
lay('#version').html('-v'+ laydate.v);
laydate.render({
  elem: '#create_date', 
  format: 'yyyy/MM/dd',
  range: true,
  done: function(value, date, endDate) {
	  app.create_date = value;
  }
});

// 聲明分页组件實例
var myPagi;

window.onload = function(){
    var tableCont = document.querySelector('#table_cont');// #table-cont為包含table的div
    function scrollHandle (e) {
        var scrollTop = this.scrollTop;
		var scrollLeft = this.scrollLeft;
		this.querySelector('thead').style.transform = 'translateY(' + scrollTop + 'px)';
		
		var tbody_lefts = this.querySelectorAll('.tbody_left');
		for(var i = 0; i < tbody_lefts.length; i++) {
			tbody_lefts[i].style.transform = 'translateX(' + scrollLeft + 'px)';
		}
	
		var thead_top_lefts = this.querySelectorAll('.thead_top_left');
		for(var i = 0; i < thead_top_lefts.length; i++) {
			thead_top_lefts[i].style.transform = 'translate(' + scrollLeft + 'px, 0px)';
		}
    }

    tableCont.addEventListener('scroll', scrollHandle);
}