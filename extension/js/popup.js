/////////////////////////////////
// # TODO
// - 妊娠月週日を表示するようにしたい。
// - 出産予定日を入力して保存するようにしたい。
// - 妊娠月週日に合わせたアドバイスやテキストを表示するようにしたい。
// - バッヂ表示をタイマー更新で日付変わると同時に更新したい。
// - 西暦入力をプルダウンにしたい。
// - 日付入力を過去の日付を入力できないようにしたい。
// - 日付の初期値を今日の日付にしたい。
// - 出産予定日を過ぎたら「もう産まれた？」とか軽いメッセージに変える。
// - リセットじゃなくて変更に文言変更する。
/////////////////////////////////

/////////////////////////////////
// background.js を読み込む
/////////////////////////////////
var bg = chrome.extension.getBackgroundPage();

/////////////////////////////////
// 初期表示
/////////////////////////////////
$(function () {

	// デバッグ
	console.log("popup.js を読み込んだぞ");
	console.log("localStorage.saveFlag = " + localStorage.saveFlag);
	console.log("bg.PWeekDay = " + bg.PWeekDay);
	console.log("出産予定日は " + bg.DUEDATE.toString("yyyy/M/d"));
	console.log("妊娠週数は " + bg.PWeek + "週" + bg.PDay + "日");
	console.log("出産予定日まであと " + bg.PCountdownDays + " 日");
	console.log("バッヂに表示するテキストは " + bg.PWeek + "w" + bg.PDay + "d");

	// 出産予定日をセットしていなかった "localStorage.saveFlag" が "" または "NO" の場合
	if(localStorage.saveFlag != "YES"){

		// 出産予定日入力エリアを表示する
		$("#showCountArea").css({display:"none"});
		$("#showInputArea").css({display:"inline"});

		// 出産予定日を指定して設定ボタン押下
		setPregnancyDate();

		// デバッグ
		console.log("出産予定日が設定されていないぞ");
		console.log("localStorage.saveFlag = " + localStorage.saveFlag);
		console.log("bg.PWeekDay = " + bg.PWeekDay);
		console.log("出産予定日は " + bg.DUEDATE.toString("yyyy/M/d"));
		console.log("妊娠週数は " + bg.PWeek + "週" + bg.PDay + "日");
		console.log("出産予定日まであと " + bg.PCountdownDays + " 日");
		console.log("バッヂに表示するテキストは " + bg.PWeek + "w" + bg.PDay + "d");

	// 出産予定日をセットしていた "localStorage.saveFlag" が "YES" の場合
	}else if(localStorage.saveFlag == "YES"){

		// 出産予定日から妊娠週数＆月数を再計算
		bg.countPregnancyDate(localStorage.YYYY, localStorage.MM, localStorage.DD);

		// 妊娠週数＆月数を表示画面に再設定する
		setPregnancyDateTxt();

		// 出産予定日入力エリアを非表示にして、妊娠週を表示する
		$("#showCountArea").css({display:"inline"});
		$("#showInputArea").css({display:"none"});

		// デバッグ
		console.log("出産予定日が設定されてるぞ");
		console.log("localStorage.saveFlag = " + localStorage.saveFlag);
		console.log("bg.PWeekDay = " + bg.PWeekDay);
		console.log("出産予定日は " + bg.DUEDATE.toString("yyyy/M/d"));
		console.log("妊娠週数は " + bg.PWeek + "週" + bg.PDay + "日");
		console.log("出産予定日まであと " + bg.PCountdownDays + " 日");
		console.log("バッヂに表示するテキストは " + bg.PWeek + "w" + bg.PDay + "d");

	};

	// 出産予定日をリセット
	resetPregnancyDate();


});

/////////////////////////////////
// 出産予定日を指定して設定ボタンを押す処理
/////////////////////////////////
var setPregnancyDate = function(){
	// 設定ボタンを押したら
	$("#setPregnancyDate").click(
		function(){

			// 出産予定日を保存したフラグをYESに変更
			localStorage.saveFlag = "YES";
			
			// 入力された出産予定日を変数に格納
			if($("#inputYYYY").val() != ""){
				localStorage.YYYY = $("#inputYYYY").val();
			}else{
				$("#inputYYYY").addClass();
			}
			localStorage.MM = $("#inputMM").val();
			localStorage.DD = $("#inputDD").val();
			
			// 出産予定日から妊娠週数＆月数を計算
			bg.countPregnancyDate(localStorage.YYYY, localStorage.MM, localStorage.DD);

			// 妊娠週数＆月数を表示画面に設定する
			setPregnancyDateTxt();

			// 出産予定日入力エリアを非表示にして、妊娠週エリアを表示する
			$("#showCountArea").css({display:"inline"});
			$("#showInputArea").css({display:"none"});

		}
	);
}


// /////////////////////////////////
// // 妊娠週数＆月数を出産予定日から計算する
// /////////////////////////////////
// var countPregnancyDate = function(YYYY, MM, DD){

// 	// 今日の日付をXDateオブジェクトとして格納
// 	var TODAY = new XDate();

// 	// 出産予定日の日付をXDateオブジェクトとして格納
// 	bg.DUEDATE = new XDate(YYYY, MM - 1, DD);

// 	// 出産予定日から今日が妊娠何週何日かを計算
// 	// (出産予定日 - 今日) / 7 = 残り何週か
// 	// (出産予定日 - 今日) % 7 = 残り何日か
// 	// Math.ceil() で数字切り上げ
// 	var diffWeek = Math.ceil((Math.ceil(TODAY.diffDays(bg.DUEDATE))) / 7);
// 	var diffDay = (Math.ceil(TODAY.diffDays(bg.DUEDATE))) % 7;

// 	// 満期40週から差分を引くと現在の妊娠週数
// 	bg.PWeek = 40 - diffWeek;
// 	bg.PDay = 7 - diffDay;
// 	// (現在の週数 * 7) + 日数 を 28日 で割って数値を切り上げると現在の妊娠月数
// 	bg.PMonth = Math.ceil((Number((bg.PWeek * 7)) + Number(bg.PDay)) / 28);
// 	bg.PCountdownDays = Math.ceil(TODAY.diffDays(bg.DUEDATE));
// 	bg.PWeekDay = bg.PWeek + "w" + bg.PDay + "d";

// 	// デバッグ
// 	console.log("今日は " + TODAY.toString("yyyy/M/d"));
// 	console.log("出産予定日は " + bg.DUEDATE.toString("yyyy/M/d"));
// 	console.log("妊娠週数は " + bg.PWeek + "週" + bg.PDay + "日");
// 	console.log("出産予定日まであと " + Math.ceil(TODAY.diffDays(bg.DUEDATE)) + " 日");
// 	console.log("バッヂに表示するテキストは " + bg.PWeek + "w" + bg.PDay + "d");
// }

/////////////////////////////////
// 妊娠週数＆月数を表示画面に設定する
/////////////////////////////////
var setPregnancyDateTxt = function(){
	$("#setDUEDATE").text(bg.DUEDATE.toString("yyyy/M/d")); // 出産予定日
	$("#setPWeek").text(bg.PWeek); // 妊娠週数
	$("#setPDay").text(bg.PDay); // 妊娠週日数
	$("#setPMonth").text(bg.PMonth); // 妊娠付き数
	$("#setPCountdownDays").text(bg.PCountdownDays); // 出産予定日まであと何日
	bg.setBadge(); // バッヂ表示をリフレッシュ
}

/////////////////////////////////
// 出生予定日をリセットする処理
/////////////////////////////////
var resetPregnancyDate = function(){
	// リセットボタンを押したら
	$("#resetPregnancyDate").click(
		function(){

			// 出産予定日を保存したフラグをNOに変更
			localStorage.saveFlag = "NO";

			// 妊娠週を非表示にして、出産予定日入力エリアを表示する
			$("#showCountArea").css({display:"none"});
			$("#showInputArea").css({display:"inline"});

			// 出産予定日や計算した妊娠週数を空にする
			localStorage.YYYY = "";
			localStorage.MM = "";
			localStorage.DD = "";
			bg.PWeek = "";
			bg.PDay = "";
			bg.PMonth = "";
			bg.PCountdownDays = "";
			bg.DUEDATE = "";
			bg.PWeekDay = "";

			bg.setBadge(); // バッヂ表示をリフレッシュ

			// デバッグ
			console.log("リセットしたぞ");
			console.log("localStorage.saveFlag = " + localStorage.saveFlag);
			console.log("bg.PWeekDay = " + bg.PWeekDay);
			console.log("出産予定日は " + bg.DUEDATE.toString("yyyy/M/d"));
			console.log("妊娠週数は " + bg.PWeek + "週" + bg.PDay + "日");
			console.log("出産予定日まであと " + bg.PCountdownDays + " 日");
			console.log("バッヂに表示するテキストは " + bg.PWeek + "w" + bg.PDay + "d");

		}
	);
}