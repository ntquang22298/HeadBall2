const WebSocket = require("ws");
const uuidv1 = require("uuid/v1");
const url = require("url");

class PlayerData {
  constructor(id, x) {
    this.id = id;
    this.x = x;
    this.index = 0;
    this.type = "";
    this.key = "";
    this.idRoom = null;
  }
}

class Room {
  constructor(id) {
    this.id = id;
    this.playerA_Id = null;
    this.playerB_Id = null;
    this.scoreA = 0;
    this.scoreB = 0;
    this.total = 0;
    this.time = 0;
  }
}
const KEY_CONNECTED = "connected";
const KEY_READY = "ready";
const KEY_INGAME = "ingame";
const KEY_BALL = "ball";
const KEY_ENDGAME = "endgame";
const KEY_TIME = "time";
const KEY_GOAL = "goal";

const wss = new WebSocket.Server({ port: 8081 });
let users = {};
let listRoom = [];

wss.on("connection", function connection(ws, req) {
  var infor = url.parse(req.url, true).query;
  let player = null;
  if (infor.address != "null") {
    player = new PlayerData(infor.address, 0);
  } else {
    player = new PlayerData(uuidv1(), 0);
  }
  console.log(player);

  player.ws = ws;
  player.key = KEY_CONNECTED;

  if (listRoom.length == 0) {
    var room = new Room(uuidv1());
    room.playerA_Id = player.id;
    room.total = 1;
    player.idRoom = room.id;
    player.index = 1;
    listRoom.push(room);
  } else {
    var addRoom = false;
    for (let room in listRoom) {
      if (listRoom[room].total < 2) {
        listRoom[room].playerB_Id = player.id;
        listRoom[room].total = 2;
        player.idRoom = listRoom[room].id;
        player.index = 2;
        addRoom = true;
        break;
      }
    }

    if (!addRoom) {
      var room = new Room(uuidv1());
      room.playerA_Id = player.id;
      room.total = 1;
      player.idRoom = room.id;
      player.index = 1;
      listRoom.push(room);
    }
  }

  users[player.id] = player;

  // console.log("--------- LIST ROOM ----------", listRoom);

  ws.send(
    JSON.stringify({
      id: player.id,
      x: player.x,
      key: player.key,
      idRoom: player.idRoom,
      type: "ME",
      index: player.index
    })
  );

  // console.log("____________________");
  // console.log("| client++: " + player.id + " connected");
  // console.log("| size : " + Object.keys(users).length);
  // console.log("____________________");

  let roomPlayer = listRoom.find(room => room.id === player.idRoom);

  // console.log("----------Room Player--------------", listRoom);

  if (roomPlayer.total == 2) {
    var playerA_Id = roomPlayer.playerA_Id;
    var playerB_Id = roomPlayer.playerB_Id;

    // Player
    users[playerA_Id].ws.send(
      JSON.stringify({
        id: users[playerB_Id].id,
        x: users[playerB_Id].x,
        key: users[playerB_Id].key,
        type: "RIVAL",
        index: users[playerB_Id].index
      })
    );
    users[playerB_Id].ws.send(
      JSON.stringify({
        id: users[playerA_Id].id,
        x: users[playerA_Id].x,
        key: users[playerA_Id].key,
        type: "RIVAL",
        index: users[playerA_Id].index
      })
    );

    // Ball
    users[playerA_Id].ws.send(
      JSON.stringify({
        playerId: users[playerB_Id].id,
        x: 0,
        y: -150,
        key: KEY_CONNECTED,
        type: "RIVAL_BALL"
      })
    );
    users[playerB_Id].ws.send(
      JSON.stringify({
        playerId: users[playerA_Id].id,
        x: 0,
        y: -150,
        key: KEY_CONNECTED,
        type: "RIVAL_BALL"
      })
    );

    // listRoom[indexRoom].startTime = new Date();
      endGame(users[playerA_Id].ws, users[playerB_Id].ws, listRoom[indexRoom]);
      listRoom.splice(indexRoom, 1);
      // console.log("----------Room Player--------------", listRoom);
    }, 20000);
  }

  ws.on("message", data => {
    // console.log(data);

    let playerdata = JSON.parse(data);
    if (playerdata.type == KEY_READY) {
      // console.log(`Received message form client: => ${data}`);
    }
    let pack = new Array();
    var indexRoom = listRoom.indexOf(roomPlayer);
    if (
      playerdata.type == KEY_INGAME ||
      playerdata.type == KEY_BALL ||
      playerdata.type == KEY_GOAL
    ) {
      // console.log("sent: ");
      // console.log(playerdata);
      var userInRoom = [
        users[roomPlayer.playerA_Id],
        users[roomPlayer.playerB_Id]
      ];
      if (playerdata.type == KEY_GOAL) {
        listRoom[indexRoom].scoreA = playerdata.scoreA;
        listRoom[indexRoom].scoreB = playerdata.scoreB;
        // console.log(listRoom[indexRoom]);
        for (let id in userInRoom) {
          userInRoom[id].ws.send(
            JSON.stringify({
              key: KEY_GOAL,
              scoreA: listRoom[indexRoom].scoreA,
              scoreB: listRoom[indexRoom].scoreB
            })
          );
        }
      } else {
        for (let id in userInRoom) {
          let user = userInRoom[id];
          if (user) {
            if (playerdata.type == KEY_INGAME) {
              user.type = KEY_INGAME;
              pack.push(playerdata);
            }
            if (playerdata.type == KEY_BALL) {
              user.type = KEY_BALL;
              if (playerdata.playerId == roomPlayer.playerA_Id) {
                pack.push(playerdata);
              }
            }
            // pack.push(playerdata);
          }
        }
        for (let id in userInRoom) {
          if (userInRoom[id]) {
            if (userInRoom[id].id != playerdata.id) {
              userInRoom[id].ws.send(JSON.stringify(pack));
            }
          }
        }
      }
    }
  });

  ws.on("close", message => {
    // console.log("close .. ");
    // console.log(message);
    // console.log(wss.clients.length);

    for (let obj in users) {
      // console.log(obj);
      if (users[obj].ws == ws) {
        // console.log("remove client --");
        delete users[obj];
        break;
      }
    }

    var indexRoom = listRoom.indexOf(roomPlayer);
    if (listRoom[indexRoom]) {
      listRoom[indexRoom].total -= 1;
      if (listRoom[indexRoom].total == 0) {
        listRoom.splice(indexRoom, 1);
      }
    }
    console.log("----------- Room -----------", listRoom);

    // console.log("clients size : " + Object.keys(users).length);
  });

  ws.on("error", function(code, reason) {
    // console.log(code);
  });
});

endGame = (wsA, wsB, room) => {
  wsA.send(
    JSON.stringify({
      key: KEY_ENDGAME,
      scoreA: room.scoreA,
      scoreB: room.scoreB,
      node: null
    })
  );
  wsB.send(
    JSON.stringify({
      key: KEY_ENDGAME,
      scoreA: room.scoreA,
      scoreB: room.scoreB,
      node: null
    })
  );
  //---------- Ket Qua --------
  console.log("+------ KET QUA -----+");
  console.log(`| A - ${room.id} : ${room.scoreA} `);
  console.log(`| B - ${room.id}: ${room.scoreB}`);
  console.log("+--------------------+");
};

countDown = (wsA, wsB, roomId) => {
  var time = 20;
  var downloadTimer = setInterval(function() {
    time -= 1;
    wsA.send(
      JSON.stringify({
        key: KEY_TIME,
        time: time
      })
    );
    wsB.send(
      JSON.stringify({
        key: KEY_TIME,
        time: time
      })
    );
    if (time <= 0) {
      clearInterval(downloadTimer);
    }
    let roomPlayer = listRoom.find(room => room.id === roomId);
  }, 1000);
};
