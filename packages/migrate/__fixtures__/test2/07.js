const up = async ctx => {
    ctx.value += 7;
};

const down = async ctx => {
    ctx.value -= 7;
};

module.exports = {
    up,
    down,
};