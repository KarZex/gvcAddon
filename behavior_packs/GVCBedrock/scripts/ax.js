//インポート
const path = require("path"); //access to path
const express = require("express");
const engine = require("engine");
const ejs = require("ejs");
const fs = require("fs");
const NodeCache = require('node-cache'); 
const bodyParser = require("body-parser");
const axios = require('axios');
const e = require("express");

// アプリ自身をインスタンス化 
var app = express();

// userの位置情報（初期値）
var place_pre = [5,1];  // 一つ前の位置情報
var place = [5,1];      // 今の位置情報
var place_new = [5,1];  // 次の位置情報

var sensor_h = 0;   // x座標
var sensor_w = 0;   // y座標
var data = {        // appに送るデータ
    x:sensor_h,
    y:sensor_w
}

// 当たり判定(0:問題なし,1:壁衝突,2:鍵無ゴール,3:体力切れ,4:ゴール)
var hit = 0;
// センサ番号
var id = 0;         // 
var id_pre = 0;     // 前回反応したセンサid
// 観測した距離
var distance = 0;
// 位置を変更するか（0:しない,1:する）
var update = 0;

var count = 0;      // 前回反応してからどのくらい時間がたったのか
//bool re = 0;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
// アプリからデータを受信
app.post("/adjust", function (req, res){
    place_new[0] = req.body.x;
    place_new[1] = req.body.y;
    console.log(place_new);
})

//userの位置情報を取得
app.post("/sensor", function (req, res){
    console.log(`現在地:` + place_new);
    let placePre0 = place_pre;
    let place0 = place;
    
    //座標履歴を更新
    if(update == 1){
        place_pre = place.concat();  
        place = place_new.concat();
    }
    
    //res.bodyはセンサの番号(id)と観測した距離(distance)
    res.send('ok');
    console.log(req.body);
    
    id = req.body.id; 
    distance = req.body.distance;       // センサ側からデータ取得
    id = parseFloat(id);                // 受け取ったidをfloatに変換
    distance = parseFloat(distance);    // 受け取ったdistanceをfloatに変換
    
    //センサ境界線,位置情報更新
    if(1 <= id && id <= 5 ){//x座標境界線上
        place_new[0] = id;
    } 
    else if(8 <= id && id <= 11){//x座標境界線　下
        //if(place[0] <= id-7){
        place_new[0] = id-6;
        //}
        //else{
            //place_new[0] = id-7;
        //}
    }
    else if(14 <= id && id <= 17 ){//y座標境界線　左
        //if(place[1] <= id-13){
        place_new[1] = id-12;
        //}
        //else{
            //place_new[1] = id-13;
        //}
    } 
    else if(20 <= id && id <= 23){//y座標境界線　右
        //if(place[1] <= id-19){
        place_new[1] = id-18;
        //}
        //else{
            //place_new[1] = id-19;
        //}
    }
    var distance1 = 5000;
    var distance2 = 5000;

    //距離による座標特定補助
    if(1 <= id && id <= 6){//上
        if(distance <= distance1){
            place_new[1] = 1;
        }
        else if(distance <= distance2){
            place_new[1] = 2;
        }
        else{
            place_new[1] = 3;
        }
    }
    else if(7 <= id && id <= 12){//下
        if(distance <= distance1){
            place_new[1] = 5;
        }
        else if(distance <= distance2){
            place_new[1] = 4;
        }
        else{
            place_new[1] = 3;
        }
    }
    else if(13 <= id && id <= 18){//左
        if(distance <= distance1){
            place_new[0] = 1;
        }
        else if(distance <= distance2){
            place_new[0] = 2;
        }
        else{
            place_new[0] = 3;
        }
    }
    else if(19 <= id && id <= 24){//右
        if(distance <= distance1){
            place_new[0] = 5;
        }
        else if(distance<=distance2){
            place_new[0] = 4;
        }
        else{
            place_new[0] = 3;
        }
    }
    if(id == 7){    // ゴールのセンサが反応したとき
        place_new[0] = 0;
        place_new[1] = 5;
    }
    //現在地と1つ前の座標に隣接した場所以外には移動しない
    var matrix = [      // 隣接したマス
        [place_pre[0] - 1, place_pre[1]],
        [place_pre[0] + 1, place_pre[1]],
        [place_pre[0], place_pre[1] - 1],
        [place_pre[0], place_pre[1] + 1],
        [place[0] - 1, place[1]],
        [place[0] + 1, place[1]],
        [place[0], place[1] - 1],
        [place[0], place[1] + 1]
    ];
    
    //if(id != id_pre){
    for(let i = 0; i < 8;i++){
        // 隣接していマスか
        if(matrix[i][0] == place_new[0] && matrix[i][1] == place_new[1]){
            update = 1;
            break;
        }
        // 隣接していないときは位置情報を戻す
        if(i == 7){ 
            place_new = place.concat();
            place = place0.concat();
            place_pre = placePre0.concat();
        }
    }
    //}
    //else{}
    //--変更の余地あり↓--------
    if( update == 1 ){
    //２つ前の座標と同じ時更新しない
        //if(count <= 20){
        if(place_new[0] == place_pre[0] && place_new[1] == place_pre[1]){
            place_new = place.concat();
            update = 0;
        }
        else{
            update = 1;
        }
        //}
    }
	
	if(place[0]!=place_new[0] || place[1]!=place_new[1]){
		count=0
		update = 1;
	}
	//--変更の余地あり↑--------
    
    //sensor
    id_pre = id;

    //Pythonに送るデータを代入
    data.y = place_new[0];
    data.x = place_new[1];
    //Pythonに座標データを送信

    //axios.post('http://172.16.0.61:5000/',data)
    //axios.post('http://172.16.0.68:5000/',data)
    axios.post('http://127.0.0.1:5000/',data)
    return 1
})


//当たり判定の取得
app.post("/maze", function (req, res){
    hit = req.body; // データ受け取り
    console.log('受け取ったデータ',hit);
    var responseData ={
        message:'データを受け取りました',
        data:hit
    };
    res.json(responseData);
    if(hit['判定'] == 2){
        place_pre = [1,5];
        place = [1,5];
        place_new = [1,5];
        data.y = place_new[0];
        data.x = place_new[1];
        //axios.post('http://172.16.0.62:5000/',data)
        axios.post('http://172.16.0.68:5000/',data)
        //axios.post('http://127.0.0.1:5000/',data)
    
    }
    else if(hit['判定'] == 4 ||hit['判定'] == 3 ){
        place_pre = [5,1];
        place = [5,1];
        place_new = [5,1];
        
    }
});

//当たり判定の情報からスピーカーを鳴らすかの判断
app.get("/speaker54", function (ewq, res){
    if(place_new[0] >= 1 && place_new[0] <= 2 && place_new[1] >= 1 && place_new[1] <= 2 ){
        //hitが1なら スピーカーを鳴らす
        if(hit['判定'] == 1 && place_new[0] < place[0] ){
            res.send('on');
            place_new = place.concat(); // 元の位置に戻す
        }
        else{
            res.send('off');
        }
    }
    else if(place_new[0] >= 1 && place_new[0] <= 2 && place_new[1] >= 3 && place_new[1] <= 5 ){
        if(hit['判定'] == 1 && place_new[0] < place[0]){
            res.send('on');
            place_new = place.concat(); // 元の位置に戻す
        }
        else{
            res.send('off');
        }
    }
    
    else{
        if(hit['判定'] == 1 && place_new[0] < place[0]){
            res.send('ok-on');
            place_new = place.concat(); // 元の位置に戻す
        }
        else{
            res.send('ok');
        }
    }
})
app.get("/speaker55", function (ewq, res){
    //hitが1なら スピーカーを鳴らす
    if(place_new[0] >= 3 && place_new[0] <= 5 && place_new[1] >= 3 && place_new[1] <= 5 ){
        if(hit['判定'] == 1 && place_new[1] > place[1]){
            res.send('on');
            place_new = place.concat();
        }
        else{
            res.send('off');
        }
    }
    else if(place_new[0] >= 1 && place_new[0] <= 2 && place_new[1] >= 3 && place_new[1] <= 5 ){
        if(hit['判定'] == 1 && place_new[1] > place[1]){
            res.send('on');
            place_new = place.concat();
        }
        else{
            res.send('off');
        }
    }
    else{
        if(hit['判定'] == 1 && place_new[1] > place[1]){
            res.send('ok-on');
            place_new = place.concat();
        }
        else{
            res.send('ok');
        }
    }
})
app.get("/speaker66", function (ewq, res){
	console.log(count)
	count++;
	
    if(place_new[0] >= 1 && place_new[0] <= 2 && place_new[1] >= 1 && place_new[1] <= 2 ){
        //hitが1なら スピーカーを鳴らす
        if(hit['判定'] == 1 && place_new[1] < place[1]){
            res.send('on');
            place_new = place.concat();
        }
        else{
            res.send('off');
        }
    }
    else if(place_new[0] >= 3 && place_new[0] <= 5 && place_new[1] >= 1 && place_new[1] <= 2 ){
        if(hit['判定'] == 1 && place_new[1] < place[1]){
            res.send('on');
            place_new = place.concat();
        }
        else{
            res.send('off');
        }
    }
    else{
        if(hit['判定'] == 1 && place_new[1] < place[1]){
            res.send('ok-on');
            place_new = place.concat();
        }
        else{
            res.send('ok');
        }
    }
})
app.get("/speaker67", function (ewq, res){
    //hitが1なら スピーカーを鳴らす
    if(place_new[0] >= 3 && place_new[0] <= 5 && place_new[1] >= 1 && place_new[1] <= 2 ){
        if(hit['判定'] == 1 && place_new[0] > place[0]){
            res.send('on');
            place_new = place.concat();
        }
        else{
            res.send('off');
        }
    }
    else if(place_new[0] >= 3 && place_new[0] <= 5 && place_new[1] >= 3 && place_new[1] <= 5 ){
        if(hit['判定'] == 1 && place_new[0] > place[0]){
            res.send('on');
            place_new = place.concat();
        }
        else{
            res.send('off');
        }
    }  
    else{
        if(hit['判定'] == 1 && place_new[0] > place[0]){
            res.send('ok-on');
            place_new = place.concat();
        }
        else{
            res.send('ok');
        }
    }
})
//ポート番号の定義
app.listen(8082);

