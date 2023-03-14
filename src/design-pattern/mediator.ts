import { getSingleClass } from './singleton';
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

export class Player1 {
    name: string;
    state: PlayerState = PlayerState.Live;
    team: Team;
    partners: Player1[] = [];
    enemies: Player1[] = [];

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

const createPlayer1 = (() => {
    const players: Player1[] = [];

    return (name: string, team: Team) => {
        const newPlayer = new Player1(name, team);

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
const player1 = createPlayer1('A1', Team.A);
const player2 = createPlayer1('A2', Team.A);
const player3 = createPlayer1('A3', Team.A);

// B队
createPlayer1('B1', Team.B);
createPlayer1('B2', Team.B);
createPlayer1('B3', Team.B);

[player1, player2, player3].forEach((player) => player.die());

/*
以上代码中每个玩家都和其他玩家强耦合，每个玩家的状态发生变更都要通知所有其他玩家

下面我们用中介者模式来重构代码
*/
export class Player {
    name: string;
    team: string;
    state: PlayerState = PlayerState.Live;

    playerDirector: PlayerDirector;

    constructor(name: string, team: string, playerDirector: PlayerDirector) {
        this.name = name;
        this.team = team;

        this.playerDirector = playerDirector;
    }

    public die() {
        this.state = PlayerState.Dead;
        this.playerDirector.receiveMessage(PlayerMessageType.PlayerDead, this);
    }

    public changeTeam(team: string) {
        this.playerDirector.receiveMessage(PlayerMessageType.ChangeTeam, this, team);
    }

    public win() {
        console.log(`${this.name} won`);
    }

    public lose() {
        console.log(`${this.name} lost`);
    }
}

enum PlayerMessageType {
    AddPlayer,
    RemovePlayer,
    ChangeTeam,
    PlayerDead,
}

export class PlayerDirector {
    players: Record<string, Player[]> = {};

    operations: Record<PlayerMessageType, (player: Player, team?: string) => void> = {
        [PlayerMessageType.AddPlayer]: (player: Player) => {
            const { team } = player;
            const partners = this.players[team] || (this.players[team] = []);

            partners.push(player);
        },
        [PlayerMessageType.RemovePlayer]: (player: Player) => {
            const { team } = player;
            const partners = this.players[team];
            if (!partners || partners.length === 0) {
                return;
            }

            for (let i = partners.length - 1; i >= 0; i--) {
                if (partners[i] === player) {
                    partners.slice(i, 1);
                }
            }
        },
        [PlayerMessageType.ChangeTeam]: (player: Player, team?: string) => {
            if (team === undefined) {
                return;
            }
            this.operations[PlayerMessageType.RemovePlayer](player);

            // 直接复用原始对象
            player.team = team;
            this.operations[PlayerMessageType.AddPlayer](player);
        },
        [PlayerMessageType.PlayerDead]: (player: Player) => {
            const partners = this.players[player.team] || [];
            const isAllDead = partners.every((partner) => partner.state === PlayerState.Dead);

            if (isAllDead) {
                // 通知本方玩家失败
                partners.forEach((partner) => partner.lose());

                // 通知所有其他队伍玩家获胜
                for (const team of Object.keys(this.players)) {
                    if (team !== player.team) {
                        (this.players[team] || []).forEach((enemy) => enemy.win());
                    }
                }
            }
        },
    };

    public receiveMessage(msgType: PlayerMessageType, player: Player, team?: string) {
        this.operations[msgType](player, team);
    }
}

const getPlayerDirectorInstance = getSingleClass(PlayerDirector);

function playerFactory(name: string, team: string): Player {
    const playerDirector = getPlayerDirectorInstance();
    const player = new Player(name, team, playerDirector);
    playerDirector.receiveMessage(PlayerMessageType.AddPlayer, player);

    return player;
}

// 红队
const redPlayers = ['红1', '红2', '红3'].map((name) => playerFactory(name, 'red'));

// 蓝队
['蓝1', '蓝2'].forEach((name) => playerFactory(name, 'blue'));

// 紫队
['紫1', '紫2'].forEach((name) => playerFactory(name, 'purple'));

redPlayers.forEach((player) => player.die());
