// Config variables
//var urlBackend = "http://localhost:8080/";
var urlBackend = "http://miv-aodfront-01.aragon.local:8090/";

// Endpoints
var listCharts_ep = "services/charts";
var process_ep = "services/charts/download_process/";
var resource_ckan_ep = "services/ckan/packageResource";
var resource_gaodc_ep = "services/gaodc/packageInfo";
var resource_url_ep = "services/url/packageInfo";
var resource_virtuoso_ep = "services/virtuoso/packageInfo";
var save_graph_ep = "services/charts/save_chart";
var save_process_ep = "services/charts/save_process";

exports.listCharts_ep = listCharts_ep;
exports.process_ep = process_ep;
exports.resource_ckan_ep = resource_ckan_ep;
exports.resource_gaodc_ep = resource_gaodc_ep;
exports.resource_url_ep = resource_url_ep;
exports.resource_virtuoso_ep = resource_virtuoso_ep;
exports.save_graph_ep = save_graph_ep;
exports.save_process_ep = save_process_ep;
exports.urlBackend = urlBackend;