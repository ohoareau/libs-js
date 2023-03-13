import {flatten_operation} from "../types";

export default function operate(img, config: flatten_operation) {
 img.flatten({background: String(config?.background)});
}