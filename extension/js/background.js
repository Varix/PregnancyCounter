// 妊娠週数を格納する変数
// 値は popup.js から受け取りたいけどどうするんだ？
// 値を空にすると if で分けなくてもバッヂは非表示になる様子
var PWeekDay = "36w3d";

// background.js でコンソールログだすにはどうしたらいいんだ？
// 下記だと表示されない
console.log("background.js だぞ");

// BrouserAction アイコンにバッヂを表示
chrome.browserAction.setBadgeText({
		text:PWeekDay
});