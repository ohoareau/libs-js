const up = async ctx => {
    ctx.value += 12;
};

const down = async ctx => {
    ctx.value -= 12;
};

module.exports = {
    up,
    down,
};