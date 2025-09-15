var handler = async (m, { conn }) => {
    let user = global.db.data.users[m.sender];

    let cooldown = 10 * 60 * 1000;
    let time = user.lastfish + cooldown;

    if (new Date() - user.lastfish < cooldown) {
        return conn.reply(m.chat, `⏰ Debes esperar ${msToTime(time - new Date())} antes de volver a pescar.`, m);
    }

    let peces = Math.floor(Math.random() * 5) + 1;
    let monedas = 0;

    for (let i = 0; i < peces; i++) {
        monedas += Math.floor(Math.random() * 51) + 150;
    }

    user.coin += monedas;
    user.lastfish = Date.now();

    conn.reply(m.chat, `🎣 ¡Felicidades! *${m.pushName}* pescaste *${peces}* pez(es)\n💸 Ganaste: *${monedas}* monedas\n✐ Ahora tienes: *${user.coin}* monedas.`, m);
}

handler.help = ['pescar'];
handler.tags = ['rpg'];
handler.command = ['pescar'];
handler.group = true;

export default handler;

function msToTime(duration) {
    let minutes = Math.floor((duration / (1000 * 60)) % 60);
    let seconds = Math.floor((duration / 1000) % 60);

    minutes = (minutes < 10) ? '0' + minutes : minutes;
    seconds = (seconds < 10) ? '0' + seconds : seconds;

    return minutes + " minutos " + seconds + " segundos";
}