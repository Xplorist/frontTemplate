var app = new Vue({
	el: '#app',
	data: {
		title: '品管文件發行',
		axiosBaseUrl: '/ePDMWeb/QM_DOC/',
		query_name: '',// 查詢文件名
		query_factory: '', // 查詢廠區
		query_project: '',// 查詢專案
		doc_list: [],// 文檔list
		doc_type_list: [],// 文檔類型list
		factory_list: [],// 廠區list
		project_list: [],// 專案list
		auditor_type_list: [],// 審核人類型list
		pageSize: 8,// 分頁每頁數量
		recordList: [],// 審核記錄list
		taskList: [],// 審核任務list
	},
	methods: {
		// 新增
		add: function () {
			var _self = this;
			window.location.href = 'QM_DOC_Edit.html';
		},
		// 查詢
		query: function (pageIndex) {
			
			// 【03】分頁條件查詢文檔list
			axios({
				  method: 'get',
				  url: _self.axiosBaseUrl + 'listDocInfo.x?pageIndex=' + pageIndex + '&pageSize=' + _self.pageSize 
				  	+ '&factory=' + _self.query_factory + '&project=' + _self.query_project + '&name=' + _self.query_name
				}).then(function(response) {
					var data = response.data;
					if (data.code === '1') {
						var t = data.t;
						var row_total = t.row_total;
						var page_total = t.page_total;
						_self.doc_list = t.list;
						
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
						    	_self.query(pageIndex);
						    }
						});
					} else {
						alert(data.msg);
					}
				});
		},
		// 查詢基本數據
		queryBaseInfo: function () {
			var _self = this;
			
			// 【09】查詢基本信息
			axios({
				  method: 'get',
				  url: _self.axiosBaseUrl + 'queryBaseInfo.x'
				}).then(function(response) {
					var data = response.data;
					if (data.code === '1') {
						var t = data.t;
						_self.doc_type_list = t.doc_type_list;
						_self.factory_list = t.factory_list;
						_self.project_list = t.project_list;
						_self.auditor_type_list = t.auditor_type_list;
					} else {
						alert(data.msg);
					}
				});
		},
		// 打開查看頁面
		open_show: function () {
			window.href.location = 'QM_DOC_Show.html';
		},
		// 打開編輯頁面
		open_edit: function () {
			window.href.location = 'QM_DOC_Edit.html';
		},
		// 刪除數據
		delete_data: function (doc_id) {
			// 【04】刪除文檔信息
			axios({
				  method: 'get',
				  url: _self.axiosBaseUrl + 'deleteDocInfo.x?doc_id=' + doc_id
				}).then(function(response) {
					var data = response.data;
					if (data.code === '1') {
						alert("刪除成功");
					} else {
						alert(data.msg);
					}
				});
		},
		// 查詢審核記錄
		au_record: function (doc_id) {
			// 【07】查詢審核記錄
			axios({
				  method: 'get',
				  url: _self.axiosBaseUrl + 'auRecord.x?doc_id=' + doc_id
				}).then(function(response) {
					var data = response.data;
					if (data.code === '1') {
						var t = data.t;
						_self.recordList = t.recordList;
						_self.taskList = t.taskList;
					} else {
						alert(data.msg);
					}
				});
		},
		// 模板，放在最後
		template: function () {
			// 【0x】xxx
			axios({
				  method: 'post',
				  url: _self.axiosBaseUrl + 'queryBaseInfo.x',
				  data: {
					  'x': 'x'
				  }
				}).then(function(response) {
					var data = response.data;
					if (data.code === '1') {
						var t = data.t;
						_self.title = t.x;
					} else {
						alert(data.msg);
					}
				});
		}
	},
	created: function () {
		var _self = this;
		_self.queryBaseInfo();
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