const up = async ctx => {
    ctx.value += 11;
};

const down = async ctx => {
    ctx.value -= 11;
};

module.exports = {
    up,
    down,
};