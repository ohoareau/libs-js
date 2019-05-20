import { restrict } from './restrict';
import { defaults } from './defaults';

const zones = {
    france: [
        'FR', // Metropolitan France
    ],
    france_all: [
        'FR', // Metropolitan France
        'RE', // Reunion Island
    ],
    europe: [
        'FR', // Metropolitan France
        'BE', // Belgium
        'LU', // Luxembourg
        'CH', // Switzerland
        'DE', // Germany
        'IT', // Italy
        'MC', // Monaco
        'ES', // Spain
        'PT', // Portugal
        'AD', // Andorra
        'NL', // Netherlands
        'LI', // Liechtenstein
        'AT', // Austria
        'BG', // Bulgaria
        'CY', // Cyprus
        'HR', // Croatia
        'DK', // Denmark
        'EE', // Estonia
        'FI', // Finland
        'GR', // Greece
        'HU', // Hungary
        'IE', // Ireland
        'LV', // Latvia
        'LT', // Lithuania
        'MT', // Malta
        'PL', // Poland
        'RE', // Reunion Island
    ],
};

export const country = (field: string = 'country', zone = 'europe', defaultValue: string|undefined = undefined) => [
    restrict(field, zones[zone] || zone.split(/\s*,\s*/)),
    defaultValue ? defaults({[field]: defaultValue}) : undefined,
];
