var app = new Vue({
	el: '#app',
	data: {
		title: '品管文件發行',// 標題
		name: '',// 文件名
		factory: '',// 廠區
		project: '',// 專案
		factoryList: [],// 廠區list
		projectList: [],// 專案list
		doc_list: [],// 文檔list
		pageSize: 10,// 分頁每頁數量
	},
	methods: {
		// 查詢doc_list數據
		query: function (pageIndex) {
			var _self = this;
			var data = [
				{
					file_origin_name: '測試原始文件名稱11111',
					factory: '成都',
					project: '測試專案1',
					version: '版本1',
					memo: '測試備註',
					creator: '向波任(C3005579)',
					create_time: '2020-01-20',
					update_time: '2020-01-22'
				},
				{
					file_origin_name: '測試原始文件名稱11111',
					factory: '成都',
					project: '測試專案1',
					version: '版本1',
					memo: '測試備註',
					creator: '向波任(C3005579)',
					create_time: '2020-01-20',
					update_time: '2020-01-22'
				},
				{
					file_origin_name: '測試原始文件名稱11111',
					factory: '成都',
					project: '測試專案1',
					version: '版本1',
					memo: '測試備註',
					creator: '向波任(C3005579)',
					create_time: '2020-01-20',
					update_time: '2020-01-22'
				},
				{
					file_origin_name: '測試原始文件名稱11111',
					factory: '成都',
					project: '測試專案1',
					version: '版本1',
					memo: '測試備註',
					creator: '向波任(C3005579)',
					create_time: '2020-01-20',
					update_time: '2020-01-22'
				},
				{
					file_origin_name: '測試原始文件名稱11111',
					factory: '成都',
					project: '測試專案1',
					version: '版本1',
					memo: '測試備註',
					creator: '向波任(C3005579)',
					create_time: '2020-01-20',
					update_time: '2020-01-22'
				},
				{
					file_origin_name: '測試原始文件名稱11111',
					factory: '成都',
					project: '測試專案1',
					version: '版本1',
					memo: '測試備註',
					creator: '向波任(C3005579)',
					create_time: '2020-01-20',
					update_time: '2020-01-22'
				},
				{
					file_origin_name: '測試原始文件名稱11111',
					factory: '成都',
					project: '測試專案1',
					version: '版本1',
					memo: '測試備註',
					creator: '向波任(C3005579)',
					create_time: '2020-01-20',
					update_time: '2020-01-22'
				},
				{
					file_origin_name: '測試原始文件名稱11111',
					factory: '成都',
					project: '測試專案1',
					version: '版本1',
					memo: '測試備註',
					creator: '向波任(C3005579)',
					create_time: '2020-01-20',
					update_time: '2020-01-22'
				},
				{
					file_origin_name: '測試原始文件名稱11111',
					factory: '成都',
					project: '測試專案1',
					version: '版本1',
					memo: '測試備註',
					creator: '向波任(C3005579)',
					create_time: '2020-01-20',
					update_time: '2020-01-22'
				},
				{
					file_origin_name: '測試原始文件名稱11111',
					factory: '成都',
					project: '測試專案1',
					version: '版本1',
					memo: '測試備註',
					creator: '向波任(C3005579)',
					create_time: '2020-01-20',
					update_time: '2020-01-22'
				},
				{
					file_origin_name: '測試原始文件名稱11111',
					factory: '成都',
					project: '測試專案1',
					version: '版本1',
					memo: '測試備註',
					creator: '向波任(C3005579)',
					create_time: '2020-01-20',
					update_time: '2020-01-22'
				},
				{
					file_origin_name: '測試原始文件名稱11111',
					factory: '成都',
					project: '測試專案1',
					version: '版本1',
					memo: '測試備註',
					creator: '向波任(C3005579)',
					create_time: '2020-01-20',
					update_time: '2020-01-22'
				},
				{
					file_origin_name: '測試原始文件名稱11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111',
					factory: '成都',
					project: '測試專案111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111',
					version: '版本1',
					memo: '測試備註',
					creator: '向波任(C3005579)',
					create_time: '2020-01-20',
					update_time: '2020-01-22'
				},
			];
			_self.doc_list = data;
			var page_total = 10;
			var row_total = 10;
			
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
					_self.query_PD_Main_list(pageIndex);
				}
			});
		}
	},
	created: function () {
		var _self = this;
		_self.query(1);
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