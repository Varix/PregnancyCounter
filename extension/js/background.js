// 妊娠週数を格納する変数
// 値は popup.js から受け取りたいけどどうするんだ？
// 値を空にすると if で分けなくてもバッヂは非表示になる様子
var PWWD = "36w3d";

// background.js でコンソールログだすにはどうしたらいいんだ？
// 下記だと表示されない
console.log("background.js だぞ");

// BrouserAction アイコンにバッヂを表示
chrome.browserAction.setBadgeText({
		text:PWWD
});

// var getColors = [];

// // content.js からデータを受信
// chrome.extension.onRequest.addListener(
// 	function(request, sender, sendResponse) {

// 		console.log(sender.tab ?
// 			"from a content script:" + sender.tab.url :
// 			"from the extension"
// 		);
		
// 		// content.js から受信した データ sendColors を 変数 getColors に格納
// 		getColors[sender.tab.id] = request.sendColors;
// 		console.log("sender.tab.id =" + sender.tab.id);
		
// 		// content.js にレスポンスを返しておく
// 		sendResponse(null);
			
// 	}
// );

// BrowserAction popup.html に表示する内容を設定
// "default_popup": "popup.html" で設定していない html を popup で表示するときに使う
/*
chrome.browserAction.setPopup({
	"popup":"test.html"
});
*/