// 変数の値は全て popup.js から受け取る

// 出産予定日を保存したかどうか判別するフラグ変数
// var saveFlag = "NO"; // 初期値はNO (NO = 保存してない / YES = 保存してある)
// localStorage.saveFlag = ""; // ローカルストレージは毎回宣言しなくてOKなのでコメントアウト

// 出産予定日を保存しておくための変数
// localStorage.YYYY = ""; // ローカルストレージは毎回宣言しなくてOKなのでコメントアウト
// localStorage.MM = ""; // むしろここで宣言するとアップデート時に毎回値がリセットされてしまう
// localStorage.DD = ""; // ローカルストレージは毎回宣言しなくてOKなのでコメントアウト
var DUEDATE = ""

// 出産予定日から計算した妊娠週＆日＆月数を格納するための変数
var PWeek = "";
var PDay = "";
var PMonth = "";
var PCountdownDays = "";
var PWeekDay = "";

/////////////////////////////////
// BrouserAction アイコンのバッヂテキスト＆色を設定
/////////////////////////////////
var setBadge = function(){

 	// バッヂテキストを設定
	chrome.browserAction.setBadgeText({
		text: PWeekDay
	});

	// バッヂ背景色を設定
	chrome.browserAction.setBadgeBackgroundColor({
		color:[23,31,85,255] // R,G,B,Alpha で指定
	});
};

/////////////////////////////////
// 妊娠週数＆月数を出産予定日から計算する
/////////////////////////////////
var countPregnancyDate = function(YYYY, MM, DD){

	// 今日の日付をXDateオブジェクトとして格納
	var TODAY = new XDate();

	// 出産予定日の日付をXDateオブジェクトとして格納
	DUEDATE = new XDate(YYYY, MM - 1, DD);

	// 出産予定日が今日より未来の日付だった場合
	if(TODAY.diffDays(DUEDATE) > 0){
	
		// 出産予定日から今日が妊娠何週何日かを計算
		// (出産予定日 - 今日) / 7 = 残り何週か
		// (出産予定日 - 今日) % 7 = 残り何日か
		// Math.ceil() で数字切り上げ
		var diffWeek = Math.ceil((Math.ceil(TODAY.diffDays(DUEDATE))) / 7);
		var diffDay = (Math.ceil(TODAY.diffDays(DUEDATE))) % 7;

		// 満期40週から差分を引くと現在の妊娠週数
		PWeek = 40 - diffWeek;
		PDay = 7 - diffDay;

		// 7日目とは数えないので7日の場合は0日と表記
		if (PDay == 7){
			PDay = 0;
		};

	// 出産予定日が今日より過去の日付だった場合
	}else{

		var diffWeek = Math.ceil((Math.ceil(DUEDATE.diffDays(TODAY))) / 7);
		var diffDay = (Math.ceil(DUEDATE.diffDays(TODAY))) % 7;

		// 満期40週に差分を足すと妊娠週数
		PWeek = 39 + diffWeek;
		PDay = diffDay - 1;

		// 変な数字になるので無理やり微調整
		if(PDay == -1){
			PDay = 6;
		};

	}

	// (現在の週数 * 7) + 日数 を 28日 で割って数値を切り上げると現在の妊娠月数
	PMonth = Math.ceil((Number((PWeek * 7)) + Number(PDay + 1)) / 28);
	PCountdownDays = Math.ceil(TODAY.diffDays(DUEDATE));
	PWeekDay = PWeek + "w" + PDay + "d";

	// // デバッグ
	// console.log("今日は " + TODAY.toString("yyyy/M/d"));
	// console.log("出産予定日は " + DUEDATE.toString("yyyy/M/d"));
	// console.log("妊娠週数は " + PWeek + "週" + PDay + "日");
	// console.log("出産予定日まであと " + Math.ceil(TODAY.diffDays(DUEDATE)) + " 日");
	// console.log("バッヂに表示するテキストは " + PWeek + "w" + PDay + "d");
}

/////////////////////////////////
// 日付が変わるタイミングでバッヂテキストを更新する
/////////////////////////////////
var updateBadgeText = function(){

	// タイマーを発動させる日時を設定する
	// 現在日時を取得しその日の夜中0時にタイマーが発動するようにする
	var nextMidnight = XDate();
	nextMidnight.addDays(1);
	nextMidnight.setHours(0);
	nextMidnight.setMinutes(0);
	nextMidnight.setSeconds(0);
	nextMidnight.setMilliseconds(0);
	
	// デバッグ用
	// console.log("updateBadgeText();");
	// console.log("PDay = " + PDay);
	// nextMidnight.addMilliseconds(999);

	var timer = XDate().diffMilliseconds(nextMidnight);

	countPregnancyDate(localStorage.YYYY, localStorage.MM, localStorage.DD);
	setBadge();
	setTimeout(
		function(){
			updateBadgeText();
		},
		timer
	);

	// デバッグ用
	// PDay = PDay + 1;
	// setBadge();
	// setTimeout(
	// 	function(){
	// 		updateBadgeText();
	// 	},
	// 	timer
	// );

}

if(localStorage.saveFlag == "YES"){
	countPregnancyDate(localStorage.YYYY, localStorage.MM, localStorage.DD);
	setBadge();
}
