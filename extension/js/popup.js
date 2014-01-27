/////////////////////////////////
// # TODO
// - メモリ消費を抑えるため Event Pages に対応したい。
// - setTimeout() ではなく chrome.alarm を使うように変更したい。
// - 妊娠月週日に合わせたアドバイスやテキストを表示するようにしたい。
/////////////////////////////////
// # TODO 完了済
// - 妊娠月週日を表示するようにしたい。
// - 出産予定日を入力して保存するようにしたい。
// - 西暦入力をプルダウンにしたい。
// - 日付の初期値を今日の日付にしたい。
// - リセットじゃなくて変更に文言変更する。
// - 月の数字にあわせて、日の表示をコントロールしたい（30,31,うるう年）
// - jQueryで動的にoptionを生成するようにしたい。
// - 出産予定日を変更にフォーカスがあたらないようにしたい。
// - 出産予定日を過ぎたら「もう産まれた？」とか軽いメッセージに変える。
// - 過去の日付を入力すると、妊娠週数の日数が変になるバグを直したい。
// - バッヂ表示をタイマー更新で日付変わると同時に更新したい。
/////////////////////////////////

/////////////////////////////////
// background.js を読み込む
/////////////////////////////////
var bg = chrome.extension.getBackgroundPage();

/////////////////////////////////
// 初期表示
/////////////////////////////////
$(function () {

	// // デバッグ
	// console.log("popup.js を読み込んだぞ");
	// console.log("localStorage.saveFlag = " + localStorage.saveFlag);
	// console.log("bg.PWeekDay = " + bg.PWeekDay);
	// console.log("出産予定日は " + bg.DUEDATE.toString("yyyy/M/d"));
	// console.log("妊娠週数は " + bg.PWeek + "週" + bg.PDay + "日");
	// console.log("出産予定日まであと " + bg.PCountdownDays + " 日");
	// console.log("バッヂに表示するテキストは " + bg.PWeek + "w" + bg.PDay + "d");

	// 出産予定日をセットしていなかった "localStorage.saveFlag" が "" または "NO" の場合
	if(localStorage.saveFlag != "YES"){

		// 出産予定日の入力可能数字を制御
		controlPregnancyDate();

		// 出産予定日入力エリアを表示する
		$("#showCountArea").css({display:"none"});
		$("#showInputArea").css({display:"inline"});

		// フォーム周りに装飾がつくのを防ぐ
		$("#inputYYYY").css("outline","none");
		$("#inputMM").css("outline","none");
		$("#inputDD").css("outline","none");

		// 出産予定日を指定して設定ボタン押下
		setPregnancyDate();

		// // デバッグ
		// console.log("出産予定日が設定されていないぞ");
		// console.log("localStorage.saveFlag = " + localStorage.saveFlag);
		// console.log("bg.PWeekDay = " + bg.PWeekDay);
		// console.log("出産予定日は " + bg.DUEDATE.toString("yyyy/M/d"));
		// console.log("妊娠週数は " + bg.PWeek + "週" + bg.PDay + "日");
		// console.log("出産予定日まであと " + bg.PCountdownDays + " 日");
		// console.log("バッヂに表示するテキストは " + bg.PWeek + "w" + bg.PDay + "d");

	// 出産予定日をセットしていた "localStorage.saveFlag" が "YES" の場合
	}else if(localStorage.saveFlag == "YES"){

		// 出産予定日から妊娠週数＆月数を再計算
		bg.countPregnancyDate(localStorage.YYYY, localStorage.MM, localStorage.DD);

		// 妊娠週数＆月数を表示画面に再設定する
		setPregnancyDateTxt();

		// 出産予定日入力エリアを非表示にして、妊娠週を表示する
		$("#showCountArea").css({display:"inline"});
		$("#showInputArea").css({display:"none"});

		// 変更ボタンに装飾がつくのを防ぐ
		$("#resetPregnancyDate").css("outline","none");

		// // デバッグ
		// console.log("出産予定日が設定されてるぞ");
		// console.log("localStorage.saveFlag = " + localStorage.saveFlag);
		// console.log("bg.PWeekDay = " + bg.PWeekDay);
		// console.log("出産予定日は " + bg.DUEDATE.toString("yyyy/M/d"));
		// console.log("妊娠週数は " + bg.PWeek + "週" + bg.PDay + "日");
		// console.log("出産予定日まであと " + bg.PCountdownDays + " 日");
		// console.log("バッヂに表示するテキストは " + bg.PWeek + "w" + bg.PDay + "d");

	};

	// 出産予定日を変更
	resetPregnancyDate();


});

/////////////////////////////////
// 出産予定日の入力可能数字を制御
/////////////////////////////////
var controlPregnancyDate = function(){

	// 一度プルダウンの内容を空にする
	$("#inputYYYY").empty();
	$("#inputMM").empty();

	// 今日の日時を取得
	var TODAY = XDate();

	// 入力可能な年の設定: 今年と翌年の2年分を取得する
	$("#inputYYYY").append($("<option></option>").text(TODAY.getFullYear()));
	$("#inputYYYY").append($("<option></option>").text(TODAY.getFullYear() + 1));

	// 入力可能な月の設定: 初期値は現在の月
	for(var i = 0; i < 12; i++){
		$("#inputMM").append($("<option></option>").text(i + 1));
	};
	// 今月を初期値として選択
	var thisMonth = Number(TODAY.getMonth());
	$("#inputMM>option:eq(" + thisMonth + ")").attr("selected","selected");

	// 入力可能な日の設定: 初期値は現在の日
	controlDay();

	// 今日を初期値として選択
	var thisDay = Number(TODAY.getDate()) - 1;
	$("#inputDD>option:eq(" + thisDay + ")").attr("selected","selected");

	// 年または月の表示が変わるたびに日の表示数を制御
	$("#inputYYYY").change(function(){
		controlDay();
	});
	$("#inputMM").change(function(){
		controlDay();
	});

}

/////////////////////////////////
// 設定された月に応じて日の表示数（28 or 29 or 30 or 31）を制御
/////////////////////////////////
var controlDay = function(){

	// 一度プルダウンの内容を空にする
	$("#inputDD").empty();

	// 2月の場合
	if($("#inputMM").val() == 2){

		// うるう年の場合（西暦が 4,100,400 のいづれでも割り切れる場合）
		if($("#inputYYYY").val() % 4 == 0 && $("#inputYYYY").val() % 100 == 0 && $("#inputYYYY").val() % 400 == 0){
			for(var i = 0; i < 29; i++){
				$("#inputDD").append($("<option></option>").text(i + 1));
			};
		// うるう年ではない場合
		}else{
			for(var i = 0; i < 28; i++){
				$("#inputDD").append($("<option></option>").text(i + 1));
			};
		}

	// 30日までしかない月の場合（4,6,9,11月）
	}else if($("#inputMM").val() == 4 || $("#inputMM").val() == 6 || $("#inputMM").val() == 9 || $("#inputMM").val() == 11){
		for(var i = 0; i < 30; i++){
			$("#inputDD").append($("<option></option>").text(i + 1));
		};

	// 31日まである月の場合（2,4,6,9,11月以外）
	}else{
		for(var i = 0; i < 31; i++){
			$("#inputDD").append($("<option></option>").text(i + 1));
		};
	}

}

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
			localStorage.YYYY = $("#inputYYYY").val();
			localStorage.MM = $("#inputMM").val();
			localStorage.DD = $("#inputDD").val();
			
			// 出産予定日から妊娠週数＆月数を計算
			bg.countPregnancyDate(localStorage.YYYY, localStorage.MM, localStorage.DD);

			// 妊娠週数＆月数を表示画面に設定する
			setPregnancyDateTxt();
			bg.updateBadgeText();

			// 出産予定日入力エリアを非表示にして、妊娠週エリアを表示する
			$("#showCountArea").css({display:"inline"});
			$("#showInputArea").css({display:"none"});

		}
	);
}

/////////////////////////////////
// 妊娠週数＆月数を表示画面に設定する
/////////////////////////////////
var setPregnancyDateTxt = function(){

	$("#setDUEDATE").text(bg.DUEDATE.toString("yyyy/M/d")); // 出産予定日
	$("#setPWeek").text(bg.PWeek); // 妊娠週数
	$("#setPDay").text(bg.PDay); // 妊娠週日数
	$("#setPMonth").text(bg.PMonth); // 妊娠月数
	$("#setPCountdownDays").text(bg.PCountdownDays); // 出産予定日まであと何日
	bg.setBadge(); // バッヂ表示をリフレッシュ

	// 出産予定日を過ぎていたら
	happyBirthdayBaby();

}

/////////////////////////////////
// 出産予定日を過ぎていたらカウントダウンではなくコメントを表示する
/////////////////////////////////
var happyBirthdayBaby = function(){
	if(bg.PWeek >= 40){
		$("#countdownArea").css({display:"none"});
		$("#commentArea").css({display:"inline"});
	};
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

			// 出産予定日の入力可能数字を制御
			controlPregnancyDate();

			// 妊娠週を非表示にして、出産予定日入力エリアを表示する
			$("#showCountArea").css({display:"none"});
			$("#showInputArea").css({display:"inline"});

			// 出産予定日や計算した妊娠週数を空にする
			localStorage.YYYY = "";
			localStorage.MM = "";
			localStorage.DD = "";
			bg.DUEDATE = "";
			bg.PWeek = "";
			bg.PDay = "";
			bg.PMonth = "";
			bg.PCountdownDays = "";
			bg.PWeekDay ="";

			// バッヂ表示をリフレッシュ
			bg.setBadge(); 

			// カウントダウンエリアを表示、コメントエリアを非表示、の初期状態に設定しなおす
			$("#countdownArea").css({display:"inline"});
			$("#commentArea").css({display:"none"});

			// 出産予定日を指定して設定ボタン押下
			setPregnancyDate();

			// // デバッグ
			// console.log("リセットしたぞ");
			// console.log("localStorage.saveFlag = " + localStorage.saveFlag);
			// console.log("bg.PWeekDay = " + bg.PWeekDay);
			// console.log("出産予定日は " + bg.DUEDATE.toString("yyyy/M/d"));
			// console.log("妊娠週数は " + bg.PWeek + "週" + bg.PDay + "日");
			// console.log("出産予定日まであと " + bg.PCountdownDays + " 日");
			// console.log("バッヂに表示するテキストは " + bg.PWeek + "w" + bg.PDay + "d");

		}
	);
}