/////////////////////////////////
// # TODO
// - 妊娠月週日を表示するようにしたい。
// - 出産予定日を入力して保存するようにしたい。
// - 妊娠月週日に合わせたアドバイスやテキストを表示するようにしたい。
/////////////////////////////////

/////////////////////////////////
// 変数の準備
/////////////////////////////////
// background.js を読み込む
var bg = chrome.extension.getBackgroundPage();

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

/////////////////////////////////
// 初期表示
/////////////////////////////////
$(function () {

	console.log("始まったぞ");
	console.log("localStorage.saveFlag = " + localStorage.saveFlag);

	// 出産予定日をセットしていなかった "localStorage.saveFlag" が "" または "NO" の場合
	if(localStorage.saveFlag != "YES"){

		// 出産予定日入力エリアを表示する
		$("#showCountArea").css({display:"none"});
		$("#showInputArea").css({display:"inline"});

		// 出産予定日を指定して設定ボタン押下
		setPregnancyDate();

	// 出産予定日をセットしていた "localStorage.saveFlag" が "YES" の場合
	}else if(localStorage.saveFlag == "YES"){

		// 出産予定日入力エリアを非表示にして、妊娠週を表示する
		$("#showCountArea").css({display:"inline"});
		$("#showInputArea").css({display:"none"});

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
			localStorage.YYYY = $("#inputYYYY").val();
			localStorage.MM = $("#inputMM").val();
			localStorage.DD = $("#inputDD").val();
			
			// 出産予定日から妊娠週数＆月数を計算
			countPregnancyDate(localStorage.YYYY, localStorage.MM, localStorage.DD);

			// 妊娠週数＆月数を表示画面に設定する
			setPregnancyDateTxt();

			// 出産予定日入力エリアを非表示にして、妊娠週エリアを表示する
			$("#showCountArea").css({display:"inline"});
			$("#showInputArea").css({display:"none"});

			// デバッグ
			console.log("設定ボタンを押したぞ");
			// console.log("localStorage.saveFlag = " + localStorage.saveFlag);

		}
	);
}
/////////////////////////////////
// 妊娠週数＆月数を出産予定日から計算する
/////////////////////////////////
var countPregnancyDate = function(YYYY, MM, DD){

	// 今日の日付をXDateオブジェクトとして格納
	var TODAY = new XDate();

	// 出産予定日の日付をXDateオブジェクトとして格納
	DUEDATE = new XDate(YYYY, MM - 1, DD);

	// 出産予定日から今日が妊娠何週何日かを計算
	// (出産予定日 - 今日) / 7 = 残り何週か
	// (出産予定日 - 今日) % 7 = 残り何日か
	// Math.ceil() で数字切り上げ
	var diffWeek = Math.ceil((Math.ceil(TODAY.diffDays(DUEDATE))) / 7);
	var diffDay = (Math.ceil(TODAY.diffDays(DUEDATE))) % 7;

	// 満期40週から差分を引くと現在の妊娠週数
	PWeek = 40 - diffWeek;
	PDay = 7 - diffDay;
	// (現在の週数 * 7) + 日数 を 28日 で割って数値を切り上げると現在の妊娠月数
	PMonth = Math.ceil((Number((PWeek * 7)) + Number(PDay)) / 28);
	PCountdownDays = Math.ceil(TODAY.diffDays(DUEDATE));

	// デバッグ
	console.log("今日は " + TODAY.toString("yyyy/M/d"));
	console.log("出産予定日は " + DUEDATE.toString("yyyy/M/d"));
	console.log("妊娠週数は " + PWeek + "週" + PDay + "日");
	console.log("出産予定日まであと " + Math.ceil(TODAY.diffDays(DUEDATE)) + " 日");
}

/////////////////////////////////
// 妊娠週数＆月数を表示画面に設定する
/////////////////////////////////
var setPregnancyDateTxt = function(){
	$("#setDUEDATE").text(DUEDATE.toString("yyyy/M/d"));
	$("#setPWeek").text(PWeek);
	$("#setPDay").text(PDay);
	$("#setPMonth").text(PMonth);
	$("#setPCountdownDays").text(PCountdownDays);
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
			PWeek = "";
			PDay = "";
			PMonth = "";
			PCountdownDays = "";
			TODAY = "";
			DUEDATE = "";

			// デバッグ
			console.log("リセットを押したぞ");
			// console.log("localStorage.saveFlag = " + localStorage.saveFlag);

		}
	);
}

// $(function(){

// 	// 現在表示しているタブ情報を取得
// 	// 必ず引数に関数をとる
// 	chrome.tabs.getSelected(showColors);
	
// 	// ボタンが押されたら表示する色種別(RGB/HEX)を設定
// 	$("#setRGB").click(
// 		function (){
// 			setColorType("RGB"); // RGBにセット
// 		}
// 	);
// 	$("#setHEX").click(
// 		function (){
// 			setColorType("HEX"); // HEXにセット
// 		}
// 	);

// });



/////////////////////////////////
// popup.html に表示するものを記述
/////////////////////////////////


// var showColors = function(tab){
	
// 	// console.log(tab);

// 	// if文で色情報が取得できているかどうか判別
// 	// 色情報が取得できていたら
// 	if(bg.getColors[tab.id] != null){
// 		//console.log("bg.getColors[tab.id] =" + bg.getColors[tab.id]);
		
// 		// header部分を表示
// 		$("#header").css({display:"block"});

// 		// ボタンにアウトラインが付いてしまうのを外す
// 		// デフォルトでアウトラインが付くのは Chrome の仕様のようだ 
// 		$("#setRGB").css("outline","none");
		
// 		// タブを開くごとに色情報を更新するため、古い情報を最初に消去してリセットしておく
// 		$("#showColors").empty();
		
// 		// 色情報を読込み＆表示
// 		for(var i = 0; i < bg.getColors[tab.id].length; i++){
		
// 			// RGB/HEX形式へそれぞれ変換
// 			// rgbcolor.js を利用
// 			var c = new RGBColor(bg.getColors[tab.id][i]);
// 			cRGB[i] = c.toRGB();
			
// 			cHEX[i] = c.toHex();
			
// 			// RGB値を個別に取得
// 			cR[i] = c.r;
// 			cG[i] = c.g;
// 			cB[i] = c.b;
			
// 			// 色情報を表示するテキスト色を、色情報の輝度によって白/黒に振り分け
// 			txtColor[i] = checkTxtColor(cR[i], cR[i], cB[i]);
			
// 			// ローカルストレージに格納されている色表示形式を確認
// 			checkColorTypeinLocalStorage();

// 			// 指定された形式で色情報を表示
// 			switch(colorType){
// 				//RGB形式の場合
// 				case "RGB":
// 					$('<div class="colorItem" style="color:' + txtColor[i] + '; background-color:' + cRGB[i] + ';"><div class="colorTxt">' + cRGB[i] + '</div><div class="copied">Copied!</div></div>').appendTo("#showColors");
// 					break;
// 				// Hex形式の場合
// 				case "HEX":
// 					$('<div class="colorItem" style="color:' + txtColor[i] + '; background-color:' + cHEX[i] + ';"><div class="colorTxt">' + cHEX[i] + '</div><div class="copied">Copied!</div></div>').appendTo("#showColors");
// 					break;
// 			}
// 		}
		
// 		// 色情報をクリックしたらクリップボードにコピーする
// 		copyColor();
			
// 	//色情報が取得できていなかったら
// 	}else{
// 		// メッセージを表示
// 		$("#showColors").html('<div id="failedArea"><h3 id="failedTitle">Failed! - 色泥棒失敗！</h3><p id="failedTxtEng">Please click the icon again, after reload this page.</p><p id="failedTxtJpn">ブラウザを再読込してから、再度アイコンをクリックしてください。</p></div>');
// 	}

// }


// /////////////////////////////////
// // ローカルストレージに格納されている色表示形式を確認
// /////////////////////////////////
// var checkColorTypeinLocalStorage = function(){

// 	// もしローカルストレージに何も値が記録されていなかったら
// 	if (localStorage.colorType == null){
// 		// RGB を初期値としてセット
// 		localStorage.colorType = "RGB";
// 		// ローカルストレージに記録
// 		colorType = localStorage.colorType;
// 		// ボタン色を変更
// 		$("#setRGB").addClass("btn-primary");


// 	// 何か値が記録されていたら
// 	}else{
// 		// ローカルストレージから値を取り出して、変数 colorType に代入
// 		colorType = localStorage.colorType;
		
// 		if(colorType == "RGB"){
// 			// ボタン色を変更
// 			$("#setHEX").removeClass("btn-primary");
// 			$("#setRGB").addClass("btn-primary");
// 		}else if(colorType == "HEX"){
// 			// ボタン色を変更
// 			$("#setRGB").removeClass("btn-primary");
// 			$("#setHEX").addClass("btn-primary");

// 		}
// 	}
// }

// /////////////////////////////////
// // 色情報をクリックしたらクリップボードにコピー＆アニメーション
// /////////////////////////////////
// var copyColor = function(){
// 	$(".colorItem").click(
// 		function () {
// 			// 色情報テキストをクリップボードにコピー
// 			var cTxt = $(this).find(".colorTxt").text();
// 			copyTextToClipboard(cTxt);
// 			// コピーした色情報テキストの右横に"Copied!"をアニメーション表示する
// 			$(this).find(".copied").css({display: "block", opacity: "0"});
// 			//$(this).find(".copied").fadeTo("slow", 1).fadeTo("slow", 0, function(){$(".copied").css({display: "none"});});
// 			$(this)
// 				.find(".copied")
// 				.fadeTo("slow", 1, function(){
// 					$(this).fadeTo("slow", 0, function(){
// 						$(this).css({display: "none"});
// 					})
// 				});
// 		}
// 	);
// }