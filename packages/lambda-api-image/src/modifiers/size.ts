import {order} from '../types';
import {filterValues, http_request} from "@ohoareau/lambda-utils";

const mapping = {
    icon: '16x16',
    'fb-profile': '180x180',
    'fb-cover': '828x315',
    'fb-shared-image': '1200x630',
    'fb-shared-link': '1200x627',
    'fb-highlighted-image': '1200x717',
    'in-bg-image': '1000x425',
    'in-standard-logo': '100x60',
    'in-profile-image': '400x400',
    'in-career-cover-photo': '974x300',
    'in-banner-image': '646x200',
    'in-square-logo': '50x50',
    'yt-channel-cover-photo': '2560x1440',
    'yt-video-upload': '1280x760',
    'ig-profile-image': '110x110',
    'ig-photo-thumbnail': '161x161',
    'ig-photo-size': '1080x1080',
    'tw-header-photo': '1500x500',
    'tw-profile-photo': '400x400',
    'tw-in-stream-photo': '440x220',
    'pi-profile-image': '165x165',
    'pi-board-display': '222x150',
    'pi-board-display-small': '55x55',
    'pi-pin-size': '236x',
};

export async function size(order: order, request: http_request) {
    let size = request.qsParams?.size;
    if (!size) return;
    if (Array.isArray(size)) size = size[0];
    if (!size) return;
    size = mapping[size] || size;
    if (!size) return;
    const [width = undefined, height = undefined] = (size as string).split('x');
    const fit = filterValues(request.qsParams?.size_fit as any, ['cover', 'contain', 'fill', 'inside', 'outside']);
    const position = filterValues(request.qsParams?.size_position as any, ['top', 'right-top', 'right', 'right-bottom', 'bottom', 'left-bottom', 'left', 'left-top'], 'space');
    const gravity = filterValues(request.qsParams?.size_gravity as any, ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest', 'center', 'centre']);
    const strategy = filterValues(request.qsParams?.size_strategy as any, ['entropy', 'attention']);
    const background = request.qsParams?.size_background as any;
    const kernel = filterValues(request.qsParams?.size_kernel as any, ['nearest', 'cubic', 'mitchell', 'lanczos2', 'lanczos3']);
    const withoutEnlargement = filterValues(request.qsParams?.size_enlargement as any, ['0', '1', 'false', 'true', 'none', 'no', 'yes'], 'boolean');
    const fastShrinkOnLoad = filterValues(request.qsParams?.size_fastshrink as any, ['0', '1', 'false', 'true', 'none', 'no', 'yes'], 'boolean');
    order.operations.push({
        type: 'resize',
        width: !!width ? width : undefined,
        height: !!height ? height : undefined,
        ...(fit ? {fit} : {}),
        ...(position ? {position} : {}),
        ...(gravity ? {gravity} : {}),
        ...(strategy ? {strategy} : {}),
        ...(background ? {background} : {}),
        ...(kernel ? {kernel} : {}),
        ...(withoutEnlargement ? {withoutEnlargement} : {}),
        ...(fastShrinkOnLoad ? {fastShrinkOnLoad} : {}),
    });
}