import { EventBus } from './event';
/* 
面向对象设计鼓励将行为分布到各个对象中，把对象划分成更小的粒度，
有助于增强对象的可复用性，但由于这些细粒度对象之间的联系激增，
又有可能会反过来降低它们的可复用性。

中介者模式的作用就是解除对象与对象之间的紧耦合关系。
*/
enum PlayerState {
    Live,
    Dead,
}

enum Team {
    A,
    B,
}

export class Player {
    name: string;
    state: PlayerState = PlayerState.Live;
    team: Team;
    partners: Player[] = [];
    enemies: Player[] = [];

    constructor(name: string, team: Team) {
        this.name = name;
        this.team = team;
    }

    public win() {
        console.log(`winner:${this.name}`);
    }

    public lose() {
        console.log(`loser:${this.name}`);
    }

    public die() {
        this.state = PlayerState.Dead;
        const isAllDead = this.partners.every((partner) => partner.state === PlayerState.Dead);

        if (isAllDead) {
            // 通知队友失败
            this.lose();
            this.partners.forEach((partner) => partner.lose());

            // 通敌敌人获胜
            this.enemies.forEach((enemy) => enemy.win());
        }
    }
}

const createPlayer = (() => {
    const players: Player[] = [];

    return (name: string, team: Team) => {
        const newPlayer = new Player(name, team);

        // 通知现有所有玩家有新玩家加入
        for (let i = 0; i < players.length; i++) {
            if (players[i].team === team) {
                players[i].partners.push(newPlayer);
                newPlayer.partners.push(players[i]);
            } else {
                players[i].enemies.push(newPlayer);
                newPlayer.enemies.push(players[i]);
            }
        }

        players.push(newPlayer);

        return newPlayer;
    };
})();

// A队
const player1 = createPlayer('A1', Team.A);
const player2 = createPlayer('A2', Team.A);
const player3 = createPlayer('A3', Team.A);

// B队
const player4 = createPlayer('B1', Team.B);
const player5 = createPlayer('B2', Team.B);
const player6 = createPlayer('B3', Team.B);

[player1, player2, player3].forEach((player) => player.die());

/*
以上代码中每个玩家都和其他玩家强耦合，每个玩家的状态发生变更都要通知所有其他玩家

下面我们用中介者模式来重构代码
*/
