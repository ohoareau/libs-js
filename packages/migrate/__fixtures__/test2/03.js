const up = async ctx => {
    ctx.value += 3;
};

const down = async ctx => {
    ctx.value -= 3;
};

module.exports = {
    up,
    down,
};