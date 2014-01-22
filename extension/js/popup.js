/////////////////////////////////
// # TODO
// - 出産予定日を入力して保存するようにしたい。
// - 妊娠月週日を表示するようにしたい。
// - 妊娠月週日に合わせたアドバイスやテキストを表示するようにしたい。
/////////////////////////////////

/////////////////////////////////
// 変数の準備
/////////////////////////////////
// background.js を読み込む
var bg = chrome.extension.getBackgroundPage();

// 出産予定日を保存したかどうか判別するフラグ変数
var flag = "NO"; // 初期値はNO (NO = 保存してない / YES = 保存してある)

// 出産予定日を保存しておくための変数
var YYYY = "";
var MM = "";
var DD = "";

// 出産予定日から計算した妊娠週数＆日数を格納するための変数
var WW = "36";
var WD = "3";

// 出産予定日から計算した妊娠月数を格納するための変数
var WM = "10";

/////////////////////////////////
// 初期表示
/////////////////////////////////
$(function () {
	console.log("始まったぞ");
	// 設定ボタンを押したら
	$("#setPregnancyDate").click(
		function(){
			console.log("設定ボタンを押したぞ");
			// 出産予定日入力エリアを非表示にして、妊娠週を表示する
			$("#showInputArea").css({display:"none"});
			$("#showCountArea").css({display:"inline"});
			// 出産予定日を保存したフラグをYESに変更
			flag = "YES";
			// 妊娠週数＆月数を表示画面に設定する
			setPregnancyDateTxt();
		}
	);
	// リセットボタンを押したら
	$("#resetPregnancyDate").click(
		function(){
			console.log("リセットを押したぞ");
			// 妊娠週を非表示にして、出産予定日入力エリアを表示する
			$("#showInputArea").css({display:"inline"});
			$("#showCountArea").css({display:"none"});
			// 出産予定日を保存したフラグをNOに変更
			flag = "NO";
		}
	);
});

/////////////////////////////////
// 妊娠週数＆月数を表示画面に設定する
/////////////////////////////////
var setPregnancyDateTxt = function(){
	$("#setWW").text(WW);
	$("#setWD").text(WD);
	$("#setWM").text(WM);
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

/////////////////////////////////
// 出産予定日を記録
/////////////////////////////////
// var setPregnancyDate = function() {
// 	$("#setPregnancyDate").click(

// 		// ローカルストレージに記録
// 		localStorage.yyyy = ("#inputYYYY").text();
// 		localStorage.mm = ("#inputMM").text();
// 		localStorage.dd = ("#inputYYYY").text();

// 		console.log(localStorage.yyyy);
// 	);

// 	var flag = "YES";
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

// /////////////////////////////////
// // 背景色によってテキスト色を白/黒どちらにするか判別する
// /////////////////////////////////
// // 参考式: Y=0.3R+0.6G+0.1B で Y>127なら黒、それ以外なら白
// // 参考URL: http://q.hatena.ne.jp/1214314649
// var checkTxtColor = function(cR,cG,cB){

// 	// 最高値は255なので、約半分の数値127を堺目にして白/黒の判別する
// 	var cY = 0.3*cR + 0.6*cG + 0.1*cB;
	
// 	if(cY > 127){
// 		return "#111111"; // 黒に設定
// 	}
// 	return "#EEEEEE"; // 白に設定
// }