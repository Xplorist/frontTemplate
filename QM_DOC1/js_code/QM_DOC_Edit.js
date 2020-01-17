var app = new Vue({
	el: '#app',
	data: {
		doc_type: '',// 文件類型
		doc_type_list: [],// 文件類型list
		factory: '',// 廠區
		factory_list: [],// 廠區list
		project: '',// 專案
		project_list: [],// 專案list
		version: '',// 版本
		file_origin_name: '',// 文件原始名稱
		file_save_name: '',// 文件保存名稱
		file_save_path: '',// 文件保存路徑
		memo: '',// 備註說明
	},
	methods: {
		// 返回上一頁
		goBack: function() {
			var _self = this;
			window.location.href = "QM_DOC_List.html";
		},
	},
	created: function () {
		
	}
});