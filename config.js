// Config variables
var urlBackend = "http://localhost:8080/";

// Endpoints
var listCharts_ep = "services/charts";
var process_ep = "services/charts/download_process/";
var resorce_ckan_ep = "services/ckan/packageResource";
var resorce_gaodc_ep = "services/gaodc/packageInfo";
var resorce_url_ep = "services/url/packageInfo";
var resorce_virtuoso_ep = "services/virtuoso/packageInfo";
var save_graph_ep = "services/charts/save_chart";
var save_process_ep = "services/charts/save_process";

exports.listCharts_ep = listCharts_ep;
exports.process_ep = process_ep;
exports.resorce_ckan_ep = resorce_ckan_ep;
exports.resorce_gaodc_ep = resorce_gaodc_ep;
exports.resorce_url_ep = resorce_url_ep;
exports.resorce_virtuoso_ep = resorce_virtuoso_ep;
exports.save_graph_ep = save_graph_ep;
exports.save_process_ep = save_process_ep;
exports.urlBackend = urlBackend;