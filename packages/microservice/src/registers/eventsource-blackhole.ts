import p from '../plugins/eventsource/blackhole';
import {register} from "..";
register('eventsource', 'blackhole', p);