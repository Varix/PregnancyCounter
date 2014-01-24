// 変数の値は全て popup.js から受け取る

// 出産予定日を保存したかどうか判別するフラグ変数
// var saveFlag = "NO"; // 初期値はNO (NO = 保存してない / YES = 保存してある)
localStorage.saveFlag = "";

// 出産予定日を保存しておくための変数
localStorage.YYYY = "";
localStorage.MM = "";
localStorage.DD = "";
var DUEDATE = ""

// 出産予定日から計算した妊娠週＆日＆月数を格納するための変数
var PWeek = "";
var PDay = "";
var PMonth = "";
var PCountdownDays = "";
var PWeekDay = ""; // バッヂ表示用

// BrouserAction アイコンのバッヂテキストを設定
var setBadge = function(){
	chrome.browserAction.setBadgeText({
		text:PWeekDay
	});
};

setBadge();